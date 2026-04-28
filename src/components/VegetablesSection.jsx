import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { vegetablesData, fruitsData } from '../data/cropsData';
import { colors } from '../theme/theme';
import Modal from './shared/Modal';

const allData = [...vegetablesData, ...fruitsData];

const ProfitabilityStars = ({ count }) => (
  <span>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= count ? colors.gold : colors.sand }}>★</span>
    ))}
  </span>
);

const VegetablesSection = () => {
  const { farmData, updateLand } = useFarm();
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedSeason, setSelectedSeason]     = useState('الكل');
  const [selectedItem, setSelectedItem]   = useState(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [selectedLand, setSelectedLand]   = useState('');
  const [notification, setNotification]   = useState(null);

  const categories = ['الكل', 'خضروات', 'بقوليات', 'درنات', 'فواكة'];
  const seasons     = ['الكل', 'صيفي', 'شتوي', 'دائم'];

  const catColors = {
    'خضروات': colors.teal,
    'بقوليات': colors.lime,
    'درنات':   colors.wheat,
    'فواكة':   colors.orange
  };

  const filtered = allData.filter(item => {
    const matchSearch   = item.name.includes(searchTerm);
    const matchCategory = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchSeason   = selectedSeason === 'الكل' || item.season === selectedSeason;
    return matchSearch && matchCategory && matchSeason;
  });

  const currentMonth = new Date().getMonth() + 1;
  const isPlantingSeason = (item) => item.plantingMonths?.includes(currentMonth);
  const isFruit = (item) => item.category === 'فواكة';

  const notify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handlePlantItem = () => {
    if (!selectedLand || !selectedItem) return;
    const plantingDate = new Date().toISOString().split('T')[0];
    let harvestDate = null;
    if (!isFruit(selectedItem)) {
      const daysNums = (selectedItem.daysToHarvest || '').split('-').map(d => parseInt(d)).filter(n => !isNaN(n));
      const avgDays = daysNums.length >= 2 ? (daysNums[0] + daysNums[1]) / 2 : daysNums[0] || 60;
      harvestDate = new Date(Date.now() + avgDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }
    updateLand(selectedLand, {
      currentCrop:      selectedItem.name,
      plantingDate,
      expectedHarvest:  harvestDate || null
    });
    const itemName = selectedItem.name;
    setShowPlantModal(false);
    setSelectedItem(null);
    setSelectedLand('');
    notify(`✅ تم تسجيل زراعة ${itemName} بنجاح`);
  };

  const currentSeasonItems = allData.filter(v => isPlantingSeason(v) && !isFruit(v));

  return (
    <div style={{ padding: '20px' }}>
      {notification && (
        <div style={{
          position: 'fixed', top: 'calc(64px + env(safe-area-inset-top, 0px))',
          right: '16px', left: '16px', zIndex: 2000,
          backgroundColor: notification.type === 'warning' ? colors.gold : colors.teal,
          color: 'white', padding: '14px 16px', borderRadius: '10px',
          fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }}>
          {notification.msg}
        </div>
      )}

      <h2 style={{ color: colors.dark, marginBottom: '16px' }}>🌿 المحاصيل والفواكه</h2>

      {/* بحث */}
      <input
        type="text"
        placeholder="🔍 بحث..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%', padding: '12px', borderRadius: '8px',
          border: `1px solid ${colors.sand}`, fontSize: '16px',
          marginBottom: '10px', fontFamily: 'inherit', boxSizing: 'border-box'
        }}
      />

      {/* تصفية الفئة */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '7px 14px', borderRadius: '20px', border: 'none',
              whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px',
              backgroundColor: selectedCategory === cat
                ? (catColors[cat] || colors.green)
                : colors.cream,
              color: selectedCategory === cat ? 'white' : colors.dark,
              fontWeight: selectedCategory === cat ? 'bold' : 'normal'
            }}
          >
            {cat === 'الكل' ? '🌿 الكل' : cat === 'خضروات' ? '🥬 خضروات' : cat === 'بقوليات' ? '🫘 بقوليات' : cat === 'درنات' ? '🥔 درنات' : '🍊 فواكة وأشجار'}
          </button>
        ))}
      </div>

      {/* تصفية الموسم */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {seasons.map(s => (
          <button
            key={s}
            onClick={() => setSelectedSeason(s)}
            style={{
              padding: '7px 14px', borderRadius: '20px', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px',
              backgroundColor: selectedSeason === s ? colors.teal : colors.cream,
              color: selectedSeason === s ? 'white' : colors.dark
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* بطاقة الشهر الحالي */}
      {currentSeasonItems.length > 0 && (
        <div style={{
          backgroundColor: colors.teal + '15', padding: '12px 16px',
          borderRadius: '8px', marginBottom: '16px',
          border: `1px solid ${colors.teal}`, fontSize: '14px', color: colors.dark
        }}>
          🗓️ مناسب للزراعة هذا الشهر:&nbsp;
          <strong>{currentSeasonItems.map(v => v.name).join(' · ')}</strong>
        </div>
      )}

      {/* الشبكة */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            style={{
              backgroundColor: 'white', borderRadius: '12px', padding: '14px',
              cursor: 'pointer', position: 'relative',
              border: `2px solid ${isPlantingSeason(item) && !isFruit(item) ? colors.teal : colors.sand}`
            }}
          >
            {isPlantingSeason(item) && !isFruit(item) && (
              <div style={{
                position: 'absolute', top: '8px', left: '8px',
                backgroundColor: colors.teal, color: 'white',
                fontSize: '10px', padding: '2px 8px', borderRadius: '10px'
              }}>موسمها الآن</div>
            )}
            {isFruit(item) && (
              <div style={{
                position: 'absolute', top: '8px', left: '8px',
                backgroundColor: colors.orange, color: 'white',
                fontSize: '10px', padding: '2px 8px', borderRadius: '10px'
              }}>{item.type}</div>
            )}
            <div style={{ fontSize: '30px', marginBottom: '6px' }}>{item.icon}</div>
            <h3 style={{ color: colors.dark, marginBottom: '4px', fontSize: '15px' }}>{item.name}</h3>
            <div style={{ fontSize: '12px', color: colors.soil, lineHeight: '1.7' }}>
              <div>🌱 {item.season}</div>
              {isFruit(item)
                ? <div>🌳 إنتاج بعد {item.yearsToProduction}</div>
                : <div>📅 {item.daysToHarvest} يوم</div>
              }
              <div>💰 <ProfitabilityStars count={item.profitability} /></div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.soil }}>
          لا توجد نتائج تطابق البحث
        </div>
      )}

      {/* نافذة التفاصيل */}
      {selectedItem && !showPlantModal && (
        <Modal
          title={`${selectedItem.icon} ${selectedItem.name}`}
          onClose={() => setSelectedItem(null)}
        >
          <div>
            <div style={{ lineHeight: '1.9', color: colors.dark, marginBottom: '16px' }}>
              <p><strong>الفئة:</strong> {selectedItem.category}</p>
              <p><strong>الموسم:</strong> {selectedItem.season}</p>
              {isFruit(selectedItem) ? (
                <>
                  <p><strong>نوع الشجرة:</strong> {selectedItem.type}</p>
                  <p><strong>سنوات الإنتاج:</strong> {selectedItem.yearsToProduction}</p>
                  <p><strong>عمر الشجرة:</strong> {selectedItem.lifespan}</p>
                  <p><strong>مسافة الزراعة:</strong> {selectedItem.spacing}</p>
                </>
              ) : (
                <p><strong>مدة الدورة:</strong> {selectedItem.daysToHarvest} يوم</p>
              )}
              <p><strong>الإنتاجية:</strong> {selectedItem.yieldPerHa}</p>
              <p><strong>الربحية:</strong> <ProfitabilityStars count={selectedItem.profitability} /></p>
              <p><strong>الملاءمة:</strong> {selectedItem.suitability} — {selectedItem.suitabilityReason}</p>
              <p><strong>احتياج المياه:</strong> {selectedItem.waterNeeds}</p>
            </div>

            {selectedItem.bestVarieties?.length > 0 && (
              <>
                <h4 style={{ color: colors.teal, marginBottom: '8px' }}>🏆 أفضل الأصناف:</h4>
                <p style={{ color: colors.soil, marginBottom: '12px' }}>{selectedItem.bestVarieties.join(' · ')}</p>
              </>
            )}

            {selectedItem.stages?.length > 0 && (
              <>
                <h4 style={{ color: colors.green, marginBottom: '8px', marginTop: '12px' }}>📈 مراحل النمو:</h4>
                {selectedItem.stages.map((st, i) => (
                  <div key={i} style={{
                    backgroundColor: colors.cream, borderRadius: '8px',
                    padding: '8px 12px', marginBottom: '6px', fontSize: '13px'
                  }}>
                    <strong>{st.name}</strong> ({st.days}) — {st.details}
                  </div>
                ))}
              </>
            )}

            {selectedItem.fertilization?.length > 0 && (
              <>
                <h4 style={{ color: colors.soil, marginBottom: '8px', marginTop: '12px' }}>🧪 التسميد:</h4>
                {selectedItem.fertilization.map((f, i) => (
                  <div key={i} style={{ fontSize: '13px', color: colors.dark, marginBottom: '4px' }}>
                    • {f.type}: <strong>{f.amount}</strong> — {f.timing}
                  </div>
                ))}
              </>
            )}

            {selectedItem.challenges?.length > 0 && (
              <>
                <h4 style={{ color: colors.orange, marginBottom: '8px', marginTop: '12px' }}>⚠️ التحديات الشائعة:</h4>
                {selectedItem.challenges.map((ch, i) => (
                  <div key={i} style={{
                    backgroundColor: colors.cream, padding: '10px', borderRadius: '8px',
                    marginBottom: '8px', fontSize: '13px'
                  }}>
                    <strong>{ch.problem}</strong>: {ch.signs}
                    <div style={{ color: colors.green }}>الحل: {ch.solution}</div>
                    {ch.prevention && <div style={{ color: colors.sky }}>الوقاية: {ch.prevention}</div>}
                  </div>
                ))}
              </>
            )}

            {selectedItem.localTips && (
              <div style={{
                backgroundColor: colors.gold + '20', padding: '12px', borderRadius: '8px',
                marginTop: '12px', fontSize: '14px', color: colors.dark
              }}>
                💡 <strong>نصيحة محلية:</strong> {selectedItem.localTips}
              </div>
            )}

            {farmData.lands.length > 0 && (
              <button
                onClick={() => setShowPlantModal(true)}
                style={{
                  width: '100%', padding: '14px',
                  backgroundColor: colors.teal, color: 'white', border: 'none',
                  borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
                  cursor: 'pointer', marginTop: '20px', fontFamily: 'inherit'
                }}
              >
                🌱 تسجيل في قطعة أرض
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* نافذة اختيار القطعة */}
      {showPlantModal && selectedItem && (
        <Modal
          title={`زراعة ${selectedItem.name} — اختر القطعة`}
          onClose={() => { setShowPlantModal(false); setSelectedItem(null); setSelectedLand(''); }}
        >
          <div>
            <p style={{ color: colors.soil, marginBottom: '12px', fontSize: '14px' }}>
              اضغط على القطعة المراد تسجيلها:
            </p>
            <div style={{ marginBottom: '16px' }}>
              {farmData.lands.map(land => (
                <button
                  key={land.id}
                  type="button"
                  onClick={() => setSelectedLand(land.id)}
                  style={{
                    display: 'block', width: '100%', padding: '14px', marginBottom: '8px',
                    borderRadius: '10px',
                    border: `2px solid ${selectedLand === land.id ? colors.teal : colors.sand}`,
                    backgroundColor: selectedLand === land.id ? colors.teal + '18' : 'white',
                    textAlign: 'right', cursor: 'pointer',
                    fontFamily: 'inherit', fontSize: '15px', color: colors.dark
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
              onClick={handlePlantItem}
              disabled={!selectedLand}
              style={{
                width: '100%', padding: '14px',
                backgroundColor: selectedLand ? colors.teal : colors.sand,
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '16px', fontWeight: 'bold',
                cursor: selectedLand ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit'
              }}
            >
              ✅ تأكيد التسجيل
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VegetablesSection;
