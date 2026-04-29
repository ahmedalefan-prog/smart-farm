import React, { useState, useMemo } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

/* ── التصنيفات ── */
const INCOME_CATS = [
  { id: 'livestock_sales', label: 'مبيعات حيوانات', icon: '🐄', color: '#f97316' },
  { id: 'crop_sales',      label: 'مبيعات محاصيل',  icon: '🌾', color: '#84cc16' },
  { id: 'milk_sales',      label: 'مبيعات حليب',    icon: '🥛', color: '#0ea5e9' },
  { id: 'egg_sales',       label: 'مبيعات بيض',     icon: '🥚', color: '#eab308' },
  { id: 'fish_sales',      label: 'مبيعات أسماك',   icon: '🐟', color: '#14b8a6' },
  { id: 'wool_sales',      label: 'مبيعات صوف',     icon: '🧶', color: '#8b5cf6' },
  { id: 'other_income',    label: 'إيرادات أخرى',   icon: '💰', color: '#6b7280' }
];

const EXPENSE_CATS = [
  { id: 'feed',            label: 'أعلاف',           icon: '🌾', color: '#84cc16' },
  { id: 'medicine',        label: 'أدوية ولقاحات',   icon: '💊', color: '#ef4444' },
  { id: 'labor',           label: 'عمالة وأجور',     icon: '👷', color: '#f97316' },
  { id: 'equipment',       label: 'معدات وصيانة',    icon: '🔧', color: '#6b7280' },
  { id: 'utilities',       label: 'مياه وكهرباء',    icon: '💧', color: '#0ea5e9' },
  { id: 'seeds',           label: 'بذور وأسمدة',     icon: '🌱', color: '#22c55e' },
  { id: 'transport',       label: 'نقل وتسويق',      icon: '🚛', color: '#8b5cf6' },
  { id: 'other_expense',   label: 'مصاريف أخرى',    icon: '💸', color: '#9ca3af' }
];

const ALL_CATS = [...INCOME_CATS, ...EXPENSE_CATS];
const getCat = (id) => ALL_CATS.find(c => c.id === id) || { label: id, icon: '💰', color: '#9ca3af' };

const fmt = (n) => n >= 1_000_000
  ? (n / 1_000_000).toFixed(1) + ' م'
  : n >= 1_000 ? (n / 1_000).toFixed(0) + ' ألف' : String(n);

const fmtFull = (n) => n.toLocaleString('ar-IQ') + ' د.ع';

const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

/* ════════════════════════════════════════════ */
const FinanceSection = () => {
  const { farmData, addTransaction, deleteTransaction, updateFinanceBudget } = useFarm();
  const transactions = farmData.finances?.transactions || [];

  const [tab,         setTab]         = useState('summary');
  const [period,      setPeriod]      = useState('month');
  const [txFilter,    setTxFilter]    = useState('all');  // all|income|expense
  const [showForm,    setShowForm]    = useState(false);
  const [pendingDel,  setPendingDel]  = useState(null);
  const [budgetDraft, setBudgetDraft] = useState(() => {
    const saved = farmData.finances?.budget || {};
    const draft = {};
    [...INCOME_CATS, ...EXPENSE_CATS].forEach(c => { draft[c.id] = saved[c.id] ? String(saved[c.id]) : ''; });
    return draft;
  });
  const [budgetSaved, setBudgetSaved] = useState(false);
  const [formData,    setFormData]    = useState({
    type: 'income', category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0], note: ''
  });

  /* ── نافذة التاريخ ── */
  const now = new Date();
  const periodStart = useMemo(() => {
    const d = new Date();
    if (period === 'month')  { d.setDate(1); d.setHours(0,0,0,0); }
    else if (period === '3m'){ d.setMonth(d.getMonth() - 2); d.setDate(1); d.setHours(0,0,0,0); }
    else if (period === 'year'){ d.setMonth(0); d.setDate(1); d.setHours(0,0,0,0); }
    else return null;
    return d;
  }, [period]);

  const filtered = useMemo(() =>
    transactions.filter(t => {
      if (periodStart && new Date(t.date) < periodStart) return false;
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions, periodStart]
  );

  const totalIncome  = filtered.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
  const netProfit    = totalIncome - totalExpense;
  const margin       = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  /* ── بيانات الرسم البياني الشهري ── */
  const monthlyChart = useMemo(() => {
    const map = {};
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      map[key] = { month: MONTHS_AR[d.getMonth()], income: 0, expense: 0 };
    }
    transactions.forEach(t => {
      const key = t.date?.slice(0, 7);
      if (map[key]) {
        if (t.type === 'income')  map[key].income  += t.amount || 0;
        if (t.type === 'expense') map[key].expense += t.amount || 0;
      }
    });
    return Object.values(map);
  }, [transactions]);

  /* ── بيانات دائرة المصاريف ── */
  const expensePie = useMemo(() => {
    const map = {};
    filtered.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + (t.amount || 0);
    });
    return Object.entries(map)
      .map(([id, value]) => ({ name: getCat(id).label, value, color: getCat(id).color }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [filtered]);

  /* ── نموذج الإضافة ── */
  const cats = formData.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount || !formData.date) return;
    addTransaction({ ...formData, amount: Number(formData.amount) });
    setFormData({ type: formData.type, category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0], note: '' });
    setShowForm(false);
    setTab('transactions');
  };

  /* ── مؤشر الربحية ── */
  const profitColor  = netProfit >= 0 ? colors.green : '#ef4444';
  const profitBg     = netProfit >= 0 ? colors.green + '15' : '#fef2f2';

  const periodBtns = [
    { id: 'month', label: 'هذا الشهر' },
    { id: '3m',    label: 'آخر 3 أشهر' },
    { id: 'year',  label: 'هذه السنة' },
    { id: 'all',   label: 'الكل' }
  ];

  /* ── actuals per category for budget comparison ── */
  const actualByCategory = useMemo(() => {
    const map = {};
    filtered.forEach(t => {
      map[t.category] = (map[t.category] || 0) + (t.amount || 0);
    });
    return map;
  }, [filtered]);

  const saveBudget = () => {
    const parsed = {};
    Object.entries(budgetDraft).forEach(([k, v]) => {
      const n = parseFloat(v);
      if (!isNaN(n) && n > 0) parsed[k] = n;
    });
    updateFinanceBudget(parsed);
    setBudgetSaved(true);
    setTimeout(() => setBudgetSaved(false), 2000);
  };

  const tabs = [
    { id: 'summary',      label: '📊 ملخص' },
    { id: 'transactions', label: '📋 الصفقات' },
    { id: 'budget',       label: '🎯 الميزانية' },
    { id: 'add',          label: '➕ إضافة' }
  ];

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '16px', fontSize: '18px' }}>💰 المالية والأرباح</h2>

      {/* ── فلتر الفترة ── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {periodBtns.map(b => (
          <button key={b.id} onClick={() => setPeriod(b.id)} style={{
            padding: '7px 14px', borderRadius: '20px', border: 'none', whiteSpace: 'nowrap',
            flexShrink: 0, cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px',
            backgroundColor: period === b.id ? colors.dark : colors.cream,
            color: period === b.id ? 'white' : colors.soil,
            fontWeight: period === b.id ? 'bold' : 'normal'
          }}>{b.label}</button>
        ))}
      </div>

      {/* ── بطاقات الملخص ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div style={{ backgroundColor: colors.green + '15', border: `1px solid ${colors.green}40`, borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '12px', color: colors.green, fontWeight: 'bold', marginBottom: '4px' }}>📈 إجمالي الإيرادات</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.green }}>{fmt(totalIncome)}</div>
          <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>د.ع</div>
        </div>
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '12px', color: '#dc2626', fontWeight: 'bold', marginBottom: '4px' }}>📉 إجمالي المصاريف</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc2626' }}>{fmt(totalExpense)}</div>
          <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>د.ع</div>
        </div>
        <div style={{ backgroundColor: profitBg, border: `1px solid ${profitColor}40`, borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '12px', color: profitColor, fontWeight: 'bold', marginBottom: '4px' }}>
            {netProfit >= 0 ? '✅ صافي الربح' : '❌ صافي الخسارة'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: profitColor }}>
            {netProfit < 0 ? '-' : ''}{fmt(Math.abs(netProfit))}
          </div>
          <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>د.ع</div>
        </div>
        <div style={{ backgroundColor: colors.sky + '15', border: `1px solid ${colors.sky}40`, borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '12px', color: colors.sky, fontWeight: 'bold', marginBottom: '4px' }}>📐 هامش الربح</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.sky }}>{margin}%</div>
          <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>
            {margin >= 30 ? 'ممتاز' : margin >= 15 ? 'جيد' : margin >= 0 ? 'منخفض' : 'خسارة'}
          </div>
        </div>
      </div>

      {/* ── التبويبات ── */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); if (t.id === 'add') setShowForm(true); }} style={{
            flex: 1, padding: '10px 6px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '12px', fontWeight: tab === t.id ? 'bold' : 'normal',
            backgroundColor: tab === t.id ? colors.dark : colors.cream,
            color: tab === t.id ? 'white' : colors.soil
          }}>{t.label}</button>
        ))}
      </div>

      {/* ════ تبويب: ملخص ════ */}
      {tab === 'summary' && (
        <div>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: colors.soil }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
              <p style={{ fontSize: '15px', marginBottom: '8px' }}>لا توجد صفقات بعد</p>
              <button onClick={() => setTab('add')} style={{
                padding: '10px 24px', backgroundColor: colors.green, color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px'
              }}>أضف أول قيد مالي</button>
            </div>
          ) : (
            <>
              {/* رسم شهري */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                <div style={{ fontWeight: 'bold', color: colors.dark, fontSize: '13px', marginBottom: '12px' }}>📊 الإيرادات والمصاريف (آخر 6 أشهر)</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={monthlyChart} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.sand} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: colors.soil }} />
                    <YAxis tick={{ fontSize: 9, fill: colors.soil }} tickFormatter={v => fmt(v)} />
                    <Tooltip formatter={(v, n) => [fmtFull(v), n === 'income' ? 'إيرادات' : 'مصاريف']} />
                    <Bar dataKey="income"  fill={colors.green}  radius={[3,3,0,0]} name="income"  />
                    <Bar dataKey="expense" fill="#f87171"       radius={[3,3,0,0]} name="expense" />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '8px', fontSize: '11px' }}>
                  <span><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: colors.green, borderRadius: '2px', marginLeft: '4px' }} />إيرادات</span>
                  <span><span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#f87171', borderRadius: '2px', marginLeft: '4px' }} />مصاريف</span>
                </div>
              </div>

              {/* دائرة المصاريف */}
              {expensePie.length > 0 && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
                  <div style={{ fontWeight: 'bold', color: colors.dark, fontSize: '13px', marginBottom: '12px' }}>🔴 توزيع المصاريف</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ResponsiveContainer width={130} height={130}>
                      <PieChart>
                        <Pie data={expensePie} dataKey="value" cx="50%" cy="50%" outerRadius={58} innerRadius={30}>
                          {expensePie.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                        <Tooltip formatter={(v) => fmtFull(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex: 1 }}>
                      {expensePie.map((e, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '12px' }}>
                          <span><span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: e.color, borderRadius: '50%', marginLeft: '5px' }} />{e.name}</span>
                          <span style={{ fontWeight: 'bold', color: colors.dark }}>{fmt(e.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* أعلى 5 صفقات */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontWeight: 'bold', color: colors.dark, fontSize: '13px', marginBottom: '10px' }}>🕐 آخر الصفقات</div>
                {filtered.slice(0, 5).map(t => {
                  const cat = getCat(t.category);
                  return (
                    <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: `1px solid ${colors.sand}` }}>
                      <span style={{ fontSize: '20px' }}>{cat.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: colors.dark }}>{t.description || cat.label}</div>
                        <div style={{ fontSize: '11px', color: colors.soil }}>{t.date}</div>
                      </div>
                      <div style={{ fontWeight: 'bold', color: t.type === 'income' ? colors.green : '#dc2626', fontSize: '14px' }}>
                        {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                      </div>
                    </div>
                  );
                })}
                {filtered.length > 5 && (
                  <button onClick={() => setTab('transactions')} style={{ width: '100%', marginTop: '10px', padding: '8px', backgroundColor: colors.cream, border: 'none', borderRadius: '8px', color: colors.soil, cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>
                    عرض كل الصفقات ({filtered.length})
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ════ تبويب: الصفقات ════ */}
      {tab === 'transactions' && (
        <div>
          {/* فلتر نوع الصفقة */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
            {[['all','الكل'],['income','إيرادات'],['expense','مصاريف']].map(([v, l]) => (
              <button key={v} onClick={() => setTxFilter(v)} style={{
                flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px',
                backgroundColor: txFilter === v ? colors.dark : colors.cream,
                color: txFilter === v ? 'white' : colors.soil, fontWeight: txFilter === v ? 'bold' : 'normal'
              }}>{l}</button>
            ))}
          </div>

          {filtered.filter(t => txFilter === 'all' || t.type === txFilter).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: colors.soil }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>📋</div>
              <p>لا توجد صفقات في هذه الفترة</p>
            </div>
          ) : (
            filtered.filter(t => txFilter === 'all' || t.type === txFilter).map(t => {
              const cat = getCat(t.category);
              return (
                <div key={t.id} style={{
                  backgroundColor: 'white', borderRadius: '12px', padding: '14px', marginBottom: '10px',
                  border: `1px solid ${colors.sand}`,
                  borderRight: `4px solid ${t.type === 'income' ? colors.green : '#ef4444'}`
                }}>
                  {pendingDel === t.id ? (
                    <div>
                      <p style={{ fontSize: '14px', color: colors.dark, marginBottom: '10px' }}>تأكيد حذف هذا القيد؟</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { deleteTransaction(t.id); setPendingDel(null); }} style={{ flex: 1, padding: '8px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }}>تأكيد الحذف</button>
                        <button onClick={() => setPendingDel(null)} style={{ flex: 1, padding: '8px', backgroundColor: colors.cream, border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit', color: colors.dark }}>إلغاء</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: cat.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{cat.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div style={{ fontWeight: 'bold', color: colors.dark, fontSize: '14px' }}>{t.description || cat.label}</div>
                          <div style={{ fontWeight: 'bold', color: t.type === 'income' ? colors.green : '#dc2626', fontSize: '15px', flexShrink: 0, marginRight: '8px' }}>
                            {t.type === 'income' ? '+' : '-'}{fmtFull(t.amount)}
                          </div>
                        </div>
                        <div style={{ fontSize: '12px', color: colors.soil, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <span>📅 {t.date}</span>
                          <span style={{ backgroundColor: cat.color + '20', color: cat.color, padding: '1px 7px', borderRadius: '10px', fontWeight: 'bold' }}>{cat.label}</span>
                          {t.note && <span>📝 {t.note}</span>}
                        </div>
                      </div>
                      <button onClick={() => setPendingDel(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#dc2626', padding: '2px', flexShrink: 0 }}>🗑️</button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ════ تبويب: إضافة قيد ════ */}
      {tab === 'add' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px' }}>
          <h3 style={{ color: colors.dark, marginBottom: '16px', fontSize: '15px' }}>➕ قيد مالي جديد</h3>

          {/* نوع القيد */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[['income','📈 إيراد'],['expense','📉 مصروف']].map(([v, l]) => (
              <button key={v} onClick={() => setFormData(p => ({ ...p, type: v, category: '' }))} style={{
                flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${formData.type === v ? (v === 'income' ? colors.green : '#ef4444') : colors.sand}`,
                backgroundColor: formData.type === v ? (v === 'income' ? colors.green + '15' : '#fef2f2') : 'white',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold',
                color: formData.type === v ? (v === 'income' ? colors.green : '#dc2626') : colors.soil
              }}>{l}</button>
            ))}
          </div>

          {/* التصنيف */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: colors.soil, display: 'block', marginBottom: '6px' }}>التصنيف *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {cats.map(c => (
                <button key={c.id} onClick={() => setFormData(p => ({ ...p, category: c.id }))} style={{
                  padding: '10px 8px', borderRadius: '10px', border: `2px solid ${formData.category === c.id ? c.color : colors.sand}`,
                  backgroundColor: formData.category === c.id ? c.color + '15' : 'white',
                  cursor: 'pointer', fontFamily: 'inherit', fontSize: '12px', textAlign: 'center',
                  color: formData.category === c.id ? c.color : colors.dark, fontWeight: formData.category === c.id ? 'bold' : 'normal'
                }}>
                  <span style={{ display: 'block', fontSize: '18px', marginBottom: '3px' }}>{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* المبلغ */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: colors.soil, display: 'block', marginBottom: '4px' }}>المبلغ (دينار عراقي) *</label>
            <input type="text" inputMode="numeric" value={formData.amount}
              onChange={e => setFormData(p => ({ ...p, amount: e.target.value }))}
              placeholder="مثال: 500000"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${colors.sand}`, fontSize: '16px', fontFamily: 'inherit', boxSizing: 'border-box', fontWeight: 'bold' }} />
            {formData.amount && !isNaN(formData.amount) && (
              <div style={{ fontSize: '12px', color: colors.soil, marginTop: '4px' }}>
                = {fmtFull(Number(formData.amount))}
              </div>
            )}
          </div>

          {/* الوصف */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: colors.soil, display: 'block', marginBottom: '4px' }}>الوصف *</label>
            <input type="text" value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="مثال: بيع 5 رؤوس أغنام عواسي"
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: `1px solid ${colors.sand}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          {/* التاريخ */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', color: colors.soil, display: 'block', marginBottom: '4px' }}>التاريخ *</label>
            <input type="date" value={formData.date}
              onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: `1px solid ${colors.sand}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          {/* ملاحظة */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', color: colors.soil, display: 'block', marginBottom: '4px' }}>ملاحظة (اختياري)</label>
            <input type="text" value={formData.note}
              onChange={e => setFormData(p => ({ ...p, note: e.target.value }))}
              placeholder="أي تفاصيل إضافية..."
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: `1px solid ${colors.sand}`, fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box' }} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!formData.category || !formData.amount || !formData.description || !formData.date}
            style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '15px', fontWeight: 'bold',
              backgroundColor: formData.category && formData.amount && formData.description
                ? (formData.type === 'income' ? colors.green : '#ef4444') : colors.sand,
              color: 'white'
            }}
          >
            {formData.type === 'income' ? '📈 حفظ الإيراد' : '📉 حفظ المصروف'}
          </button>
        </div>
      )}

      {/* ════ تبويب: الميزانية ════ */}
      {tab === 'budget' && (
        <div>
          {budgetSaved && (
            <div style={{ padding: '10px', backgroundColor: colors.green + '20', color: colors.green, borderRadius: '10px', textAlign: 'center', fontWeight: 'bold', marginBottom: '14px', fontSize: '14px' }}>
              ✅ تم حفظ الميزانية
            </div>
          )}

          <div style={{ backgroundColor: colors.sky + '10', border: `1px solid ${colors.sky}40`, borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: colors.dark }}>
            💡 أدخل المبالغ المخططة لكل تصنيف، ثم قارنها بالفعلي للفترة المختارة أعلاه.
          </div>

          {/* الإيرادات */}
          <h4 style={{ color: colors.green, marginBottom: '10px', fontSize: '14px' }}>📈 الإيرادات المخططة</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {INCOME_CATS.map(cat => {
              const planned = parseFloat(budgetDraft[cat.id]) || 0;
              const actual  = actualByCategory[cat.id] || 0;
              const ratio   = planned > 0 ? Math.min(1, actual / planned) : actual > 0 ? 1 : 0;
              const barColor = actual >= planned && planned > 0 ? colors.green : actual > 0 ? colors.gold : colors.sand;
              return (
                <div key={cat.id} style={{ backgroundColor: 'white', borderRadius: '10px', border: `1px solid ${colors.sand}`, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: 'bold', color: colors.dark }}>{cat.label}</span>
                    <input
                      type="text" inputMode="numeric"
                      value={budgetDraft[cat.id]}
                      onChange={e => setBudgetDraft(d => ({ ...d, [cat.id]: e.target.value }))}
                      placeholder="مخطط"
                      style={{ width: '110px', padding: '6px 8px', borderRadius: '6px', border: `1px solid ${colors.sand}`, fontSize: '13px', fontFamily: 'inherit', textAlign: 'center' }}
                    />
                  </div>
                  {(planned > 0 || actual > 0) && (
                    <>
                      <div style={{ height: '6px', backgroundColor: colors.cream, borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ width: `${ratio * 100}%`, height: '100%', backgroundColor: barColor, borderRadius: '3px', transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.soil }}>
                        <span>الفعلي: <strong style={{ color: colors.green }}>{fmt(actual)}</strong></span>
                        {planned > 0 && <span>المخطط: <strong>{fmt(planned)}</strong></span>}
                        {planned > 0 && <span style={{ color: actual >= planned ? colors.green : colors.gold }}>{Math.round(ratio * 100)}%</span>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* المصاريف */}
          <h4 style={{ color: '#dc2626', marginBottom: '10px', fontSize: '14px' }}>📉 المصاريف المخططة</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {EXPENSE_CATS.map(cat => {
              const planned = parseFloat(budgetDraft[cat.id]) || 0;
              const actual  = actualByCategory[cat.id] || 0;
              const ratio   = planned > 0 ? Math.min(1, actual / planned) : actual > 0 ? 1 : 0;
              const overBudget = planned > 0 && actual > planned;
              const barColor = overBudget ? '#ef4444' : actual > 0 ? colors.gold : colors.sand;
              return (
                <div key={cat.id} style={{ backgroundColor: 'white', borderRadius: '10px', border: `1px solid ${overBudget ? '#fecaca' : colors.sand}`, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                    <span style={{ flex: 1, fontSize: '13px', fontWeight: 'bold', color: colors.dark }}>{cat.label}</span>
                    {overBudget && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>⚠️ تجاوز</span>}
                    <input
                      type="text" inputMode="numeric"
                      value={budgetDraft[cat.id]}
                      onChange={e => setBudgetDraft(d => ({ ...d, [cat.id]: e.target.value }))}
                      placeholder="مخطط"
                      style={{ width: '110px', padding: '6px 8px', borderRadius: '6px', border: `1px solid ${overBudget ? '#fca5a5' : colors.sand}`, fontSize: '13px', fontFamily: 'inherit', textAlign: 'center' }}
                    />
                  </div>
                  {(planned > 0 || actual > 0) && (
                    <>
                      <div style={{ height: '6px', backgroundColor: colors.cream, borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ width: `${Math.min(ratio, 1) * 100}%`, height: '100%', backgroundColor: barColor, borderRadius: '3px', transition: 'width 0.3s' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.soil }}>
                        <span>الفعلي: <strong style={{ color: overBudget ? '#dc2626' : colors.soil }}>{fmt(actual)}</strong></span>
                        {planned > 0 && <span>المخطط: <strong>{fmt(planned)}</strong></span>}
                        {planned > 0 && <span style={{ color: overBudget ? '#ef4444' : colors.green }}>{Math.round(ratio * 100)}%</span>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={saveBudget} style={{
            width: '100%', padding: '14px', backgroundColor: colors.dark, color: 'white',
            border: 'none', borderRadius: '10px', cursor: 'pointer',
            fontFamily: 'inherit', fontSize: '15px', fontWeight: 'bold'
          }}>💾 حفظ الميزانية</button>
        </div>
      )}
    </div>
  );
};

export default FinanceSection;
