import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import Field from '../shared/Field';
import { colors } from '../../theme/theme';

const AddLandForm = ({ onSuccess }) => {
  const { addLand } = useFarm();
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    soilType: ''
  });

  const soilTypes = ['غرينية خفيفة', 'غرينية متوسطة', 'رملية', 'طينية', 'مختلطة'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.area || !formData.soilType) {
      alert('جميع الحقول مطلوبة');
      return;
    }
    addLand({
      ...formData,
      area: Number(formData.area),
      currentCrop: null,
      plantingDate: null,
      cropHistory: []
    });
    alert('تمت إضافة القطعة بنجاح');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field
        label="اسم القطعة"
        value={formData.name}
        onChange={(val) => setFormData({ ...formData, name: val })}
        placeholder="مثال: قطعة الفرات الشرقية"
        required
      />
      <Field
        label="المساحة"
        type="number"
        unit="دونم"
        value={formData.area}
        onChange={(val) => setFormData({ ...formData, area: val })}
        min={0.1}
        required
      />
      <Field
        label="نوع التربة"
        type="select"
        options={soilTypes}
        value={formData.soilType}
        onChange={(val) => setFormData({ ...formData, soilType: val })}
        required
      />
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: colors.green,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        حفظ القطعة
      </button>
    </form>
  );
};

export default AddLandForm;
