import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';
import Field from './shared/Field';

const SettingsSection = ({ onClose }) => {
  const { farmData, setFarmData, importFullData } = useFarm();
  const [farmName, setFarmName] = useState(farmData.farm.name);
  const [totalArea, setTotalArea] = useState(farmData.farm.totalArea);
  const [lat, setLat] = useState(String(farmData.farm.lat ?? 33.35));
  const [lon, setLon] = useState(String(farmData.farm.lon ?? 43.78));
  const [confirmReset, setConfirmReset] = useState(false);
  const [importError, setImportError] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('smartFarmApiKey') || '');
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSaveApiKey = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem('smartFarmApiKey', trimmed);
    } else {
      localStorage.removeItem('smartFarmApiKey');
    }
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2000);
  };

  const handleSave = () => {
    setFarmData(prev => ({
      ...prev,
      farm: { ...prev.farm, name: farmName, totalArea: Number(totalArea), lat: parseFloat(lat) || 33.35, lon: parseFloat(lon) || 43.78 }
    }));
    if (onClose) onClose();
  };

  const handleExport = () => {
    const json = JSON.stringify(farmData, null, 2);
    const url = 'data:application/json;charset=utf-8,' + encodeURIComponent(json);
    const date = new Date().toISOString().split('T')[0];
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-farm-${date}.json`;
    a.click();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        importFullData(parsed);
        if (onClose) onClose();
      } catch {
        setImportError('خطأ: الملف غير صالح. يرجى اختيار ملف JSON صحيح.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    localStorage.removeItem('smartFarmData');
    window.location.reload();
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  };

  const btnStyle = (bg) => ({
    width: '100%',
    padding: '14px',
    backgroundColor: bg,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'inherit'
  });

  return (
    <div style={{ padding: '4px' }}>
      <div style={cardStyle}>
        <h3 style={{ color: colors.dark, marginBottom: '16px' }}>معلومات المزرعة</h3>
        <Field label="اسم المزرعة" value={farmName} onChange={setFarmName} />
        <Field label="المساحة الكلية" type="text" inputMode="decimal" unit="دونم" value={String(totalArea)} onChange={setTotalArea} placeholder="مثال: 200" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <Field label="خط العرض (Lat)" type="text" inputMode="decimal" value={lat} onChange={setLat} placeholder="33.35" hint="لجلب الطقس تلقائياً" />
          <Field label="خط الطول (Lon)" type="text" inputMode="decimal" value={lon} onChange={setLon} placeholder="43.78" />
        </div>
        <button onClick={handleSave} style={{ ...btnStyle(colors.green), marginTop: '8px' }}>
          💾 حفظ الإعدادات
        </button>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: colors.dark, marginBottom: '16px' }}>النسخ الاحتياطي</h3>
        <button onClick={handleExport} style={{ ...btnStyle(colors.sky), marginBottom: '12px' }}>
          📤 تصدير جميع البيانات
        </button>
        {importError && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '10px', fontSize: '14px' }}>
            {importError}
          </div>
        )}
        <label style={{ ...btnStyle(colors.teal), display: 'block', textAlign: 'center', cursor: 'pointer' }}>
          📥 استيراد البيانات
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: colors.dark, marginBottom: '8px' }}>🪖 فلوكي</h3>
        <p style={{ color: colors.soil, fontSize: '13px', marginBottom: '14px', lineHeight: '1.6' }}>
          أدخل مفتاح Anthropic API لتفعيل المستشار الزراعي الذكي. المفتاح محفوظ على جهازك فقط ولا يُرسل لأي خادم آخر.
        </p>
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            style={{
              width: '100%', padding: '12px', paddingLeft: '48px',
              border: `1px solid ${colors.sand}`, borderRadius: '8px',
              fontSize: '13px', fontFamily: 'monospace', boxSizing: 'border-box',
              outline: 'none'
            }}
            dir="ltr"
          />
          <button
            onClick={() => setShowApiKey(s => !s)}
            style={{
              position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '0'
            }}
          >{showApiKey ? '🙈' : '👁️'}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            fontSize: '12px', color: localStorage.getItem('smartFarmApiKey') ? colors.green : colors.orange,
            fontWeight: 'bold'
          }}>
            {localStorage.getItem('smartFarmApiKey') ? '✅ مفتاح مُضاف' : '⚠️ لم يُضف بعد'}
          </div>
        </div>
        <button
          onClick={handleSaveApiKey}
          style={{ ...btnStyle(apiKeySaved ? colors.green : colors.teal) }}
        >
          {apiKeySaved ? '✅ تم الحفظ' : '💾 حفظ المفتاح'}
        </button>
        {!apiKey.trim() && localStorage.getItem('smartFarmApiKey') && (
          <button
            onClick={() => { setApiKey(''); localStorage.removeItem('smartFarmApiKey'); setApiKeySaved(false); }}
            style={{ ...btnStyle(colors.orange), marginTop: '8px' }}
          >
            🗑️ حذف المفتاح
          </button>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ color: colors.dark, marginBottom: '16px' }}>منطقة الخطر</h3>
        <button
          onClick={handleReset}
          style={btnStyle(confirmReset ? colors.red : colors.orange)}
        >
          {confirmReset ? '⚠️ اضغط مرة أخرى للتأكيد — سيتم مسح كل البيانات' : '🗑️ مسح جميع البيانات'}
        </button>
        {confirmReset && (
          <button
            onClick={() => setConfirmReset(false)}
            style={{
              width: '100%', padding: '10px', marginTop: '8px',
              backgroundColor: 'transparent', color: colors.soil,
              border: 'none', cursor: 'pointer', fontFamily: 'inherit'
            }}
          >
            إلغاء
          </button>
        )}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ color: colors.dark, marginBottom: '16px' }}>ℹ️ عن التطبيق</h3>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '48px' }}>🌾</span>
          <h4 style={{ color: colors.green, marginTop: '8px', marginBottom: '4px' }}>المزرعة الذكية</h4>
          <p style={{ color: colors.soil, margin: 0 }}>الإصدار 2.0.0 - متكامل</p>
        </div>
        <div style={{ color: colors.soil, lineHeight: '1.8' }}>
          <p><strong>نظام متكامل لإدارة المزرعة الذكية</strong></p>
          <p>مصمم خصيصاً لمنطقة الأنبار - جزيرة الخالدية</p>
          <h4 style={{ color: colors.dark, marginTop: '16px', marginBottom: '8px' }}>المميزات الرئيسية:</h4>
          <ul style={{ paddingRight: '20px', margin: 0 }}>
            <li>إدارة المحاصيل والخضروات (13 محصول + 20 خضرة)</li>
            <li>إدارة الثروة الحيوانية (أبقار - أغنام - دواجن - أسماك)</li>
            <li>نظام أعلاف متكامل مع حاسبة وسيلاج</li>
            <li>دورة موارد مغلقة لتحقيق الاكتفاء الذاتي</li>
            <li>هندسة الري وحاسبة الاحتياجات المائية</li>
            <li>تأهيل الأراضي وتحسين التربة</li>
            <li>موسوعة 19 سلالة حيوانية</li>
            <li>تقارير وتحليلات دورية</li>
            <li>مستشار ذكي (يحتاج API)</li>
          </ul>
          <h4 style={{ color: colors.dark, marginTop: '16px', marginBottom: '8px' }}>للاستخدام الأمثل:</h4>
          <ul style={{ paddingRight: '20px', margin: 0 }}>
            <li>سجل السجل اليومي يومياً</li>
            <li>صدّر بياناتك أسبوعياً للنسخ الاحتياطي</li>
            <li>راقب قسم الدورة المغلقة لتحسين الاكتفاء الذاتي</li>
          </ul>
        </div>
      </div>

      <div style={{ textAlign: 'center', color: colors.soil, fontSize: '13px', paddingTop: '4px' }}>
        🌾 المزرعة الذكية — الإصدار 2.0.0
      </div>
    </div>
  );
};

export default SettingsSection;
