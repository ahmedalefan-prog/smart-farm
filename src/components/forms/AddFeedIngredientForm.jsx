import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import Field from '../shared/Field';
import { colors } from '../../theme/theme';

const AddFeedIngredientForm = ({ onSuccess }) => {
  const { addFeedIngredient } = useFarm();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'كغ',
    minThreshold: ''
  });
  const [err, setErr] = useState('');

  const units = ['كغ', 'طن'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity) {
      setErr('يرجى ملء الحقول المطلوبة: الاسم والكمية');
      return;
    }
    setErr('');
    addFeedIngredient({
      ...formData,
      quantity: Number(formData.quantity),
      minThreshold: Number(formData.minThreshold) || 0
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
        label="اسم المادة"
        value={formData.name}
        onChange={(val) => { setErr(''); setFormData({ ...formData, name: val }); }}
        placeholder="مثال: ذرة صفراء"
        required
      />
      <Field
        label="الكمية"
        type="text"
        inputMode="decimal"
        unit={formData.unit}
        value={formData.quantity}
        onChange={(val) => { setErr(''); setFormData({ ...formData, quantity: val }); }}
        placeholder="0"
        required
      />
      <Field
        label="الوحدة"
        type="select"
        options={units}
        value={formData.unit}
        onChange={(val) => setFormData({ ...formData, unit: val })}
        required
      />
      <Field
        label="الحد الأدنى للتنبيه"
        type="text"
        inputMode="decimal"
        unit={formData.unit}
        value={formData.minThreshold}
        onChange={(val) => setFormData({ ...formData, minThreshold: val })}
        placeholder="0"
        hint="سيظهر تنبيه عندما تقل الكمية عن هذا الحد"
      />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: colors.lime,
          color: colors.dark,
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        حفظ المادة
      </button>
    </form>
  );
};

export default AddFeedIngredientForm;
