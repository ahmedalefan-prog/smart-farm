import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import Field from '../shared/Field';
import { colors } from '../../theme/theme';

const AddCattleHerdForm = ({ onSuccess }) => {
  const { addCattleHerd } = useFarm();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    count: '',
    avgWeight: '',
    housing: ''
  });

  const types = ['حلوب', 'تسمين', 'عجول', 'تكاثر'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.count) {
      alert('جميع الحقول المطلوبة مطلوبة');
      return;
    }
    addCattleHerd({
      ...formData,
      count: Number(formData.count),
      avgWeight: Number(formData.avgWeight) || null
    });
    alert('تمت إضافة القطيع بنجاح');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="اسم القطيع"
        value={formData.name}
        onChange={(val) => setFormData({ ...formData, name: val })}
        placeholder="مثال: قطيع الحظيرة رقم 1"
        required
      />
      <Field
        label="النوع"
        type="select"
        options={types}
        value={formData.type}
        onChange={(val) => setFormData({ ...formData, type: val })}
        required
      />
      <Field
        label="عدد الرؤوس"
        type="number"
        value={formData.count}
        onChange={(val) => setFormData({ ...formData, count: val })}
        min={1}
        required
      />
      <Field
        label="متوسط الوزن"
        type="number"
        unit="كغ"
        value={formData.avgWeight}
        onChange={(val) => setFormData({ ...formData, avgWeight: val })}
        min={0}
      />
      <Field
        label="اسم الحظيرة"
        value={formData.housing}
        onChange={(val) => setFormData({ ...formData, housing: val })}
        placeholder="مثال: حظيرة مفتوحة شمالية"
      />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: colors.soil,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        حفظ القطيع
      </button>
    </form>
  );
};

export default AddCattleHerdForm;
