import React, { useState, useMemo } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ReportsSection = () => {
  const { farmData } = useFarm();
  const [reportType, setReportType] = useState('weekly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const years = [2024, 2025, 2026];

  const dailyLogsData = useMemo(() => {
    return farmData.dailyLogs.map(log => ({
      ...log,
      dateObj: new Date(log.date),
      day: new Date(log.date).getDate(),
      month: new Date(log.date).getMonth(),
      year: new Date(log.date).getFullYear()
    }));
  }, [farmData.dailyLogs]);

  const filteredLogs = useMemo(() => {
    return dailyLogsData.filter(log =>
      log.month === selectedMonth && log.year === selectedYear
    );
  }, [dailyLogsData, selectedMonth, selectedYear]);

  const weeklyStats = useMemo(() => {
    const last7Days = dailyLogsData.slice(-7);
    if (last7Days.length === 0) return null;
    const avgMilk = last7Days.reduce((s, l) => s + (l.milkProduction || 0), 0) / last7Days.length;
    const avgFeed = last7Days.reduce((s, l) => s + (l.feedConsumed || 0), 0) / last7Days.length;
    const avgTemp = last7Days.reduce((s, l) => s + ((l.maxTemp + l.minTemp) / 2 || 0), 0) / last7Days.length;
    const irrigationDays = last7Days.filter(l => l.irrigationDone).length;
    const mortalityTotal = last7Days.reduce((s, l) => s + (l.mortality || 0), 0);
    return { avgMilk, avgFeed, avgTemp, irrigationDays, mortalityTotal, daysCount: last7Days.length };
  }, [dailyLogsData]);

  const monthlyStats = useMemo(() => {
    if (filteredLogs.length === 0) return null;
    const totalMilk = filteredLogs.reduce((s, l) => s + (l.milkProduction || 0), 0);
    const totalFeed = filteredLogs.reduce((s, l) => s + (l.feedConsumed || 0), 0);
    const avgTemp = filteredLogs.reduce((s, l) => s + ((l.maxTemp + l.minTemp) / 2 || 0), 0) / filteredLogs.length;
    const irrigationDays = filteredLogs.filter(l => l.irrigationDone).length;
    const totalMortality = filteredLogs.reduce((s, l) => s + (l.mortality || 0), 0);
    return { totalMilk, totalFeed, avgTemp, irrigationDays, totalMortality, daysCount: filteredLogs.length };
  }, [filteredLogs]);

  const livestockStats = useMemo(() => {
    const totalCattle = farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0);
    const totalSheep = farmData.livestock.sheep.herds.reduce((s, h) => s + (h.count || 0), 0);
    const totalPoultry = farmData.livestock.poultry.flocks.reduce((s, f) => s + (f.count || 0), 0);
    const totalFish = farmData.livestock.fish.ponds.reduce((s, p) => s + (p.fishCount || 0), 0);
    return { totalCattle, totalSheep, totalPoultry, totalFish };
  }, [farmData]);

  const cropsStats = useMemo(() => {
    const totalArea = farmData.lands.reduce((s, l) => s + (l.area || 0), 0);
    const plantedArea = farmData.lands.filter(l => l.currentCrop).reduce((s, l) => s + (l.area || 0), 0);
    const cropsCount = {};
    farmData.lands.forEach(l => {
      if (l.currentCrop) cropsCount[l.currentCrop] = (cropsCount[l.currentCrop] || 0) + (l.area || 0);
    });
    return { totalArea, plantedArea, cropsCount };
  }, [farmData]);

  const productionChartData = useMemo(() => {
    return dailyLogsData.slice(-14).map(log => ({
      date: new Date(log.date).toLocaleDateString('ar-IQ', { day: 'numeric', month: 'numeric' }),
      حليب: log.milkProduction || 0,
      علف: log.feedConsumed || 0,
      حرارة: ((log.maxTemp + log.minTemp) / 2) || 0
    }));
  }, [dailyLogsData]);

  const cropsChartData = useMemo(() => {
    return Object.entries(cropsStats.cropsCount).map(([name, area]) => ({
      name,
      value: area,
      color: name.includes('قمح') ? colors.wheat :
             name.includes('برسيم') ? colors.lime :
             name.includes('ذرة') ? colors.orange :
             name.includes('طماطم') ? colors.red :
             colors.teal
    }));
  }, [cropsStats]);

  const livestockChartData = useMemo(() => [
    { name: 'أبقار', value: livestockStats.totalCattle, color: colors.soil },
    { name: 'أغنام', value: livestockStats.totalSheep, color: colors.green },
    { name: 'دواجن', value: livestockStats.totalPoultry, color: colors.orange },
    { name: 'أسماك', value: livestockStats.totalFish, color: colors.sky }
  ].filter(d => d.value > 0), [livestockStats]);

  const selfSufficiencyStats = useMemo(() => {
    const totalFeedStock = farmData.feedInventory.ingredients.reduce((s, ing) => {
      return s + (ing.unit === 'طن' ? ing.quantity * 1000 : ing.quantity);
    }, 0);
    const avgDailyFeed = dailyLogsData.slice(-30).reduce((s, l) => s + (l.feedConsumed || 0), 0) / 30;
    const totalManure = (livestockStats.totalCattle * 3.5) + (livestockStats.totalSheep * 0.8) + (livestockStats.totalPoultry * 0.05);
    const manureNeeded = cropsStats.plantedArea * 5.5;
    return {
      feedDaysLeft: avgDailyFeed > 0 ? Math.floor(totalFeedStock / avgDailyFeed) : 0,
      manureSelfSufficiency: manureNeeded > 0 ? Math.min(100, (totalManure / manureNeeded) * 100) : 0,
      landUtilization: cropsStats.totalArea > 0 ? ((cropsStats.plantedArea / cropsStats.totalArea) * 100) : 0
    };
  }, [farmData, dailyLogsData, livestockStats, cropsStats]);

  const recommendations = useMemo(() => {
    const recs = [];
    if (selfSufficiencyStats.feedDaysLeft < 14) {
      recs.push({ type: 'warning', text: `مخزون الأعلاف يكفي ${selfSufficiencyStats.feedDaysLeft} يوم فقط - يفضل البدء بتجهيز طلبية جديدة` });
    }
    if (selfSufficiencyStats.manureSelfSufficiency < 50) {
      recs.push({ type: 'info', text: `نسبة الاكتفاء من السماد العضوي ${selfSufficiencyStats.manureSelfSufficiency.toFixed(0)}% - فكر في زيادة أعداد الحيوانات أو شراء سماد إضافي` });
    }
    if (selfSufficiencyStats.landUtilization < 70) {
      recs.push({ type: 'info', text: `نسبة استغلال الأراضي ${selfSufficiencyStats.landUtilization.toFixed(0)}% فقط - يمكنك زراعة ${(cropsStats.totalArea - cropsStats.plantedArea).toFixed(0)} دونم إضافية` });
    }
    if (livestockStats.totalFish > 0 && cropsStats.plantedArea > 0) {
      recs.push({ type: 'success', text: 'يمكنك استخدام مياه أحواض الأسماك لري المحاصيل - غنية بالمغذيات الطبيعية' });
    }
    if (weeklyStats && weeklyStats.avgMilk < 15 && livestockStats.totalCattle > 0) {
      recs.push({ type: 'warning', text: `متوسط إنتاج الحليب منخفض (${weeklyStats.avgMilk.toFixed(1)} لتر/يوم) - راجع التغذية والرعاية الصحية` });
    }
    return recs;
  }, [selfSufficiencyStats, cropsStats, livestockStats, weeklyStats]);

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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: colors.dark }}>📊 التقارير والتحليلات</h2>
        <button
          onClick={() => window.print()}
          style={{
            padding: '10px 16px',
            backgroundColor: colors.purple,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          🖨️ طباعة
        </button>
      </div>

      {/* محدد الشهر والسنة */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${colors.sand}`, fontFamily: 'inherit' }}
        >
          {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${colors.sand}`, fontFamily: 'inherit' }}
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* تبويبات نوع التقرير */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'weekly', name: 'أسبوعي' },
          { id: 'monthly', name: 'شهري' },
          { id: 'overview', name: 'نظرة عامة' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: reportType === tab.id ? colors.green : colors.cream,
              color: reportType === tab.id ? 'white' : colors.dark,
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* التقرير الأسبوعي */}
      {reportType === 'weekly' && weeklyStats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: colors.sky + '30', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>متوسط إنتاج الحليب</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.sky }}>{weeklyStats.avgMilk.toFixed(1)} لتر/يوم</div>
            </div>
            <div style={{ backgroundColor: colors.lime + '30', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>متوسط استهلاك العلف</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.lime }}>{weeklyStats.avgFeed.toFixed(1)} كغ/يوم</div>
            </div>
            <div style={{ backgroundColor: colors.orange + '30', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>متوسط الحرارة</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.orange }}>{weeklyStats.avgTemp.toFixed(1)} °م</div>
            </div>
            <div style={{ backgroundColor: colors.teal + '30', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>أيام الري</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.teal }}>{weeklyStats.irrigationDays} / 7 يوم</div>
            </div>
          </div>

          {productionChartData.length > 0 && (
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
              <h4 style={{ color: colors.dark, marginBottom: '16px' }}>اتجاهات الإنتاج (آخر 14 يوم)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={productionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="حليب" stroke={colors.sky} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="علف" stroke={colors.lime} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {!productionChartData.length && (
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
              لا توجد سجلات يومية للأسبوع الأخير
            </div>
          )}
        </div>
      )}

      {reportType === 'weekly' && !weeklyStats && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
          لا توجد سجلات يومية بعد — سجّل العمليات اليومية لعرض التحليل الأسبوعي
        </div>
      )}

      {/* التقرير الشهري */}
      {reportType === 'monthly' && monthlyStats && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: colors.sky + '30', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>إجمالي إنتاج الحليب</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.sky }}>{monthlyStats.totalMilk.toFixed(0)} لتر</div>
            </div>
            <div style={{ backgroundColor: colors.lime + '30', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>إجمالي استهلاك العلف</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.lime }}>{(monthlyStats.totalFeed / 1000).toFixed(2)} طن</div>
            </div>
            <div style={{ backgroundColor: colors.orange + '30', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>أيام الري</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.orange }}>{monthlyStats.irrigationDays} / {monthlyStats.daysCount} يوم</div>
            </div>
            <div style={{ backgroundColor: colors.red + '30', padding: '16px', borderRadius: '12px' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>حالات النفوق</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.red }}>{monthlyStats.totalMortality}</div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'monthly' && !monthlyStats && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
          لا توجد سجلات لشهر {months[selectedMonth]} {selectedYear}
        </div>
      )}

      {/* نظرة عامة */}
      {reportType === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: colors.green + '20', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>أيام تغطية الأعلاف</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: colors.green }}>{selfSufficiencyStats.feedDaysLeft}</div>
              <div style={{ fontSize: '12px', color: colors.soil }}>يوم</div>
            </div>
            <div style={{ backgroundColor: colors.soil + '20', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>اكتفاء السماد</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: colors.soil }}>{selfSufficiencyStats.manureSelfSufficiency.toFixed(0)}%</div>
            </div>
            <div style={{ backgroundColor: colors.wheat + '20', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: colors.soil }}>استغلال الأراضي</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: colors.wheat }}>{selfSufficiencyStats.landUtilization.toFixed(0)}%</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {cropsChartData.length > 0 && (
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ color: colors.dark, marginBottom: '12px', fontSize: '14px' }}>توزيع المحاصيل (دونم)</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={cropsChartData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                      {cropsChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {livestockChartData.length > 0 && (
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ color: colors.dark, marginBottom: '12px', fontSize: '14px' }}>توزيع الثروة الحيوانية</h4>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={livestockChartData} cx="50%" cy="50%" outerRadius={60} dataKey="value">
                      {livestockChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {cropsChartData.length === 0 && livestockChartData.length === 0 && (
              <div style={{ gridColumn: 'span 2', backgroundColor: 'white', padding: '24px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
                أضف بيانات الأراضي والثروة الحيوانية لعرض الرسوم البيانية
              </div>
            )}
          </div>

          {/* ملخص الأعداد */}
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <h4 style={{ color: colors.dark, marginBottom: '12px' }}>ملخص المزرعة</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '14px' }}>
              <div>🐄 أبقار: <strong>{livestockStats.totalCattle}</strong></div>
              <div>🐑 أغنام: <strong>{livestockStats.totalSheep}</strong></div>
              <div>🐔 دواجن: <strong>{livestockStats.totalPoultry}</strong></div>
              <div>🐟 أسماك: <strong>{livestockStats.totalFish}</strong></div>
              <div>🌾 مساحة كلية: <strong>{cropsStats.totalArea} دونم</strong></div>
              <div>🌱 مزروعة: <strong>{cropsStats.plantedArea} دونم</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* التوصيات */}
      {recommendations.length > 0 && (
        <div style={{ backgroundColor: colors.gold + '20', padding: '16px', borderRadius: '12px', marginTop: '10px' }}>
          <h4 style={{ color: colors.dark, marginBottom: '12px' }}>💡 توصيات ذكية</h4>
          {recommendations.map((rec, i) => (
            <div key={i} style={{
              padding: '10px 12px',
              marginBottom: '8px',
              backgroundColor: rec.type === 'warning' ? colors.orange + '20' :
                              rec.type === 'success' ? colors.green + '20' :
                              colors.sky + '20',
              borderRadius: '8px',
              borderRight: `4px solid ${
                rec.type === 'warning' ? colors.orange :
                rec.type === 'success' ? colors.green : colors.sky
              }`,
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              {rec.text}
            </div>
          ))}
        </div>
      )}

      {/* ملخص للطباعة */}
      <div className="print-only" style={{ display: 'none' }}>
        <h2>تقرير المزرعة الذكية — {new Date().toLocaleDateString('ar-IQ')}</h2>
        <hr />
        <h3>ملخص الثروة الحيوانية</h3>
        <p>أبقار: {livestockStats.totalCattle} | أغنام: {livestockStats.totalSheep} | دواجن: {livestockStats.totalPoultry} | أسماك: {livestockStats.totalFish}</p>
        <h3>ملخص المحاصيل</h3>
        <p>المساحة الكلية: {cropsStats.totalArea} دونم | المزروعة: {cropsStats.plantedArea} دونم</p>
        <h3>مؤشرات الاكتفاء الذاتي</h3>
        <p>أيام تغطية الأعلاف: {selfSufficiencyStats.feedDaysLeft} | اكتفاء السماد: {selfSufficiencyStats.manureSelfSufficiency.toFixed(0)}%</p>
        {recommendations.length > 0 && (
          <>
            <h3>التوصيات</h3>
            {recommendations.map((rec, i) => <p key={i}>• {rec.text}</p>)}
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsSection;
