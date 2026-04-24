import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { generateAlerts } from '../utils/alertsGenerator';

const FarmContext = createContext();

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm يجب استخدامه داخل FarmProvider');
  }
  return context;
};

const STORAGE_KEY = 'smartFarmData';

const initialFarmData = {
  farm: {
    name: 'مزرعة الجزيرة الخضراء',
    totalArea: 500,
    unit: 'دونم',
    established: '2024-01-01'
  },
  lands: [],
  livestock: {
    cattle: { herds: [] },
    sheep: { herds: [] },
    poultry: { flocks: [] },
    fish: { ponds: [] }
  },
  feedInventory: {
    ingredients: [],
    producedFeed: [],
    silage: []
  },
  soilTests: [],
  dailyLogs: [],
  finances: { transactions: [] },
  alerts: []
};

export const FarmProvider = ({ children }) => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(() => {
    return localStorage.getItem('hasSeenWelcome') === 'true';
  });

  const markWelcomeSeen = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setHasSeenWelcome(true);
  };

  const [farmData, setFarmData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialFarmData;
      }
    }
    return initialFarmData;
  });

  // منع حلقة التنبيهات اللانهائية
  const isGeneratingAlerts = useRef(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(farmData));
  }, [farmData]);

  // توليد التنبيهات عند تغير البيانات الجوهرية فقط
  const landsKey = JSON.stringify(farmData.lands);
  const livestockKey = JSON.stringify(farmData.livestock);
  const feedKey = JSON.stringify(farmData.feedInventory);
  const logsKey = farmData.dailyLogs.length;

  useEffect(() => {
    if (isGeneratingAlerts.current) return;
    isGeneratingAlerts.current = true;
    const newAlerts = generateAlerts(farmData);
    setFarmData(prev => ({ ...prev, alerts: newAlerts }));
    setTimeout(() => { isGeneratingAlerts.current = false; }, 100);
  }, [landsKey, livestockKey, feedKey, logsKey]);

  // دوال إدارة الأراضي
  const addLand = (land) => {
    setFarmData(prev => ({
      ...prev,
      lands: [...prev.lands, { ...land, id: Date.now().toString() }]
    }));
  };

  const updateLand = (id, updates) => {
    setFarmData(prev => ({
      ...prev,
      lands: prev.lands.map(land => land.id === id ? { ...land, ...updates } : land)
    }));
  };

  const deleteLand = (id) => {
    setFarmData(prev => ({
      ...prev,
      lands: prev.lands.filter(land => land.id !== id)
    }));
  };

  // دوال مساعدة لتحديث وحذف الحيوانات
  const makeUpdater = (animalKey, listKey) => (id, updates) =>
    setFarmData(prev => ({
      ...prev,
      livestock: {
        ...prev.livestock,
        [animalKey]: {
          [listKey]: prev.livestock[animalKey][listKey].map(item =>
            item.id === id ? { ...item, ...updates } : item
          )
        }
      }
    }));

  const makeDeleter = (animalKey, listKey) => (id) =>
    setFarmData(prev => ({
      ...prev,
      livestock: {
        ...prev.livestock,
        [animalKey]: {
          [listKey]: prev.livestock[animalKey][listKey].filter(item => item.id !== id)
        }
      }
    }));

  const updateCattleHerd  = makeUpdater('cattle',  'herds');
  const deleteCattleHerd  = makeDeleter('cattle',  'herds');
  const updateSheepHerd   = makeUpdater('sheep',   'herds');
  const deleteSheepHerd   = makeDeleter('sheep',   'herds');
  const updatePoultryFlock = makeUpdater('poultry', 'flocks');
  const deletePoultryFlock = makeDeleter('poultry', 'flocks');
  const updateFishPond    = makeUpdater('fish',    'ponds');
  const deleteFishPond    = makeDeleter('fish',    'ponds');

  // دوال إدارة الأبقار
  const addCattleHerd = (herd) => {
    setFarmData(prev => ({
      ...prev,
      livestock: {
        ...prev.livestock,
        cattle: {
          herds: [...prev.livestock.cattle.herds, { ...herd, id: Date.now().toString() }]
        }
      }
    }));
  };

  // دوال إدارة الأغنام
  const addSheepHerd = (herd) => {
    setFarmData(prev => ({
      ...prev,
      livestock: {
        ...prev.livestock,
        sheep: {
          herds: [...prev.livestock.sheep.herds, { ...herd, id: Date.now().toString() }]
        }
      }
    }));
  };

  // دوال إدارة الدواجن
  const addPoultryFlock = (flock) => {
    setFarmData(prev => ({
      ...prev,
      livestock: {
        ...prev.livestock,
        poultry: {
          flocks: [...prev.livestock.poultry.flocks, { ...flock, id: Date.now().toString() }]
        }
      }
    }));
  };

  // دوال إدارة الأسماك
  const addFishPond = (pond) => {
    setFarmData(prev => ({
      ...prev,
      livestock: {
        ...prev.livestock,
        fish: {
          ponds: [...prev.livestock.fish.ponds, { ...pond, id: Date.now().toString() }]
        }
      }
    }));
  };

  // دوال إدارة المخزون
  const addFeedIngredient = (ingredient) => {
    setFarmData(prev => ({
      ...prev,
      feedInventory: {
        ...prev.feedInventory,
        ingredients: [...prev.feedInventory.ingredients, { ...ingredient, id: Date.now().toString() }]
      }
    }));
  };

  const updateIngredientQuantity = (id, quantity) => {
    setFarmData(prev => ({
      ...prev,
      feedInventory: {
        ...prev.feedInventory,
        ingredients: prev.feedInventory.ingredients.map(ing =>
          ing.id === id ? { ...ing, quantity } : ing
        )
      }
    }));
  };

  const updateFeedIngredient = (id, updates) => {
    setFarmData(prev => ({
      ...prev,
      feedInventory: {
        ...prev.feedInventory,
        ingredients: prev.feedInventory.ingredients.map(ing =>
          ing.id === id ? { ...ing, ...updates } : ing
        )
      }
    }));
  };

  const deleteFeedIngredient = (id) => {
    setFarmData(prev => ({
      ...prev,
      feedInventory: {
        ...prev.feedInventory,
        ingredients: prev.feedInventory.ingredients.filter(ing => ing.id !== id)
      }
    }));
  };

  // دوال تحاليل التربة
  const addSoilTest = (test) => {
    setFarmData(prev => ({
      ...prev,
      soilTests: [...prev.soilTests, { ...test, id: Date.now().toString() }]
    }));
  };

  // دوال السجلات اليومية
  const addDailyLog = (log) => {
    setFarmData(prev => ({
      ...prev,
      dailyLogs: [...prev.dailyLogs, { ...log, id: Date.now().toString(), date: new Date().toISOString() }]
    }));
  };

  // دوال المالية
  const addTransaction = (tx) => {
    setFarmData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        transactions: [
          ...(prev.finances?.transactions || []),
          { ...tx, id: Date.now().toString(), createdAt: new Date().toISOString() }
        ]
      }
    }));
  };

  const deleteTransaction = (id) => {
    setFarmData(prev => ({
      ...prev,
      finances: {
        ...prev.finances,
        transactions: (prev.finances?.transactions || []).filter(t => t.id !== id)
      }
    }));
  };

  // دالة إعادة تعيين كامل (للاستيراد)
  const importFullData = (data) => {
    setFarmData({ ...initialFarmData, ...data, finances: data.finances || { transactions: [] } });
  };

  // دوال التنبيهات
  const markAlertAsRead = (alertId) => {
    setFarmData(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    }));
  };

  const dismissAlert = (alertId) => {
    setFarmData(prev => ({
      ...prev,
      alerts: prev.alerts.filter(alert => alert.id !== alertId)
    }));
  };

  const clearAllAlerts = () => {
    setFarmData(prev => ({ ...prev, alerts: [] }));
  };

  const value = {
    farmData,
    setFarmData,
    addLand,
    updateLand,
    deleteLand,
    addCattleHerd,
    updateCattleHerd,
    deleteCattleHerd,
    addSheepHerd,
    updateSheepHerd,
    deleteSheepHerd,
    addPoultryFlock,
    updatePoultryFlock,
    deletePoultryFlock,
    addFishPond,
    updateFishPond,
    deleteFishPond,
    addFeedIngredient,
    updateIngredientQuantity,
    updateFeedIngredient,
    deleteFeedIngredient,
    addSoilTest,
    addDailyLog,
    addTransaction,
    deleteTransaction,
    importFullData,
    markAlertAsRead,
    dismissAlert,
    clearAllAlerts,
    hasSeenWelcome,
    markWelcomeSeen
  };

  return (
    <FarmContext.Provider value={value}>
      {children}
    </FarmContext.Provider>
  );
};
