import React, { useState, useRef, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';

const AIChatbot = ({ onOpenSettings }) => {
  const { farmData } = useFarm();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'السلام عليكم! أنا فلوكي، مستشارك الزراعي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const buildSystemPrompt = () => {
    const cattle = farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0);
    const sheep = farmData.livestock.sheep.herds.reduce((s, h) => s + (h.count || 0), 0);
    const poultry = farmData.livestock.poultry.flocks.reduce((s, f) => s + (f.count || 0), 0);
    const fish = farmData.livestock.fish.ponds.reduce((s, p) => s + (p.fishCount || 0), 0);
    const totalArea = farmData.lands.reduce((s, l) => s + (l.area || 0), 0);
    const plantedLands = farmData.lands.filter(l => l.currentCrop);
    const plantedArea = plantedLands.reduce((s, l) => s + (l.area || 0), 0);
    const feedKg = farmData.feedInventory.ingredients.reduce((s, ing) => {
      return s + (ing.unit === 'طن' ? (ing.quantity || 0) * 1000 : (ing.quantity || 0));
    }, 0);
    const lastLog = farmData.dailyLogs[farmData.dailyLogs.length - 1];
    const lastWeather = lastLog
      ? `${lastLog.weather || 'غير محدد'} / ${lastLog.maxTemp || '--'}°C - ${lastLog.minTemp || '--'}°C`
      : 'لا يوجد سجل';
    const landsDesc = farmData.lands.length > 0
      ? farmData.lands.map(l => `${l.name} (${l.area} دونم${l.currentCrop ? ' - ' + l.currentCrop : ' - بور'})`).join('، ')
      : 'لا توجد أراضٍ مسجلة';

    return `أنت فلوكي — مستشار زراعي متخصص لمزرعة "${farmData.farm.name}" في جزيرة الخالدية، محافظة الأنبار، العراق (على نهر الفرات).

بيانات المزرعة الحالية:
- المساحة الكلية: ${farmData.farm.totalArea} دونم، المزروع: ${plantedArea} دونم من ${totalArea} دونم
- الأراضي: ${landsDesc}
- الثروة الحيوانية: ${cattle} رأس أبقار | ${sheep} رأس أغنام | ${poultry} طائر دواجن | ${fish} سمكة
- مخزون الأعلاف: ${feedKg.toFixed(0)} كغ
- آخر طقس مسجل: ${lastWeather}

قواعد المستشار:
- أجب بالعربية دائماً
- ركز على الواقع المحلي (مناخ الأنبار الحار الجاف، التربة الغرينية، نهر الفرات، السوق المحلي)
- اقتراحات عملية وقابلة للتطبيق الفوري بإمكانيات المزرعة
- الردود مختصرة ومفيدة (3-6 جمل عادةً)
- استخدم الأرقام الفعلية من بيانات المزرعة عند الإجابة
- إذا لم تتوفر بيانات كافية، اطلب من المستخدم إدخالها في القسم المناسب`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');

    const newUserMsg = { role: 'user', text: userMessage };
    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);

    const apiKey = localStorage.getItem('smartFarmApiKey');
    if (!apiKey) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '⚠️ لم يتم إضافة مفتاح API بعد.\n\nافتح الإعدادات ← قسم "فلوكي" وأدخل مفتاح Anthropic API للبدء.'
      }]);
      setLoading(false);
      return;
    }

    const updatedHistory = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ].slice(-20);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: buildSystemPrompt(),
          messages: updatedHistory
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('مفتاح API غير صالح أو منتهي الصلاحية. يرجى التحقق من الإعدادات.');
        } else if (response.status === 429) {
          throw new Error('تم تجاوز حد الاستخدام. يرجى الانتظار قليلاً والمحاولة مرة أخرى.');
        } else {
          throw new Error(err.error?.message || `خطأ في الاتصال (${response.status})`);
        }
      }

      const data = await response.json();
      const assistantText = data.content?.[0]?.text || 'لم أتمكن من الإجابة. حاول مرة أخرى.';

      setMessages(prev => [...prev, { role: 'assistant', text: assistantText }]);
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: assistantText }
      ].slice(-20));

    } catch (err) {
      const isOffline = !navigator.onLine;
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: isOffline
          ? '📵 لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
          : `❌ ${err.message}`
      }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = () => {
    setMessages([{ role: 'assistant', text: 'محادثة جديدة. أنا فلوكي، كيف يمكنني مساعدتك؟' }]);
    setConversationHistory([]);
  };

  const buildFarmSummary = () => {
    const cattle = farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0);
    const poultry = farmData.livestock.poultry.flocks.reduce((s, f) => s + (f.count || 0), 0);
    const totalArea = farmData.lands.reduce((s, l) => s + (l.area || 0), 0);
    return `${totalArea} دونم · ${cattle} بقرة · ${poultry} طائر`;
  };

  const getSuggestedQuestions = () => {
    const questions = ['ما أفضل محصول الآن في الأنبار؟', 'كيف أوفر المياه في الري؟'];
    const cattle = farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0);
    const plantedLands = farmData.lands.filter(l => l.currentCrop);
    if (cattle > 0) questions.unshift('كيف أحسن إنتاج الحليب؟');
    if (plantedLands.length > 0) {
      const land = plantedLands[0];
      questions.unshift(`متى أحصد ${land.currentCrop}؟`);
    }
    return questions.slice(0, 3);
  };

  const hasApiKey = !!localStorage.getItem('smartFarmApiKey');

  return (
    <>
      {/* أيقونة عائمة */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '16px',
            width: '58px',
            height: '58px',
            borderRadius: '29px',
            backgroundColor: hasApiKey ? colors.green : colors.orange,
            color: 'white',
            border: 'none',
            fontSize: '26px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🪖
        </button>
      )}

      {/* نافذة المحادثة */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: isMinimized ? '100px' : '16px',
          right: '16px',
          width: '340px',
          maxWidth: 'calc(100vw - 32px)',
          height: isMinimized ? 'auto' : '520px',
          maxHeight: '80vh',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* رأس النافذة */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: hasApiKey ? colors.green : colors.orange,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🪖</span>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>فلوكي</span>
              {!hasApiKey && <span style={{ fontSize: '11px', opacity: 0.85 }}>— يحتاج API</span>}
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={handleNewConversation}
                title="محادثة جديدة"
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', padding: '2px 5px', opacity: 0.85 }}
              >
                🗑️
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer', padding: '2px 6px' }}
              >
                {isMinimized ? '□' : '−'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '16px', cursor: 'pointer', padding: '2px 6px' }}
              >
                ✕
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* ملخص المزرعة */}
              <div style={{
                padding: '6px 14px',
                backgroundColor: colors.cream,
                fontSize: '11px',
                color: colors.soil,
                borderBottom: `1px solid ${colors.sand}`
              }}>
                📋 {buildFarmSummary()}
              </div>

              {/* تحذير بدون API */}
              {!hasApiKey && (
                <div style={{
                  padding: '10px 14px',
                  backgroundColor: '#fff7ed',
                  borderBottom: `1px solid ${colors.sand}`,
                  fontSize: '12px',
                  color: colors.orange,
                  lineHeight: '1.5'
                }}>
                  ⚠️ أضف مفتاح API في{' '}
                  <button
                    onClick={() => { setIsOpen(false); onOpenSettings?.(); }}
                    style={{ background: 'none', border: 'none', color: colors.green, fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', padding: 0, textDecoration: 'underline' }}
                  >
                    الإعدادات
                  </button>
                  {' '}لتفعيل المستشار
                </div>
              )}

              {/* منطقة المحادثة */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', backgroundColor: colors.cream }}>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '8px'
                    }}
                  >
                    <div style={{
                      maxWidth: '85%',
                      padding: '9px 12px',
                      borderRadius: msg.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                      backgroundColor: msg.role === 'user' ? colors.green : 'white',
                      color: msg.role === 'user' ? 'white' : colors.dark,
                      fontSize: '13px',
                      lineHeight: '1.5',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '9px 12px', borderRadius: '4px 12px 12px 12px',
                      backgroundColor: colors.sand, color: colors.soil, fontSize: '13px'
                    }}>
                      🪖 جاري التفكير...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* اقتراحات سريعة */}
              <div style={{
                padding: '6px 10px',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                borderTop: `1px solid ${colors.sand}`
              }}>
                {getSuggestedQuestions().map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: 'white',
                      border: `1px solid ${colors.sand}`,
                      borderRadius: '14px',
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      color: colors.dark
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* حقل الإدخال */}
              <div style={{
                padding: '10px 12px',
                borderTop: `1px solid ${colors.sand}`,
                display: 'flex',
                gap: '8px'
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اسأل مستشارك..."
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '18px',
                    border: `1px solid ${colors.sand}`,
                    fontSize: '13px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '19px',
                    backgroundColor: input.trim() && !loading ? colors.green : colors.sand,
                    color: 'white',
                    border: 'none',
                    fontSize: '15px',
                    cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default AIChatbot;
