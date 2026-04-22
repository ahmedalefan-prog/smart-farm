import React, { useState, useRef, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';

const AIChatbot = () => {
  const { farmData } = useFarm();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'السلام عليكم. أنا مستشارك الزراعي. كيف يمكنني مساعدتك؟' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const buildFarmSummary = () => {
    const totalCattle = farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0);
    const totalPoultry = farmData.livestock.poultry.flocks.reduce((s, f) => s + (f.count || 0), 0);
    const totalArea = farmData.lands.reduce((s, l) => s + (l.area || 0), 0);
    return `${totalArea} دونم · ${totalCattle} بقرة · ${totalPoultry} طائر`;
  };

  const mockResponses = [
    'بناءً على بيانات مزرعتك، أنصحك بمراقبة استهلاك العلف اليومي.',
    'الطقس في الأنبار حالياً مناسب للزراعة. راقع درجات الحرارة يومياً.',
    'من تحليل بيانات القطيع، معدل النمو جيد. استمر على نفس البرنامج الغذائي.',
    'أنصحك بجدولة الري في الصباح الباكر لتقليل التبخر وتوفير المياه.',
    'مخزون الأعلاف الحالي يحتاج متابعة - سجّل الكميات يومياً لتتبع الاستهلاك.',
    'السيلاج خيار ممتاز لتخزين الأعلاف الخضراء. الموسم مناسب للتحضير.'
  ];

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: mockResponses[Math.floor(Math.random() * mockResponses.length)] +
              '\n\n(للاستخدام الفعلي: أضف مفتاح Claude API في إعدادات المستشار)'
      }]);
      setLoading(false);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'كيف أحسن إنتاج الحليب؟',
    'ما أفضل محصول الآن؟',
    'هل الري كافٍ؟'
  ];

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
            backgroundColor: colors.green,
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
          🤖
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
            backgroundColor: colors.green,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <span style={{ fontWeight: 'bold', fontSize: '14px' }}>المستشار الذكي</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
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
                      🤖 جاري التفكير...
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
                {suggestedQuestions.map((q, i) => (
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
