import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import Field from '../shared/Field';
import { colors } from '../../theme/theme';

const AddLandForm = ({ onSuccess }) => {
  const { addLand } = useFarm();
  const [formData, setFormData] = useState({ name: '', area: '', soilType: '' });
  const [error, setError] = useState('');

  const soilTypes = ['غرينية خفيفة', 'غرينية متوسطة', 'رملية', 'طينية', 'مختلطة'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const areaNum = parseFloat(formData.area);
    if (!formData.name.trim()) { setError('يرجى إدخال اسم القطعة'); return; }
    if (!formData.area || isNaN(areaNum) || areaNum <= 0) { setError('يرجى إدخال مساحة صحيحة (مثال: 50 أو 10.5)'); return; }
    if (!formData.soilType) { setError('يرجى اختيار نوع التربة'); return; }

    addLand({ ...formData, area: areaNum, currentCrop: null, plantingDate: null, cropHistory: [] });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{
          backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px 14px',
          borderRadius: '8px', marginBottom: '14px', fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      <Field
        label="اسم القطعة"
        value={formData.name}
        onChange={(val) => { setError(''); setFormData({ ...formData, name: val }); }}
        placeholder="مثال: قطعة الفرات الشرقية"
        required
      />
      <Field
        label="المساحة"
        type="text"
        inputMode="decimal"
        unit="دونم"
        value={formData.area}
        onChange={(val) => { setError(''); setFormData({ ...formData, area: val }); }}
        placeholder="مثال: 50 أو 10.5"
        required
      />
      <Field
        label="نوع التربة"
        type="select"
        options={soilTypes}
        value={formData.soilType}
        onChange={(val) => { setError(''); setFormData({ ...formData, soilType: val }); }}
        required
      />
      <button
        type="submit"
        style={{
          width: '100%', padding: '14px',
          backgroundColor: colors.green, color: 'white',
          border: 'none', borderRadius: '8px',
          fontSize: '16px', fontWeight: 'bold',
          cursor: 'pointer', marginTop: '10px',
          fontFamily: 'inherit'
        }}
      >
        حفظ القطعة
      </button>
    </form>
  );
};

export default AddLandForm;
