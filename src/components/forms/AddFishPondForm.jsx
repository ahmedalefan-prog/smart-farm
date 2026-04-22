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

  const types = ['بلطي نيلي', 'كارب', 'مختلط'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.length || !formData.width || !formData.depth) {
      alert('جميع الحقول المطلوبة مطلوبة');
      return;
    }
    addFishPond({
      ...formData,
      length: Number(formData.length),
      width: Number(formData.width),
      depth: Number(formData.depth),
      fishCount: Number(formData.fishCount) || 0
    });
    alert('تمت إضافة الحوض بنجاح');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="اسم الحوض"
        value={formData.name}
        onChange={(val) => setFormData({ ...formData, name: val })}
        placeholder="مثال: حوض رقم 1"
        required
      />
      <Field
        label="نوع السمك"
        type="select"
        options={types}
        value={formData.type}
        onChange={(val) => setFormData({ ...formData, type: val })}
        required
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <Field
          label="الطول"
          type="number"
          unit="م"
          value={formData.length}
          onChange={(val) => setFormData({ ...formData, length: val })}
          min={1}
          required
        />
        <Field
          label="العرض"
          type="number"
          unit="م"
          value={formData.width}
          onChange={(val) => setFormData({ ...formData, width: val })}
          min={1}
          required
        />
        <Field
          label="العمق"
          type="number"
          unit="م"
          value={formData.depth}
          onChange={(val) => setFormData({ ...formData, depth: val })}
          min={0.5}
          required
        />
      </div>
      <Field
        label="عدد الأسماك الحالي"
        type="number"
        value={formData.fishCount}
        onChange={(val) => setFormData({ ...formData, fishCount: val })}
        min={0}
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
