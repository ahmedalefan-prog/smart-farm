import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import Field from '../shared/Field';
import { colors } from '../../theme/theme';

const AddPoultryFlockForm = ({ onSuccess }) => {
  const { addPoultryFlock } = useFarm();
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    count: '',
    ageDays: ''
  });

  const breeds = ['روس 308', 'كوب 500', 'لوهان براون', 'أربور أيكرز', 'محلي'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.count || !formData.ageDays) {
      alert('جميع الحقول المطلوبة مطلوبة');
      return;
    }
    addPoultryFlock({
      ...formData,
      count: Number(formData.count),
      ageDays: Number(formData.ageDays)
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
        placeholder="مثال: عنبر رقم 1"
        required
      />
      <Field
        label="السلالة"
        type="select"
        options={breeds}
        value={formData.breed}
        onChange={(val) => setFormData({ ...formData, breed: val })}
      />
      <Field
        label="عدد الطيور"
        type="number"
        value={formData.count}
        onChange={(val) => setFormData({ ...formData, count: val })}
        min={1}
        required
      />
      <Field
        label="عمر الطيور"
        type="number"
        unit="يوم"
        value={formData.ageDays}
        onChange={(val) => setFormData({ ...formData, ageDays: val })}
        min={1}
        max={365}
        required
      />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: colors.orange,
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

export default AddPoultryFlockForm;
