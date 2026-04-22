import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import Field from './shared/Field';
import { colors } from '../theme/theme';

const DailyLogForm = ({ onSuccess }) => {
  const { addDailyLog, farmData } = useFarm();
  const [formData, setFormData] = useState({
    maxTemp: '',
    minTemp: '',
    weather: '',
    milkProduction: '',
    mortality: '',
    treatments: '',
    feedConsumed: '',
    irrigationDone: false,
    fieldNotes: ''
  });
  const [error, setError] = useState('');

  const weatherOptions = ['مشمس', 'غائم جزئي', 'غائم', 'ممطر', 'عاصف'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.maxTemp || !formData.minTemp || !formData.weather) {
      setError('الحقول المطلوبة: درجة الحرارة والحالة الجوية');
      return;
    }
    setError('');
    addDailyLog({
      maxTemp: Number(formData.maxTemp),
      minTemp: Number(formData.minTemp),
      weather: formData.weather,
      milkProduction: Number(formData.milkProduction) || 0,
      mortality: Number(formData.mortality) || 0,
      treatments: formData.treatments,
      feedConsumed: Number(formData.feedConsumed) || 0,
      irrigationDone: formData.irrigationDone,
      fieldNotes: formData.fieldNotes
    });
    onSuccess?.();
  };

  const today = new Date().toISOString().split('T')[0];
  const hasTodayLog = farmData.dailyLogs.some(log =>
    log.date && log.date.startsWith(today)
  );

  if (hasTodayLog) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: colors.lime, borderRadius: '12px', color: colors.dark }}>
        ✅ تم تسجيل سجل اليوم بالفعل
        <br />
        <small>يمكنك إضافة سجل جديد غداً</small>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxHeight: '60vh', overflowY: 'auto', padding: '5px' }}>
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <h3 style={{ color: colors.dark, marginBottom: '16px' }}>☀️ الطقس</h3>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Field
          label="العظمى"
          type="text"
          inputMode="decimal"
          unit="°م"
          value={formData.maxTemp}
          onChange={(val) => { setError(''); setFormData({ ...formData, maxTemp: val }); }}
          required
        />
        <Field
          label="الصغرى"
          type="text"
          inputMode="decimal"
          unit="°م"
          value={formData.minTemp}
          onChange={(val) => { setError(''); setFormData({ ...formData, minTemp: val }); }}
          required
        />
      </div>

      <Field
        label="الحالة الجوية"
        type="select"
        options={weatherOptions}
        value={formData.weather}
        onChange={(val) => { setError(''); setFormData({ ...formData, weather: val }); }}
        required
      />

      <h3 style={{ color: colors.dark, margin: '20px 0 16px' }}>🐄 الثروة الحيوانية</h3>

      <Field
        label="إنتاج الحليب"
        type="text"
        inputMode="decimal"
        unit="لتر"
        value={formData.milkProduction}
        onChange={(val) => setFormData({ ...formData, milkProduction: val })}
        hint="إجمالي إنتاج اليوم"
      />

      <Field
        label="نفوق"
        type="text"
        inputMode="numeric"
        value={formData.mortality}
        onChange={(val) => setFormData({ ...formData, mortality: val })}
        hint="عدد الحالات (إن وجدت)"
      />

      <Field
        label="علاجات"
        value={formData.treatments}
        onChange={(val) => setFormData({ ...formData, treatments: val })}
        placeholder="مثال: تطعيم العجول ضد الحمى القلاعية"
      />

      <h3 style={{ color: colors.dark, margin: '20px 0 16px' }}>📦 المخزون</h3>

      <Field
        label="العلف المستهلك"
        type="text"
        inputMode="decimal"
        unit="كغ"
        value={formData.feedConsumed}
        onChange={(val) => setFormData({ ...formData, feedConsumed: val })}
      />

      <h3 style={{ color: colors.dark, margin: '20px 0 16px' }}>🌾 المحاصيل</h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.irrigationDone}
            onChange={(e) => setFormData({ ...formData, irrigationDone: e.target.checked })}
            style={{ width: '20px', height: '20px' }}
          />
          <span>تم تنفيذ الري اليوم</span>
        </label>
      </div>

      <Field
        label="ملاحظات حقلية"
        value={formData.fieldNotes}
        onChange={(val) => setFormData({ ...formData, fieldNotes: val })}
        placeholder="أي ملاحظات على المحاصيل..."
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
          marginTop: '20px',
          marginBottom: '10px'
        }}
      >
        حفظ السجل اليومي
      </button>
    </form>
  );
};

export default DailyLogForm;
