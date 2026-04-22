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
  const [err, setErr] = useState('');

  const breeds = ['روس 308', 'كوب 500', 'لوهان براون', 'أربور أيكرز', 'محلي'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.count || !formData.ageDays) {
      setErr('يرجى ملء الحقول المطلوبة: الاسم والعدد والعمر');
      return;
    }
    setErr('');
    addPoultryFlock({
      ...formData,
      count: Number(formData.count),
      ageDays: Number(formData.ageDays)
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
        label="اسم القطيع"
        value={formData.name}
        onChange={(val) => { setErr(''); setFormData({ ...formData, name: val }); }}
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
        type="text"
        inputMode="numeric"
        value={formData.count}
        onChange={(val) => { setErr(''); setFormData({ ...formData, count: val }); }}
        placeholder="مثال: 1000"
        required
      />
      <Field
        label="عمر الطيور"
        type="text"
        inputMode="numeric"
        unit="يوم"
        value={formData.ageDays}
        onChange={(val) => { setErr(''); setFormData({ ...formData, ageDays: val }); }}
        placeholder="مثال: 20"
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
