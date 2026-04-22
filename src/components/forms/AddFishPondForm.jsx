import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import Field from '../shared/Field';
import { colors } from '../../theme/theme';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.length || !formData.width || !formData.depth) {
      setErr('يرجى ملء الحقول المطلوبة: الاسم والنوع والأبعاد');
      return;
    }
    setErr('');
    addFishPond({
      ...formData,
      length: Number(formData.length),
      width: Number(formData.width),
      depth: Number(formData.depth),
      fishCount: Number(formData.fishCount) || 0
    });
    onSuccess?.();
  };

  const upd = (key) => (val) => { setErr(''); setFormData(prev => ({ ...prev, [key]: val })); };

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
        <Field
          label="الطول"
          type="text"
          inputMode="decimal"
          unit="م"
          value={formData.length}
          onChange={upd('length')}
          placeholder="0"
          required
        />
        <Field
          label="العرض"
          type="text"
          inputMode="decimal"
          unit="م"
          value={formData.width}
          onChange={upd('width')}
          placeholder="0"
          required
        />
        <Field
          label="العمق"
          type="text"
          inputMode="decimal"
          unit="م"
          value={formData.depth}
          onChange={upd('depth')}
          placeholder="0"
          required
        />
      </div>
      <Field
        label="عدد الأسماك الحالي"
        type="text"
        inputMode="numeric"
        value={formData.fishCount}
        onChange={(val) => setFormData(prev => ({ ...prev, fishCount: val }))}
        placeholder="0"
        hint="اختياري - يمكن إضافته لاحقاً"
      />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: colors.sky,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        حفظ الحوض
      </button>
    </form>
  );
};

export default AddFishPondForm;
