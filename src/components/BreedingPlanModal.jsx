import React, { useState } from 'react';
import { colors } from '../theme/theme';
import { getTemplatesForType, getGeneralRecs, BREEDING_TEMPLATES } from '../data/breedingTemplates';

/* ── helpers ── */
const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};
const daysDiff = (from, to) => {
  const ms = new Date(to) - new Date(from);
  return Math.floor(ms / (1000 * 60 * 60 * 24));
};
const fmtDate = (str) => {
  if (!str) return '-';
  const d = new Date(str);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

/* ── colour palette shortcuts ── */
const C = {
  green:  colors.green,
  orange: colors.orange,
  red:    '#ef4444',
  sky:    colors.sky,
  gold:   colors.gold,
  teal:   colors.teal,
  soil:   colors.soil,
  cream:  colors.cream,
  sand:   colors.sand,
  dark:   colors.dark,
};

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
const BreedingPlanModal = ({ animalType, item, onUpdate, onClose }) => {
  const existing = item.plan || null;
  const [screen, setScreen]   = useState(existing ? 'editor' : 'template');
  const [plan,   setPlan]     = useState(existing);
  const [tab,    setTab]      = useState('phases');

  const templates = getTemplatesForType(animalType);

  /* apply template */
  const applyTemplate = (key, tmpl) => {
    setPlan({
      templateKey: key,
      startDate:   new Date().toISOString().split('T')[0],
      totalDays:   tmpl.totalDays,
      phases:      tmpl.phases.map(p => ({ ...p, id: uid() })),
      vaccines:    tmpl.vaccines.map(v => ({ ...v, id: uid(), done: false, doneDate: null })),
      treatments:  []
    });
    setScreen('editor');
  };

  /* manual entry */
  const startManual = () => {
    setPlan({ templateKey: null, startDate: new Date().toISOString().split('T')[0], totalDays: 90, phases: [], vaccines: [], treatments: [] });
    setScreen('editor');
  };

  const save = () => { onUpdate({ plan }); onClose(); };
  const deletePlan = () => { onUpdate({ plan: null }); onClose(); };

  /* ── TEMPLATE SELECTION SCREEN ── */
  if (screen === 'template') {
    return (
      <div>
        <p style={{ color: C.soil, fontSize: '14px', marginBottom: '16px' }}>
          اختر قالباً جاهزاً أو ابدأ بإدخال يدوي
        </p>

        {templates.map(([key, tmpl]) => (
          <button key={key} onClick={() => applyTemplate(key, tmpl)} style={{
            display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
            padding: '14px 16px', marginBottom: '10px', borderRadius: '12px',
            border: `1px solid ${C.sand}`, backgroundColor: 'white', cursor: 'pointer',
            textAlign: 'right', fontFamily: 'inherit'
          }}>
            <span style={{ fontSize: '32px' }}>{tmpl.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', color: C.dark, fontSize: '15px' }}>{tmpl.label}</div>
              <div style={{ fontSize: '12px', color: C.soil, marginTop: '3px' }}>
                {tmpl.totalDays} يوم · {tmpl.phases.length} مراحل · {tmpl.vaccines.length} لقاحات
              </div>
            </div>
            <span style={{ color: C.sky, fontSize: '18px' }}>›</span>
          </button>
        ))}

        <button onClick={startManual} style={{
          display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
          padding: '14px 16px', marginBottom: '10px', borderRadius: '12px',
          border: `2px dashed ${C.sand}`, backgroundColor: C.cream, cursor: 'pointer',
          textAlign: 'right', fontFamily: 'inherit'
        }}>
          <span style={{ fontSize: '32px' }}>✏️</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', color: C.dark, fontSize: '15px' }}>إدخال يدوي</div>
            <div style={{ fontSize: '12px', color: C.soil, marginTop: '3px' }}>أضف المراحل واللقاحات بنفسك</div>
          </div>
        </button>

        {existing && (
          <button onClick={() => setScreen('editor')} style={{
            width: '100%', padding: '12px', marginTop: '8px', border: `1px solid ${C.sky}`,
            borderRadius: '10px', backgroundColor: 'white', color: C.sky, cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '14px'
          }}>
            ← العودة للخطة الحالية
          </button>
        )}
      </div>
    );
  }

  /* ── EDITOR SCREEN ── */
  const today     = new Date().toISOString().split('T')[0];
  const currentDay = plan.startDate ? daysDiff(plan.startDate, today) : 0;
  const endDate    = plan.startDate ? addDays(plan.startDate, plan.totalDays) : null;
  const daysLeft   = endDate ? daysDiff(today, endDate) : 0;
  const progress   = plan.totalDays > 0 ? Math.min(100, Math.round((currentDay / plan.totalDays) * 100)) : 0;
  const currentPhase = plan.phases?.find(p => currentDay >= p.startDay && currentDay <= p.endDay);

  const nextVaccine = plan.startDate
    ? [...(plan.vaccines || [])].filter(v => !v.done).sort((a, b) => a.day - b.day)[0]
    : null;
  const nextVaccineDate = nextVaccine ? addDays(plan.startDate, nextVaccine.day) : null;
  const nextVaccineDays = nextVaccineDate ? daysDiff(today, nextVaccineDate) : null;

  const tabs = [
    { id: 'phases',  label: '📅 الأطوار' },
    { id: 'vaccines', label: '💉 اللقاحات' },
    { id: 'treatments', label: '🩺 العلاجات' },
    { id: 'recs',    label: '💡 توصيات' }
  ];

  return (
    <div>
      {/* ── Summary Bar ── */}
      <div style={{ backgroundColor: C.dark, borderRadius: '12px', padding: '14px', marginBottom: '16px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
          <span>يوم <strong>{Math.max(0, currentDay)}</strong> من {plan.totalDays}</span>
          <span>{daysLeft > 0 ? `متبقي ${daysLeft} يوم` : currentDay > plan.totalDays ? 'انتهت الفترة' : 'اليوم الأول'}</span>
        </div>
        <div style={{ height: '6px', backgroundColor: '#ffffff30', borderRadius: '3px', marginBottom: '10px' }}>
          <div style={{ width: `${progress}%`, height: '100%', backgroundColor: C.green, borderRadius: '3px', transition: 'width 0.3s' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '11px' }}>
          <div style={{ backgroundColor: '#ffffff15', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <div style={{ opacity: 0.7 }}>المرحلة الحالية</div>
            <div style={{ fontWeight: 'bold', marginTop: '2px' }}>{currentPhase?.name || '—'}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff15', borderRadius: '8px', padding: '8px', textAlign: 'center' }}>
            <div style={{ opacity: 0.7 }}>تاريخ الانتهاء</div>
            <div style={{ fontWeight: 'bold', marginTop: '2px' }}>{endDate ? fmtDate(endDate) : '—'}</div>
          </div>
          <div style={{
            backgroundColor: nextVaccineDays !== null && nextVaccineDays <= 3 ? '#fef08a20' : '#ffffff15',
            border: nextVaccineDays !== null && nextVaccineDays <= 3 ? `1px solid ${C.gold}` : 'none',
            borderRadius: '8px', padding: '8px', textAlign: 'center'
          }}>
            <div style={{ opacity: 0.7 }}>أقرب لقاح</div>
            <div style={{ fontWeight: 'bold', marginTop: '2px' }}>
              {nextVaccine
                ? nextVaccineDays !== null && nextVaccineDays <= 0
                  ? `⚠️ ${nextVaccine.name}`
                  : `${nextVaccineDays}ي — ${nextVaccine.name}`
                : 'لا يوجد'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Start Date + Total Days ── */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', color: C.soil, display: 'block', marginBottom: '4px' }}>تاريخ البداية</label>
          <input type="date" value={plan.startDate || ''}
            onChange={e => setPlan(p => ({ ...p, startDate: e.target.value }))}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${C.sand}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '12px', color: C.soil, display: 'block', marginBottom: '4px' }}>مدة التربية (يوم)</label>
          <input type="text" inputMode="numeric" value={plan.totalDays || ''}
            onChange={e => setPlan(p => ({ ...p, totalDays: Number(e.target.value) || 0 }))}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${C.sand}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '8px 12px', borderRadius: '20px', border: 'none', whiteSpace: 'nowrap',
            flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px',
            backgroundColor: tab === t.id ? C.dark : C.cream,
            color: tab === t.id ? 'white' : C.soil,
            fontWeight: tab === t.id ? 'bold' : 'normal'
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {tab === 'phases'     && <PhasesTab     plan={plan} setPlan={setPlan} currentDay={currentDay} />}
      {tab === 'vaccines'   && <VaccinesTab   plan={plan} setPlan={setPlan} today={today} />}
      {tab === 'treatments' && <TreatmentsTab plan={plan} setPlan={setPlan} />}
      {tab === 'recs'       && <RecsTab       plan={plan} currentDay={currentDay} animalType={animalType} currentPhase={currentPhase} nextVaccine={nextVaccine} nextVaccineDays={nextVaccineDays} />}

      {/* ── Footer Buttons ── */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={() => setScreen('template')} style={{
          padding: '11px 14px', borderRadius: '8px', border: `1px solid ${C.sand}`,
          backgroundColor: 'white', color: C.dark, cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit'
        }}>
          تغيير القالب
        </button>
        {existing && (
          <button onClick={deletePlan} style={{
            padding: '11px 14px', borderRadius: '8px', border: 'none',
            backgroundColor: '#fee2e2', color: C.red, cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit'
          }}>
            🗑️ حذف الخطة
          </button>
        )}
        <button onClick={save} style={{
          flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
          backgroundColor: C.green, color: 'white', cursor: 'pointer',
          fontSize: '15px', fontWeight: 'bold', fontFamily: 'inherit'
        }}>
          💾 حفظ الخطة
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   TAB: PHASES
══════════════════════════════════════════════ */
const PhasesTab = ({ plan, setPlan, currentDay }) => {
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm]     = useState({ name: '', startDay: '', endDay: '', feedType: '', feedKgPerHead: '', notes: '' });
  const upd = k => v => setForm(p => ({ ...p, [k]: v }));

  const resetForm = () => { setForm({ name: '', startDay: '', endDay: '', feedType: '', feedKgPerHead: '', notes: '' }); };

  const addPhase = () => {
    if (!form.name || form.startDay === '' || form.endDay === '') return;
    setPlan(p => ({ ...p, phases: [...(p.phases || []), { ...form, id: uid(), startDay: Number(form.startDay), endDay: Number(form.endDay), feedKgPerHead: Number(form.feedKgPerHead) || 0 }] }));
    resetForm(); setAdding(false);
  };

  const saveEdit = () => {
    setPlan(p => ({ ...p, phases: p.phases.map(ph => ph.id === editId ? { ...ph, ...form, startDay: Number(form.startDay), endDay: Number(form.endDay), feedKgPerHead: Number(form.feedKgPerHead) || 0 } : ph) }));
    setEditId(null); resetForm();
  };

  const deletePhase = id => setPlan(p => ({ ...p, phases: p.phases.filter(ph => ph.id !== id) }));

  const startEdit = ph => {
    setForm({ name: ph.name, startDay: String(ph.startDay), endDay: String(ph.endDay), feedType: ph.feedType || '', feedKgPerHead: String(ph.feedKgPerHead || ''), notes: ph.notes || '' });
    setEditId(ph.id); setAdding(false);
  };

  const PhaseForm = ({ onSave, onCancel }) => (
    <div style={{ backgroundColor: C.cream, borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 2 }}>
          <label style={{ fontSize: '11px', color: C.soil }}>اسم المرحلة *</label>
          <input value={form.name} onChange={e => upd('name')(e.target.value)} placeholder="مثال: مرحلة التسمين"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '11px', color: C.soil }}>من يوم *</label>
          <input type="text" inputMode="numeric" value={form.startDay} onChange={e => upd('startDay')(e.target.value)} placeholder="0"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '11px', color: C.soil }}>إلى يوم *</label>
          <input type="text" inputMode="numeric" value={form.endDay} onChange={e => upd('endDay')(e.target.value)} placeholder="42"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 2 }}>
          <label style={{ fontSize: '11px', color: C.soil }}>نوع العلف</label>
          <input value={form.feedType} onChange={e => upd('feedType')(e.target.value)} placeholder="مثال: علف بادئ 22% بروتين"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '11px', color: C.soil }}>كغ/رأس/يوم</label>
          <input type="text" inputMode="decimal" value={form.feedKgPerHead} onChange={e => upd('feedKgPerHead')(e.target.value)} placeholder="0.08"
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
        </div>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ fontSize: '11px', color: C.soil }}>ملاحظات</label>
        <input value={form.notes} onChange={e => upd('notes')(e.target.value)} placeholder="تعليمات خاصة بهذه المرحلة..."
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={onSave} style={{ flex: 1, padding: '9px', borderRadius: '7px', border: 'none', backgroundColor: C.green, color: 'white', fontFamily: 'inherit', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>حفظ</button>
        <button onClick={onCancel} style={{ flex: 1, padding: '9px', borderRadius: '7px', border: `1px solid ${C.sand}`, backgroundColor: 'white', color: C.dark, fontFamily: 'inherit', cursor: 'pointer', fontSize: '13px' }}>إلغاء</button>
      </div>
    </div>
  );

  const phases = [...(plan.phases || [])].sort((a, b) => a.startDay - b.startDay);

  return (
    <div>
      {phases.length === 0 && !adding && (
        <div style={{ textAlign: 'center', padding: '30px', color: C.soil, fontSize: '14px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>📅</div>
          لا توجد مراحل — أضف مرحلة أو اختر قالباً
        </div>
      )}

      {phases.map(ph => {
        const isCurrent = currentDay >= ph.startDay && currentDay <= ph.endDay;
        const isDone    = currentDay > ph.endDay;
        const barWidth  = plan.totalDays > 0 ? Math.round(((ph.endDay - ph.startDay + 1) / plan.totalDays) * 100) : 0;
        const barLeft   = plan.totalDays > 0 ? Math.round((ph.startDay / plan.totalDays) * 100) : 0;

        if (editId === ph.id) return (
          <div key={ph.id}>
            <PhaseForm onSave={saveEdit} onCancel={() => { setEditId(null); resetForm(); }} />
          </div>
        );

        return (
          <div key={ph.id} style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '14px', marginBottom: '10px',
            border: `2px solid ${isCurrent ? C.green : isDone ? C.sand : C.sand}`,
            opacity: isDone ? 0.7 : 1
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                {isCurrent && <span style={{ backgroundColor: C.green, color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>الآن</span>}
                {isDone && <span style={{ backgroundColor: C.sand, color: C.soil, fontSize: '10px', padding: '2px 8px', borderRadius: '10px', marginLeft: '8px' }}>منتهية</span>}
                <strong style={{ color: C.dark }}>{ph.name}</strong>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => startEdit(ph)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px' }}>✏️</button>
                <button onClick={() => deletePhase(ph.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px' }}>🗑️</button>
              </div>
            </div>

            {/* Timeline bar */}
            <div style={{ position: 'relative', height: '8px', backgroundColor: C.cream, borderRadius: '4px', marginBottom: '10px' }}>
              <div style={{ position: 'absolute', left: `${barLeft}%`, width: `${barWidth}%`, height: '100%', backgroundColor: isCurrent ? C.green : isDone ? C.sand : C.sky, borderRadius: '4px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '12px', color: C.soil }}>
              <span>📅 يوم {ph.startDay} – {ph.endDay} ({ph.endDay - ph.startDay + 1} يوم)</span>
              {ph.feedKgPerHead > 0 && <span>🌾 {ph.feedKgPerHead} كغ/رأس/يوم</span>}
              {ph.feedType && <span style={{ gridColumn: '1/-1' }}>🥣 {ph.feedType}</span>}
              {ph.notes    && <span style={{ gridColumn: '1/-1', color: C.teal }}>💡 {ph.notes}</span>}
            </div>
          </div>
        );
      })}

      {adding && <PhaseForm onSave={addPhase} onCancel={() => { setAdding(false); resetForm(); }} />}

      {!adding && !editId && (
        <button onClick={() => { setAdding(true); setEditId(null); }} style={{
          width: '100%', padding: '12px', borderRadius: '10px', border: `2px dashed ${C.sand}`,
          backgroundColor: C.cream, color: C.soil, cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit'
        }}>
          ＋ إضافة مرحلة
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   TAB: VACCINES
══════════════════════════════════════════════ */
const VaccinesTab = ({ plan, setPlan, today }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState({ name: '', day: '', dose: '', method: '' });

  const addVaccine = () => {
    if (!form.name || form.day === '') return;
    setPlan(p => ({ ...p, vaccines: [...(p.vaccines || []), { ...form, id: uid(), day: Number(form.day), done: false, doneDate: null }] }));
    setForm({ name: '', day: '', dose: '', method: '' }); setAdding(false);
  };

  const toggleDone = (id) => {
    setPlan(p => ({ ...p, vaccines: p.vaccines.map(v =>
      v.id === id ? { ...v, done: !v.done, doneDate: !v.done ? today : null } : v
    )}));
  };

  const deleteVaccine = id => setPlan(p => ({ ...p, vaccines: p.vaccines.filter(v => v.id !== id) }));

  const vaccines = [...(plan.vaccines || [])].sort((a, b) => a.day - b.day).map(v => {
    const actualDate = plan.startDate ? addDays(plan.startDate, v.day) : null;
    const daysToVax  = actualDate ? daysDiff(today, actualDate) : null;
    let status = 'future';
    if (v.done) status = 'done';
    else if (daysToVax !== null && daysToVax < 0)  status = 'overdue';
    else if (daysToVax !== null && daysToVax <= 3)  status = 'soon';
    return { ...v, actualDate, daysToVax, status };
  });

  const statusStyle = { done: { bg: '#f0fdf4', border: C.green, text: C.green }, soon: { bg: '#fefce8', border: C.gold, text: '#92400e' }, overdue: { bg: '#fef2f2', border: C.red, text: C.red }, future: { bg: 'white', border: C.sand, text: C.soil } };
  const statusLabel = { done: '✅ تم', soon: '⚡ قريب', overdue: '⚠️ متأخر', future: '⏳ قادم' };

  return (
    <div>
      {vaccines.length === 0 && !adding && (
        <div style={{ textAlign: 'center', padding: '30px', color: C.soil, fontSize: '14px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>💉</div>
          لا توجد لقاحات — أضف لقاحاً أو اختر قالباً
        </div>
      )}

      {vaccines.map(v => {
        const s = statusStyle[v.status];
        return (
          <div key={v.id} style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input type="checkbox" checked={v.done} onChange={() => toggleDone(v.id)}
                style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer', accentColor: C.green }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: C.dark, fontSize: '14px', textDecoration: v.done ? 'line-through' : 'none' }}>{v.name}</strong>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', backgroundColor: s.border + '20', color: s.text }}>{statusLabel[v.status]}</span>
                </div>
                <div style={{ fontSize: '12px', color: C.soil, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span>📅 يوم {v.day}{v.actualDate ? ` (${v.actualDate})` : ''}</span>
                  {v.dose   && <span>💊 {v.dose}</span>}
                  {v.method && <span>🔬 {v.method}</span>}
                  {v.status === 'soon'    && v.daysToVax !== null && <span style={{ color: C.gold, fontWeight: 'bold' }}>⚡ بعد {v.daysToVax} يوم</span>}
                  {v.status === 'overdue' && v.daysToVax !== null && <span style={{ color: C.red,  fontWeight: 'bold' }}>⚠️ متأخر {Math.abs(v.daysToVax)} يوم</span>}
                  {v.done && v.doneDate  && <span style={{ color: C.green }}>✅ تم {v.doneDate}</span>}
                </div>
              </div>
              <button onClick={() => deleteVaccine(v.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px', color: '#dc2626' }}>🗑️</button>
            </div>
          </div>
        );
      })}

      {adding && (
        <div style={{ backgroundColor: C.cream, borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ fontSize: '11px', color: C.soil }}>اسم اللقاح *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: نيوكاسل"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: C.soil }}>اليوم *</label>
              <input type="text" inputMode="numeric" value={form.day} onChange={e => setForm(p => ({ ...p, day: e.target.value }))} placeholder="7"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: C.soil }}>الجرعة</label>
              <input value={form.dose} onChange={e => setForm(p => ({ ...p, dose: e.target.value }))} placeholder="1 قطرة/طير"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: C.soil }}>طريقة التطبيق</label>
              <input value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))} placeholder="قطرة عين / حقن"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addVaccine} style={{ flex: 1, padding: '9px', borderRadius: '7px', border: 'none', backgroundColor: C.sky, color: 'white', fontFamily: 'inherit', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>حفظ</button>
            <button onClick={() => setAdding(false)} style={{ flex: 1, padding: '9px', borderRadius: '7px', border: `1px solid ${C.sand}`, backgroundColor: 'white', color: C.dark, fontFamily: 'inherit', cursor: 'pointer', fontSize: '13px' }}>إلغاء</button>
          </div>
        </div>
      )}

      {!adding && (
        <button onClick={() => setAdding(true)} style={{
          width: '100%', padding: '12px', borderRadius: '10px', border: `2px dashed ${C.sand}`,
          backgroundColor: C.cream, color: C.soil, cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit'
        }}>
          ＋ إضافة لقاح
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   TAB: TREATMENTS
══════════════════════════════════════════════ */
const TreatmentsTab = ({ plan, setPlan }) => {
  const [adding, setAdding] = useState(false);
  const empty = { date: new Date().toISOString().split('T')[0], issue: '', medicine: '', affectedCount: '', cost: '', notes: '' };
  const [form, setForm] = useState(empty);

  const addTreatment = () => {
    if (!form.issue || !form.medicine) return;
    setPlan(p => ({ ...p, treatments: [...(p.treatments || []), { ...form, id: uid(), affectedCount: Number(form.affectedCount) || 0, cost: Number(form.cost) || 0 }] }));
    setForm(empty); setAdding(false);
  };

  const deleteTreatment = id => setPlan(p => ({ ...p, treatments: p.treatments.filter(t => t.id !== id) }));

  const treatments = [...(plan.treatments || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      {treatments.length === 0 && !adding && (
        <div style={{ textAlign: 'center', padding: '30px', color: C.soil, fontSize: '14px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🩺</div>
          لا توجد علاجات مسجلة
        </div>
      )}

      {treatments.map(t => (
        <div key={t.id} style={{ backgroundColor: 'white', border: `1px solid ${C.sand}`, borderRadius: '10px', padding: '12px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <strong style={{ color: C.dark }}>{t.issue}</strong>
                <span style={{ fontSize: '11px', color: C.soil, backgroundColor: C.cream, padding: '2px 8px', borderRadius: '10px' }}>{fmtDate(t.date)}</span>
              </div>
              <div style={{ fontSize: '12px', color: C.soil, display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span>💊 {t.medicine}</span>
                {t.affectedCount > 0 && <span>🔴 {t.affectedCount} حيوان متأثر</span>}
                {t.cost > 0         && <span>💰 {t.cost.toLocaleString()} دينار</span>}
                {t.notes            && <span style={{ gridColumn: '1/-1' }}>📝 {t.notes}</span>}
              </div>
            </div>
            <button onClick={() => deleteTreatment(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '2px', color: '#dc2626' }}>🗑️</button>
          </div>
        </div>
      ))}

      {adding && (
        <div style={{ backgroundColor: C.cream, borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', color: C.soil }}>تاريخ العلاج</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: C.soil }}>المشكلة / التشخيص *</label>
              <input value={form.issue} onChange={e => setForm(p => ({ ...p, issue: e.target.value }))} placeholder="مثال: إسهال، تنفسي"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: C.soil }}>الدواء / العلاج *</label>
              <input value={form.medicine} onChange={e => setForm(p => ({ ...p, medicine: e.target.value }))} placeholder="مثال: أموكسيسيلين"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: C.soil }}>عدد المتأثرين</label>
              <input type="text" inputMode="numeric" value={form.affectedCount} onChange={e => setForm(p => ({ ...p, affectedCount: e.target.value }))} placeholder="0"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '11px', color: C.soil }}>التكلفة (دينار)</label>
              <input type="text" inputMode="numeric" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} placeholder="0"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', color: C.soil }}>ملاحظات</label>
            <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="تفاصيل إضافية..."
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${C.sand}`, fontSize: '13px', fontFamily: 'inherit', boxSizing: 'border-box', marginTop: '3px' }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={addTreatment} style={{ flex: 1, padding: '9px', borderRadius: '7px', border: 'none', backgroundColor: C.orange, color: 'white', fontFamily: 'inherit', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>حفظ</button>
            <button onClick={() => setAdding(false)} style={{ flex: 1, padding: '9px', borderRadius: '7px', border: `1px solid ${C.sand}`, backgroundColor: 'white', color: C.dark, fontFamily: 'inherit', cursor: 'pointer', fontSize: '13px' }}>إلغاء</button>
          </div>
        </div>
      )}

      {!adding && (
        <button onClick={() => setAdding(true)} style={{
          width: '100%', padding: '12px', borderRadius: '10px', border: `2px dashed ${C.sand}`,
          backgroundColor: C.cream, color: C.soil, cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit'
        }}>
          ＋ تسجيل علاج
        </button>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════
   TAB: RECOMMENDATIONS
══════════════════════════════════════════════ */
const RecsTab = ({ plan, currentDay, animalType, currentPhase, nextVaccine, nextVaccineDays }) => {
  const tmpl = plan.templateKey ? BREEDING_TEMPLATES[plan.templateKey] : null;

  const currentRec = tmpl?.recommendations?.find(r => currentDay >= r.fromDay && currentDay <= r.toDay);
  const generalRecs = getGeneralRecs(animalType);

  const upcomingVaccines = (plan.vaccines || [])
    .filter(v => !v.done && plan.startDate)
    .map(v => ({ ...v, actualDate: addDays(plan.startDate, v.day), daysLeft: daysDiff(new Date().toISOString().split('T')[0], addDays(plan.startDate, v.day)) }))
    .filter(v => v.daysLeft >= 0 && v.daysLeft <= 14)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const treatmentCount = (plan.treatments || []).length;
  const totalTreatmentCost = (plan.treatments || []).reduce((s, t) => s + (t.cost || 0), 0);

  return (
    <div>
      {/* Current phase recommendation */}
      {currentRec && (
        <div style={{ backgroundColor: C.green + '15', border: `1px solid ${C.green}40`, borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <div style={{ fontWeight: 'bold', color: C.green, fontSize: '13px', marginBottom: '6px' }}>
            ✅ توصية المرحلة الحالية — {currentPhase?.name || `يوم ${currentDay}`}
          </div>
          <p style={{ color: C.dark, fontSize: '14px', margin: 0, lineHeight: 1.6 }}>{currentRec.text}</p>
        </div>
      )}

      {/* Upcoming vaccines */}
      {upcomingVaccines.length > 0 && (
        <div style={{ backgroundColor: C.gold + '15', border: `1px solid ${C.gold}40`, borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <div style={{ fontWeight: 'bold', color: '#92400e', fontSize: '13px', marginBottom: '8px' }}>
            💉 لقاحات قادمة خلال 14 يوماً
          </div>
          {upcomingVaccines.map(v => (
            <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.gold}30`, fontSize: '13px' }}>
              <span style={{ color: C.dark }}>{v.name}</span>
              <span style={{ color: v.daysLeft <= 3 ? C.red : '#92400e', fontWeight: 'bold' }}>
                {v.daysLeft === 0 ? 'اليوم!' : `بعد ${v.daysLeft} يوم`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Current phase feed */}
      {currentPhase && (
        <div style={{ backgroundColor: C.sky + '15', border: `1px solid ${C.sky}40`, borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <div style={{ fontWeight: 'bold', color: C.sky, fontSize: '13px', marginBottom: '8px' }}>🌾 خطة الإعلاف الحالية</div>
          <div style={{ fontSize: '13px', color: C.dark }}>
            <div style={{ marginBottom: '4px' }}><strong>النوع:</strong> {currentPhase.feedType || '—'}</div>
            <div style={{ marginBottom: '4px' }}><strong>الكمية:</strong> {currentPhase.feedKgPerHead || '—'} كغ / رأس / يوم</div>
            {currentPhase.notes && <div style={{ color: C.teal }}><strong>ملاحظة:</strong> {currentPhase.notes}</div>}
          </div>
        </div>
      )}

      {/* All template recommendations */}
      {tmpl && tmpl.recommendations.length > 0 && (
        <div style={{ backgroundColor: 'white', border: `1px solid ${C.sand}`, borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
          <div style={{ fontWeight: 'bold', color: C.dark, fontSize: '13px', marginBottom: '10px' }}>📋 جدول التوصيات الكامل</div>
          {tmpl.recommendations.map((r, i) => {
            const isActive = currentDay >= r.fromDay && currentDay <= r.toDay;
            const isPast   = currentDay > r.toDay;
            return (
              <div key={i} style={{ padding: '10px', marginBottom: '6px', borderRadius: '8px', backgroundColor: isActive ? C.green + '15' : isPast ? C.cream : 'white', border: `1px solid ${isActive ? C.green + '50' : C.sand}` }}>
                <div style={{ fontSize: '11px', color: isActive ? C.green : C.soil, marginBottom: '3px', fontWeight: isActive ? 'bold' : 'normal' }}>
                  {isActive && '◉ '}{isPast && '✓ '}يوم {r.fromDay}–{r.toDay}
                </div>
                <div style={{ fontSize: '13px', color: C.dark }}>{r.text}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* General recommendations */}
      <div style={{ backgroundColor: C.cream, borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
        <div style={{ fontWeight: 'bold', color: C.dark, fontSize: '13px', marginBottom: '10px' }}>💡 نصائح عامة</div>
        {generalRecs.map((r, i) => (
          <div key={i} style={{ padding: '6px 0', borderBottom: i < generalRecs.length - 1 ? `1px solid ${C.sand}` : 'none', fontSize: '13px', color: C.dark }}>
            • {r}
          </div>
        ))}
      </div>

      {/* Treatment summary */}
      {treatmentCount > 0 && (
        <div style={{ backgroundColor: C.orange + '10', border: `1px solid ${C.orange}30`, borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontWeight: 'bold', color: C.orange, fontSize: '13px', marginBottom: '6px' }}>🩺 ملخص العلاجات</div>
          <div style={{ fontSize: '13px', color: C.dark }}>
            <div>• {treatmentCount} سجل علاج خلال هذه الدورة</div>
            {totalTreatmentCost > 0 && <div>• إجمالي تكلفة العلاجات: {totalTreatmentCost.toLocaleString()} دينار</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default BreedingPlanModal;
