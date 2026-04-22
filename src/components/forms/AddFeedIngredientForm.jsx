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

  const units = ['كغ', 'طن'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.quantity) {
      alert('جميع الحقول المطلوبة مطلوبة');
      return;
    }
    addFeedIngredient({
      ...formData,
      quantity: Number(formData.quantity),
      minThreshold: Number(formData.minThreshold) || 0
    });
    alert('تمت إضافة المادة بنجاح');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="اسم المادة"
        value={formData.name}
        onChange={(val) => setFormData({ ...formData, name: val })}
        placeholder="مثال: ذرة صفراء"
        required
      />
      <Field
        label="الكمية"
        type="number"
        unit={formData.unit}
        value={formData.quantity}
        onChange={(val) => setFormData({ ...formData, quantity: val })}
        min={0}
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
        type="number"
        unit={formData.unit}
        value={formData.minThreshold}
        onChange={(val) => setFormData({ ...formData, minThreshold: val })}
        min={0}
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
