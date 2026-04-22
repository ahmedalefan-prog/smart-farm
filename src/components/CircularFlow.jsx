import React, { useMemo } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CircularFlow = () => {
  const { farmData } = useFarm();

  const flows = useMemo(() => {
    const totalCattle = farmData.livestock.cattle.herds.reduce((sum, h) => sum + (h.count || 0), 0);
    const totalSheep = farmData.livestock.sheep.herds.reduce((sum, h) => sum + (h.count || 0), 0);
    const totalPoultry = farmData.livestock.poultry.flocks.reduce((sum, f) => sum + (f.count || 0), 0);

    const manureCattle = totalCattle * 3.5;
    const manureSheep = totalSheep * 0.8;
    const manurePoultry = totalPoultry * 0.05;
    const totalManure = manureCattle + manureSheep + manurePoultry;

    const totalCropArea = farmData.lands.reduce((sum, l) => sum + (l.area || 0), 0);
    const manureNeeded = totalCropArea * 5.5;
    const manureSelfSufficiency = manureNeeded > 0 ? Math.min(100, (totalManure / manureNeeded) * 100) : 0;

    const feedStock = farmData.feedInventory.ingredients.reduce((sum, ing) => {
      const kg = ing.unit === 'طن' ? ing.quantity * 1000 : ing.quantity;
      return sum + kg;
    }, 0);

    const recentLogs = farmData.dailyLogs.slice(-7);
    const avgDailyFeed = recentLogs.length > 0
      ? recentLogs.reduce((sum, log) => sum + (log.feedConsumed || 0), 0) / recentLogs.length
      : 0;

    const daysOfFeedLeft = avgDailyFeed > 0 ? Math.floor(feedStock / avgDailyFeed) : 0;

    const fishWaterVolume = farmData.livestock.fish.ponds.reduce((sum, p) => {
      return sum + (p.length * p.width * p.depth * 1000);
    }, 0);
    const fishWaterForIrrigation = fishWaterVolume * 0.1;

    const lastLog = farmData.dailyLogs[farmData.dailyLogs.length - 1];
    const totalWaterUsed = lastLog?.irrigationDone ? totalCropArea * 5000 : 0;
    const waterProductivity = totalWaterUsed > 0 ? (totalCropArea / (totalWaterUsed / 1000)).toFixed(2) : 0;

    return {
      manure: {
        daily: totalManure.toFixed(1),
        needed: manureNeeded.toFixed(1),
        selfSufficiency: manureSelfSufficiency.toFixed(1)
      },
      feed: {
        stock: feedStock,
        dailyConsumption: avgDailyFeed.toFixed(1),
        daysLeft: daysOfFeedLeft
      },
      fish: {
        irrigationWater: (fishWaterForIrrigation / 1000).toFixed(2),
        ponds: farmData.livestock.fish.ponds.length
      },
      water: {
        productivity: waterProductivity
      }
    };
  }, [farmData]);

  const feedSourceData = useMemo(() => {
    const localFeed = farmData.feedInventory.ingredients
      .filter(ing => ing.name.includes('محلي') || ing.name.includes('منتج'))
      .reduce((sum, ing) => sum + (ing.unit === 'طن' ? ing.quantity * 1000 : ing.quantity), 0);

    const totalFeed = farmData.feedInventory.ingredients.reduce((sum, ing) => {
      return sum + (ing.unit === 'طن' ? ing.quantity * 1000 : ing.quantity);
    }, 0);

    const purchasedFeed = totalFeed - localFeed;

    return [
      { name: 'منتج محلياً', value: localFeed, color: colors.lime },
      { name: 'مشترى', value: purchasedFeed, color: colors.orange }
    ].filter(d => d.value > 0);
  }, [farmData]);

  const hasData = farmData.lands.length > 0 ||
    farmData.livestock.cattle.herds.length > 0 ||
    farmData.livestock.poultry.flocks.length > 0 ||
    farmData.livestock.fish.ponds.length > 0;

  if (!hasData) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '48px', marginBottom: '20px' }}>🔄</p>
        <h3 style={{ color: colors.dark, marginBottom: '10px' }}>الدورة المغلقة</h3>
        <p style={{ color: colors.soil }}>
          أضف قطع أراضي وقطعان حيوانات لبدء تحليل تدفق الموارد
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>
        🔄 دورة الموارد المغلقة
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {/* السماد العضوي */}
        <div style={{
          backgroundColor: colors.soil + '15',
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${colors.soil}`
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>💩</div>
          <h4 style={{ color: colors.soil, marginBottom: '12px' }}>السماد العضوي</h4>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.dark }}>
            {flows.manure.daily} كغ/يوم
          </div>
          <div style={{ fontSize: '14px', color: colors.soil, marginTop: '8px' }}>
            نسبة الاكتفاء: {flows.manure.selfSufficiency}%
          </div>
          <div style={{ marginTop: '12px', height: '6px', backgroundColor: colors.sand, borderRadius: '3px' }}>
            <div style={{
              width: `${flows.manure.selfSufficiency}%`,
              height: '100%',
              backgroundColor: flows.manure.selfSufficiency >= 70 ? colors.lime : colors.orange,
              borderRadius: '3px'
            }}></div>
          </div>
        </div>

        {/* الأعلاف */}
        <div style={{
          backgroundColor: colors.lime + '15',
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${colors.lime}`
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌾</div>
          <h4 style={{ color: colors.lime, marginBottom: '12px' }}>مخزون الأعلاف</h4>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.dark }}>
            {(flows.feed.stock / 1000).toFixed(2)} طن
          </div>
          <div style={{ fontSize: '14px', color: colors.soil, marginTop: '8px' }}>
            يكفي {flows.feed.daysLeft} يوم
          </div>
          {flows.feed.daysLeft < 7 && flows.feed.daysLeft > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: colors.red + '20',
              borderRadius: '6px',
              color: colors.red,
              fontSize: '13px'
            }}>
              ⚠️ المخزون منخفض - يفضل إعادة الطلب
            </div>
          )}
        </div>

        {/* مياه الأسماك */}
        <div style={{
          backgroundColor: colors.sky + '15',
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${colors.sky}`
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>💧</div>
          <h4 style={{ color: colors.sky, marginBottom: '12px' }}>مياه الأحواض للري</h4>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.dark }}>
            {flows.fish.irrigationWater} م³/يوم
          </div>
          <div style={{ fontSize: '14px', color: colors.soil, marginTop: '8px' }}>
            من {flows.fish.ponds} أحواض أسماك
          </div>
          {parseFloat(flows.fish.irrigationWater) > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: colors.lime + '20',
              borderRadius: '6px',
              color: colors.green,
              fontSize: '13px'
            }}>
              ✅ يمكن استخدامها لري المحاصيل اليوم
            </div>
          )}
        </div>

        {/* إنتاجية المياه */}
        <div style={{
          backgroundColor: colors.teal + '15',
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${colors.teal}`
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
          <h4 style={{ color: colors.teal, marginBottom: '12px' }}>كفاءة المياه</h4>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.dark }}>
            {flows.water.productivity} كغ/م³
          </div>
          <div style={{ fontSize: '14px', color: colors.soil, marginTop: '8px' }}>
            إنتاجية المحصول لكل متر مكعب
          </div>
        </div>
      </div>

      {/* مخطط مصادر الأعلاف */}
      {feedSourceData.length > 0 && (
        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginTop: '20px' }}>
          <h4 style={{ color: colors.dark, marginBottom: '16px' }}>📈 مصادر الأعلاف (كغ)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={feedSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={70}
                dataKey="value"
              >
                {feedSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${(value / 1000).toFixed(2)} طن`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* توصيات ذكية */}
      <div style={{
        backgroundColor: colors.gold + '20',
        padding: '16px',
        borderRadius: '12px',
        marginTop: '20px',
        border: `1px solid ${colors.gold}`
      }}>
        <h4 style={{ color: colors.dark, marginBottom: '12px' }}>💡 توصيات لتحسين الاكتفاء الذاتي</h4>
        <ul style={{ paddingRight: '20px', color: colors.soil }}>
          {parseFloat(flows.manure.selfSufficiency) < 50 && (
            <li style={{ marginBottom: '8px' }}>
              نسبة الاكتفاء من السماد منخفضة ({flows.manure.selfSufficiency}%).
              فكر في زيادة أعداد الحيوانات أو شراء سماد عضوي إضافي.
            </li>
          )}
          {flows.feed.daysLeft < 14 && flows.feed.daysLeft > 0 && (
            <li style={{ marginBottom: '8px' }}>
              مخزون الأعلاف يكفي {flows.feed.daysLeft} يوم فقط.
              ابدأ في تجهيز طلبية جديدة أو زيادة إنتاج الأعلاف محلياً.
            </li>
          )}
          {parseFloat(flows.fish.irrigationWater) > 0 && farmData.lands.length > 0 && (
            <li style={{ marginBottom: '8px' }}>
              لديك {flows.fish.irrigationWater} م³ يومياً من مياه أحواض الأسماك.
              هذه المياه غنية بالمغذيات ومثالية لري المحاصيل.
            </li>
          )}
          {farmData.lands.filter(l => !l.currentCrop).length > 0 && (
            <li style={{ marginBottom: '8px' }}>
              لديك {farmData.lands.filter(l => !l.currentCrop).length} قطع أراضي غير مزروعة.
              استغلها في زراعة أعلاف لزيادة الاكتفاء الذاتي.
            </li>
          )}
          {parseFloat(flows.manure.selfSufficiency) >= 70 && flows.feed.daysLeft >= 14 && (
            <li style={{ marginBottom: '8px', color: colors.green }}>
              ✅ أداء ممتاز! نسبة الاكتفاء الذاتي مرتفعة والمخزون جيد.
            </li>
          )}
          {parseFloat(flows.manure.selfSufficiency) === 0 && flows.feed.daysLeft === 0 && farmData.lands.filter(l => !l.currentCrop).length === 0 && (
            <li style={{ marginBottom: '8px' }}>
              أضف بيانات المزرعة (محاصيل، حيوانات، أعلاف) لتظهر التوصيات.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CircularFlow;
