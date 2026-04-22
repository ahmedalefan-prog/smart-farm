import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { cropsData } from '../data/cropsData';
import { colors } from '../theme/theme';
import Modal from './shared/Modal';

const CropsSection = () => {
  const { farmData, updateLand } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState('');
  const [notification, setNotification] = useState(null);

  const categories = ['الكل', 'حبوب', 'أعلاف', 'بقوليات', 'درنات'];

  const filteredCrops = cropsData.filter(crop => {
    const matchesSearch = crop.name.includes(searchTerm);
    const matchesCategory = selectedCategory === 'الكل' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handlePlantCrop = () => {
    if (!selectedLand || !selectedCrop) return;
    const land = farmData.lands.find(l => l.id === selectedLand);
    if (!land) return;

    const plantingDate = new Date().toISOString().split('T')[0];
    const daysNums = (selectedCrop.daysToHarvest || '').split('-').map(d => parseInt(d)).filter(n => !isNaN(n));
    const avgDays = daysNums.length >= 2 ? (daysNums[0] + daysNums[1]) / 2 : daysNums[0] || 60;
    const harvestDate = new Date(Date.now() + avgDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const previousCrop = land.currentCrop;
    const updatedHistory = [...(land.cropHistory || [])];
    if (previousCrop) updatedHistory.push(previousCrop);

    updateLand(selectedLand, {
      currentCrop: selectedCrop.name,
      plantingDate,
      expectedHarvest: harvestDate,
      cropHistory: updatedHistory
    });

    setShowPlantModal(false);
    setSelectedCrop(null);
    setSelectedLand('');

    if (land.cropHistory && land.cropHistory.length > 0) {
      const lastCrop = land.cropHistory[land.cropHistory.length - 1];
      if (selectedCrop.avoidAfter && selectedCrop.avoidAfter.includes(lastCrop)) {
        notify(`⚠️ تم الحفظ — لكن تجنب ${selectedCrop.name} بعد ${lastCrop} في المستقبل`, 'warning');
      } else if (selectedCrop.goodAfter && selectedCrop.goodAfter.includes(lastCrop)) {
        notify(`✅ ممتاز! ${selectedCrop.name} مناسب بعد ${lastCrop}`);
      } else {
        notify(`✅ تم زراعة ${selectedCrop.name} بنجاح`);
      }
    } else {
      notify(`✅ تم زراعة ${selectedCrop.name} بنجاح`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {notification && (
        <div style={{
          position: 'fixed', top: 'calc(64px + env(safe-area-inset-top, 0px))',
          right: '16px', left: '16px', zIndex: 2000,
          backgroundColor: notification.type === 'warning' ? colors.gold : colors.green,
          color: 'white', padding: '14px 16px', borderRadius: '10px',
          fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          {notification.msg}
        </div>
      )}
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>🌾 المحاصيل الزراعية</h2>

      {/* الأراضي المزروعة */}
      {farmData.lands.filter(l => l.currentCrop).length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: colors.dark, marginBottom: '12px' }}>📍 الأراضي المزروعة حالياً</h3>
          {farmData.lands.filter(l => l.currentCrop).map(land => {
            const today = new Date();
            const harvest = land.expectedHarvest ? new Date(land.expectedHarvest) : null;
            const daysLeft = harvest ? Math.ceil((harvest - today) / (1000 * 60 * 60 * 24)) : null;
            return (
              <div key={land.id} style={{
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                border: `1px solid ${colors.wheat}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{land.name}</strong>
                  <div style={{ fontSize: '14px', color: colors.soil }}>
                    {land.currentCrop} · {land.area} دونم
                  </div>
                </div>
                {daysLeft !== null && (
                  <div style={{
                    backgroundColor: daysLeft <= 7 ? colors.orange : colors.lime,
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '13px'
                  }}>
                    {daysLeft > 0 ? `${daysLeft} يوم للحصاد` : 'حان موعد الحصاد!'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* شريط البحث والتصفية */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 بحث عن محصول..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${colors.sand}`,
            fontSize: '16px',
            marginBottom: '10px',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        />
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: selectedCategory === cat ? colors.wheat : colors.cream,
                color: selectedCategory === cat ? 'white' : colors.dark,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* شبكة المحاصيل */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {filteredCrops.map(crop => (
          <div
            key={crop.id}
            onClick={() => setSelectedCrop(crop)}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              border: `1px solid ${colors.sand}`
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{crop.icon}</div>
            <h3 style={{ color: colors.dark, marginBottom: '4px', fontSize: '16px' }}>{crop.name}</h3>
            <div style={{ fontSize: '13px', color: colors.soil, lineHeight: '1.6' }}>
              <div>🌱 {crop.season}</div>
              <div>📅 {crop.daysToHarvest} يوم</div>
              <div>💧 {crop.waterNeeds}</div>
            </div>
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.soil }}>
          لا توجد محاصيل تطابق البحث
        </div>
      )}

      {/* نافذة تفاصيل المحصول */}
      {selectedCrop && !showPlantModal && (
        <Modal
          title={`${selectedCrop.icon} ${selectedCrop.name}`}
          onClose={() => setSelectedCrop(null)}
        >
          <div>
            <div style={{ marginBottom: '16px', lineHeight: '1.8', color: colors.dark }}>
              <p><strong>الفئة:</strong> {selectedCrop.category}</p>
              <p><strong>الموسم:</strong> {selectedCrop.season}</p>
              <p><strong>مدة الدورة:</strong> {selectedCrop.daysToHarvest} يوم</p>
              <p><strong>الإنتاجية:</strong> {selectedCrop.yieldPerHa}</p>
              <p><strong>تأثير التربة:</strong> {selectedCrop.soilEffect}</p>
            </div>

            <h4 style={{ color: colors.green, marginBottom: '8px' }}>✅ يتوافق بعد:</h4>
            <p style={{ color: colors.soil }}>{selectedCrop.goodAfter?.join(' · ') || 'جميع المحاصيل'}</p>

            <h4 style={{ color: colors.red, marginBottom: '8px', marginTop: '12px' }}>❌ تجنب بعد:</h4>
            <p style={{ color: colors.soil }}>{selectedCrop.avoidAfter?.join(' · ') || 'لا يوجد'}</p>

            {selectedCrop.challenges?.length > 0 && (
              <>
                <h4 style={{ color: colors.orange, marginBottom: '8px', marginTop: '12px' }}>⚠️ التحديات الشائعة:</h4>
                {selectedCrop.challenges.map((ch, idx) => (
                  <div key={idx} style={{
                    backgroundColor: colors.cream,
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    <strong>{ch.problem}</strong>: {ch.signs}
                    <div style={{ color: colors.green }}>الحل: {ch.solution}</div>
                  </div>
                ))}
              </>
            )}

            {farmData.lands.length > 0 && (
              <button
                onClick={() => setShowPlantModal(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: colors.green,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '20px',
                  fontFamily: 'inherit'
                }}
              >
                🌱 زراعة هذا المحصول
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* نافذة اختيار القطعة */}
      {showPlantModal && selectedCrop && (
        <Modal
          title={`زراعة ${selectedCrop.name} - اختر القطعة`}
          onClose={() => { setShowPlantModal(false); setSelectedCrop(null); setSelectedLand(''); }}
        >
          <div>
            <p style={{ color: colors.soil, marginBottom: '12px', fontSize: '14px' }}>اضغط على القطعة المراد زراعتها:</p>
            <div style={{ marginBottom: '16px' }}>
              {farmData.lands.map(land => (
                <button
                  key={land.id}
                  type="button"
                  onClick={() => setSelectedLand(land.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px',
                    marginBottom: '8px',
                    borderRadius: '10px',
                    border: `2px solid ${selectedLand === land.id ? colors.green : colors.sand}`,
                    backgroundColor: selectedLand === land.id ? colors.green + '18' : 'white',
                    textAlign: 'right',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '15px',
                    color: colors.dark
                  }}
                >
                  <strong>{land.name}</strong>
                  <span style={{ color: colors.soil, fontSize: '13px', marginRight: '8px' }}>
                    {land.area} دونم · {land.currentCrop ? `🌱 ${land.currentCrop}` : 'فارغة'}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={handlePlantCrop}
              disabled={!selectedLand}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: selectedLand ? colors.green : colors.sand,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: selectedLand ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit'
              }}
            >
              ✅ تأكيد الزراعة
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CropsSection;
