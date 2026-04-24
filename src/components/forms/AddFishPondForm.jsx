import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import Field from '../shared/Field';
import { colors } from '../../theme/theme';

// كثافات التخزين الموصى بها (سمكة/م³) حسب نوع السمك
const DENSITY = {
  'بلطي نيلي': {
    min:         1.5,
    recommended: 3,
    max:         6,
    note:        'الكثافة المكثفة تتطلب تهوية ميكانيكية مستمرة'
  },
  'كارب': {
    min:         1,
    recommended: 2,
    max:         4,
    note:        'الكارب حساس للأوكسجين — لا تتجاوز 2 سمكة/م³ بدون تهوية'
  },
  'مختلط': {
    min:         1,
    recommended: 2.5,
    max:         5,
    note:        'للأنواع المختلطة يُفضل كثافة أقل لتقليل التنافس على الغذاء'
  }
};

const AddFishPondForm = ({ onSuccess }) => {
  const { addFishPond } = useFarm();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    length: '',
    width: '',
    depth: '',
    fishCount: ''
  });
  const [err, setErr] = useState('');

  const types = ['بلطي نيلي', 'كارب', 'مختلط'];
  const upd = (key) => (val) => { setErr(''); setFormData(prev => ({ ...prev, [key]: val })); };

  // حساب الطاقة الاستيعابية
  const L = Number(formData.length) || 0;
  const W = Number(formData.width)  || 0;
  const D = Number(formData.depth)  || 0;
  const volume = L * W * D;
  const density = DENSITY[formData.type];
  const showCapacity = volume > 0 && density;

  const minFish = showCapacity ? Math.floor(volume * density.min)         : 0;
  const recFish = showCapacity ? Math.floor(volume * density.recommended) : 0;
  const maxFish = showCapacity ? Math.floor(volume * density.max)         : 0;
  const currentFish = Number(formData.fishCount) || 0;

  const getStatusColor = () => {
    if (!showCapacity || currentFish === 0) return null;
    if (currentFish <= recFish) return { color: colors.green,  icon: '✅', label: 'ضمن الحد الموصى به' };
    if (currentFish <= maxFish) return { color: colors.orange, icon: '⚠️', label: 'كثافة عالية — تحتاج تهوية' };
    return                            { color: '#ef4444',      icon: '🔴', label: 'تجاوز الحد الأقصى' };
  };
  const status = getStatusColor();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.length || !formData.width || !formData.depth) {
      setErr('يرجى ملء الحقول المطلوبة: الاسم والنوع والأبعاد');
      return;
    }
    setErr('');
    addFishPond({
      ...formData,
      length:    Number(formData.length),
      width:     Number(formData.width),
      depth:     Number(formData.depth),
      fishCount: Number(formData.fishCount) || 0
    });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      {err && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>
          {err}
        </div>
      )}

      <Field
        label="اسم الحوض"
        value={formData.name}
        onChange={upd('name')}
        placeholder="مثال: حوض رقم 1"
        required
      />
      <Field
        label="نوع السمك"
        type="select"
        options={types}
        value={formData.type}
        onChange={upd('type')}
        required
      />

      <div style={{ display: 'flex', gap: '10px' }}>
        <Field label="الطول" type="text" inputMode="decimal" unit="م" value={formData.length} onChange={upd('length')} placeholder="0" required />
        <Field label="العرض" type="text" inputMode="decimal" unit="م" value={formData.width}  onChange={upd('width')}  placeholder="0" required />
        <Field label="العمق" type="text" inputMode="decimal" unit="م" value={formData.depth}  onChange={upd('depth')}  placeholder="0" required />
      </div>

      {/* بطاقة الطاقة الاستيعابية */}
      {showCapacity && (
        <div style={{
          backgroundColor: colors.sky + '15',
          border: `1px solid ${colors.sky}40`,
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <strong style={{ color: colors.sky, fontSize: '14px' }}>🐟 الطاقة الاستيعابية</strong>
            <span style={{ backgroundColor: colors.sky + '25', color: colors.sky, fontSize: '12px', padding: '3px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
              {volume.toFixed(1)} م³
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
            <div style={{ textAlign: 'center', backgroundColor: 'white', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: colors.soil, marginBottom: '4px' }}>كثافة خفيفة</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.teal }}>{minFish}</div>
              <div style={{ fontSize: '10px', color: colors.soil }}>سمكة</div>
              <div style={{ fontSize: '10px', color: colors.soil, marginTop: '2px' }}>{density.min} /م³</div>
            </div>
            <div style={{ textAlign: 'center', backgroundColor: colors.green + '20', padding: '10px 6px', borderRadius: '8px', border: `2px solid ${colors.green}40` }}>
              <div style={{ fontSize: '11px', color: colors.green, marginBottom: '4px', fontWeight: 'bold' }}>موصى به ⭐</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.green }}>{recFish}</div>
              <div style={{ fontSize: '10px', color: colors.soil }}>سمكة</div>
              <div style={{ fontSize: '10px', color: colors.soil, marginTop: '2px' }}>{density.recommended} /م³</div>
            </div>
            <div style={{ textAlign: 'center', backgroundColor: colors.orange + '15', padding: '10px 6px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', color: colors.orange, marginBottom: '4px' }}>أقصى حد</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.orange }}>{maxFish}</div>
              <div style={{ fontSize: '10px', color: colors.soil }}>سمكة</div>
              <div style={{ fontSize: '10px', color: colors.soil, marginTop: '2px' }}>{density.max} /م³</div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: colors.soil, backgroundColor: 'white', padding: '8px 10px', borderRadius: '6px' }}>
            💡 {density.note}
          </div>
        </div>
      )}

      <Field
        label="عدد الأسماك الحالي"
        type="text"
        inputMode="numeric"
        value={formData.fishCount}
        onChange={upd('fishCount')}
        placeholder={showCapacity ? `الموصى به: ${recFish}` : '0'}
        hint={showCapacity ? `موصى به ${recFish} — أقصى حد ${maxFish}` : 'أدخل الأبعاد ونوع السمك أولاً'}
      />

      {/* مؤشر حالة الكثافة */}
      {status && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 12px', borderRadius: '8px', marginBottom: '8px',
          backgroundColor: status.color + '15',
          border: `1px solid ${status.color}40`,
          fontSize: '13px', color: status.color, fontWeight: 'bold'
        }}>
          <span>{status.icon}</span>
          <span>{status.label} ({currentFish} من أصل {recFish} موصى به)</span>
        </div>
      )}

      <button
        type="submit"
        style={{
          width: '100%', padding: '14px',
          backgroundColor: colors.sky, color: 'white',
          border: 'none', borderRadius: '8px',
          fontSize: '16px', fontWeight: 'bold',
          cursor: 'pointer', marginTop: '8px',
          fontFamily: 'inherit'
        }}
      >
        حفظ الحوض
      </button>
    </form>
  );
};

export default AddFishPondForm;
