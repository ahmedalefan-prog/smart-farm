import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { cropsData } from '../data/cropsData';
import { colors } from '../theme/theme';
import Modal from './shared/Modal';
import Field from './shared/Field';

const CropsSection = () => {
  const { farmData, updateLand, deleteLand, addTransaction } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState('');
  const [notification, setNotification] = useState(null);
  const [editLand, setEditLand] = useState(null);
  const [pendingDeleteLandId, setPendingDeleteLandId] = useState(null);

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

  const harvestCrop = (land) => {
    const cropName = land.currentCrop;
    const updatedHistory = [...(land.cropHistory || [])];
    if (cropName) updatedHistory.push(cropName);
    updateLand(land.id, {
      currentCrop: null,
      plantingDate: null,
      expectedHarvest: null,
      cropHistory: updatedHistory
    });
    addTransaction({
      type: 'income',
      category: 'crop_sales',
      amount: 0,
      description: `حصاد ${cropName} — ${land.name} (${land.area} دونم)`,
      date: new Date().toISOString().split('T')[0],
      note: 'أدخل قيمة البيع في قسم المالية'
    });
    notify(`✅ تم تسجيل حصاد ${cropName} — راجع المالية لإدخال قيمة البيع`);
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

  const LandEditForm = ({ land }) => {
    const soilTypes = ['غرينية خفيفة', 'غرينية متوسطة', 'رملية', 'طينية', 'مختلطة'];
    const [f, setF] = useState({ name: land.name, area: String(land.area), soilType: land.soilType || '' });
    const [err, setErr] = useState('');
    const save = (e) => {
      e.preventDefault();
      const areaNum = parseFloat(f.area);
      if (!f.name.trim()) { setErr('يرجى إدخال اسم القطعة'); return; }
      if (!f.area || isNaN(areaNum) || areaNum <= 0) { setErr('يرجى إدخال مساحة صحيحة'); return; }
      updateLand(land.id, { name: f.name.trim(), area: areaNum, soilType: f.soilType });
      setEditLand(null);
      notify('✅ تم تعديل بيانات القطعة');
    };
    return (
      <form onSubmit={save}>
        {err && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>{err}</div>}
        <Field label="اسم القطعة" value={f.name} onChange={v => { setErr(''); setF(p => ({ ...p, name: v })); }} required />
        <Field label="المساحة" type="text" inputMode="decimal" unit="دونم" value={f.area} onChange={v => { setErr(''); setF(p => ({ ...p, area: v })); }} placeholder="مثال: 50" required />
        <Field label="نوع التربة" type="select" options={soilTypes} value={f.soilType} onChange={v => setF(p => ({ ...p, soilType: v }))} />
        <button type="submit" style={{ width: '100%', padding: '13px', backgroundColor: colors.green, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px' }}>
          حفظ التعديلات
        </button>
      </form>
    );
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

      {/* إدارة الأراضي */}
      {farmData.lands.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: colors.dark, marginBottom: '12px' }}>📍 الأراضي ({farmData.lands.length})</h3>
          {farmData.lands.map(land => {
            const today = new Date();
            const harvest = land.expectedHarvest ? new Date(land.expectedHarvest) : null;
            const daysLeft = harvest ? Math.ceil((harvest - today) / (1000 * 60 * 60 * 24)) : null;
            const isPendingDelete = pendingDeleteLandId === land.id;
            return (
              <div key={land.id} style={{
                backgroundColor: 'white',
                padding: '14px',
                borderRadius: '10px',
                marginBottom: '10px',
                border: `1px solid ${land.currentCrop ? colors.wheat : colors.sand}`
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong style={{ color: colors.dark, fontSize: '15px' }}>{land.name}</strong>
                  <span style={{ fontSize: '13px', color: colors.soil, marginRight: '8px' }}>
                    {land.area} دونم{land.soilType ? ` · ${land.soilType}` : ''}
                  </span>
                  {land.currentCrop ? (
                    <div style={{ fontSize: '14px', color: colors.green, marginTop: '4px' }}>
                      🌱 {land.currentCrop}
                      {daysLeft !== null && (
                        <span style={{
                          marginRight: '8px', fontSize: '13px',
                          color: daysLeft <= 7 ? colors.orange : colors.soil
                        }}>
                          · {daysLeft > 0 ? `${daysLeft} يوم للحصاد` : '⚡ حان موعد الحصاد!'}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: colors.soil, marginTop: '4px' }}>فارغة</div>
                  )}
                  {land.cropHistory?.length > 0 && (
                    <div style={{ fontSize: '12px', color: colors.soil, marginTop: '3px', opacity: 0.8 }}>
                      السابق: {land.cropHistory.slice(-3).join(' ← ')}
                    </div>
                  )}
                </div>

                {isPendingDelete ? (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { deleteLand(land.id); setPendingDeleteLandId(null); }} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', fontWeight: 'bold' }}>
                      ⚠️ تأكيد الحذف
                    </button>
                    <button onClick={() => setPendingDeleteLandId(null)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${colors.sand}`, backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {land.currentCrop && (
                      <button onClick={() => harvestCrop(land)} style={{ flex: 1, minWidth: '90px', padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: colors.lime + '30', color: colors.green, cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', fontWeight: 'bold' }}>
                        ✅ تم الحصاد
                      </button>
                    )}
                    <button onClick={() => setEditLand(land)} style={{ flex: 1, minWidth: '70px', padding: '8px', borderRadius: '8px', border: `1px solid ${colors.sand}`, backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', color: colors.dark }}>
                      ✏️ تعديل
                    </button>
                    <button onClick={() => setPendingDeleteLandId(land.id)} style={{ flex: 1, minWidth: '70px', padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#fee2e2', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', color: '#dc2626' }}>
                      🗑️ حذف
                    </button>
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

      {/* نافذة تعديل الأرض */}
      {editLand && (
        <Modal title={`تعديل: ${editLand.name}`} onClose={() => setEditLand(null)}>
          <LandEditForm land={editLand} />
        </Modal>
      )}
    </div>
  );
};

export default CropsSection;
