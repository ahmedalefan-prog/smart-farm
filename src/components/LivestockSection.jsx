import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';

const LivestockSection = () => {
  const { farmData } = useFarm();
  const [activeTab, setActiveTab] = useState('cattle');

  const totalCattle = farmData.livestock.cattle.herds.reduce((sum, h) => sum + (h.count || 0), 0);
  const totalSheep = farmData.livestock.sheep.herds.reduce((sum, h) => sum + (h.count || 0), 0);
  const totalPoultry = farmData.livestock.poultry.flocks.reduce((sum, f) => sum + (f.count || 0), 0);
  const totalFish = farmData.livestock.fish.ponds.reduce((sum, p) => sum + (p.fishCount || 0), 0);

  const tabs = [
    { id: 'cattle', name: '🐄 أبقار', count: totalCattle, color: colors.soil },
    { id: 'sheep', name: '🐑 أغنام', count: totalSheep, color: colors.green },
    { id: 'poultry', name: '🐔 دواجن', count: totalPoultry, color: colors.orange },
    { id: 'fish', name: '🐟 أسماك', count: totalFish, color: colors.sky }
  ];

  const EmptyState = ({ message }) => (
    <div style={{ textAlign: 'center', padding: '40px', color: colors.soil }}>
      <p style={{ fontSize: '48px', marginBottom: '10px' }}>
        {activeTab === 'cattle' ? '🐄' : activeTab === 'sheep' ? '🐑' : activeTab === 'poultry' ? '🐔' : '🐟'}
      </p>
      <p>{message}</p>
      <p style={{ fontSize: '14px', marginTop: '8px' }}>اضغط على زر ➕ لإضافة</p>
    </div>
  );

  const HerdCard = ({ herd, fields }) => (
    <div style={{
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '12px',
      border: `1px solid ${colors.sand}`
    }}>
      <h3 style={{ color: colors.dark, marginBottom: '10px' }}>{herd.name}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' }}>
        {fields.map(({ label, value }) => (
          <div key={label}>
            <span style={{ color: colors.soil }}>{label}:</span>{' '}
            <strong>{value || '-'}</strong>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>🐄 الثروة الحيوانية</h2>

      {/* ملخص سريع */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <div key={tab.id} style={{
            backgroundColor: tab.color,
            padding: '12px 8px',
            borderRadius: '10px',
            color: 'white',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{tab.count}</div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>{tab.name.split(' ')[1]}</div>
          </div>
        ))}
      </div>

      {/* تبويبات */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? tab.color : colors.cream,
              color: activeTab === tab.id ? 'white' : colors.dark,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit'
            }}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* الأبقار */}
      {activeTab === 'cattle' && (
        farmData.livestock.cattle.herds.length === 0
          ? <EmptyState message="لا توجد قطعان أبقار" />
          : farmData.livestock.cattle.herds.map(herd => (
            <HerdCard key={herd.id} herd={herd} fields={[
              { label: 'النوع', value: herd.type },
              { label: 'العدد', value: `${herd.count} رأس` },
              { label: 'متوسط الوزن', value: herd.avgWeight ? `${herd.avgWeight} كغ` : null },
              { label: 'الحظيرة', value: herd.housing }
            ]} />
          ))
      )}

      {/* الأغنام */}
      {activeTab === 'sheep' && (
        farmData.livestock.sheep.herds.length === 0
          ? <EmptyState message="لا توجد قطعان أغنام" />
          : farmData.livestock.sheep.herds.map(herd => (
            <HerdCard key={herd.id} herd={herd} fields={[
              { label: 'النوع', value: herd.type },
              { label: 'العدد', value: `${herd.count} رأس` },
              { label: 'متوسط الوزن', value: herd.avgWeight ? `${herd.avgWeight} كغ` : null },
              { label: 'الحظيرة', value: herd.housing }
            ]} />
          ))
      )}

      {/* الدواجن */}
      {activeTab === 'poultry' && (
        farmData.livestock.poultry.flocks.length === 0
          ? <EmptyState message="لا توجد قطعان دواجن" />
          : farmData.livestock.poultry.flocks.map(flock => {
            const isReady = flock.ageDays >= 35 && flock.ageDays <= 42;
            return (
              <div key={flock.id} style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '12px',
                border: `2px solid ${isReady ? colors.orange : colors.sand}`
              }}>
                {isReady && (
                  <div style={{
                    backgroundColor: colors.orange,
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    marginBottom: '10px',
                    display: 'inline-block'
                  }}>
                    🐔 جاهز للتسويق
                  </div>
                )}
                <h3 style={{ color: colors.dark, marginBottom: '10px' }}>{flock.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px' }}>
                  <div><span style={{ color: colors.soil }}>السلالة:</span> <strong>{flock.breed || '-'}</strong></div>
                  <div><span style={{ color: colors.soil }}>العدد:</span> <strong>{flock.count} طير</strong></div>
                  <div><span style={{ color: colors.soil }}>العمر:</span> <strong>{flock.ageDays} يوم</strong></div>
                  <div>
                    <div style={{
                      height: '6px',
                      backgroundColor: colors.sand,
                      borderRadius: '3px',
                      marginTop: '8px'
                    }}>
                      <div style={{
                        width: `${Math.min(100, (flock.ageDays / 42) * 100)}%`,
                        height: '100%',
                        backgroundColor: isReady ? colors.orange : colors.lime,
                        borderRadius: '3px'
                      }}></div>
                    </div>
                    <small style={{ color: colors.soil }}>{Math.min(100, Math.round((flock.ageDays / 42) * 100))}% من التسويق</small>
                  </div>
                </div>
              </div>
            );
          })
      )}

      {/* الأسماك */}
      {activeTab === 'fish' && (
        farmData.livestock.fish.ponds.length === 0
          ? <EmptyState message="لا توجد أحواض أسماك" />
          : farmData.livestock.fish.ponds.map(pond => {
            const volume = pond.length * pond.width * pond.depth;
            const maxFish = Math.floor(volume * (pond.type === 'كارب' ? 2 : 3));
            const density = pond.fishCount > 0 ? Math.round((pond.fishCount / maxFish) * 100) : 0;
            return (
              <div key={pond.id} style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '12px',
                border: `2px solid ${density > 90 ? colors.orange : colors.sand}`
              }}>
                <h3 style={{ color: colors.dark, marginBottom: '10px' }}>{pond.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
                  <div><span style={{ color: colors.soil }}>نوع السمك:</span> <strong>{pond.type}</strong></div>
                  <div><span style={{ color: colors.soil }}>الأسماك:</span> <strong>{pond.fishCount}</strong></div>
                  <div><span style={{ color: colors.soil }}>الأبعاد:</span> <strong>{pond.length}×{pond.width}×{pond.depth} م</strong></div>
                  <div><span style={{ color: colors.soil }}>الحجم:</span> <strong>{volume} م³</strong></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: colors.soil }}>كثافة الأسماك</span>
                    <span style={{ color: density > 90 ? colors.orange : colors.green }}>
                      {density}% (أقصى: {maxFish})
                    </span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: colors.sand, borderRadius: '3px' }}>
                    <div style={{
                      width: `${Math.min(100, density)}%`,
                      height: '100%',
                      backgroundColor: density > 90 ? colors.orange : colors.sky,
                      borderRadius: '3px'
                    }}></div>
                  </div>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default LivestockSection;
