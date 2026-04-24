import React, { useState, useMemo } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart
} from 'recharts';

const trendBadge = (current, prev) => {
  if (!prev || prev === 0) return null;
  const pct = (current - prev) / prev * 100;
  if (Math.abs(pct) < 3) return <span style={{ fontSize: '11px', color: colors.soil }}>≈ مستقر</span>;
  return (
    <span style={{ fontSize: '11px', fontWeight: 'bold', color: pct > 0 ? colors.green : '#ef4444' }}>
      {pct > 0 ? '↑' : '↓'} {Math.abs(pct).toFixed(0)}%
    </span>
  );
};

const ReportsSection = () => {
  const { farmData } = useFarm();
  const [reportType, setReportType] = useState('alerts');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const years = [2024, 2025, 2026];

  // ─── معالجة السجلات ──────────────────────────────────────────────────────
  const dailyLogsData = useMemo(() =>
    [...farmData.dailyLogs]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(log => ({
        ...log,
        day: new Date(log.date).getDate(),
        month: new Date(log.date).getMonth(),
        year: new Date(log.date).getFullYear(),
        avgTemp: ((log.maxTemp || 0) + (log.minTemp || 0)) / 2
      }))
  , [farmData.dailyLogs]);

  const filteredLogs = useMemo(() =>
    dailyLogsData.filter(l => l.month === selectedMonth && l.year === selectedYear)
  , [dailyLogsData, selectedMonth, selectedYear]);

  const last7  = useMemo(() => dailyLogsData.slice(-7),      [dailyLogsData]);
  const prev7  = useMemo(() => dailyLogsData.slice(-14, -7), [dailyLogsData]);
  const last14 = useMemo(() => dailyLogsData.slice(-14),     [dailyLogsData]);

  // ─── إحصاءات أسبوعية ────────────────────────────────────────────────────
  const weeklyStats = useMemo(() => {
    if (!last7.length) return null;
    const s  = (arr, k) => arr.reduce((t, l) => t + (l[k] || 0), 0);
    const av = (arr, k) => arr.length ? s(arr, k) / arr.length : 0;
    return {
      avgMilk:        av(last7,  'milkProduction'), prevAvgMilk: av(prev7, 'milkProduction'),
      avgFeed:        av(last7,  'feedConsumed'),   prevAvgFeed: av(prev7, 'feedConsumed'),
      avgTemp:        av(last7,  'avgTemp'),         prevAvgTemp: av(prev7, 'avgTemp'),
      totalEggs:      s(last7,   'eggsCollected'),  prevEggs:    s(prev7,  'eggsCollected'),
      totalMortality: s(last7,   'mortality'),      prevMortality: s(prev7, 'mortality'),
      irrigationDays: last7.filter(l => l.irrigationDone).length,
      daysCount:      last7.length
    };
  }, [last7, prev7]);

  // ─── إحصاءات شهرية ──────────────────────────────────────────────────────
  const monthlyStats = useMemo(() => {
    if (!filteredLogs.length) return null;
    const s  = k => filteredLogs.reduce((t, l) => t + (l[k] || 0), 0);
    const av = k => s(k) / filteredLogs.length;
    const temps = filteredLogs.filter(l => l.minTemp > 0).map(l => l.minTemp);
    return {
      totalMilk:      s('milkProduction'),
      totalFeed:      s('feedConsumed'),
      totalEggs:      s('eggsCollected'),
      totalMortality: s('mortality'),
      avgTemp:        av('avgTemp'),
      irrigationDays: filteredLogs.filter(l => l.irrigationDone).length,
      daysCount:      filteredLogs.length,
      maxTemp:        Math.max(...filteredLogs.map(l => l.maxTemp || 0)),
      minTemp:        temps.length ? Math.min(...temps) : 0
    };
  }, [filteredLogs]);

  // ─── الحيوانات والأراضي ─────────────────────────────────────────────────
  const livestockStats = useMemo(() => {
    const c  = farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0);
    const sh = farmData.livestock.sheep.herds.reduce((s, h) => s + (h.count || 0), 0);
    const p  = farmData.livestock.poultry.flocks.reduce((s, f) => s + (f.count || 0), 0);
    const f  = farmData.livestock.fish.ponds.reduce((s, pond) => s + (pond.fishCount || 0), 0);
    return { totalCattle: c, totalSheep: sh, totalPoultry: p, totalFish: f, totalAnimals: c + sh + p };
  }, [farmData]);

  const cropsStats = useMemo(() => {
    const totalArea   = farmData.lands.reduce((s, l) => s + (l.area || 0), 0);
    const plantedArea = farmData.lands.filter(l => l.currentCrop).reduce((s, l) => s + (l.area || 0), 0);
    const cropsCount  = {};
    farmData.lands.forEach(l => { if (l.currentCrop) cropsCount[l.currentCrop] = (cropsCount[l.currentCrop] || 0) + (l.area || 0); });
    return { totalArea, plantedArea, cropsCount };
  }, [farmData]);

  const selfSufficiencyStats = useMemo(() => {
    const stock    = farmData.feedInventory.ingredients.reduce((s, i) => s + (i.unit === 'طن' ? i.quantity * 1000 : i.quantity), 0);
    const slice30  = dailyLogsData.slice(-30);
    const avgFeed  = slice30.length ? slice30.reduce((s, l) => s + (l.feedConsumed || 0), 0) / slice30.length : 0;
    const manure   = (livestockStats.totalCattle * 3.5) + (livestockStats.totalSheep * 0.8) + (livestockStats.totalPoultry * 0.05);
    const needed   = cropsStats.plantedArea * 5.5;
    return {
      feedDaysLeft:           avgFeed > 0 ? Math.floor(stock / avgFeed) : (stock > 0 ? 999 : 0),
      manureSelfSufficiency:  needed > 0 ? Math.min(100, manure / needed * 100) : 0,
      landUtilization:        cropsStats.totalArea > 0 ? cropsStats.plantedArea / cropsStats.totalArea * 100 : 0,
      totalFeedStock:         stock
    };
  }, [farmData, dailyLogsData, livestockStats, cropsStats]);

  // ─── بيانات أداء الدورات ─────────────────────────────────────────────────
  const cyclesData = useMemo(() => {
    const today = new Date();
    const allHerds = [
      ...farmData.livestock.cattle.herds.map(h  => ({ ...h, kind: 'cattle',  icon: '🐄', label: 'أبقار',  color: colors.soil   })),
      ...farmData.livestock.sheep.herds.map(h   => ({ ...h, kind: 'sheep',   icon: '🐑', label: 'أغنام',  color: colors.green  })),
      ...farmData.livestock.poultry.flocks.map(f => ({ ...f, kind: 'poultry', icon: '🐔', label: 'دواجن', color: colors.orange })),
      ...farmData.livestock.fish.ponds.map(p    => ({ ...p, kind: 'fish',    icon: '🐟', label: 'أسماك', color: colors.sky    }))
    ].filter(h => h.plan?.startDate && h.plan?.totalDays);

    return allHerds.map(h => {
      const start = new Date(h.plan.startDate);
      const elapsed = Math.max(0, Math.floor((today - start) / (1000 * 60 * 60 * 24)));
      const progress = Math.min(100, Math.round((elapsed / h.plan.totalDays) * 100));
      const remaining = Math.max(0, h.plan.totalDays - elapsed);
      const endDate = new Date(start);
      endDate.setDate(endDate.getDate() + h.plan.totalDays);

      // سجلات في فترة الدورة
      const cycleLogs = dailyLogsData.filter(l => {
        const d = new Date(l.date);
        return d >= start && d <= today;
      });
      const totalFeed     = cycleLogs.reduce((s, l) => s + (l.feedConsumed    || 0), 0);
      const totalMilk     = cycleLogs.reduce((s, l) => s + (l.milkProduction  || 0), 0);
      const totalEggs     = cycleLogs.reduce((s, l) => s + (l.eggsCollected   || 0), 0);
      const totalMortality = cycleLogs.reduce((s, l) => s + (l.mortality      || 0), 0);
      const mortalityRate = h.count > 0 ? ((totalMortality / h.count) * 100).toFixed(1) : 0;

      // FCR تقديري: علف كلي / (عدد × وزن حالي)
      const currentWeight = parseFloat(h.avgWeight || h.plan?.phases?.[0]?.targetWeight || 0);
      const totalWeightGained = h.count * currentWeight * (progress / 100);
      const fcr = totalWeightGained > 0 ? (totalFeed / totalWeightGained).toFixed(2) : null;

      // مقارنة مع الهدف
      const targetMain = h.plan?.targets?.main || '';
      const targetFCR  = parseFloat(h.plan?.targets?.fcr) || null;

      return {
        ...h, elapsed, progress, remaining, endDate,
        totalFeed, totalMilk, totalEggs, totalMortality, mortalityRate, fcr,
        targetMain, targetFCR, cycleLogs: cycleLogs.length
      };
    });
  }, [farmData, dailyLogsData]);

  // ─── بيانات الرسوم ───────────────────────────────────────────────────────
  const weeklyChartData = useMemo(() =>
    last14.map(log => ({
      date:   new Date(log.date).toLocaleDateString('ar-IQ', { day: 'numeric', month: 'numeric' }),
      حليب:   log.milkProduction || 0,
      بيض:    log.eggsCollected  || 0,
      حرارة:  log.avgTemp        || 0
    }))
  , [last14]);

  const monthlyChartData = useMemo(() =>
    filteredLogs.map(log => ({
      يوم:   log.day,
      حليب:  log.milkProduction || 0,
      بيض:   log.eggsCollected  || 0,
      حرارة: log.avgTemp        || 0
    }))
  , [filteredLogs]);

  const cropsChartData = useMemo(() =>
    Object.entries(cropsStats.cropsCount).map(([name, area]) => ({
      name, value: area,
      color: name.includes('قمح') ? colors.wheat
           : name.includes('برسيم') ? colors.lime
           : name.includes('ذرة')   ? colors.orange
           : name.includes('طماطم') ? '#ef4444'
           : colors.teal
    }))
  , [cropsStats]);

  const livestockChartData = useMemo(() =>
    [
      { name: 'أبقار', value: livestockStats.totalCattle,  color: colors.soil },
      { name: 'أغنام', value: livestockStats.totalSheep,   color: colors.green },
      { name: 'دواجن', value: livestockStats.totalPoultry, color: colors.orange },
      { name: 'أسماك', value: livestockStats.totalFish,    color: colors.sky }
    ].filter(d => d.value > 0)
  , [livestockStats]);

  // ─── التنبيهات الذكية ────────────────────────────────────────────────────
  const smartAlerts = useMemo(() => {
    const list     = [];
    const today    = new Date().toISOString().split('T')[0];
    const hasToday = dailyLogsData.some(l => l.date?.startsWith(today));
    const lastLog  = dailyLogsData[dailyLogsData.length - 1];
    const mort7    = last7.reduce((s, l) => s + (l.mortality || 0), 0);

    // حرج ───────────────────────────────────────────────────────────────────
    if (selfSufficiencyStats.feedDaysLeft > 0 && selfSufficiencyStats.feedDaysLeft <= 7)
      list.push({ level: 'critical', title: 'مخزون الأعلاف حرج جداً', body: `يكفي ${selfSufficiencyStats.feedDaysLeft} أيام فقط — اطلب علفاً فوراً` });

    if (mort7 >= 3)
      list.push({ level: 'critical', title: `نفوق مرتفع — ${mort7} حالات هذا الأسبوع`, body: 'تواصل مع الطبيب البيطري وعزل الحيوانات المريضة فوراً' });

    if (lastLog?.maxTemp >= 45)
      list.push({ level: 'critical', title: `موجة حر شديدة — ${lastLog.maxTemp}°م`, body: 'وفّر الظل والمياه الباردة للحيوانات — خطر الإجهاد الحراري' });

    // تحذير ─────────────────────────────────────────────────────────────────
    if (selfSufficiencyStats.feedDaysLeft > 7 && selfSufficiencyStats.feedDaysLeft <= 14)
      list.push({ level: 'warning', title: `مخزون الأعلاف منخفض — ${selfSufficiencyStats.feedDaysLeft} يوم`, body: 'خطط لطلبية جديدة خلال هذا الأسبوع' });

    if (!hasToday)
      list.push({ level: 'warning', title: 'لم تسجّل سجل اليوم بعد', body: 'سجّل العمليات اليومية للحصول على تحليلات دقيقة' });

    if (prev7.length >= 3 && livestockStats.totalCattle > 0) {
      const thisM = last7.filter(l => l.milkProduction > 0);
      const prevM = prev7.filter(l => l.milkProduction > 0);
      if (thisM.length >= 2 && prevM.length >= 2) {
        const avg = arr => arr.reduce((s, l) => s + l.milkProduction, 0) / arr.length;
        const drop = 1 - avg(thisM) / avg(prevM);
        if (drop > 0.2)
          list.push({ level: 'warning', title: `إنتاج الحليب انخفض ${(drop * 100).toFixed(0)}%`, body: 'تحقق من التغذية والصحة والإجهاد الحراري للأبقار' });
      }
    }

    if (cropsStats.plantedArea > 0 && last7.length >= 5 && last7.slice(-5).every(l => !l.irrigationDone))
      list.push({ level: 'warning', title: 'لا يوجد ري منذ 5 أيام', body: `لديك ${cropsStats.plantedArea} دونم مزروعة — تأكد من حالة المحاصيل` });

    // معلومات ───────────────────────────────────────────────────────────────
    if (cropsStats.totalArea > 0 && selfSufficiencyStats.landUtilization < 50)
      list.push({ level: 'info', title: `${(cropsStats.totalArea - cropsStats.plantedArea).toFixed(0)} دونم غير مزروعة`, body: `استغلال ${selfSufficiencyStats.landUtilization.toFixed(0)}% فقط — فرصة لتوسيع الإنتاج` });

    if (selfSufficiencyStats.manureSelfSufficiency < 50 && cropsStats.plantedArea > 0)
      list.push({ level: 'info', title: `اكتفاء السماد ${selfSufficiencyStats.manureSelfSufficiency.toFixed(0)}%`, body: 'زيادة أعداد الحيوانات أو شراء سماد يُحسّن خصوبة التربة' });

    if (livestockStats.totalFish > 0 && cropsStats.plantedArea > 0)
      list.push({ level: 'info', title: 'فرصة: ري بمياه الأسماك', body: 'مياه الأحواض غنية بالمغذيات — استخدمها لري المحاصيل' });

    // إيجابية ───────────────────────────────────────────────────────────────
    if (selfSufficiencyStats.feedDaysLeft > 60)
      list.push({ level: 'success', title: `مخزون الأعلاف ممتاز — ${selfSufficiencyStats.feedDaysLeft} يوم`, body: 'تخطيط جيد! استمر في هذا المستوى' });

    if (selfSufficiencyStats.landUtilization >= 80)
      list.push({ level: 'success', title: `استغلال الأراضي ${selfSufficiencyStats.landUtilization.toFixed(0)}%`, body: 'ممتاز! تستخدم معظم مساحتك الزراعية بكفاءة' });

    if (mort7 === 0 && last7.length >= 5 && livestockStats.totalAnimals > 0)
      list.push({ level: 'success', title: 'لا نفوق هذا الأسبوع', body: 'صحة الثروة الحيوانية ممتازة — استمر في الرعاية الجيدة' });

    const order = { critical: 0, warning: 1, info: 2, success: 3 };
    return list.sort((a, b) => order[a.level] - order[b.level]);
  }, [selfSufficiencyStats, cropsStats, livestockStats, dailyLogsData, last7, prev7]);

  // ─── متغيرات المزرعة ─────────────────────────────────────────────────────
  const farmVariables = useMemo(() => {
    const last30   = dailyLogsData.slice(-30);
    const avgMilk30 = last30.length ? last30.reduce((s, l) => s + (l.milkProduction || 0), 0) / last30.length : 0;
    const avgFeed30 = last30.length ? last30.reduce((s, l) => s + (l.feedConsumed  || 0), 0) / last30.length : 0;
    const mort30    = last30.reduce((s, l) => s + (l.mortality || 0), 0);
    const avgTemp7  = last7.length  ? last7.reduce((s, l) => s + (l.avgTemp || 0), 0) / last7.length : 0;
    const irrigRate = last7.length  ? last7.filter(l => l.irrigationDone).length / last7.length * 100 : 0;

    let daysSinceTreatment = null;
    for (let i = dailyLogsData.length - 1; i >= 0; i--) {
      if (dailyLogsData[i].treatments) {
        daysSinceTreatment = Math.floor((new Date() - new Date(dailyLogsData[i].date)) / 86400000);
        break;
      }
    }

    const milkTrend = weeklyStats?.prevAvgMilk > 0
      ? (weeklyStats.avgMilk - weeklyStats.prevAvgMilk) / weeklyStats.prevAvgMilk * 100
      : null;

    return {
      avgMilk30, avgFeed30,
      fcr:           avgMilk30 > 0 ? avgFeed30 / avgMilk30 : 0,
      mortalityRate: livestockStats.totalAnimals > 0 ? mort30 / livestockStats.totalAnimals * 100 : 0,
      avgTemp7, irrigRate, daysSinceTreatment, milkTrend,
      logsCount: dailyLogsData.length
    };
  }, [dailyLogsData, last7, weeklyStats, livestockStats]);

  const hasData = dailyLogsData.length > 0 || cropsStats.totalArea > 0 || livestockStats.totalCattle > 0;

  if (!hasData) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '48px', marginBottom: '20px' }}>📊</p>
        <h3 style={{ color: colors.dark, marginBottom: '10px' }}>لا توجد بيانات كافية</h3>
        <p style={{ color: colors.soil }}>قم بإدخال بيانات المزرعة وسجل العمليات اليومية لبدء التحليل</p>
      </div>
    );
  }

  const alertConfig = {
    critical: { bg: '#fee2e2', border: '#ef4444', icon: '🔴', label: 'حرج' },
    warning:  { bg: colors.orange + '20', border: colors.orange, icon: '🟡', label: 'تحذير' },
    info:     { bg: colors.sky + '15',    border: colors.sky,    icon: '🔵', label: 'معلومة' },
    success:  { bg: colors.green + '15',  border: colors.green,  icon: '🟢', label: 'جيد' }
  };

  const criticalCount = smartAlerts.filter(a => a.level === 'critical').length;

  return (
    <div style={{ padding: '20px' }}>

      {/* الرأس */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: colors.dark }}>📊 التقارير والتحليلات</h2>
        <button
          onClick={() => window.print()}
          style={{ padding: '10px 16px', backgroundColor: colors.purple, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          🖨️ طباعة
        </button>
      </div>

      {/* التبويبات */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'alerts',   name: criticalCount ? `⚠️ التنبيهات (${criticalCount})` : '⚠️ التنبيهات' },
          { id: 'weekly',   name: 'أسبوعي' },
          { id: 'monthly',  name: 'شهري' },
          { id: 'cycles',   name: '🔄 الدورات' },
          { id: 'overview', name: 'نظرة عامة' },
          { id: 'logs',     name: '📋 السجل' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setReportType(tab.id)} style={{
            padding: '10px 18px', borderRadius: '20px', border: 'none', whiteSpace: 'nowrap', flexShrink: 0,
            backgroundColor: reportType === tab.id ? colors.green : colors.cream,
            color:           reportType === tab.id ? 'white' : colors.dark,
            cursor: 'pointer', fontFamily: 'inherit',
            fontWeight: reportType === tab.id ? 'bold' : 'normal'
          }}>
            {tab.name}
          </button>
        ))}
      </div>

      {/* ══════════════════════ تبويب التنبيهات ══════════════════════ */}
      {reportType === 'alerts' && (
        <div>
          {/* ملخص الأعداد */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {[
              { level: 'critical', label: 'حرج',    color: '#ef4444' },
              { level: 'warning',  label: 'تحذير',  color: colors.orange },
              { level: 'info',     label: 'معلومة', color: colors.sky },
              { level: 'success',  label: 'جيد',    color: colors.green }
            ].map(({ level, label, color }) => (
              <div key={level} style={{ backgroundColor: color + '20', padding: '12px', borderRadius: '10px', textAlign: 'center', border: `2px solid ${color}30` }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color }}>
                  {smartAlerts.filter(a => a.level === level).length}
                </div>
                <div style={{ fontSize: '11px', color: colors.soil }}>{label}</div>
              </div>
            ))}
          </div>

          {/* قائمة التنبيهات */}
          {smartAlerts.length === 0 && (
            <div style={{ backgroundColor: colors.green + '15', padding: '24px', borderRadius: '12px', textAlign: 'center', color: colors.dark, border: `2px solid ${colors.green}30`, marginBottom: '20px' }}>
              🌟 لا توجد تنبيهات — مزرعتك في حالة ممتازة!
            </div>
          )}
          {smartAlerts.map((alert, i) => {
            const cfg = alertConfig[alert.level];
            return (
              <div key={i} style={{ backgroundColor: cfg.bg, borderRadius: '10px', padding: '14px 16px', marginBottom: '10px', borderRight: `4px solid ${cfg.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span>{cfg.icon}</span>
                  <strong style={{ color: colors.dark, fontSize: '14px' }}>{alert.title}</strong>
                </div>
                <div style={{ fontSize: '13px', color: colors.soil, paddingRight: '24px' }}>{alert.body}</div>
              </div>
            );
          })}

          {/* متغيرات المزرعة */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginTop: '8px' }}>
            <h4 style={{ color: colors.dark, marginBottom: '14px' }}>📐 متغيرات المزرعة</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'متوسط الحليب (30 يوم)', value: livestockStats.totalCattle > 0 ? `${farmVariables.avgMilk30.toFixed(1)} لتر/يوم` : '—', icon: '🥛', color: colors.sky },
                { label: 'استهلاك العلف (30 يوم)', value: `${farmVariables.avgFeed30.toFixed(0)} كغ/يوم`, icon: '📦', color: colors.lime },
                { label: 'كفاءة التحول (علف÷حليب)', value: farmVariables.fcr > 0 ? `${farmVariables.fcr.toFixed(2)} كغ/لتر` : '—', icon: '⚖️', color: colors.green },
                { label: 'معدل النفوق (30 يوم)', value: livestockStats.totalAnimals > 0 ? `${farmVariables.mortalityRate.toFixed(2)}%` : '—', icon: '📉', color: farmVariables.mortalityRate > 2 ? '#ef4444' : colors.soil },
                { label: 'متوسط الحرارة (7 أيام)', value: last7.length > 0 ? `${farmVariables.avgTemp7.toFixed(1)}°م` : '—', icon: '🌡️', color: colors.orange },
                { label: 'نسبة الري (7 أيام)', value: cropsStats.plantedArea > 0 ? `${farmVariables.irrigRate.toFixed(0)}%` : '—', icon: '💧', color: colors.teal },
                { label: 'آخر علاج منذ', value: farmVariables.daysSinceTreatment !== null ? `${farmVariables.daysSinceTreatment} يوم` : 'لا يوجد', icon: '💊', color: colors.purple },
                { label: 'عدد السجلات المسجلة', value: `${farmVariables.logsCount} سجل`, icon: '📝', color: colors.dark }
              ].map((v, idx) => (
                <div key={idx} style={{ backgroundColor: v.color + '15', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '11px', color: colors.soil, marginBottom: '4px' }}>{v.icon} {v.label}</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: v.color }}>{v.value}</div>
                </div>
              ))}
            </div>
            {farmVariables.milkTrend !== null && (
              <div style={{
                marginTop: '12px', padding: '10px', borderRadius: '8px', fontSize: '13px', textAlign: 'center',
                backgroundColor: (farmVariables.milkTrend > 0 ? colors.green : '#ef4444') + '15'
              }}>
                اتجاه الحليب هذا الأسبوع: {farmVariables.milkTrend > 0 ? '↑' : '↓'} {Math.abs(farmVariables.milkTrend).toFixed(1)}% مقارنة بالأسبوع الماضي
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════ التقرير الأسبوعي ══════════════════════ */}
      {reportType === 'weekly' && (
        <div>
          {!weeklyStats ? (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
              لا توجد سجلات يومية بعد — سجّل العمليات اليومية لعرض التحليل الأسبوعي
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: colors.sky + '30', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: colors.soil }}>🥛 متوسط الحليب</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.sky }}>{weeklyStats.avgMilk.toFixed(1)} ل/يوم</div>
                  {trendBadge(weeklyStats.avgMilk, weeklyStats.prevAvgMilk)}
                </div>
                <div style={{ backgroundColor: colors.lime + '30', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: colors.soil }}>📦 متوسط العلف</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.lime }}>{weeklyStats.avgFeed.toFixed(0)} كغ/يوم</div>
                  {trendBadge(weeklyStats.avgFeed, weeklyStats.prevAvgFeed)}
                </div>
                <div style={{ backgroundColor: colors.orange + '30', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: colors.soil }}>🌡️ متوسط الحرارة</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.orange }}>{weeklyStats.avgTemp.toFixed(1)}°م</div>
                  {trendBadge(weeklyStats.avgTemp, weeklyStats.prevAvgTemp)}
                </div>
                <div style={{ backgroundColor: colors.teal + '30', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: colors.soil }}>💧 أيام الري</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.teal }}>{weeklyStats.irrigationDays} / {weeklyStats.daysCount}</div>
                </div>
                {weeklyStats.totalEggs > 0 && (
                  <div style={{ backgroundColor: colors.wheat + '30', padding: '14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '12px', color: colors.soil }}>🥚 البيض المجموع</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.wheat }}>{weeklyStats.totalEggs} بيضة</div>
                    {trendBadge(weeklyStats.totalEggs, weeklyStats.prevEggs)}
                  </div>
                )}
                {weeklyStats.totalMortality > 0 && (
                  <div style={{ backgroundColor: '#fee2e2', padding: '14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '12px', color: colors.soil }}>⚠️ حالات النفوق</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ef4444' }}>{weeklyStats.totalMortality}</div>
                  </div>
                )}
              </div>

              {weeklyChartData.length > 0 && (
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                  <h4 style={{ color: colors.dark, marginBottom: '12px' }}>اتجاهات الإنتاج (آخر 14 يوم)</h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <ComposedChart data={weeklyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left"  tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left"  type="monotone" dataKey="حليب"  stroke={colors.sky}    strokeWidth={2} dot={false} />
                      {weeklyChartData.some(d => d.بيض > 0) && (
                        <Line yAxisId="left" type="monotone" dataKey="بيض"  stroke={colors.wheat}  strokeWidth={2} dot={false} />
                      )}
                      <Line yAxisId="right" type="monotone" dataKey="حرارة" stroke={colors.orange} strokeWidth={1} dot={false} strokeDasharray="4 4" />
                    </ComposedChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: '11px', color: colors.soil, textAlign: 'center', marginTop: '4px' }}>
                    المحور الأيسر: إنتاج (لتر/بيضة) | المحور الأيمن: حرارة (°م)
                  </div>
                </div>
              )}

              {(() => {
                const wm = {};
                last7.forEach(l => { if (l.weather) wm[l.weather] = (wm[l.weather] || 0) + 1; });
                const icons = { 'مشمس': '☀️', 'غائم جزئي': '⛅', 'غائم': '☁️', 'ممطر': '🌧️', 'عاصف': '💨' };
                return Object.keys(wm).length > 0 ? (
                  <div style={{ backgroundColor: 'white', padding: '14px', borderRadius: '12px' }}>
                    <h4 style={{ color: colors.dark, marginBottom: '10px', fontSize: '14px' }}>حالة الطقس هذا الأسبوع</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {Object.entries(wm).map(([w, count]) => (
                        <div key={w} style={{ backgroundColor: colors.cream, padding: '8px 14px', borderRadius: '20px', fontSize: '13px' }}>
                          {icons[w] || '🌤️'} {w}: <strong>{count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════ التقرير الشهري ══════════════════════ */}
      {reportType === 'monthly' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))}
              style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${colors.sand}`, fontFamily: 'inherit', flex: 1 }}>
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))}
              style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${colors.sand}`, fontFamily: 'inherit' }}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {!monthlyStats ? (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
              لا توجد سجلات لشهر {months[selectedMonth]} {selectedYear}
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: colors.sky + '30', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: colors.soil }}>🥛 إجمالي الحليب</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.sky }}>{monthlyStats.totalMilk.toFixed(0)} لتر</div>
                  <div style={{ fontSize: '11px', color: colors.soil }}>معدل {(monthlyStats.totalMilk / monthlyStats.daysCount).toFixed(1)} لتر/يوم</div>
                </div>
                <div style={{ backgroundColor: colors.lime + '30', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: colors.soil }}>📦 إجمالي العلف</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.lime }}>{(monthlyStats.totalFeed / 1000).toFixed(2)} طن</div>
                  <div style={{ fontSize: '11px', color: colors.soil }}>معدل {(monthlyStats.totalFeed / monthlyStats.daysCount).toFixed(0)} كغ/يوم</div>
                </div>
                <div style={{ backgroundColor: colors.orange + '30', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: colors.soil }}>🌡️ نطاق الحرارة</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.orange }}>{monthlyStats.minTemp}° — {monthlyStats.maxTemp}°</div>
                  <div style={{ fontSize: '11px', color: colors.soil }}>معدل {monthlyStats.avgTemp.toFixed(1)}°م</div>
                </div>
                <div style={{ backgroundColor: colors.teal + '30', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '12px', color: colors.soil }}>💧 أيام الري</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.teal }}>{monthlyStats.irrigationDays} يوم</div>
                  <div style={{ fontSize: '11px', color: colors.soil }}>من {monthlyStats.daysCount} يوم مسجّل</div>
                </div>
                {monthlyStats.totalEggs > 0 && (
                  <div style={{ backgroundColor: colors.wheat + '30', padding: '14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '12px', color: colors.soil }}>🥚 البيض المجموع</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.wheat }}>{monthlyStats.totalEggs} بيضة</div>
                    <div style={{ fontSize: '11px', color: colors.soil }}>معدل {(monthlyStats.totalEggs / monthlyStats.daysCount).toFixed(0)} بيضة/يوم</div>
                  </div>
                )}
                {monthlyStats.totalMortality > 0 && (
                  <div style={{ backgroundColor: '#fee2e2', padding: '14px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '12px', color: colors.soil }}>⚠️ حالات النفوق</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ef4444' }}>{monthlyStats.totalMortality}</div>
                  </div>
                )}
              </div>

              {monthlyChartData.length > 0 && (
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                  <h4 style={{ color: colors.dark, marginBottom: '12px', fontSize: '14px' }}>
                    إنتاج الحليب يومياً — {months[selectedMonth]} {selectedYear}
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="يوم" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="حليب" fill={colors.sky} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* تقويم الري */}
              {filteredLogs.length > 0 && (() => {
                const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
                const logMap = {};
                filteredLogs.forEach(l => { logMap[l.day] = l; });
                return (
                  <div style={{ backgroundColor: 'white', padding: '14px', borderRadius: '12px' }}>
                    <h4 style={{ color: colors.dark, marginBottom: '12px', fontSize: '14px' }}>💧 تقويم الري — {months[selectedMonth]}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                        const log = logMap[day];
                        const bg = log?.irrigationDone ? colors.teal + '50'
                                 : log              ? colors.cream
                                 : 'transparent';
                        return (
                          <div key={day} style={{
                            textAlign: 'center', fontSize: '11px', padding: '6px 2px', borderRadius: '4px',
                            backgroundColor: bg,
                            color: log?.irrigationDone ? colors.teal : log ? colors.dark : colors.sand,
                            fontWeight: log?.irrigationDone ? 'bold' : 'normal'
                          }}>
                            {day}{log?.irrigationDone ? '💧' : ''}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: colors.soil, display: 'flex', gap: '12px' }}>
                      <span style={{ color: colors.teal }}>💧 ري تم</span>
                      <span style={{ backgroundColor: colors.cream, padding: '1px 6px', borderRadius: '3px', color: colors.dark }}>■ مسجّل</span>
                      <span style={{ color: colors.sand }}>○ بدون سجل</span>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════ نظرة عامة ══════════════════════ */}
      {reportType === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: 'أيام تغطية الأعلاف', value: selfSufficiencyStats.feedDaysLeft, unit: 'يوم', icon: '📦',
                color: selfSufficiencyStats.feedDaysLeft < 14 ? '#ef4444' : selfSufficiencyStats.feedDaysLeft > 60 ? colors.green : colors.wheat },
              { label: 'اكتفاء السماد', value: selfSufficiencyStats.manureSelfSufficiency.toFixed(0), unit: '%', icon: '♻️', color: colors.soil },
              { label: 'استغلال الأراضي', value: selfSufficiencyStats.landUtilization.toFixed(0), unit: '%', icon: '🌾',
                color: selfSufficiencyStats.landUtilization >= 80 ? colors.green : colors.wheat }
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: 'white', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: colors.soil, marginBottom: '4px' }}>{item.icon} {item.label}</div>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: item.color }}>{item.value}</div>
                <div style={{ fontSize: '12px', color: colors.soil, marginBottom: '6px' }}>{item.unit}</div>
                <div style={{ height: '4px', backgroundColor: colors.cream, borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: `${Math.min(100, Number(item.value))}%`, backgroundColor: item.color, borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {cropsChartData.length > 0 && (
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ color: colors.dark, marginBottom: '8px', fontSize: '14px' }}>🌾 توزيع المحاصيل (دونم)</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={cropsChartData} cx="50%" cy="50%" outerRadius={55} dataKey="value">
                      {cropsChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            {livestockChartData.length > 0 && (
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ color: colors.dark, marginBottom: '8px', fontSize: '14px' }}>🐄 الثروة الحيوانية</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={livestockChartData} cx="50%" cy="50%" outerRadius={55} dataKey="value">
                      {livestockChartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px' }}>
            <h4 style={{ color: colors.dark, marginBottom: '12px' }}>🏠 ملخص المزرعة</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' }}>
              <div>🐄 أبقار: <strong>{livestockStats.totalCattle}</strong></div>
              <div>🐑 أغنام: <strong>{livestockStats.totalSheep}</strong></div>
              <div>🐔 دواجن: <strong>{livestockStats.totalPoultry}</strong></div>
              <div>🐟 أسماك: <strong>{livestockStats.totalFish}</strong></div>
              <div>🌾 المساحة الكلية: <strong>{cropsStats.totalArea} دونم</strong></div>
              <div>🌱 مزروعة: <strong>{cropsStats.plantedArea} دونم</strong></div>
              <div>📦 مخزون العلف: <strong>{(selfSufficiencyStats.totalFeedStock / 1000).toFixed(2)} طن</strong></div>
              <div>📋 سجلات: <strong>{dailyLogsData.length}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════ سجل العمليات ══════════════════════ */}
      {reportType === 'logs' && (
        <div>
          {dailyLogsData.length === 0 ? (
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
              لا توجد سجلات بعد — سجّل العمليات اليومية لتظهر هنا
            </div>
          ) : (
            [...dailyLogsData].reverse().map(log => {
              const weatherIcons = { 'مشمس': '☀️', 'غائم جزئي': '⛅', 'غائم': '☁️', 'ممطر': '🌧️', 'عاصف': '💨' };
              const dateStr = new Date(log.date).toLocaleDateString('ar-IQ', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
              return (
                <div key={log.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px', marginBottom: '10px', border: `1px solid ${colors.sand}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ color: colors.dark, fontSize: '14px' }}>{dateStr}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', color: colors.soil }}>{log.maxTemp}°/{log.minTemp}°</span>
                      <span style={{ fontSize: '20px' }}>{weatherIcons[log.weather] || '🌤️'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '12px' }}>
                    {log.milkProduction  > 0 && <span style={{ backgroundColor: colors.sky   + '25', padding: '4px 10px', borderRadius: '12px', color: colors.sky   }}>🥛 {log.milkProduction} ل</span>}
                    {log.eggsCollected   > 0 && <span style={{ backgroundColor: colors.wheat + '25', padding: '4px 10px', borderRadius: '12px', color: colors.wheat }}>🥚 {log.eggsCollected} بيضة</span>}
                    {log.feedConsumed    > 0 && <span style={{ backgroundColor: colors.lime  + '25', padding: '4px 10px', borderRadius: '12px', color: colors.lime  }}>📦 {log.feedConsumed} كغ</span>}
                    {log.irrigationDone     && <span style={{ backgroundColor: colors.teal  + '25', padding: '4px 10px', borderRadius: '12px', color: colors.teal  }}>💧 ري</span>}
                    {log.mortality       > 0 && <span style={{ backgroundColor: '#fee2e2',           padding: '4px 10px', borderRadius: '12px', color: '#ef4444'    }}>⚠️ نفوق: {log.mortality}</span>}
                  </div>
                  {log.treatments  && <div style={{ marginTop: '8px', fontSize: '12px', color: colors.purple }}>💊 {log.treatments}</div>}
                  {log.fieldNotes  && <div style={{ marginTop: '4px', fontSize: '12px', color: colors.soil, fontStyle: 'italic' }}>📝 {log.fieldNotes}</div>}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ══════════════════════ أداء الدورات ══════════════════════ */}
      {reportType === 'cycles' && (
        <div>
          {cyclesData.length === 0 ? (
            <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔄</div>
              <div style={{ fontWeight: 'bold' }}>لا توجد دورات تربية نشطة</div>
              <div style={{ fontSize: '13px', marginTop: '6px' }}>أضف خطط التربية للقطعان من قسم الحيوانية</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cyclesData.map(h => (
                <div key={h.id} style={{ backgroundColor: 'white', borderRadius: '14px', border: `1px solid ${colors.sand}`, overflow: 'hidden' }}>
                  {/* رأس */}
                  <div style={{ padding: '12px 14px', borderBottom: `1px solid ${colors.cream}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '26px' }}>{h.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '15px', color: colors.dark }}>{h.name}</div>
                      <div style={{ fontSize: '12px', color: colors.soil }}>
                        {h.label} · {h.count || h.fishCount} رأس · بدأت {new Date(h.plan.startDate).toLocaleDateString('ar-IQ')}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '22px', fontWeight: 'bold', color: h.color }}>{h.progress}%</div>
                      <div style={{ fontSize: '11px', color: colors.soil }}>مكتمل</div>
                    </div>
                  </div>

                  {/* شريط التقدم */}
                  <div style={{ padding: '10px 14px 0' }}>
                    <div style={{ height: '8px', backgroundColor: colors.cream, borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${h.progress}%`, height: '100%', backgroundColor: h.color, borderRadius: '4px', transition: 'width 0.3s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.soil, marginTop: '4px' }}>
                      <span>اليوم {h.elapsed} من {h.plan.totalDays}</span>
                      <span>{h.remaining > 0 ? `${h.remaining} يوم متبقي` : `انتهت ${new Date(h.endDate).toLocaleDateString('ar-IQ')}`}</span>
                    </div>
                  </div>

                  {/* KPIs */}
                  <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div style={{ backgroundColor: colors.cream, borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: colors.dark }}>
                        {h.totalFeed > 0 ? `${(h.totalFeed / 1000).toFixed(1)} طن` : '—'}
                      </div>
                      <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>علف مستهلك</div>
                    </div>
                    <div style={{ backgroundColor: colors.cream, borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: parseFloat(h.mortalityRate) > 3 ? '#ef4444' : colors.green }}>
                        {h.mortalityRate}%
                      </div>
                      <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>معدل النفوق ({h.totalMortality})</div>
                    </div>
                    {h.totalMilk > 0 && (
                      <div style={{ backgroundColor: colors.sky + '15', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: colors.sky }}>{h.totalMilk.toFixed(0)} ل</div>
                        <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>إنتاج الحليب</div>
                      </div>
                    )}
                    {h.totalEggs > 0 && (
                      <div style={{ backgroundColor: colors.wheat + '15', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: colors.wheat }}>{h.totalEggs.toLocaleString()}</div>
                        <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>بيض مجموع</div>
                      </div>
                    )}
                    {h.fcr && (
                      <div style={{ backgroundColor: colors.green + '15', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: colors.green }}>{h.fcr}</span>
                          {h.targetFCR && (
                            <span style={{ fontSize: '11px', color: parseFloat(h.fcr) <= h.targetFCR ? colors.green : '#ef4444' }}>
                              / هدف {h.targetFCR}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>FCR معدل التحويل</div>
                      </div>
                    )}
                    <div style={{ backgroundColor: colors.purple + '15', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: colors.purple }}>{h.cycleLogs}</div>
                      <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>يوم مسجّل</div>
                    </div>
                  </div>

                  {/* الهدف من الخطة */}
                  {h.targetMain && (
                    <div style={{ margin: '0 14px 14px', padding: '8px 12px', backgroundColor: h.color + '10', borderRadius: '8px', border: `1px solid ${h.color}30` }}>
                      <span style={{ fontSize: '12px', color: colors.soil }}>🎯 هدف الخطة: </span>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: h.color }}>{h.targetMain}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* للطباعة فقط */}
      <div className="print-only" style={{ display: 'none' }}>
        <h2>تقرير المزرعة الذكية — {new Date().toLocaleDateString('ar-IQ')}</h2>
        <hr />
        <h3>ملخص الثروة الحيوانية</h3>
        <p>أبقار: {livestockStats.totalCattle} | أغنام: {livestockStats.totalSheep} | دواجن: {livestockStats.totalPoultry} | أسماك: {livestockStats.totalFish}</p>
        <h3>ملخص المحاصيل</h3>
        <p>المساحة الكلية: {cropsStats.totalArea} دونم | المزروعة: {cropsStats.plantedArea} دونم</p>
        <h3>مؤشرات الاكتفاء الذاتي</h3>
        <p>أيام تغطية الأعلاف: {selfSufficiencyStats.feedDaysLeft} | اكتفاء السماد: {selfSufficiencyStats.manureSelfSufficiency.toFixed(0)}%</p>
        {smartAlerts.filter(a => a.level !== 'success').length > 0 && (
          <>
            <h3>التنبيهات</h3>
            {smartAlerts.filter(a => a.level !== 'success').map((a, i) => <p key={i}>• {a.title}: {a.body}</p>)}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsSection;
