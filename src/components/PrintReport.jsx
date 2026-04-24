import React from 'react';
import { useFarm } from '../context/FarmContext';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
    <h2 style={{ fontSize: '16px', borderBottom: '2px solid #1a1a1a', paddingBottom: '6px', marginBottom: '12px', color: '#1a1a1a' }}>
      {title}
    </h2>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>
    <span style={{ color: '#6b7280' }}>{label}</span>
    <strong style={{ color: '#1a1a1a' }}>{value}</strong>
  </div>
);

const PrintReport = () => {
  const { farmData } = useFarm();
  const today = new Date().toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const cattle  = farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0);
  const sheep   = farmData.livestock.sheep.herds.reduce((s, h) => s + (h.count || 0), 0);
  const poultry = farmData.livestock.poultry.flocks.reduce((s, f) => s + (f.count || 0), 0);
  const fish    = farmData.livestock.fish.ponds.reduce((s, p) => s + (p.fishCount || 0), 0);

  const totalArea   = farmData.lands.reduce((s, l) => s + (l.area || 0), 0);
  const plantedArea = farmData.lands.filter(l => l.currentCrop).reduce((s, l) => s + (l.area || 0), 0);

  const feedKg = farmData.feedInventory.ingredients.reduce((s, i) =>
    s + (i.unit === 'طن' ? (i.quantity || 0) * 1000 : (i.quantity || 0)), 0);

  const thisMonth = new Date().getMonth();
  const thisYear  = new Date().getFullYear();
  const monthTx   = (farmData.finances?.transactions || []).filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  const income  = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
  const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);

  const last30 = [...farmData.dailyLogs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 30);

  const totalMilk = last30.reduce((s, l) => s + (l.milkProduction || 0), 0);
  const totalEggs = last30.reduce((s, l) => s + (l.eggsCollected || 0), 0);
  const totalMort = last30.reduce((s, l) => s + (l.mortality || 0), 0);

  const medItems = farmData.medicineInventory?.items || [];
  const expiredMeds = medItems.filter(m => {
    if (!m.expiryDate) return false;
    return new Date(m.expiryDate) < new Date();
  });
  const lowMeds = medItems.filter(m => m.minQuantity > 0 && m.quantity <= m.minQuantity);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', direction: 'rtl', padding: '20px', color: '#1a1a1a', maxWidth: '800px', margin: '0 auto' }}>
      {/* رأس التقرير */}
      <div style={{ textAlign: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '3px solid #1a1a1a' }}>
        <h1 style={{ fontSize: '22px', margin: '0 0 6px', color: '#1a1a1a' }}>📊 تقرير المزرعة الذكية</h1>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#374151' }}>{farmData.farm.name}</div>
        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{today}</div>
      </div>

      {/* ملخص الثروة الحيوانية */}
      <Section title="🐄 الثروة الحيوانية">
        <Row label="الأبقار"  value={`${cattle} رأس`} />
        <Row label="الأغنام"  value={`${sheep} رأس`} />
        <Row label="الدواجن"  value={`${poultry} طير`} />
        <Row label="الأسماك"  value={`${fish} سمكة`} />
        <Row label="القطعان / الأسراب" value={`${farmData.livestock.cattle.herds.length + farmData.livestock.sheep.herds.length + farmData.livestock.poultry.flocks.length + farmData.livestock.fish.ponds.length}`} />
      </Section>

      {/* المحاصيل والأراضي */}
      <Section title="🌾 المحاصيل والأراضي">
        <Row label="المساحة الكلية"  value={`${totalArea} دونم`} />
        <Row label="المساحة المزروعة" value={`${plantedArea} دونم`} />
        <Row label="نسبة الاستثمار"  value={totalArea > 0 ? `${Math.round(plantedArea / totalArea * 100)}%` : '—'} />
        {farmData.lands.filter(l => l.currentCrop).map(l => (
          <Row key={l.id} label={l.name} value={`${l.currentCrop} — ${l.area} دونم`} />
        ))}
      </Section>

      {/* الإنتاج (آخر 30 يوم) */}
      {(totalMilk > 0 || totalEggs > 0 || last30.length > 0) && (
        <Section title="📈 الإنتاج (آخر 30 يوم)">
          {totalMilk > 0 && <Row label="إجمالي الحليب"  value={`${totalMilk.toFixed(0)} لتر`} />}
          {totalEggs > 0 && <Row label="إجمالي البيض"   value={`${totalEggs.toLocaleString()} بيضة`} />}
          {totalMort > 0 && <Row label="إجمالي النفوق"  value={`${totalMort} حالة`} />}
          <Row label="أيام مسجّلة" value={`${last30.length} يوم`} />
        </Section>
      )}

      {/* الأعلاف */}
      <Section title="📦 مخزون الأعلاف">
        <Row label="إجمالي المخزون" value={feedKg >= 1000 ? `${(feedKg / 1000).toFixed(1)} طن` : `${feedKg} كغ`} />
        {farmData.feedInventory.ingredients.map(i => (
          <Row key={i.id} label={i.name} value={`${i.quantity} ${i.unit}`} />
        ))}
      </Section>

      {/* الأدوية */}
      {medItems.length > 0 && (
        <Section title="💊 مخزون الأدوية">
          <Row label="إجمالي الأصناف"    value={medItems.length} />
          {expiredMeds.length > 0 && <Row label="منتهية الصلاحية" value={`${expiredMeds.length} صنف ⚠️`} />}
          {lowMeds.length > 0      && <Row label="مخزون حرج"      value={`${lowMeds.length} صنف ⚠️`} />}
          {medItems.map(m => (
            <Row key={m.id} label={m.name} value={`${m.quantity} ${m.unit}${m.expiryDate ? ` (ينتهي ${m.expiryDate})` : ''}`} />
          ))}
        </Section>
      )}

      {/* الملخص المالي */}
      {monthTx.length > 0 && (
        <Section title="💰 الملخص المالي (هذا الشهر)">
          <Row label="الإيرادات"  value={`${income.toLocaleString()} د.ع`} />
          <Row label="المصاريف"   value={`${expense.toLocaleString()} د.ع`} />
          <Row label="صافي الربح" value={`${(income - expense).toLocaleString()} د.ع`} />
          {income > 0 && <Row label="هامش الربح" value={`${Math.round((income - expense) / income * 100)}%`} />}
        </Section>
      )}

      {/* تذييل */}
      <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', fontSize: '12px', color: '#9ca3af' }}>
        تم إنشاء هذا التقرير تلقائياً من تطبيق المزرعة الذكية · {today}
      </div>
    </div>
  );
};

export default PrintReport;
