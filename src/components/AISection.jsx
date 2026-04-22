import React, { useState, useRef, useEffect } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';

const AISection = () => {
  const { farmData } = useFarm();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'السلام عليكم. أنا مستشارك الزراعي الشخصي. يمكنني مساعدتك في إدارة مزرعتك بناءً على بياناتك الفعلية. اسألني عن أي شيء يتعلق بالمحاصيل، الحيوانات، الأعلاف، أو الري.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const buildFarmSummary = () => {
    const totalCattle = farmData.livestock.cattle.herds.reduce((sum, h) => sum + (h.count || 0), 0);
    const totalSheep = farmData.livestock.sheep.herds.reduce((sum, h) => sum + (h.count || 0), 0);
    const totalPoultry = farmData.livestock.poultry.flocks.reduce((sum, f) => sum + (f.count || 0), 0);
    const totalFish = farmData.livestock.fish.ponds.reduce((sum, p) => sum + (p.fishCount || 0), 0);
    const totalArea = farmData.lands.reduce((sum, l) => sum + (l.area || 0), 0);

    const crops = farmData.lands.filter(l => l.currentCrop).map(l => `${l.currentCrop} (${l.area} دونم)`);
    const feedStock = farmData.feedInventory.ingredients.reduce((sum, ing) => {
      return sum + (ing.unit === 'طن' ? ing.quantity * 1000 : ing.quantity);
    }, 0);

    const recentLogs = farmData.dailyLogs.slice(-3);
    const avgTemp = recentLogs.length > 0
      ? (recentLogs.reduce((sum, log) => sum + (log.maxTemp || 0) + (log.minTemp || 0), 0) / (recentLogs.length * 2)).toFixed(1)
      : 'غير متوفر';

    return `المساحة الكلية: ${totalArea} دونم
المحاصيل المزروعة: ${crops.length > 0 ? crops.join('، ') : 'لا يوجد'}
الثروة الحيوانية: ${totalCattle} بقرة، ${totalSheep} رأس غنم، ${totalPoultry} طائر
الأسماك: ${totalFish} سمكة في ${farmData.livestock.fish.ponds.length} حوض
مخزون الأعلاف: ${(feedStock / 1000).toFixed(2)} طن
متوسط درجة الحرارة: ${avgTemp}°م
آخر تحليل تربة: ${farmData.soilTests.length > 0 ? 'متوفر' : 'غير متوفر'}`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    // محاكاة رد المستشار - للربط مع Claude API لاحقاً
    setTimeout(() => {
      const responses = [
        'بناءً على بيانات مزرعتك، أنصحك بمراقبة استهلاك العلف اليومي. المعدل الحالي يبدو طبيعياً.',
        'الطقس في المنطقة مناسب لزراعة الخضروات الشتوية. يمكنك البدء بتجهيز المشاتل.',
        'من تحليل بيانات القطيع، معدل النمو جيد. استمر على نفس برنامج التغذية.',
        'أنصحك بجدولة ري المحاصيل في الصباح الباكر لتقليل التبخر خاصة مع ارتفاع الحرارة.',
        'مخزون الأعلاف الحالي يكفي لمدة معقولة. راقب الاستهلاك اليومي وجهز طلبية جديدة مبكراً.'
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: randomResponse + '\n\n(هذا رد تجريبي - لربط المستشار بـ Claude API الحقيقي، أضف مفتاح API في ملف .env)'
      }]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'كيف أحسن إنتاج الحليب؟',
    'ما أفضل محصول للموسم القادم؟',
    'هل مخزون الأعلاف كافٍ؟',
    'كيف أتعامل مع الإجهاد الحراري؟',
    'ما هي علامات نقص النيتروجين؟'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      {/* رأس القسم */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${colors.sand}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🤖</span>
          <h3 style={{ color: colors.dark, margin: 0 }}>المستشار الذكي</h3>
        </div>
        <button
          onClick={() => setShowContext(!showContext)}
          style={{
            padding: '8px 12px',
            backgroundColor: colors.cream,
            border: `1px solid ${colors.sand}`,
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'inherit'
          }}
        >
          {showContext ? 'إخفاء' : 'عرض'} بيانات المزرعة
        </button>
      </div>

      {/* ملخص المزرعة */}
      {showContext && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: colors.cream,
          borderBottom: `1px solid ${colors.sand}`,
          fontSize: '13px',
          color: colors.soil,
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          <strong>📋 ملخص مزرعتك:</strong>
          <pre style={{ margin: '8px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
            {buildFarmSummary()}
          </pre>
        </div>
      )}

      {/* منطقة المحادثة */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: colors.cream
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '12px'
            }}
          >
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: msg.role === 'user' ? colors.dark : colors.lime,
              color: msg.role === 'user' ? 'white' : colors.dark,
              borderTopRightRadius: msg.role === 'user' ? '4px' : '16px',
              borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '16px'
            }}>
              {msg.role === 'assistant' && (
                <span style={{ marginRight: '8px', opacity: 0.7 }}>🤖</span>
              )}
              <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px',
              backgroundColor: colors.sand,
              color: colors.soil
            }}>
              🤖 جاري التفكير...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* اقتراحات سريعة */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        borderTop: `1px solid ${colors.sand}`,
        backgroundColor: 'white'
      }}>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => setInput(q)}
            style={{
              padding: '8px 12px',
              backgroundColor: 'white',
              border: `1px solid ${colors.sand}`,
              borderRadius: '20px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              color: colors.soil,
              fontFamily: 'inherit'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* حقل الإدخال */}
      <div style={{
        padding: '16px',
        borderTop: `1px solid ${colors.sand}`,
        display: 'flex',
        gap: '10px',
        backgroundColor: 'white'
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اسأل مستشارك الزراعي..."
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '24px',
            border: `1px solid ${colors.sand}`,
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'none',
            maxHeight: '80px',
            outline: 'none'
          }}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '24px',
            backgroundColor: input.trim() && !loading ? colors.green : colors.sand,
            color: 'white',
            border: 'none',
            fontSize: '20px',
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
    </div>
  );
};

export default AISection;
