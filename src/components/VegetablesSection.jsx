import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { vegetablesData } from '../data/cropsData';
import { colors } from '../theme/theme';
import Modal from './shared/Modal';

const ProfitabilityStars = ({ count }) => (
  <span>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= count ? colors.gold : colors.sand }}>★</span>
    ))}
  </span>
);

const VegetablesSection = () => {
  const { farmData, updateLand } = useFarm();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('الكل');
  const [selectedVeg, setSelectedVeg] = useState(null);
  const [showPlantModal, setShowPlantModal] = useState(false);
  const [selectedLand, setSelectedLand] = useState('');

  const seasons = ['الكل', 'صيفي', 'شتوي'];

  const filtered = vegetablesData.filter(veg => {
    const matchesSearch = veg.name.includes(searchTerm);
    const matchesSeason = selectedSeason === 'الكل' || veg.season === selectedSeason;
    return matchesSearch && matchesSeason;
  });

  // الشهر الحالي
  const currentMonth = new Date().getMonth() + 1;

  const isPlantingSeason = (veg) => veg.plantingMonths?.includes(currentMonth);

  const handlePlantVeg = () => {
    if (selectedLand && selectedVeg) {
      const plantingDate = new Date().toISOString().split('T')[0];
      const daysRange = selectedVeg.daysToHarvest.split('-').map(d => parseInt(d));
      const avgDays = daysRange.length === 2 ? (daysRange[0] + daysRange[1]) / 2 : parseInt(daysRange[0]);
      const harvestDate = new Date(Date.now() + avgDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      updateLand(selectedLand, {
        currentCrop: selectedVeg.name,
        plantingDate,
        expectedHarvest: harvestDate
      });

      alert(`تم زراعة ${selectedVeg.name} في القطعة المحددة`);
      setShowPlantModal(false);
      setSelectedVeg(null);
      setSelectedLand('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>🥬 الخضروات</h2>

      {/* البحث والتصفية */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 بحث عن خضروات..."
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
        <div style={{ display: 'flex', gap: '8px' }}>
          {seasons.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: selectedSeason === s ? colors.teal : colors.cream,
                color: selectedSeason === s ? 'white' : colors.dark,
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* بطاقة الشهر الحالي */}
      <div style={{
        backgroundColor: colors.teal + '15',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: `1px solid ${colors.teal}`,
        fontSize: '14px',
        color: colors.dark
      }}>
        🗓️ الخضروات المناسبة للزراعة هذا الشهر:&nbsp;
        <strong>
          {vegetablesData.filter(v => isPlantingSeason(v)).map(v => v.name).join(' · ') || 'لا يوجد حالياً'}
        </strong>
      </div>

      {/* شبكة الخضروات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {filtered.map(veg => (
          <div
            key={veg.id}
            onClick={() => setSelectedVeg(veg)}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '16px',
              cursor: 'pointer',
              border: `2px solid ${isPlantingSeason(veg) ? colors.teal : colors.sand}`,
              position: 'relative'
            }}
          >
            {isPlantingSeason(veg) && (
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                backgroundColor: colors.teal,
                color: 'white',
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                موسمها الآن
              </div>
            )}
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{veg.icon}</div>
            <h3 style={{ color: colors.dark, marginBottom: '4px', fontSize: '16px' }}>{veg.name}</h3>
            <div style={{ fontSize: '13px', color: colors.soil, lineHeight: '1.6' }}>
              <div>🌱 {veg.season}</div>
              <div>📅 {veg.daysToHarvest} يوم</div>
              <div>💰 <ProfitabilityStars count={veg.profitability} /></div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: colors.soil }}>
          لا توجد خضروات تطابق البحث
        </div>
      )}

      {/* تفاصيل الخضروات */}
      {selectedVeg && !showPlantModal && (
        <Modal
          title={`${selectedVeg.icon} ${selectedVeg.name}`}
          onClose={() => setSelectedVeg(null)}
        >
          <div>
            <div style={{ lineHeight: '1.8', color: colors.dark, marginBottom: '16px' }}>
              <p><strong>الموسم:</strong> {selectedVeg.season}</p>
              <p><strong>مدة الدورة:</strong> {selectedVeg.daysToHarvest} يوم</p>
              <p><strong>الإنتاجية:</strong> {selectedVeg.yieldPerDonum}</p>
              <p><strong>الربحية:</strong> <ProfitabilityStars count={selectedVeg.profitability} /></p>
              <p><strong>الملاءمة:</strong> {selectedVeg.suitability} - {selectedVeg.suitabilityReason}</p>
            </div>

            {selectedVeg.bestVarieties?.length > 0 && (
              <>
                <h4 style={{ color: colors.teal, marginBottom: '8px' }}>🏆 أفضل الأصناف:</h4>
                <p style={{ color: colors.soil }}>{selectedVeg.bestVarieties.join(' · ')}</p>
              </>
            )}

            {selectedVeg.challenges?.length > 0 && (
              <>
                <h4 style={{ color: colors.orange, marginBottom: '8px', marginTop: '12px' }}>⚠️ التحديات الشائعة:</h4>
                {selectedVeg.challenges.map((ch, idx) => (
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

            {selectedVeg.localTips && (
              <div style={{
                backgroundColor: colors.gold + '20',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '12px',
                fontSize: '14px',
                color: colors.dark
              }}>
                💡 <strong>نصيحة محلية:</strong> {selectedVeg.localTips}
              </div>
            )}

            {farmData.lands.length > 0 && (
              <button
                onClick={() => setShowPlantModal(true)}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: colors.teal,
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
                🌱 زراعة في قطعة أرض
              </button>
            )}
          </div>
        </Modal>
      )}

      {/* نافذة اختيار القطعة */}
      {showPlantModal && selectedVeg && (
        <Modal
          title={`زراعة ${selectedVeg.name} - اختر القطعة`}
          onClose={() => { setShowPlantModal(false); setSelectedVeg(null); }}
        >
          <div>
            <select
              value={selectedLand}
              onChange={(e) => setSelectedLand(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: `1px solid ${colors.sand}`,
                fontSize: '16px',
                marginBottom: '20px',
                fontFamily: 'inherit'
              }}
            >
              <option value="">-- اختر القطعة --</option>
              {farmData.lands.map(land => (
                <option key={land.id} value={land.id}>
                  {land.name} ({land.area} دونم) - {land.currentCrop || 'فارغة'}
                </option>
              ))}
            </select>
            <button
              onClick={handlePlantVeg}
              disabled={!selectedLand}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: selectedLand ? colors.teal : colors.sand,
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

export default VegetablesSection;
