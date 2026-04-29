import React, { useMemo, useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';

const TODAY_KEY = () => 'dismissedTasks_' + new Date().toISOString().split('T')[0];

const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};
const daysDiff = (a, b) =>
  Math.floor((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));

const PRIORITY = { critical: 0, high: 1, medium: 2, low: 3 };

const TodayTasks = ({ onAction }) => {
  const { farmData } = useFarm();
  const today = new Date().toISOString().split('T')[0];

  const [dismissed, setDismissed] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(TODAY_KEY()) || '[]')); }
    catch { return new Set(); }
  });

  const dismissTask = (id) => {
    setDismissed(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(TODAY_KEY(), JSON.stringify([...next]));
      return next;
    });
  };

  const tasks = useMemo(() => {
    const list = [];

    /* ── 1. السجل اليومي ── */
    const hasTodayLog = farmData.dailyLogs.some(l => l.date?.startsWith(today));
    if (!hasTodayLog) {
      list.push({
        id: 'daily-log',
        priority: 'high',
        icon: '📋',
        title: 'سجل اليوم لم يُدخَل بعد',
        subtitle: 'سجّل الطقس والإنتاج والتغذية',
        action: 'dailyLog',
        color: colors.gold
      });
    }

    /* ── 2. لقاحات قادمة من خطط التربية ── */
    const allAnimals = [
      ...farmData.livestock.cattle.herds.map(h => ({ ...h, kind: 'أبقار' })),
      ...farmData.livestock.sheep.herds.map(h => ({ ...h, kind: 'أغنام' })),
      ...farmData.livestock.poultry.flocks.map(f => ({ ...f, kind: 'دواجن' })),
      ...farmData.livestock.fish.ponds.map(p => ({ ...p, kind: 'أسماك' }))
    ];

    allAnimals.forEach(animal => {
      if (!animal.plan?.startDate) return;
      (animal.plan.vaccines || []).filter(v => !v.done).forEach(v => {
        const vaccDate = addDays(animal.plan.startDate, v.day);
        const diff = daysDiff(today, vaccDate);
        if (diff >= -1 && diff <= 3) {
          list.push({
            id: `vacc-${animal.id}-${v.id}`,
            priority: diff <= 0 ? 'critical' : 'high',
            icon: '💉',
            title: `${v.name}`,
            subtitle: `${animal.kind} — ${animal.name} · ${diff === 0 ? 'اليوم!' : diff < 0 ? `متأخر ${Math.abs(diff)} يوم` : `بعد ${diff} يوم`}`,
            action: 'livestock',
            color: diff <= 0 ? '#ef4444' : colors.orange
          });
        }
      });
    });

    /* ── 3. مواعيد الحصاد ── */
    farmData.lands.filter(l => l.expectedHarvest && l.currentCrop).forEach(land => {
      const diff = daysDiff(today, land.expectedHarvest);
      if (diff >= -7 && diff <= 3) {
        list.push({
          id: `harvest-${land.id}`,
          priority: diff < 0 ? 'critical' : diff === 0 ? 'high' : 'medium',
          icon: '🌾',
          title: `حصاد ${land.currentCrop}`,
          subtitle: `${land.name} (${land.area} دونم) · ${diff < 0 ? `متأخر ${Math.abs(diff)} يوم` : diff === 0 ? 'اليوم!' : `بعد ${diff} يوم`}`,
          action: 'crops',
          color: diff < 0 ? '#ef4444' : colors.wheat
        });
      }
    });

    /* ── 4. الأعلاف منخفضة ── */
    const totalFeedDays = (() => {
      const totalFeedKg = farmData.feedInventory.ingredients.reduce((s, ing) =>
        s + (ing.unit === 'طن' ? (ing.quantity || 0) * 1000 : (ing.quantity || 0)), 0);
      const totalAnimals =
        farmData.livestock.cattle.herds.reduce((s, h) => s + (h.count || 0), 0) * 12 +
        farmData.livestock.sheep.herds.reduce((s, h) => s + (h.count || 0), 0) * 1.5 +
        farmData.livestock.poultry.flocks.reduce((s, f) => s + (f.count || 0), 0) * 0.15;
      return totalAnimals > 0 ? Math.floor(totalFeedKg / totalAnimals) : 999;
    })();

    if (totalFeedDays > 0 && totalFeedDays <= 7) {
      list.push({
        id: 'feed-low',
        priority: totalFeedDays <= 3 ? 'critical' : 'high',
        icon: '🌾',
        title: 'مخزون الأعلاف منخفض جداً',
        subtitle: `يكفي ${totalFeedDays} أيام فقط — اطلب توريد فوراً`,
        action: 'feed',
        color: totalFeedDays <= 3 ? '#ef4444' : colors.orange
      });
    }

    /* ── 5. دورة التربية قاربت على الانتهاء ── */
    allAnimals.forEach(animal => {
      if (!animal.plan?.startDate || !animal.plan?.totalDays) return;
      const endDate = addDays(animal.plan.startDate, animal.plan.totalDays);
      const diff = daysDiff(today, endDate);
      if (diff >= 0 && diff <= 5) {
        list.push({
          id: `plan-end-${animal.id}`,
          priority: 'medium',
          icon: '📅',
          title: `انتهاء دورة تربية ${animal.name}`,
          subtitle: `${animal.kind} · ${diff === 0 ? 'اليوم!' : `بعد ${diff} أيام`}`,
          action: 'livestock',
          color: colors.teal
        });
      }
    });

    /* ── 6. أدوية منتهية الصلاحية أو منخفضة ── */
    (farmData.medicineInventory?.items || []).forEach(med => {
      const expDiff = med.expiryDate
        ? Math.floor((new Date(med.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null;
      if (expDiff !== null && expDiff <= 14) {
        list.push({
          id: `med-exp-${med.id}`,
          priority: expDiff <= 0 ? 'critical' : 'high',
          icon: '💊',
          title: expDiff <= 0 ? `انتهت صلاحية: ${med.name}` : `تنتهي صلاحية: ${med.name}`,
          subtitle: expDiff <= 0 ? `منتهي منذ ${Math.abs(expDiff)} يوم` : `بعد ${expDiff} يوم`,
          action: 'medicines',
          color: expDiff <= 0 ? '#ef4444' : colors.orange
        });
      }
      if (med.minQuantity > 0 && med.quantity <= med.minQuantity) {
        list.push({
          id: `med-low-${med.id}`,
          priority: med.quantity === 0 ? 'critical' : 'high',
          icon: '📦',
          title: `مخزون حرج: ${med.name}`,
          subtitle: `متبقي ${med.quantity} ${med.unit} — اطلب توريداً`,
          action: 'medicines',
          color: '#ef4444'
        });
      }
    });

    return list.sort((a, b) => PRIORITY[a.priority] - PRIORITY[b.priority]);
  }, [farmData, today]);

  const visibleTasks = tasks.filter(t => !dismissed.has(t.id));

  const displayTasks = visibleTasks.length > 0 ? visibleTasks : [{
    id: 'all-good', priority: 'low', icon: '✅',
    title: 'كل شيء على ما يرام اليوم',
    subtitle: 'لا توجد مهام عاجلة',
    action: null, color: colors.green
  }];

  const criticalCount = visibleTasks.filter(t => t.priority === 'critical').length;
  const highCount     = visibleTasks.filter(t => t.priority === 'high').length;

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ color: colors.dark, margin: 0, fontSize: '15px' }}>📌 مهام اليوم</h3>
        {(criticalCount + highCount) > 0 && (
          <span style={{
            backgroundColor: criticalCount > 0 ? '#ef4444' : colors.orange,
            color: 'white', fontSize: '11px', fontWeight: 'bold',
            padding: '3px 10px', borderRadius: '12px'
          }}>
            {criticalCount > 0 ? `${criticalCount} عاجل` : `${highCount} مهم`}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {displayTasks.map(task => (
          <div
            key={task.id}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px',
              backgroundColor: task.color + '12',
              border: `1px solid ${task.color}30`
            }}
          >
            <span
              style={{ fontSize: '22px', flexShrink: 0, cursor: task.action ? 'pointer' : 'default' }}
              onClick={() => task.action && onAction?.(task.action)}
            >{task.icon}</span>
            <div
              style={{ flex: 1, minWidth: 0, cursor: task.action ? 'pointer' : 'default' }}
              onClick={() => task.action && onAction?.(task.action)}
            >
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: colors.dark }}>{task.title}</div>
              <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>{task.subtitle}</div>
            </div>
            {task.action && (
              <span
                onClick={() => onAction?.(task.action)}
                style={{ color: task.color, fontSize: '16px', flexShrink: 0, cursor: 'pointer' }}
              >›</span>
            )}
            {task.priority === 'critical' && (
              <span style={{ backgroundColor: '#ef4444', color: 'white', fontSize: '9px', padding: '2px 6px', borderRadius: '8px', flexShrink: 0, fontWeight: 'bold' }}>عاجل</span>
            )}
            {task.id !== 'all-good' && (
              <button
                onClick={() => dismissTask(task.id)}
                title="تجاهل لهذا اليوم"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: colors.soil, fontSize: '16px', flexShrink: 0,
                  padding: '0 2px', opacity: 0.5, lineHeight: 1
                }}
              >✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayTasks;
