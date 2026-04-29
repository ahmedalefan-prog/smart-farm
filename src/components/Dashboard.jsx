import React from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';

const Dashboard = ({ type = 'main', onGoTo }) => {
  const { farmData } = useFarm();

  const totalCattle  = farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0);
  const totalSheep   = farmData.livestock.sheep.herds.reduce((s, h) => s + (h.count || 0), 0);
  const totalPoultry = farmData.livestock.poultry.flocks.reduce((s, f) => s + (f.count || 0), 0);
  const totalFish    = farmData.livestock.fish.ponds.reduce((s, p) => s + (p.fishCount || 0), 0);
  const totalArea    = farmData.lands.reduce((s, l) => s + (l.area || 0), 0);
  const plantedArea  = farmData.lands.filter(l => l.currentCrop).reduce((s, l) => s + (l.area || 0), 0);
  const totalFeedKg  = farmData.feedInventory.ingredients.reduce((s, ing) => {
    return s + (ing.unit === 'طن' ? ing.quantity * 1000 : ing.quantity);
  }, 0);

  const cardStyle = (bg) => ({
    backgroundColor: bg,
    padding: '16px',
    borderRadius: '12px',
    color: 'white'
  });

  const navBtn = (label, section, sub) => (
    <button
      key={sub}
      onClick={() => onGoTo?.(section, sub)}
      style={{
        flex: 1, padding: '12px 8px', border: 'none', borderRadius: '10px',
        backgroundColor: 'white', color: colors.dark, cursor: 'pointer',
        fontFamily: 'inherit', fontSize: '13px', fontWeight: 'bold',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
      }}
    >
      {label}
    </button>
  );

  switch (type) {
    case 'crops':
      return (
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: colors.wheat, marginBottom: '20px' }}>🌾 المحاصيل والخضروات</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={cardStyle(colors.wheat)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>المساحة الكلية</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{totalArea} دونم</div>
            </div>
            <div style={cardStyle(colors.lime)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>المزروعة</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{plantedArea} دونم</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{farmData.lands.filter(l => l.currentCrop).length} قطعة</div>
            </div>
          </div>
          {farmData.lands.filter(l => l.currentCrop).length > 0 && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <h4 style={{ color: colors.dark, marginBottom: '10px' }}>📍 الأراضي المزروعة</h4>
              {farmData.lands.filter(l => l.currentCrop).map(land => {
                const daysLeft = land.expectedHarvest
                  ? Math.ceil((new Date(land.expectedHarvest) - new Date()) / (1000 * 60 * 60 * 24))
                  : null;
                return (
                  <div key={land.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.sand}` }}>
                    <span style={{ fontSize: '14px' }}>{land.name} — {land.currentCrop} ({land.area} دونم)</span>
                    {daysLeft !== null && (
                      <span style={{ color: daysLeft <= 7 ? colors.orange : colors.green, fontSize: '13px', whiteSpace: 'nowrap', marginRight: '8px' }}>
                        {daysLeft > 0 ? `${daysLeft} يوم` : '⚡ حان الحصاد!'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            {navBtn('🌾 المحاصيل الحقلية', 'crops', 'field-crops')}
            {navBtn('🥬 الخضروات والفواكه', 'crops', 'vegetables')}
          </div>
        </div>
      );

    case 'livestock':
      return (
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: colors.soil, marginBottom: '20px' }}>🐄 الثروة الحيوانية</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={cardStyle(colors.soil)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>🐄 أبقار</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{totalCattle}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{farmData.livestock.cattle.herds.length} قطيع</div>
            </div>
            <div style={cardStyle(colors.green)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>🐑 أغنام</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{totalSheep}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{farmData.livestock.sheep.herds.length} قطيع</div>
            </div>
            <div style={cardStyle(colors.orange)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>🐔 دواجن</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{totalPoultry}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{farmData.livestock.poultry.flocks.length} قطيع</div>
            </div>
            <div style={cardStyle(colors.sky)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>🐟 أسماك</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{totalFish}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>{farmData.livestock.fish.ponds.length} حوض</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {navBtn('🐄 القطعان', 'livestock', 'animals')}
            {navBtn('🏠 المنشآت', 'livestock', 'housing')}
            {navBtn('💊 الأدوية', 'livestock', 'medicines')}
          </div>
        </div>
      );

    case 'resources': {
      const totalAnimalsForFeed =
        totalCattle * 12 + totalSheep * 1.5 + totalPoultry * 0.15;
      const recentLogs = farmData.dailyLogs.slice(-7);
      const avgDailyFeed = recentLogs.length > 0
        ? recentLogs.reduce((s, l) => s + (l.feedConsumed || 0), 0) / recentLogs.length
        : totalAnimalsForFeed;
      const feedDaysLeft = avgDailyFeed > 0 ? Math.floor(totalFeedKg / avgDailyFeed) : 0;
      const feedColor = feedDaysLeft < 7 ? '#ef4444' : feedDaysLeft < 14 ? colors.orange : colors.lime;

      return (
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: colors.teal, marginBottom: '20px' }}>💧 الموارد</h2>
          <div style={{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
            <div style={cardStyle(feedColor)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>📦 مخزون الأعلاف</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{(totalFeedKg / 1000).toFixed(2)} طن</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {feedDaysLeft > 0 ? `يكفي ${feedDaysLeft} يوم` : 'غير محدد'} · {farmData.feedInventory.ingredients.length} مادة
              </div>
            </div>
            <div style={cardStyle(colors.sky)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>🌱 استغلال الأراضي</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{plantedArea} / {totalArea} دونم</div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                {totalArea > 0 ? Math.round(plantedArea / totalArea * 100) : 0}% مستغلة
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {navBtn('🌾 الأعلاف', 'resources', 'feed')}
            {navBtn('💧 الري', 'resources', 'irrigation')}
            {navBtn('🧪 التربة', 'resources', 'soil')}
          </div>
        </div>
      );
    }

    case 'analytics': {
      const totalIncome  = (farmData.finances?.transactions || []).filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
      const totalExpense = (farmData.finances?.transactions || []).filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
      const netProfit = totalIncome - totalExpense;

      return (
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: colors.purple, marginBottom: '20px' }}>📊 التحليلات</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={cardStyle(colors.purple)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>📋 السجلات</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{farmData.dailyLogs.length}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>إجمالي</div>
            </div>
            <div style={cardStyle(colors.teal)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>🔔 التنبيهات</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold' }}>{farmData.alerts?.filter(a => !a.read).length || 0}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>غير مقروءة</div>
            </div>
            <div style={{ ...cardStyle(netProfit >= 0 ? colors.green : '#ef4444'), gridColumn: '1/-1' }}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>💰 صافي الأرباح (كل الوقت)</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString('ar-IQ')} د.ع
              </div>
              <div style={{ fontSize: '12px', opacity: 0.9 }}>
                إيرادات: {totalIncome.toLocaleString('ar-IQ')} · مصاريف: {totalExpense.toLocaleString('ar-IQ')}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {navBtn('🔄 الدورة المغلقة', 'analytics', 'circular')}
            {navBtn('📊 التقارير', 'analytics', 'reports')}
            {navBtn('💰 المالية', 'analytics', 'finance')}
          </div>
        </div>
      );
    }

    case 'knowledge':
      return (
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: colors.gold, marginBottom: '20px' }}>📚 المعرفة</h2>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>🧬</p>
            <p style={{ color: colors.dark, fontWeight: 'bold', marginBottom: '8px' }}>موسوعة السلالات والأمراض</p>
            <p style={{ color: colors.soil }}>19 سلالة حيوانية مع أمراض ولقاحات وبروتوكولات علاج</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {navBtn('🧬 الموسوعة', 'knowledge', 'encyclopedia')}
          </div>
        </div>
      );

    default:
      return (
        <div style={{ padding: '20px' }}>
          <h2 style={{ color: colors.green, marginBottom: '20px', textAlign: 'center' }}>🌾 المزرعة الذكية</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={cardStyle(colors.wheat)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>🌱 الأراضي</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{plantedArea}/{totalArea}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>دونم مزروعة</div>
            </div>
            <div style={cardStyle(colors.soil)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>🐄 الحيوانات</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalCattle + totalSheep + totalPoultry + totalFish}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>إجمالي</div>
            </div>
            <div style={cardStyle(colors.lime)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>📦 الأعلاف</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{(totalFeedKg / 1000).toFixed(1)} طن</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>في المخزون</div>
            </div>
            <div style={cardStyle(colors.purple)}>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>📋 السجلات</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{farmData.dailyLogs.length}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>سجل يومي</div>
            </div>
          </div>
        </div>
      );
  }
};

export default Dashboard;
