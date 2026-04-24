import React, { useState, useMemo } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';

const MEDICINE_TYPES = [
  { id: 'vaccine',      label: 'لقاح',           icon: '💉', color: '#6366f1' },
  { id: 'antibiotic',   label: 'مضاد حيوي',      icon: '💊', color: '#ef4444' },
  { id: 'supplement',   label: 'مكمل غذائي',     icon: '🌿', color: colors.green },
  { id: 'disinfectant', label: 'مطهر',            icon: '🧴', color: colors.teal },
  { id: 'other',        label: 'أخرى',            icon: '🔬', color: colors.soil }
];

const ANIMAL_TARGETS = [
  { id: 'cattle',  label: 'أبقار',  icon: '🐄' },
  { id: 'sheep',   label: 'أغنام',  icon: '🐑' },
  { id: 'poultry', label: 'دواجن',  icon: '🐔' },
  { id: 'fish',    label: 'أسماك',  icon: '🐟' },
  { id: 'all',     label: 'الكل',   icon: '🏡' }
];

const UNITS = ['جرعة', 'مل', 'لتر', 'غم', 'كغم', 'علبة', 'قارورة'];

const typeInfo = (id) => MEDICINE_TYPES.find(t => t.id === id) || MEDICINE_TYPES[4];

const daysDiff = (dateStr) => {
  if (!dateStr) return null;
  return Math.floor((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
};

const ExpiryBadge = ({ date }) => {
  const diff = daysDiff(date);
  if (diff === null) return null;
  const expired = diff < 0;
  const warning = diff <= 30;
  if (!expired && !warning) return null;
  return (
    <span style={{
      fontSize: '10px', padding: '2px 7px', borderRadius: '8px', fontWeight: 'bold',
      backgroundColor: expired ? '#ef4444' : '#f59e0b',
      color: 'white'
    }}>
      {expired ? `منتهي منذ ${Math.abs(diff)} يوم` : `ينتهي بعد ${diff} يوم`}
    </span>
  );
};

const StockBadge = ({ quantity, minQuantity }) => {
  if (!minQuantity || minQuantity <= 0) return null;
  const ratio = quantity / minQuantity;
  if (ratio > 2) return null;
  return (
    <span style={{
      fontSize: '10px', padding: '2px 7px', borderRadius: '8px', fontWeight: 'bold',
      backgroundColor: ratio <= 1 ? '#ef4444' : '#f59e0b',
      color: 'white'
    }}>
      {ratio <= 1 ? 'مخزون حرج' : 'مخزون منخفض'}
    </span>
  );
};

const emptyForm = {
  name: '', type: 'vaccine', targetAnimals: [],
  quantity: '', unit: 'جرعة', minQuantity: '',
  expiryDate: '', cost: '', supplier: '', notes: ''
};

const MedicineSection = () => {
  const { farmData, addMedicine, updateMedicine, deleteMedicine } = useFarm();
  const items = farmData.medicineInventory?.items || [];

  const [tab, setTab] = useState('list'); // list | add
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [adjustId, setAdjustId] = useState(null);
  const [adjustVal, setAdjustVal] = useState('');

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'alerts') return items.filter(m => {
      const diff = daysDiff(m.expiryDate);
      const expiring = diff !== null && diff <= 30;
      const lowStock = m.minQuantity > 0 && m.quantity <= m.minQuantity * 2;
      return expiring || lowStock;
    });
    return items.filter(m => m.type === filter);
  }, [items, filter]);

  const alertCount = useMemo(() => items.filter(m => {
    const diff = daysDiff(m.expiryDate);
    const expiring = diff !== null && diff <= 30;
    const lowStock = m.minQuantity > 0 && m.quantity <= m.minQuantity * 2;
    return expiring || lowStock;
  }).length, [items]);

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleTarget = (id) => {
    setForm(f => ({
      ...f,
      targetAnimals: f.targetAnimals.includes(id)
        ? f.targetAnimals.filter(x => x !== id)
        : [...f.targetAnimals, id]
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const item = {
      ...form,
      quantity: parseFloat(form.quantity) || 0,
      minQuantity: parseFloat(form.minQuantity) || 0,
      cost: parseFloat(form.cost) || 0
    };
    if (editId) {
      updateMedicine(editId, item);
      setEditId(null);
    } else {
      addMedicine(item);
    }
    setForm(emptyForm);
    setTab('list');
  };

  const startEdit = (m) => {
    setForm({
      name: m.name, type: m.type, targetAnimals: m.targetAnimals || [],
      quantity: String(m.quantity), unit: m.unit, minQuantity: String(m.minQuantity || ''),
      expiryDate: m.expiryDate || '', cost: String(m.cost || ''),
      supplier: m.supplier || '', notes: m.notes || ''
    });
    setEditId(m.id);
    setTab('add');
  };

  const confirmAdjust = (id) => {
    const val = parseFloat(adjustVal);
    if (!isNaN(val)) updateMedicine(id, { quantity: val });
    setAdjustId(null);
    setAdjustVal('');
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1px solid ${colors.sand}`, fontSize: '15px',
    fontFamily: 'inherit', backgroundColor: 'white',
    color: colors.dark, boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block', marginBottom: '5px',
    fontWeight: 'bold', fontSize: '13px', color: colors.dark
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* رأس + تبويبات */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { id: 'list', label: `المخزون (${items.length})` },
          { id: 'add',  label: editId ? '✏️ تعديل' : '+ إضافة' }
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if (t.id === 'list') { setEditId(null); setForm(emptyForm); } }}
            style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '14px',
              backgroundColor: tab === t.id ? colors.dark : 'white',
              color: tab === t.id ? 'white' : colors.soil
            }}>{t.label}</button>
        ))}
      </div>

      {/* ── قائمة المخزون ── */}
      {tab === 'list' && (
        <>
          {/* فلتر */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '14px', paddingBottom: '4px' }}>
            {[
              { id: 'all', label: 'الكل' },
              ...(alertCount > 0 ? [{ id: 'alerts', label: `⚠️ تنبيهات (${alertCount})` }] : []),
              ...MEDICINE_TYPES.map(t => ({ id: t.id, label: `${t.icon} ${t.label}` }))
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                style={{
                  padding: '6px 14px', borderRadius: '16px', border: 'none', whiteSpace: 'nowrap',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', flexShrink: 0,
                  backgroundColor: filter === f.id ? colors.dark : colors.cream,
                  color: filter === f.id ? 'white' : colors.soil,
                  fontWeight: filter === f.id ? 'bold' : 'normal'
                }}>{f.label}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.soil }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>💊</div>
              <div style={{ fontWeight: 'bold' }}>لا توجد أدوية في المخزون</div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>أضف دواءً أو لقاحاً من تبويب "إضافة"</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(m => {
                const t = typeInfo(m.type);
                const diff = daysDiff(m.expiryDate);
                const isExpanded = expandedId === m.id;
                const isLow = m.minQuantity > 0 && m.quantity <= m.minQuantity;
                const stockColor = isLow ? '#ef4444' : m.minQuantity > 0 && m.quantity <= m.minQuantity * 2 ? '#f59e0b' : colors.green;

                return (
                  <div key={m.id} style={{
                    backgroundColor: 'white', borderRadius: '12px',
                    border: `1px solid ${colors.sand}`, overflow: 'hidden'
                  }}>
                    {/* رأس البطاقة */}
                    <div onClick={() => setExpandedId(isExpanded ? null : m.id)}
                      style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '10px',
                        backgroundColor: t.color + '18', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '22px', flexShrink: 0
                      }}>{t.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: colors.dark }}>{m.name}</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '10px', padding: '2px 7px', borderRadius: '8px',
                            backgroundColor: t.color + '20', color: t.color, fontWeight: 'bold'
                          }}>{t.label}</span>
                          <ExpiryBadge date={m.expiryDate} />
                          <StockBadge quantity={m.quantity} minQuantity={m.minQuantity} />
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: stockColor }}>{m.quantity}</div>
                        <div style={{ fontSize: '11px', color: colors.soil }}>{m.unit}</div>
                      </div>
                    </div>

                    {/* تعديل الكمية سريع */}
                    {adjustId === m.id ? (
                      <div style={{ padding: '0 14px 12px', display: 'flex', gap: '8px' }}>
                        <input
                          type="text" inputMode="decimal"
                          value={adjustVal} onChange={e => setAdjustVal(e.target.value)}
                          placeholder="الكمية الجديدة"
                          style={{ ...inputStyle, flex: 1 }}
                          autoFocus
                        />
                        <button onClick={() => confirmAdjust(m.id)} style={{
                          padding: '8px 14px', backgroundColor: colors.green, color: 'white',
                          border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit'
                        }}>حفظ</button>
                        <button onClick={() => setAdjustId(null)} style={{
                          padding: '8px 12px', backgroundColor: colors.cream, color: colors.soil,
                          border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit'
                        }}>×</button>
                      </div>
                    ) : null}

                    {/* تفاصيل موسّعة */}
                    {isExpanded && (
                      <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${colors.cream}` }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px', fontSize: '13px' }}>
                          {m.expiryDate && (
                            <div style={{ color: colors.soil }}>
                              <span style={{ fontWeight: 'bold' }}>انتهاء الصلاحية: </span>
                              {m.expiryDate}
                            </div>
                          )}
                          {m.minQuantity > 0 && (
                            <div style={{ color: colors.soil }}>
                              <span style={{ fontWeight: 'bold' }}>حد التنبيه: </span>
                              {m.minQuantity} {m.unit}
                            </div>
                          )}
                          {m.cost > 0 && (
                            <div style={{ color: colors.soil }}>
                              <span style={{ fontWeight: 'bold' }}>التكلفة: </span>
                              {m.cost.toLocaleString()} د.ع/{m.unit}
                            </div>
                          )}
                          {m.supplier && (
                            <div style={{ color: colors.soil }}>
                              <span style={{ fontWeight: 'bold' }}>المورد: </span>
                              {m.supplier}
                            </div>
                          )}
                          {(m.targetAnimals || []).length > 0 && (
                            <div style={{ color: colors.soil, gridColumn: '1/-1' }}>
                              <span style={{ fontWeight: 'bold' }}>للحيوانات: </span>
                              {(m.targetAnimals || []).map(a => ANIMAL_TARGETS.find(x => x.id === a)?.icon || a).join(' ')}
                            </div>
                          )}
                          {m.notes && (
                            <div style={{ color: colors.soil, gridColumn: '1/-1' }}>
                              <span style={{ fontWeight: 'bold' }}>ملاحظات: </span>
                              {m.notes}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button onClick={() => { setAdjustId(m.id); setAdjustVal(String(m.quantity)); setExpandedId(null); }}
                            style={{
                              flex: 1, padding: '8px', backgroundColor: colors.sky + '20', color: colors.sky,
                              border: `1px solid ${colors.sky}40`, borderRadius: '8px',
                              cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 'bold'
                            }}>📦 تعديل الكمية</button>
                          <button onClick={() => startEdit(m)}
                            style={{
                              flex: 1, padding: '8px', backgroundColor: colors.gold + '20', color: colors.soil,
                              border: `1px solid ${colors.gold}40`, borderRadius: '8px',
                              cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 'bold'
                            }}>✏️ تعديل</button>
                          <button onClick={() => { if (window.confirm?.(`حذف "${m.name}"?`) ?? true) deleteMedicine(m.id); }}
                            style={{
                              padding: '8px 14px', backgroundColor: '#ef444420', color: '#ef4444',
                              border: '1px solid #ef444440', borderRadius: '8px',
                              cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px'
                            }}>🗑️</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── نموذج الإضافة / التعديل ── */}
      {tab === 'add' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>اسم الدواء / اللقاح *</label>
            <input type="text" value={form.name} onChange={e => setField('name', e.target.value)}
              placeholder="مثال: لقاح الحمى القلاعية" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>النوع</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {MEDICINE_TYPES.map(t => (
                <button key={t.id} onClick={() => setField('type', t.id)}
                  style={{
                    padding: '10px 6px', borderRadius: '8px', border: `2px solid ${form.type === t.id ? t.color : colors.sand}`,
                    backgroundColor: form.type === t.id ? t.color + '15' : 'white',
                    cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px',
                    color: form.type === t.id ? t.color : colors.soil, fontWeight: 'bold'
                  }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>مخصص لـ</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ANIMAL_TARGETS.map(a => (
                <button key={a.id} onClick={() => toggleTarget(a.id)}
                  style={{
                    padding: '7px 14px', borderRadius: '16px',
                    border: `2px solid ${form.targetAnimals.includes(a.id) ? colors.green : colors.sand}`,
                    backgroundColor: form.targetAnimals.includes(a.id) ? colors.green + '15' : 'white',
                    cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px',
                    color: form.targetAnimals.includes(a.id) ? colors.green : colors.soil
                  }}>
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>الكمية الحالية *</label>
              <input type="text" inputMode="decimal" value={form.quantity}
                onChange={e => setField('quantity', e.target.value)} placeholder="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>الوحدة</label>
              <select value={form.unit} onChange={e => setField('unit', e.target.value)} style={inputStyle}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>حد التنبيه (كمية الإنذار المبكر)</label>
            <input type="text" inputMode="decimal" value={form.minQuantity}
              onChange={e => setField('minQuantity', e.target.value)}
              placeholder={`مثال: 10 ${form.unit}`} style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>تاريخ انتهاء الصلاحية</label>
            <input type="date" value={form.expiryDate}
              onChange={e => setField('expiryDate', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>التكلفة (د.ع / وحدة)</label>
              <input type="text" inputMode="decimal" value={form.cost}
                onChange={e => setField('cost', e.target.value)} placeholder="0" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>المورد / الصيدلية</label>
              <input type="text" value={form.supplier}
                onChange={e => setField('supplier', e.target.value)} placeholder="اختياري" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>ملاحظات</label>
            <textarea value={form.notes} onChange={e => setField('notes', e.target.value)}
              placeholder="جرعة، طريقة إعطاء، تعليمات التخزين..." rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <button onClick={handleSubmit} disabled={!form.name.trim()}
            style={{
              padding: '14px', backgroundColor: form.name.trim() ? colors.green : colors.sand,
              color: 'white', border: 'none', borderRadius: '10px',
              cursor: form.name.trim() ? 'pointer' : 'default',
              fontFamily: 'inherit', fontSize: '15px', fontWeight: 'bold'
            }}>
            {editId ? '💾 حفظ التعديلات' : '✅ إضافة إلى المخزون'}
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicineSection;
