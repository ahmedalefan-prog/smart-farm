import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';

const STATUS_MAP = {
  active:      { label: 'نشط',     color: colors.green,  icon: '✅' },
  sold:        { label: 'مُباع',   color: colors.gold,   icon: '💰' },
  dead:        { label: 'نافق',    color: '#6b7280',     icon: '🪦' },
  transferred: { label: 'منقول',   color: colors.sky,    icon: '🔄' }
};

const EVENT_TYPES = [
  { id: 'vaccine',    label: 'تلقيح',         icon: '💉' },
  { id: 'treatment',  label: 'علاج',           icon: '💊' },
  { id: 'weight',     label: 'وزن',            icon: '⚖️' },
  { id: 'birth',      label: 'ولادة',          icon: '🐣' },
  { id: 'note',       label: 'ملاحظة',         icon: '📝' }
];

const ageLabel = (birthDate) => {
  if (!birthDate) return null;
  const days = Math.floor((new Date() - new Date(birthDate)) / (1000 * 60 * 60 * 24));
  if (days < 30)  return `${days} يوم`;
  if (days < 365) return `${Math.floor(days / 30)} شهر`;
  const y = Math.floor(days / 365);
  const m = Math.floor((days % 365) / 30);
  return m > 0 ? `${y} سنة ${m} شهر` : `${y} سنة`;
};

const emptyAnimal = { tagNumber: '', gender: 'female', birthDate: '', weight: '', status: 'active', notes: '' };
const emptyEvent  = { type: 'vaccine', date: new Date().toISOString().split('T')[0], description: '', medicine: '', cost: '' };

const AnimalRecordsModal = ({ herd, herdType, onClose }) => {
  const { addAnimalToHerd, updateAnimalInHerd, deleteAnimalFromHerd, addMedicalEvent } = useFarm();

  const [tab, setTab] = useState('list');           // list | add
  const [expandedId, setExpandedId] = useState(null);
  const [eventFor, setEventFor] = useState(null);   // animalId
  const [form, setForm]   = useState(emptyAnimal);
  const [eForm, setEForm] = useState(emptyEvent);
  const [editAnimalId, setEditAnimalId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const animals = herd.animals || [];
  const filtered = statusFilter === 'all' ? animals : animals.filter(a => a.status === statusFilter);

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const ef = (k, v) => setEForm(e => ({ ...e, [k]: v }));

  const handleSave = () => {
    if (!form.tagNumber.trim()) return;
    const data = { ...form, weight: parseFloat(form.weight) || null };
    if (editAnimalId) {
      updateAnimalInHerd(herdType, herd.id, editAnimalId, data);
      setEditAnimalId(null);
    } else {
      addAnimalToHerd(herdType, herd.id, data);
    }
    setForm(emptyAnimal);
    setTab('list');
  };

  const startEdit = (a) => {
    setForm({ tagNumber: a.tagNumber, gender: a.gender, birthDate: a.birthDate || '', weight: String(a.weight || ''), status: a.status, notes: a.notes || '' });
    setEditAnimalId(a.id);
    setTab('add');
  };

  const handleAddEvent = (animalId) => {
    if (!eForm.description.trim() && !eForm.medicine.trim()) return;
    addMedicalEvent(herdType, herd.id, animalId, { ...eForm, cost: parseFloat(eForm.cost) || 0 });
    setEForm(emptyEvent);
    setEventFor(null);
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1px solid ${colors.sand}`, fontSize: '15px',
    fontFamily: 'inherit', backgroundColor: 'white',
    color: colors.dark, boxSizing: 'border-box'
  };
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px', color: colors.dark };

  const animalColor = herdType === 'cattle' ? colors.soil : colors.green;
  const animalIcon  = herdType === 'cattle' ? '🐄' : '🐑';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* رأس */}
      <div style={{ padding: '0 0 12px', borderBottom: `1px solid ${colors.cream}`, marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', color: colors.soil }}>
          {animalIcon} {herd.name} · {herd.count} رأس إجمالي · {animals.length} مُسجّل
        </div>
        {animals.length < herd.count && (
          <div style={{ fontSize: '11px', color: colors.orange, marginTop: '4px' }}>
            ⚠️ {herd.count - animals.length} رأس غير مسجّلة
          </div>
        )}
      </div>

      {/* تبويبات */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {[
          { id: 'list', label: `السجلات (${animals.length})` },
          { id: 'add',  label: editAnimalId ? '✏️ تعديل' : '+ إضافة' }
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if (t.id === 'list') { setEditAnimalId(null); setForm(emptyAnimal); } }}
            style={{
              flex: 1, padding: '9px', borderRadius: '10px', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '14px',
              backgroundColor: tab === t.id ? animalColor : 'white',
              color: tab === t.id ? 'white' : colors.soil
            }}>{t.label}</button>
        ))}
      </div>

      {/* ── قائمة الحيوانات ── */}
      {tab === 'list' && (
        <>
          {/* فلتر الحالة */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto' }}>
            {[{ id: 'all', label: 'الكل' }, ...Object.entries(STATUS_MAP).map(([id, s]) => ({ id, label: `${s.icon} ${s.label}` }))].map(f => (
              <button key={f.id} onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: '5px 12px', borderRadius: '14px', border: 'none', whiteSpace: 'nowrap',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', flexShrink: 0,
                  backgroundColor: statusFilter === f.id ? colors.dark : colors.cream,
                  color: statusFilter === f.id ? 'white' : colors.soil,
                  fontWeight: statusFilter === f.id ? 'bold' : 'normal'
                }}>{f.label}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: colors.soil }}>
              <div style={{ fontSize: '36px' }}>{animalIcon}</div>
              <div style={{ marginTop: '8px', fontWeight: 'bold' }}>لا توجد سجلات</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>أضف حيواناً من تبويب "إضافة"</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filtered.map(a => {
                const s = STATUS_MAP[a.status] || STATUS_MAP.active;
                const isExpanded = expandedId === a.id;
                return (
                  <div key={a.id} style={{ backgroundColor: 'white', borderRadius: '12px', border: `1px solid ${colors.sand}`, overflow: 'hidden' }}>
                    {/* رأس البطاقة */}
                    <div onClick={() => setExpandedId(isExpanded ? null : a.id)}
                      style={{ padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        backgroundColor: animalColor + '18',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', flexShrink: 0
                      }}>{a.gender === 'male' ? '♂️' : '♀️'}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '15px', color: colors.dark }}>
                          #{a.tagNumber}
                        </div>
                        <div style={{ fontSize: '12px', color: colors.soil, marginTop: '2px' }}>
                          {a.gender === 'male' ? 'ذكر' : 'أنثى'}
                          {a.birthDate && ` · ${ageLabel(a.birthDate)}`}
                          {a.weight && ` · ${a.weight} كغ`}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', backgroundColor: s.color + '20', color: s.color, fontWeight: 'bold' }}>
                          {s.icon} {s.label}
                        </span>
                        {(a.medicalHistory || []).length > 0 && (
                          <span style={{ fontSize: '10px', color: colors.soil }}>
                            📋 {a.medicalHistory.length} حدث طبي
                          </span>
                        )}
                      </div>
                    </div>

                    {/* تفاصيل موسّعة */}
                    {isExpanded && (
                      <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${colors.cream}` }}>
                        {a.notes && (
                          <div style={{ fontSize: '13px', color: colors.soil, margin: '10px 0', padding: '8px', backgroundColor: colors.cream, borderRadius: '8px' }}>
                            {a.notes}
                          </div>
                        )}

                        {/* السجل الطبي */}
                        {(a.medicalHistory || []).length > 0 && (
                          <div style={{ marginTop: '10px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', color: colors.dark, marginBottom: '8px' }}>📋 السجل الطبي</div>
                            {[...(a.medicalHistory || [])].reverse().map(ev => {
                              const et = EVENT_TYPES.find(x => x.id === ev.type) || EVENT_TYPES[4];
                              return (
                                <div key={ev.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '6px' }}>
                                  <span style={{ fontSize: '16px', flexShrink: 0 }}>{et.icon}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: colors.dark }}>
                                      {et.label}{ev.medicine ? ` — ${ev.medicine}` : ''}
                                    </div>
                                    <div style={{ fontSize: '11px', color: colors.soil }}>
                                      {ev.date}{ev.description ? ` · ${ev.description}` : ''}{ev.cost ? ` · ${ev.cost.toLocaleString()} د.ع` : ''}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* إضافة حدث طبي */}
                        {eventFor === a.id ? (
                          <div style={{ marginTop: '12px', padding: '12px', backgroundColor: colors.cream, borderRadius: '10px' }}>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', color: colors.dark, marginBottom: '10px' }}>➕ حدث طبي جديد</div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                              {EVENT_TYPES.map(et => (
                                <button key={et.id} onClick={() => ef('type', et.id)}
                                  style={{
                                    padding: '5px 10px', borderRadius: '14px', border: 'none', fontSize: '12px',
                                    cursor: 'pointer', fontFamily: 'inherit',
                                    backgroundColor: eForm.type === et.id ? animalColor : 'white',
                                    color: eForm.type === et.id ? 'white' : colors.soil,
                                    fontWeight: eForm.type === et.id ? 'bold' : 'normal'
                                  }}>{et.icon} {et.label}</button>
                              ))}
                            </div>
                            <input type="date" value={eForm.date} onChange={e => ef('date', e.target.value)}
                              style={{ ...inputStyle, marginBottom: '8px' }} />
                            <input type="text" value={eForm.description} onChange={e => ef('description', e.target.value)}
                              placeholder="وصف الحدث" style={{ ...inputStyle, marginBottom: '8px' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                              <input type="text" value={eForm.medicine} onChange={e => ef('medicine', e.target.value)}
                                placeholder="الدواء / اللقاح" style={inputStyle} />
                              <input type="text" inputMode="decimal" value={eForm.cost} onChange={e => ef('cost', e.target.value)}
                                placeholder="التكلفة د.ع" style={inputStyle} />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleAddEvent(a.id)}
                                style={{ flex: 1, padding: '9px', backgroundColor: animalColor, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }}>
                                حفظ
                              </button>
                              <button onClick={() => { setEventFor(null); setEForm(emptyEvent); }}
                                style={{ padding: '9px 14px', backgroundColor: 'white', color: colors.soil, border: `1px solid ${colors.sand}`, borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit' }}>
                                إلغاء
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button onClick={() => { setEventFor(a.id); setEForm(emptyEvent); }}
                              style={{ flex: 1, padding: '8px', backgroundColor: '#6366f120', color: '#6366f1', border: '1px solid #6366f140', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px', fontWeight: 'bold' }}>
                              💉 إضافة حدث طبي
                            </button>
                            <button onClick={() => startEdit(a)}
                              style={{ padding: '8px 14px', backgroundColor: colors.gold + '20', color: colors.soil, border: `1px solid ${colors.gold}40`, borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
                              ✏️
                            </button>
                            <button onClick={() => { if ((window.confirm?.(`حذف #${a.tagNumber}?`) ?? true)) { deleteAnimalFromHerd(herdType, herd.id, a.id); setExpandedId(null); } }}
                              style={{ padding: '8px 14px', backgroundColor: '#ef444420', color: '#ef4444', border: '1px solid #ef444440', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
                              🗑️
                            </button>
                          </div>
                        )}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={labelStyle}>رقم الأذن / العلامة *</label>
            <input type="text" value={form.tagNumber} onChange={e => sf('tagNumber', e.target.value)}
              placeholder="مثال: A-001" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>الجنس</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[{ id: 'female', label: '♀️ أنثى' }, { id: 'male', label: '♂️ ذكر' }].map(g => (
                <button key={g.id} onClick={() => sf('gender', g.id)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', fontFamily: 'inherit', fontSize: '15px',
                    border: `2px solid ${form.gender === g.id ? animalColor : colors.sand}`,
                    backgroundColor: form.gender === g.id ? animalColor + '15' : 'white',
                    color: form.gender === g.id ? animalColor : colors.soil,
                    cursor: 'pointer', fontWeight: 'bold'
                  }}>{g.label}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>تاريخ الميلاد</label>
              <input type="date" value={form.birthDate} onChange={e => sf('birthDate', e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>الوزن (كغ)</label>
              <input type="text" inputMode="decimal" value={form.weight} onChange={e => sf('weight', e.target.value)}
                placeholder="0" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>الحالة</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {Object.entries(STATUS_MAP).map(([id, s]) => (
                <button key={id} onClick={() => sf('status', id)}
                  style={{
                    padding: '9px', borderRadius: '8px', fontFamily: 'inherit', fontSize: '13px',
                    border: `2px solid ${form.status === id ? s.color : colors.sand}`,
                    backgroundColor: form.status === id ? s.color + '15' : 'white',
                    color: form.status === id ? s.color : colors.soil,
                    cursor: 'pointer', fontWeight: 'bold'
                  }}>{s.icon} {s.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>ملاحظات</label>
            <textarea value={form.notes} onChange={e => sf('notes', e.target.value)}
              placeholder="مثال: ابنة البقرة رقم A-002، شراء من مزرعة الرشيد..."
              rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <button onClick={handleSave} disabled={!form.tagNumber.trim()}
            style={{
              padding: '13px', backgroundColor: form.tagNumber.trim() ? animalColor : colors.sand,
              color: 'white', border: 'none', borderRadius: '10px',
              cursor: form.tagNumber.trim() ? 'pointer' : 'default',
              fontFamily: 'inherit', fontSize: '15px', fontWeight: 'bold'
            }}>
            {editAnimalId ? '💾 حفظ التعديلات' : '✅ إضافة الحيوان'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimalRecordsModal;
