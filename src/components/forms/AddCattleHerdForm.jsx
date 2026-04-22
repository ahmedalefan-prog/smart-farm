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
  const [err, setErr] = useState('');

  const types = ['حلوب', 'تسمين', 'عجول', 'تكاثر'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.count) {
      setErr('يرجى ملء الحقول المطلوبة: الاسم والنوع والعدد');
      return;
    }
    setErr('');
    addCattleHerd({
      ...formData,
      count: Number(formData.count),
      avgWeight: Number(formData.avgWeight) || null
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
        placeholder="مثال: قطيع الحظيرة رقم 1"
        required
      />
      <Field
        label="النوع"
        type="select"
        options={types}
        value={formData.type}
        onChange={(val) => { setErr(''); setFormData({ ...formData, type: val }); }}
        required
      />
      <Field
        label="عدد الرؤوس"
        type="text"
        inputMode="numeric"
        value={formData.count}
        onChange={(val) => { setErr(''); setFormData({ ...formData, count: val }); }}
        placeholder="مثال: 50"
        required
      />
      <Field
        label="متوسط الوزن"
        type="text"
        inputMode="decimal"
        unit="كغ"
        value={formData.avgWeight}
        onChange={(val) => setFormData({ ...formData, avgWeight: val })}
        placeholder="اختياري"
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
