import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';
import Modal from './shared/Modal';
import Field from './shared/Field';
import BreedingPlanModal from './BreedingPlanModal';

const LivestockSection = () => {
  const {
    farmData,
    updateCattleHerd, deleteCattleHerd,
    updateSheepHerd,  deleteSheepHerd,
    updatePoultryFlock, deletePoultryFlock,
    updateFishPond,   deleteFishPond
  } = useFarm();

  const [activeTab, setActiveTab] = useState('cattle');
  const [editItem, setEditItem] = useState(null); // { type, data }
  const [planItem, setPlanItem] = useState(null); // { type, data }
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const totalCattle  = farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0);
  const totalSheep   = farmData.livestock.sheep.herds.reduce((s, h) => s + (h.count || 0), 0);
  const totalPoultry = farmData.livestock.poultry.flocks.reduce((s, f) => s + (f.count || 0), 0);
  const totalFish    = farmData.livestock.fish.ponds.reduce((s, p) => s + (p.fishCount || 0), 0);

  const tabs = [
    { id: 'cattle',  name: '🐄 أبقار',  count: totalCattle,  color: colors.soil },
    { id: 'sheep',   name: '🐑 أغنام',  count: totalSheep,   color: colors.green },
    { id: 'poultry', name: '🐔 دواجن',  count: totalPoultry, color: colors.orange },
    { id: 'fish',    name: '🐟 أسماك',  count: totalFish,    color: colors.sky }
  ];

  const icons = { cattle: '🐄', sheep: '🐑', poultry: '🐔', fish: '🐟' };

  const ActionBtns = ({ id, label, onEdit, onDelete, onPlan, hasPlan }) => {
    if (pendingDeleteId === id) {
      return (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <button
            onClick={() => { onDelete(); setPendingDeleteId(null); }}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', fontWeight: 'bold' }}
          >
            ⚠️ تأكيد الحذف
          </button>
          <button
            onClick={() => setPendingDeleteId(null)}
            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${colors.sand}`, backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', color: colors.dark }}
          >
            إلغاء
          </button>
        </div>
      );
    }
    return (
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button onClick={onPlan} style={{
          flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${hasPlan ? colors.green : colors.sand}`,
          backgroundColor: hasPlan ? colors.green + '15' : 'white', cursor: 'pointer', fontSize: '13px',
          fontFamily: 'inherit', color: hasPlan ? colors.green : colors.dark, fontWeight: hasPlan ? 'bold' : 'normal'
        }}>📋 {hasPlan ? 'خطة التربية' : 'إنشاء خطة'}</button>
        <button onClick={onEdit} style={{
          padding: '8px 14px', borderRadius: '8px', border: `1px solid ${colors.sand}`,
          backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', color: colors.dark
        }}>✏️</button>
        <button onClick={() => setPendingDeleteId(id)} style={{
          padding: '8px 14px', borderRadius: '8px', border: 'none',
          backgroundColor: '#fee2e2', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', color: '#dc2626'
        }}>🗑️</button>
      </div>
    );
  };

  const EmptyState = () => (
    <div style={{ textAlign: 'center', padding: '40px', color: colors.soil }}>
      <p style={{ fontSize: '48px', marginBottom: '10px' }}>{icons[activeTab]}</p>
      <p>لا توجد بيانات</p>
      <p style={{ fontSize: '14px', marginTop: '8px' }}>اضغط على زر ➕ لإضافة</p>
    </div>
  );

  /* ──────────── Edit Forms ──────────── */
  const EditForm = () => {
    if (!editItem) return null;
    const { type, data } = editItem;

    if (type === 'cattle' || type === 'sheep') {
      return <HerdEditForm type={type} data={data} />;
    }
    if (type === 'poultry') return <PoultryEditForm data={data} />;
    if (type === 'fish')    return <FishEditForm data={data} />;
    return null;
  };

  const HerdEditForm = ({ type, data }) => {
    const [f, setF] = useState({ name: data.name, type: data.type, count: data.count, avgWeight: data.avgWeight || '', housing: data.housing || '' });
    const [err, setErr] = useState('');
    const types = type === 'cattle' ? ['حلوب', 'تسمين', 'عجول', 'تكاثر'] : ['تسمين', 'تكاثر', 'حلوب', 'عجول'];
    const upd = (k) => (v) => { setErr(''); setF(p => ({ ...p, [k]: v })); };
    const save = (e) => {
      e.preventDefault();
      if (!f.name.trim() || !f.type || !f.count) { setErr('يرجى ملء الحقول المطلوبة'); return; }
      const fn = type === 'cattle' ? updateCattleHerd : updateSheepHerd;
      fn(data.id, { ...f, count: Number(f.count), avgWeight: Number(f.avgWeight) || null });
      setEditItem(null);
    };
    return (
      <form onSubmit={save}>
        {err && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>{err}</div>}
        <Field label="الاسم" value={f.name} onChange={upd('name')} required />
        <Field label="النوع" type="select" options={types} value={f.type} onChange={upd('type')} required />
        <Field label="العدد" type="text" inputMode="numeric" value={String(f.count)} onChange={upd('count')} placeholder="مثال: 50" required />
        <Field label="متوسط الوزن" type="text" inputMode="decimal" unit="كغ" value={String(f.avgWeight || '')} onChange={upd('avgWeight')} placeholder="اختياري" />
        <Field label="الحظيرة" value={f.housing} onChange={upd('housing')} placeholder="اختياري" />
        <button type="submit" style={{ width: '100%', padding: '13px', backgroundColor: colors.green, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px' }}>
          حفظ التعديلات
        </button>
      </form>
    );
  };

  const PoultryEditForm = ({ data }) => {
    const [f, setF] = useState({ name: data.name, breed: data.breed || '', count: data.count, ageDays: data.ageDays || '' });
    const [err, setErr] = useState('');
    const upd = (k) => (v) => { setErr(''); setF(p => ({ ...p, [k]: v })); };
    const save = (e) => {
      e.preventDefault();
      if (!f.name.trim() || !f.count) { setErr('يرجى ملء الحقول المطلوبة'); return; }
      updatePoultryFlock(data.id, { ...f, count: Number(f.count), ageDays: Number(f.ageDays) || 0 });
      setEditItem(null);
    };
    return (
      <form onSubmit={save}>
        {err && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>{err}</div>}
        <Field label="الاسم" value={f.name} onChange={upd('name')} required />
        <Field label="السلالة" value={f.breed} onChange={upd('breed')} placeholder="مثال: روس 308" />
        <Field label="العدد" type="text" inputMode="numeric" value={String(f.count)} onChange={upd('count')} placeholder="مثال: 1000" required />
        <Field label="عمر القطيع (يوم)" type="text" inputMode="numeric" value={String(f.ageDays)} onChange={upd('ageDays')} placeholder="مثال: 20" />
        <button type="submit" style={{ width: '100%', padding: '13px', backgroundColor: colors.orange, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px' }}>
          حفظ التعديلات
        </button>
      </form>
    );
  };

  const FishEditForm = ({ data }) => {
    const [f, setF] = useState({ name: data.name, type: data.type || '', fishCount: data.fishCount || '', length: data.length || '', width: data.width || '', depth: data.depth || '' });
    const [err, setErr] = useState('');
    const upd = (k) => (v) => { setErr(''); setF(p => ({ ...p, [k]: v })); };
    const save = (e) => {
      e.preventDefault();
      if (!f.name.trim() || !f.fishCount) { setErr('يرجى ملء الحقول المطلوبة'); return; }
      updateFishPond(data.id, { ...f, fishCount: Number(f.fishCount), length: Number(f.length) || 0, width: Number(f.width) || 0, depth: Number(f.depth) || 0 });
      setEditItem(null);
    };
    const fishTypes = ['بلطي', 'كارب', 'جريث', 'مختلطة'];
    return (
      <form onSubmit={save}>
        {err && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>{err}</div>}
        <Field label="اسم الحوض" value={f.name} onChange={upd('name')} required />
        <Field label="نوع السمك" type="select" options={fishTypes} value={f.type} onChange={upd('type')} />
        <Field label="عدد الأسماك" type="text" inputMode="numeric" value={String(f.fishCount)} onChange={upd('fishCount')} required />
        <Field label="الطول (م)" type="text" inputMode="decimal" value={String(f.length)} onChange={upd('length')} />
        <Field label="العرض (م)"  type="text" inputMode="decimal" value={String(f.width)}  onChange={upd('width')}  />
        <Field label="العمق (م)"  type="text" inputMode="decimal" value={String(f.depth)}  onChange={upd('depth')}  />
        <button type="submit" style={{ width: '100%', padding: '13px', backgroundColor: colors.sky, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px' }}>
          حفظ التعديلات
        </button>
      </form>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>🐄 الثروة الحيوانية</h2>

      {/* ملخص سريع */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <div key={tab.id} style={{ backgroundColor: tab.color, padding: '12px 8px', borderRadius: '10px', color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{tab.count}</div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>{tab.name.split(' ')[1]}</div>
          </div>
        ))}
      </div>

      {/* تبويبات */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '10px 16px', borderRadius: '8px', border: 'none',
            backgroundColor: activeTab === tab.id ? tab.color : colors.cream,
            color: activeTab === tab.id ? 'white' : colors.dark,
            cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit'
          }}>
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* أبقار */}
      {activeTab === 'cattle' && (
        farmData.livestock.cattle.herds.length === 0 ? <EmptyState /> :
        farmData.livestock.cattle.herds.map(h => (
          <div key={h.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: `1px solid ${colors.sand}` }}>
            <h3 style={{ color: colors.dark, marginBottom: '10px' }}>{h.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' }}>
              <div><span style={{ color: colors.soil }}>النوع:</span> <strong>{h.type}</strong></div>
              <div><span style={{ color: colors.soil }}>العدد:</span> <strong>{h.count} رأس</strong></div>
              {h.avgWeight && <div><span style={{ color: colors.soil }}>الوزن:</span> <strong>{h.avgWeight} كغ</strong></div>}
              {h.housing   && <div><span style={{ color: colors.soil }}>الحظيرة:</span> <strong>{h.housing}</strong></div>}
            </div>
            <ActionBtns id={h.id} label={h.name} hasPlan={!!h.plan}
              onEdit={() => setEditItem({ type: 'cattle', data: h })}
              onDelete={() => deleteCattleHerd(h.id)}
              onPlan={() => setPlanItem({ type: 'cattle', data: h })} />
          </div>
        ))
      )}

      {/* أغنام */}
      {activeTab === 'sheep' && (
        farmData.livestock.sheep.herds.length === 0 ? <EmptyState /> :
        farmData.livestock.sheep.herds.map(h => (
          <div key={h.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: `1px solid ${colors.sand}` }}>
            <h3 style={{ color: colors.dark, marginBottom: '10px' }}>{h.name}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' }}>
              <div><span style={{ color: colors.soil }}>النوع:</span> <strong>{h.type}</strong></div>
              <div><span style={{ color: colors.soil }}>العدد:</span> <strong>{h.count} رأس</strong></div>
              {h.avgWeight && <div><span style={{ color: colors.soil }}>الوزن:</span> <strong>{h.avgWeight} كغ</strong></div>}
              {h.housing   && <div><span style={{ color: colors.soil }}>الحظيرة:</span> <strong>{h.housing}</strong></div>}
            </div>
            <ActionBtns id={h.id} label={h.name} hasPlan={!!h.plan}
              onEdit={() => setEditItem({ type: 'sheep', data: h })}
              onDelete={() => deleteSheepHerd(h.id)}
              onPlan={() => setPlanItem({ type: 'sheep', data: h })} />
          </div>
        ))
      )}

      {/* دواجن */}
      {activeTab === 'poultry' && (
        farmData.livestock.poultry.flocks.length === 0 ? <EmptyState /> :
        farmData.livestock.poultry.flocks.map(f => {
          const isReady = f.ageDays >= 35 && f.ageDays <= 42;
          return (
            <div key={f.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: `2px solid ${isReady ? colors.orange : colors.sand}` }}>
              {isReady && <div style={{ backgroundColor: colors.orange, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', marginBottom: '10px', display: 'inline-block' }}>🐔 جاهز للتسويق</div>}
              <h3 style={{ color: colors.dark, marginBottom: '10px' }}>{f.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' }}>
                <div><span style={{ color: colors.soil }}>السلالة:</span> <strong>{f.breed || '-'}</strong></div>
                <div><span style={{ color: colors.soil }}>العدد:</span> <strong>{f.count} طير</strong></div>
                <div><span style={{ color: colors.soil }}>العمر:</span> <strong>{f.ageDays} يوم</strong></div>
                <div>
                  <div style={{ height: '6px', backgroundColor: colors.sand, borderRadius: '3px', marginTop: '8px' }}>
                    <div style={{ width: `${Math.min(100, (f.ageDays / 42) * 100)}%`, height: '100%', backgroundColor: isReady ? colors.orange : colors.lime, borderRadius: '3px' }} />
                  </div>
                  <small style={{ color: colors.soil }}>{Math.min(100, Math.round((f.ageDays / 42) * 100))}% من التسويق</small>
                </div>
              </div>
              <ActionBtns id={f.id} label={f.name} hasPlan={!!f.plan}
                onEdit={() => setEditItem({ type: 'poultry', data: f })}
                onDelete={() => deletePoultryFlock(f.id)}
                onPlan={() => setPlanItem({ type: 'poultry', data: f })} />
            </div>
          );
        })
      )}

      {/* أسماك */}
      {activeTab === 'fish' && (
        farmData.livestock.fish.ponds.length === 0 ? <EmptyState /> :
        farmData.livestock.fish.ponds.map(p => {
          const volume = (p.length || 0) * (p.width || 0) * (p.depth || 0);
          const maxFish = volume > 0 ? Math.floor(volume * (p.type === 'كارب' ? 2 : 3)) : 0;
          const density = maxFish > 0 ? Math.round((p.fishCount / maxFish) * 100) : 0;
          return (
            <div key={p.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '12px', border: `2px solid ${density > 90 ? colors.orange : colors.sand}` }}>
              <h3 style={{ color: colors.dark, marginBottom: '10px' }}>{p.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
                <div><span style={{ color: colors.soil }}>النوع:</span> <strong>{p.type}</strong></div>
                <div><span style={{ color: colors.soil }}>الأسماك:</span> <strong>{p.fishCount}</strong></div>
                {volume > 0 && <><div><span style={{ color: colors.soil }}>الأبعاد:</span> <strong>{p.length}×{p.width}×{p.depth} م</strong></div>
                <div><span style={{ color: colors.soil }}>الكثافة:</span> <strong style={{ color: density > 90 ? colors.orange : colors.green }}>{density}%</strong></div></>}
              </div>
              {volume > 0 && <div style={{ height: '6px', backgroundColor: colors.sand, borderRadius: '3px', marginBottom: '12px' }}>
                <div style={{ width: `${Math.min(100, density)}%`, height: '100%', backgroundColor: density > 90 ? colors.orange : colors.sky, borderRadius: '3px' }} />
              </div>}
              <ActionBtns id={p.id} label={p.name} hasPlan={!!p.plan}
                onEdit={() => setEditItem({ type: 'fish', data: p })}
                onDelete={() => deleteFishPond(p.id)}
                onPlan={() => setPlanItem({ type: 'fish', data: p })} />
            </div>
          );
        })
      )}

      {/* نافذة التعديل */}
      {editItem && (
        <Modal title={`تعديل: ${editItem.data.name}`} onClose={() => setEditItem(null)}>
          <EditForm />
        </Modal>
      )}

      {/* نافذة خطة التربية */}
      {planItem && (
        <Modal title={`📋 خطة التربية — ${planItem.data.name}`} onClose={() => setPlanItem(null)}>
          <BreedingPlanModal
            animalType={planItem.type}
            item={planItem.data}
            onUpdate={(updates) => {
              if (planItem.type === 'cattle')  updateCattleHerd(planItem.data.id, updates);
              if (planItem.type === 'sheep')   updateSheepHerd(planItem.data.id, updates);
              if (planItem.type === 'poultry') updatePoultryFlock(planItem.data.id, updates);
              if (planItem.type === 'fish')    updateFishPond(planItem.data.id, updates);
            }}
            onClose={() => setPlanItem(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default LivestockSection;
