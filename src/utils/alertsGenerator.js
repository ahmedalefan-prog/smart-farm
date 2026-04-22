// توليد التنبيهات تلقائياً من بيانات المزرعة
export const generateAlerts = (farmData) => {
  const alerts = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. تنبيهات المخزون العلفي
  farmData.feedInventory.ingredients.forEach(ing => {
    if (ing.minThreshold && ing.quantity <= ing.minThreshold) {
      alerts.push({
        id: `feed-${ing.id}`,
        type: 'critical',
        category: 'feed',
        title: '⚠️ نقص في المخزون العلفي',
        message: `المادة: ${ing.name} - الكمية المتبقية: ${ing.quantity} ${ing.unit} (الحد الأدنى: ${ing.minThreshold} ${ing.unit})`,
        date: new Date().toISOString(),
        read: false
      });
    }
  });

  // 2. تنبيهات الأراضي - المحاصيل القريبة من الحصاد
  farmData.lands.forEach(land => {
    if (land.currentCrop && land.plantingDate && land.expectedHarvest) {
      const harvestDate = new Date(land.expectedHarvest);
      const daysUntilHarvest = Math.ceil((harvestDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntilHarvest <= 7 && daysUntilHarvest > 0) {
        alerts.push({
          id: `harvest-${land.id}`,
          type: 'warning',
          category: 'crops',
          title: '🌾 موعد حصاد قريب',
          message: `قطعة ${land.name}: ${land.currentCrop} - متبقي ${daysUntilHarvest} يوم`,
          date: new Date().toISOString(),
          read: false
        });
      }
    }
  });

  // 3. تنبيهات من السجلات اليومية - الطقس المتطرف
  const recentLogs = farmData.dailyLogs.slice(-3);
  if (recentLogs.length > 0) {
    const lastLog = recentLogs[recentLogs.length - 1];

    if (lastLog.maxTemp && lastLog.maxTemp >= 40) {
      alerts.push({
        id: `weather-hot`,
        type: 'critical',
        category: 'weather',
        title: '🔥 تحذير: موجة حر',
        message: `درجة الحرارة ${lastLog.maxTemp}°م - تأكد من توفر مياه وظل كافٍ للحيوانات`,
        date: new Date().toISOString(),
        read: false
      });
    }

    if (lastLog.minTemp && lastLog.minTemp <= 5) {
      alerts.push({
        id: `weather-cold`,
        type: 'warning',
        category: 'weather',
        title: '❄️ تنبيه: صقيع محتمل',
        message: `درجة الحرارة ${lastLog.minTemp}°م - قم بحماية المحاصيل الحساسة`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }

  // 4. تنبيهات قطعان الدواجن - العمر وقرب التسويق
  farmData.livestock.poultry.flocks.forEach(flock => {
    if (flock.ageDays >= 35 && flock.ageDays <= 42) {
      alerts.push({
        id: `poultry-market-${flock.id}`,
        type: 'info',
        category: 'livestock',
        title: '🐔 جاهزية للتسويق',
        message: `قطيع ${flock.name}: العمر ${flock.ageDays} يوم - جاهز للتسويق قريباً`,
        date: new Date().toISOString(),
        read: false
      });
    }
  });

  // 5. تنبيهات أحواض الأسماك
  farmData.livestock.fish.ponds.forEach(pond => {
    const volume = pond.length * pond.width * pond.depth;
    const maxFish = Math.floor(volume * (pond.type === 'كارب' ? 2 : 3));

    if (pond.fishCount > maxFish * 0.9) {
      alerts.push({
        id: `fish-density-${pond.id}`,
        type: 'warning',
        category: 'livestock',
        title: '🐟 كثافة أسماك مرتفعة',
        message: `حوض ${pond.name}: ${pond.fishCount} سمكة (الحد الأقصى الموصى: ${maxFish})`,
        date: new Date().toISOString(),
        read: false
      });
    }
  });

  // 6. تنبيهات الري من السجلات اليومية
  if (recentLogs.length >= 3) {
    const lastIrrigation = recentLogs.filter(l => l.irrigationDone).length;
    if (lastIrrigation < 2 && recentLogs[recentLogs.length - 1]?.maxTemp > 30) {
      alerts.push({
        id: `irrigation-reminder-${today.toDateString()}`,
        type: 'warning',
        category: 'irrigation',
        title: '💧 تذكير بالري',
        message: `لم يتم الري في ${3 - lastIrrigation} من آخر 3 أيام مع حرارة مرتفعة`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }

  // 7. تنبيهات موسم الزراعة
  const currentMonth = today.getMonth() + 1;
  const emptyLands = farmData.lands.filter(l => !l.currentCrop).length;
  if (emptyLands > 0) {
    if (currentMonth === 10 || currentMonth === 11) {
      alerts.push({
        id: `planting-season-winter`,
        type: 'info',
        category: 'crops',
        title: '🌱 موسم الزراعة الشتوية',
        message: `لديك ${emptyLands} قطع فارغة - الموسم مناسب لزراعة القمح والشعير`,
        date: new Date().toISOString(),
        read: false
      });
    }
    if (currentMonth === 3 || currentMonth === 4) {
      alerts.push({
        id: `planting-season-summer`,
        type: 'info',
        category: 'crops',
        title: '☀️ موسم الزراعة الصيفية',
        message: `لديك ${emptyLands} قطع فارغة - مناسبة لزراعة الذرة والخضروات الصيفية`,
        date: new Date().toISOString(),
        read: false
      });
    }
  }

  // 8. تنبيه صيانة دورية (كل 3 أشهر)
  const lastMaintenanceAlert = farmData.alerts.find(a => a.category === 'maintenance');
  if (!lastMaintenanceAlert || new Date(lastMaintenanceAlert.date) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
    alerts.push({
      id: `maintenance-${today.toDateString()}`,
      type: 'info',
      category: 'maintenance',
      title: '🔧 صيانة دورية',
      message: 'تذكير: فحص وصيانة مضخات الري والمرشات والمعدات الزراعية',
      date: new Date().toISOString(),
      read: false
    });
  }

  // ترتيب التنبيهات: حرجة أولاً، ثم تحذيرات، ثم معلومات
  return alerts.sort((a, b) => {
    const priority = { critical: 0, warning: 1, info: 2 };
    return priority[a.type] - priority[b.type];
  });
};

// تصفية التنبيهات غير المقروءة
export const getUnreadCount = (alerts) => {
  return alerts.filter(a => !a.read).length;
};
