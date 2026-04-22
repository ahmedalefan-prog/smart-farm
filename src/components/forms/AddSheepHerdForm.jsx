import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import Field from '../shared/Field';
import { colors } from '../../theme/theme';

const AddSheepHerdForm = ({ onSuccess, initial = null, onUpdate = null }) => {
  const { addSheepHerd } = useFarm();
  const [formData, setFormData] = useState({
    name:      initial?.name      || '',
    type:      initial?.type      || '',
    count:     initial?.count     || '',
    avgWeight: initial?.avgWeight || '',
    housing:   initial?.housing   || ''
  });
  const [error, setError] = useState('');

  const types = ['تسمين', 'تكاثر', 'حلوب', 'عجول'];

  const set = (field) => (val) => { setError(''); setFormData(p => ({ ...p, [field]: val })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError('يرجى إدخال اسم القطيع'); return; }
    if (!formData.type)        { setError('يرجى اختيار النوع'); return; }
    if (!formData.count || Number(formData.count) < 1) { setError('يرجى إدخال عدد صحيح'); return; }

    const data = { ...formData, count: Number(formData.count), avgWeight: Number(formData.avgWeight) || null };
    if (onUpdate) { onUpdate(data); } else { addSheepHerd(data); }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '14px' }}>
          {error}
        </div>
      )}
      <Field label="اسم القطيع"    value={formData.name}      onChange={set('name')}      placeholder="مثال: قطيع الأغنام الشمالي" required />
      <Field label="النوع" type="select" options={types} value={formData.type} onChange={set('type')} required />
      <Field label="عدد الرؤوس"   type="text" inputMode="numeric" value={formData.count}     onChange={set('count')}     placeholder="مثال: 50" required />
      <Field label="متوسط الوزن"  type="text" inputMode="decimal" unit="كغ" value={formData.avgWeight} onChange={set('avgWeight')} placeholder="مثال: 40" />
      <Field label="اسم الحظيرة"  value={formData.housing}   onChange={set('housing')}   placeholder="مثال: حظيرة مسقوفة" />
      <button type="submit" style={{
        width: '100%', padding: '14px', backgroundColor: colors.green,
        color: 'white', border: 'none', borderRadius: '8px',
        fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontFamily: 'inherit'
      }}>
        {onUpdate ? 'حفظ التعديلات' : 'حفظ القطيع'}
      </button>
    </form>
  );
};

export default AddSheepHerdForm;
