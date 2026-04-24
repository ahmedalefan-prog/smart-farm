import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import Field from './shared/Field';
import { colors } from '../theme/theme';

const WMO_TO_ARABIC = (code) => {
  if (code === 0) return 'مشمس';
  if (code <= 2)  return 'غائم جزئي';
  if (code === 3) return 'غائم';
  if (code <= 48) return 'غائم';
  if (code <= 67 || (code >= 80 && code <= 82)) return 'ممطر';
  if (code >= 95) return 'عاصف';
  return 'غائم جزئي';
};

const DailyLogForm = ({ onSuccess }) => {
  const { addDailyLog, farmData } = useFarm();
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherFetched, setWeatherFetched] = useState(false);
  const [formData, setFormData] = useState({
    maxTemp: '',
    minTemp: '',
    weather: '',
    milkProduction: '',
    eggsCollected: '',
    mortality: '',
    treatments: '',
    feedConsumed: '',
    irrigationDone: false,
    fieldNotes: ''
  });
  const [error, setError] = useState('');

  const weatherOptions = ['مشمس', 'غائم جزئي', 'غائم', 'ممطر', 'عاصف'];

  const fetchWeather = async () => {
    setWeatherLoading(true);
    try {
      const lat = farmData.farm.lat ?? 33.35;
      const lon = farmData.farm.lon ?? 43.78;
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Asia%2FBaghdad&forecast_days=1`;
      const res  = await fetch(url);
      const data = await res.json();
      const maxT = Math.round(data.daily.temperature_2m_max[0]);
      const minT = Math.round(data.daily.temperature_2m_min[0]);
      const code = data.daily.weather_code[0];
      setFormData(f => ({ ...f, maxTemp: String(maxT), minTemp: String(minT), weather: WMO_TO_ARABIC(code) }));
      setWeatherFetched(true);
    } catch {
      setError('تعذّر جلب الطقس — تأكد من الاتصال بالإنترنت');
    } finally {
      setWeatherLoading(false);
    }
  };

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
      eggsCollected: Number(formData.eggsCollected) || 0,
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ color: colors.dark, margin: 0 }}>☀️ الطقس</h3>
        <button type="button" onClick={fetchWeather} disabled={weatherLoading}
          style={{
            padding: '7px 14px', borderRadius: '8px',
            backgroundColor: weatherFetched ? colors.green + '20' : colors.sky + '20',
            color: weatherFetched ? colors.green : colors.sky,
            border: `1px solid ${weatherFetched ? colors.green : colors.sky}50`,
            cursor: weatherLoading ? 'default' : 'pointer',
            fontFamily: 'inherit', fontSize: '12px', fontWeight: 'bold'
          }}>
          {weatherLoading ? '⏳ جاري الجلب...' : weatherFetched ? '✅ تم الجلب' : '🌐 جلب تلقائي'}
        </button>
      </div>

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
        label="البيض المجموع"
        type="text"
        inputMode="numeric"
        unit="بيضة"
        value={formData.eggsCollected}
        onChange={(val) => setFormData({ ...formData, eggsCollected: val })}
        hint="للدواجن البياضة"
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
