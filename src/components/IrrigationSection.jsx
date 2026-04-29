import React, { useState } from 'react';
import { colors } from '../theme/theme';
import Field from './shared/Field';

const cropCoefficients = {
  'قمح':       { initial: 0.3,  mid: 1.15, late: 0.4  },
  'شعير':      { initial: 0.3,  mid: 1.15, late: 0.25 },
  'ذرة':       { initial: 0.3,  mid: 1.2,  late: 0.6  },
  'برسيم':     { initial: 0.4,  mid: 1.2,  late: 1.15 },
  'دوار شمس': { initial: 0.35, mid: 1.0,  late: 0.35 },
  'سمسم':      { initial: 0.35, mid: 1.1,  late: 0.5  },
  'طماطم':     { initial: 0.6,  mid: 1.15, late: 0.8  },
  'خيار':      { initial: 0.5,  mid: 1.0,  late: 0.75 },
  'باذنجان':   { initial: 0.5,  mid: 1.05, late: 0.9  },
  'فليفلة':    { initial: 0.6,  mid: 1.05, late: 0.9  },
  'كوسا':      { initial: 0.5,  mid: 1.0,  late: 0.75 },
  'بطيخ':      { initial: 0.4,  mid: 1.0,  late: 0.75 },
  'شمام':      { initial: 0.45, mid: 1.05, late: 0.75 },
  'بطاطا':     { initial: 0.5,  mid: 1.15, late: 0.75 },
  'بصل':       { initial: 0.7,  mid: 1.05, late: 0.75 },
  'ثوم':       { initial: 0.7,  mid: 1.0,  late: 0.7  },
  'جزر':       { initial: 0.7,  mid: 1.05, late: 0.95 },
  'طماطة (شتوي)': { initial: 0.6, mid: 1.15, late: 0.8 },
  'نخيل':      { initial: 0.9,  mid: 0.95, late: 0.95 },
};

const soilTypes = {
  'رملية':    { fieldCapacity: 10, wiltingPoint: 4,  infiltrationRate: 25 },
  'غرينية':   { fieldCapacity: 20, wiltingPoint: 8,  infiltrationRate: 15 },
  'طينية':    { fieldCapacity: 35, wiltingPoint: 18, infiltrationRate: 5  },
  'مختلطة':   { fieldCapacity: 22, wiltingPoint: 10, infiltrationRate: 12 }
};

const sprinklerTypes = [
  {
    id: 'drip', name: 'تنقيط (Drip)', icon: '💧',
    coverage: 'حسب التصميم', efficiency: '90-95%', cost: 'متوسطة إلى عالية', pressure: '1-2 بار',
    pros: ['أعلى كفاءة في استخدام المياه', 'توفير 30-50% مياه', 'تسميد مع الري', 'أمراض أقل', 'يناسب جميع التضاريس'],
    cons: ['انسداد النقاطات', 'يحتاج فلترة جيدة', 'تكلفة تركيب أولية', 'صيانة دورية'],
    bestFor: 'الخضروات - الأشجار - المحاصيل عالية القيمة',
    tag: 'ممتاز للأنبار', tagColor: colors.green
  },
  {
    id: 'pivot', name: 'مرشة محورية (Pivot)', icon: '🔄',
    coverage: '12-200 هكتار', efficiency: '85%', cost: 'عالية', pressure: '2-4 بار',
    pros: ['تغطية مساحات كبيرة', 'تشغيل آلي', 'توزيع متجانس', 'توفير عمالة'],
    cons: ['تكلفة عالية', 'صيانة متخصصة', 'غير مناسبة للأراضي غير المنتظمة', 'استهلاك طاقة'],
    bestFor: 'المساحات الكبيرة المفتوحة - الحبوب والأعلاف',
    tag: 'ممتازة للأراضي الكبيرة', tagColor: colors.green
  },
  {
    id: 'sprinkler', name: 'مرشات ثابتة (Sprinkler)', icon: '💦',
    coverage: '0.5-5 هكتار', efficiency: '75-80%', cost: 'متوسطة', pressure: '2-3 بار',
    pros: ['مرونة في التركيب', 'مناسبة للأراضي غير المنتظمة', 'تكلفة أقل من المحورية'],
    cons: ['كفاءة أقل في الرياح', 'توزيع غير متجانس تماماً'],
    bestFor: 'الخضروات - المساحات المتوسطة',
    tag: 'جيدة للمتوسطة', tagColor: colors.sky
  },
  {
    id: 'bubbler', name: 'فقاعات (Bubbler)', icon: '🫧',
    coverage: 'شجرة/شجيرة', efficiency: '80-85%', cost: 'متوسطة', pressure: '1-1.5 بار',
    pros: ['جيد للأشجار', 'انسداد أقل من التنقيط', 'توزيع موضعي جيد'],
    cons: ['غير مناسب للمحاصيل الكثيفة', 'يحتاج تخطيط مسبق'],
    bestFor: 'النخيل - الحمضيات - الأشجار المثمرة',
    tag: 'جيد للبساتين', tagColor: colors.sky
  },
  {
    id: 'flood', name: 'غمر (Flood)', icon: '🌊',
    coverage: 'حسب المساحة', efficiency: '50-60%', cost: 'منخفضة', pressure: 'جريان طبيعي',
    pros: ['أقل تكلفة', 'سهل التنفيذ', 'لا يحتاج معدات خاصة'],
    cons: ['إهدار كبير للمياه', 'توزيع غير متجانس', 'تعرية التربة', 'أمراض فطرية أكثر'],
    bestFor: 'الأرز - البرسيم في المناطق ذات المياه الوفيرة',
    tag: 'غير موصى به', tagColor: colors.red
  }
];

const efficiencyMap = { pivot: 0.85, sprinkler: 0.78, drip: 0.92, flood: 0.60, bubbler: 0.82 };
const flowRateMap  = { pivot: 120,  sprinkler: 5,    drip: 2,    flood: 50,   bubbler: 3 };

const optimalTiming = [
  { season: 'صيف شديد', condition: 'حرارة > 40°م', bestTime: '3-6 فجراً + 8-10 مساءً', reason: 'تقليل التبخر وتجنب حرق الأوراق', style: colors.red },
  { season: 'صيف', condition: 'حرارة 35-40°م', bestTime: '4-8 فجراً + 7-9 مساءً', reason: 'تبخر أقل - جلستان ضروريتان', style: colors.orange },
  { season: 'صيف', condition: 'حرارة 25-35°م', bestTime: '5-9 صباحاً', reason: 'تبخر معتدل - جلسة واحدة كافية', style: colors.wheat },
  { season: 'ربيع/خريف', condition: 'مناخ معتدل', bestTime: '6-10 صباحاً', reason: 'وقت مثالي للامتصاص', style: colors.green },
  { season: 'شتاء', condition: 'بارد', bestTime: '9-12 صباحاً', reason: 'تجنب الصقيع - دع الشمس تسخن التربة', style: colors.sky },
  { season: 'شتاء', condition: '⚠️ صقيع متوقع', bestTime: 'لا تروِ', reason: 'الري عند الصقيع يزيد الضرر', style: colors.purple }
];

const fertilizerData = {
  'قمح':       { n: 120, p: 60,  k: 40,  splits: 3 },
  'شعير':      { n: 100, p: 50,  k: 30,  splits: 2 },
  'ذرة':       { n: 200, p: 80,  k: 60,  splits: 4 },
  'برسيم':     { n: 30,  p: 80,  k: 60,  splits: 2 },
  'دوار شمس': { n: 100, p: 60,  k: 80,  splits: 3 },
  'سمسم':      { n: 60,  p: 40,  k: 40,  splits: 2 },
  'طماطم':     { n: 150, p: 100, k: 200, splits: 6 },
  'خيار':      { n: 120, p: 80,  k: 150, splits: 8 },
  'فليفلة':    { n: 140, p: 100, k: 180, splits: 7 },
  'كوسا':      { n: 100, p: 70,  k: 120, splits: 5 },
  'بطيخ':      { n: 100, p: 80,  k: 120, splits: 4 },
  'شمام':      { n: 110, p: 80,  k: 130, splits: 5 },
  'باذنجان':   { n: 130, p: 90,  k: 160, splits: 5 },
  'بطاطا':     { n: 180, p: 120, k: 200, splits: 3 },
  'بصل':       { n: 120, p: 80,  k: 100, splits: 4 },
  'ثوم':       { n: 100, p: 80,  k: 100, splits: 3 },
  'جزر':       { n: 90,  p: 80,  k: 120, splits: 3 },
  'نخيل':      { n: 80,  p: 50,  k: 200, splits: 4 },
};

const tabs = [
  { id: 'calculator', name: '🧮 حاسبة الري',   color: colors.sky },
  { id: 'sprinklers', name: '💧 أنظمة الري',    color: colors.teal },
  { id: 'timing',     name: '⏰ أوقات الري',    color: colors.wheat },
  { id: 'fertilizer', name: '🧪 حاسبة التسميد', color: colors.lime },
  { id: 'schedule',   name: '📅 جدول أسبوعي',  color: colors.purple }
];

const IrrigationSection = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [calcInputs, setCalcInputs] = useState({
    cropType: '', growthStage: '', temperature: '30',
    soilType: '', area: '', irrigationType: ''
  });
  const [fertCrop, setFertCrop] = useState('');
  const [fertArea, setFertArea] = useState('');

  const setCalc = (key, val) => setCalcInputs(prev => ({ ...prev, [key]: val }));

  const waterResult = (() => {
    const { cropType, growthStage, soilType, area, irrigationType, temperature } = calcInputs;
    if (!cropType || !growthStage || !soilType || !area || !irrigationType) return null;

    const crop = cropCoefficients[cropType];
    const areaHa = Number(area);
    const temp = Number(temperature) || 30;
    const kc = { initial: crop.initial, mid: crop.mid, late: crop.late }[growthStage] || crop.mid;

    const eto = 5 + (temp - 20) * 0.15;
    const etc = eto * kc;
    const netReq = etc * 10;
    const eff = efficiencyMap[irrigationType] || 0.75;
    const grossReq = netReq / eff;
    const totalDaily = grossReq * areaHa;
    const hours = totalDaily / (flowRateMap[irrigationType] || 5);

    return {
      etc: etc.toFixed(1),
      netReq: netReq.toFixed(1),
      grossReq: grossReq.toFixed(1),
      totalDaily: totalDaily.toFixed(0),
      hours: hours.toFixed(1),
      eff: (eff * 100).toFixed(0),
      sessions: temp > 35 ? 2 : 1
    };
  })();

  const fertResult = (() => {
    if (!fertCrop || !fertArea) return null;
    const d = fertilizerData[fertCrop];
    if (!d) return null;
    const a = Number(fertArea);
    return {
      n: (d.n * a).toFixed(0),
      p: (d.p * a).toFixed(0),
      k: (d.k * a).toFixed(0),
      urea:  ((d.n * a) / 0.46).toFixed(0),
      dap:   ((d.p * a) / 0.46).toFixed(0),
      ksulf: ((d.k * a) / 0.50).toFixed(0),
      splits: d.splits
    };
  })();

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>💧 الهندسة الزراعية والري</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '10px 14px', borderRadius: '8px', border: 'none',
            backgroundColor: activeTab === tab.id ? tab.color : colors.cream,
            color: activeTab === tab.id ? 'white' : colors.dark,
            cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '13px', fontFamily: 'inherit'
          }}>
            {tab.name}
          </button>
        ))}
      </div>

      {/* ── حاسبة الري ── */}
      {activeTab === 'calculator' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
            <h3 style={{ color: colors.dark, marginBottom: '16px' }}>احسب احتياجات الري اليومية</h3>
            <Field label="المحصول" type="select" options={Object.keys(cropCoefficients)} value={calcInputs.cropType} onChange={v => setCalc('cropType', v)} />
            <Field label="مرحلة النمو" type="select"
              options={[{ value: 'initial', label: 'بداية' }, { value: 'mid', label: 'وسط (ذروة)' }, { value: 'late', label: 'نهاية (نضج)' }]}
              value={calcInputs.growthStage} onChange={v => setCalc('growthStage', v)} />
            <Field label="متوسط الحرارة" type="text" inputMode="decimal" unit="°م" value={calcInputs.temperature} onChange={v => setCalc('temperature', v)} />
            <Field label="نوع التربة" type="select" options={Object.keys(soilTypes)} value={calcInputs.soilType} onChange={v => setCalc('soilType', v)} />
            <Field label="المساحة" type="text" inputMode="decimal" unit="هكتار" value={calcInputs.area} onChange={v => setCalc('area', v)} />
            <Field label="نظام الري" type="select"
              options={sprinklerTypes.map(s => ({ value: s.id, label: s.name }))}
              value={calcInputs.irrigationType} onChange={v => setCalc('irrigationType', v)} />
          </div>

          {waterResult ? (
            <div style={{ backgroundColor: colors.sky + '18', padding: '20px', borderRadius: '12px', border: `1px solid ${colors.sky}40` }}>
              <h3 style={{ color: colors.sky, marginBottom: '16px' }}>📊 نتائج الحساب</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '14px' }}>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ color: colors.soil, fontSize: '12px' }}>الاستهلاك المائي (ETc)</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.sky }}>{waterResult.etc} مم/يوم</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ color: colors.soil, fontSize: '12px' }}>الاحتياج الصافي</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.sky }}>{waterResult.netReq} م³/هكتار</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ color: colors.soil, fontSize: '12px' }}>كفاءة النظام</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.green }}>{waterResult.eff}%</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ color: colors.soil, fontSize: '12px' }}>إجمالي المياه اليومي</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.orange }}>{waterResult.totalDaily} م³</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ color: colors.soil, fontSize: '12px' }}>ساعات التشغيل</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.dark }}>{waterResult.hours} ساعة</div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ color: colors.soil, fontSize: '12px' }}>عدد الجلسات</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: waterResult.sessions === 2 ? colors.red : colors.green }}>{waterResult.sessions} جلسة/يوم</div>
                </div>
              </div>
              <div style={{ marginTop: '14px', padding: '12px', backgroundColor: colors.gold + '25', borderRadius: '8px', fontSize: '14px' }}>
                💡 <strong>توصية:</strong>{' '}
                {waterResult.sessions === 2
                  ? 'درجة الحرارة عالية - قسّم الري إلى جلستين: فجراً (4-7) ومساءً (7-9) لتقليل التبخر'
                  : 'جلسة واحدة صباحاً (5-9) كافية في هذه الأحوال الجوية'}
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
              🌱 أدخل بيانات المحصول والمساحة ونظام الري لحساب الاحتياجات
            </div>
          )}
        </div>
      )}

      {/* ── أنظمة الري ── */}
      {activeTab === 'sprinklers' && (
        <div style={{ display: 'grid', gap: '14px' }}>
          {sprinklerTypes.map(s => (
            <div key={s.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', border: `1px solid ${colors.sand}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '30px' }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <h3 style={{ color: colors.dark, margin: 0 }}>{s.name}</h3>
                    <span style={{ backgroundColor: s.tagColor, color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>{s.tag}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: colors.soil }}>
                    تغطية: {s.coverage} · كفاءة: {s.efficiency} · ضغط: {s.pressure} · تكلفة: {s.cost}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: colors.green, marginBottom: '6px', fontSize: '13px' }}>✅ مميزات</div>
                  <ul style={{ paddingRight: '16px', margin: 0, fontSize: '13px', color: colors.dark }}>
                    {s.pros.map((p, i) => <li key={i} style={{ marginBottom: '3px' }}>{p}</li>)}
                  </ul>
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', color: colors.red, marginBottom: '6px', fontSize: '13px' }}>❌ عيوب</div>
                  <ul style={{ paddingRight: '16px', margin: 0, fontSize: '13px', color: colors.dark }}>
                    {s.cons.map((c, i) => <li key={i} style={{ marginBottom: '3px' }}>{c}</li>)}
                  </ul>
                </div>
              </div>
              <div style={{ backgroundColor: colors.cream, padding: '8px 12px', borderRadius: '6px', fontSize: '13px' }}>
                💡 <strong>الأنسب لـ:</strong> {s.bestFor}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── أوقات الري ── */}
      {activeTab === 'timing' && (
        <div>
          <div style={{ backgroundColor: colors.gold + '25', padding: '14px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '14px' }}>
            💡 الري في الأوقات الصحيحة يوفر <strong>20-30% من المياه</strong> ويزيد كفاءة الامتصاص
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {optimalTiming.map((t, i) => (
              <div key={i} style={{ backgroundColor: 'white', padding: '14px 16px', borderRadius: '10px', border: `1px solid ${colors.sand}`, borderRight: `4px solid ${t.style}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ color: colors.dark }}>{t.season} · {t.condition}</strong>
                  <span style={{ backgroundColor: t.style, color: 'white', padding: '3px 10px', borderRadius: '4px', fontSize: '12px' }}>
                    {t.bestTime}
                  </span>
                </div>
                <p style={{ color: colors.soil, margin: 0, fontSize: '13px' }}>{t.reason}</p>
              </div>
            ))}
          </div>
          <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', marginTop: '16px' }}>
            <h4 style={{ color: colors.dark, marginBottom: '10px' }}>⚠️ تحذيرات مهمة</h4>
            <ul style={{ paddingRight: '20px', color: colors.soil, fontSize: '14px', lineHeight: '2' }}>
              <li>لا تروِ في الفترة 11 صباحاً – 4 مساءً في الصيف (أعلى تبخر)</li>
              <li>الري ليلاً يشجع الأمراض الفطرية - تجنبه للخضروات</li>
              <li>عند الريح الشديدة: أوقف المرشات وانتظر</li>
              <li>راقب رطوبة التربة ولا تعتمد فقط على الجدول</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── حاسبة التسميد ── */}
      {activeTab === 'fertilizer' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
            <h3 style={{ color: colors.dark, marginBottom: '16px' }}>احسب احتياجات التسميد الموسمية</h3>
            <Field label="المحصول" type="select" options={Object.keys(fertilizerData)} value={fertCrop} onChange={setFertCrop} />
            <Field label="المساحة" type="text" inputMode="decimal" unit="هكتار" value={fertArea} onChange={setFertArea} />
          </div>

          {fertResult ? (
            <div style={{ backgroundColor: colors.lime + '18', padding: '20px', borderRadius: '12px', border: `1px solid ${colors.lime}40` }}>
              <h3 style={{ color: colors.green, marginBottom: '16px' }}>🧪 احتياجات التسميد</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                {[['نيتروجين N', fertResult.n, colors.sky], ['فوسفور P', fertResult.p, colors.orange], ['بوتاسيوم K', fertResult.k, colors.purple]].map(([label, val, color]) => (
                  <div key={label} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ color: colors.soil, fontSize: '12px', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color }}>{val}</div>
                    <div style={{ color: colors.soil, fontSize: '12px' }}>كغ</div>
                  </div>
                ))}
              </div>
              <h4 style={{ color: colors.dark, marginBottom: '10px' }}>الأسمدة التجارية المكافئة:</h4>
              <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🟡 يوريا (46% N)</span>
                  <strong>{fertResult.urea} كغ</strong>
                </div>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>⚫ داب / سوبر فوسفات (46% P)</span>
                  <strong>{fertResult.dap} كغ</strong>
                </div>
                <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🟤 سلفات البوتاسيوم (50% K)</span>
                  <strong>{fertResult.ksulf} كغ</strong>
                </div>
              </div>
              <div style={{ marginTop: '14px', padding: '12px', backgroundColor: colors.gold + '25', borderRadius: '8px', fontSize: '14px' }}>
                💡 قسّم التسميد إلى <strong>{fertResult.splits} دفعات</strong> متساوية على مدار الموسم للحصول على أفضل نتيجة
              </div>
            </div>
          ) : (
            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center', color: colors.soil }}>
              🌿 اختر المحصول وأدخل المساحة لحساب احتياجات التسميد
            </div>
          )}
        </div>
      )}

      {/* ── الجدول الأسبوعي ── */}
      {activeTab === 'schedule' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
            <h3 style={{ color: colors.dark, marginBottom: '8px' }}>📅 جدول الري الأسبوعي المقترح</h3>
            <p style={{ color: colors.soil, fontSize: '13px', marginBottom: '16px' }}>
              بناءً على متوسط حرارة 35°م والتربة الغرينية في منطقة الأنبار
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '400px' }}>
                <thead>
                  <tr style={{ backgroundColor: colors.dark, color: 'white' }}>
                    {['اليوم', 'القطاع', 'الكمية', 'الوقت', 'ملاحظة'].map(h => (
                      <th key={h} style={{ padding: '10px 8px', textAlign: 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { day: 'السبت',    sector: 'خضروات',       amount: '30-40 م³',  time: '5-7 ص', note: 'بالتنقيط' },
                    { day: 'الأحد',    sector: 'حبوب',         amount: '50-60 م³',  time: '5-8 ص', note: 'مرشات' },
                    { day: 'الاثنين',  sector: 'علف (برسيم)',   amount: '40-50 م³',  time: '4-7 ص', note: 'بعد القص' },
                    { day: 'الثلاثاء', sector: 'خضروات',       amount: '30-40 م³',  time: '5-7 ص', note: 'بالتنقيط' },
                    { day: 'الأربعاء', sector: 'بساتين/نخيل',  amount: '20-30 م³',  time: '5-8 ص', note: 'فقاعات' },
                    { day: 'الخميس',   sector: 'حبوب',         amount: '50-60 م³',  time: '5-8 ص', note: 'مرشات' },
                    { day: 'الجمعة',   sector: 'راحة/صيانة',  amount: '-',         time: '-',      note: 'فحص النظام' }
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${colors.sand}`, backgroundColor: i % 2 === 0 ? 'white' : colors.cream }}>
                      <td style={{ padding: '10px 8px', fontWeight: 'bold' }}>{row.day}</td>
                      <td style={{ padding: '10px 8px' }}>{row.sector}</td>
                      <td style={{ padding: '10px 8px', color: colors.sky }}>{row.amount}</td>
                      <td style={{ padding: '10px 8px' }}>{row.time}</td>
                      <td style={{ padding: '10px 8px', color: colors.soil, fontSize: '12px' }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ backgroundColor: colors.orange + '18', padding: '14px 16px', borderRadius: '10px', fontSize: '14px' }}>
            ⚠️ هذا جدول استرشادي - عدّل حسب الطقس الفعلي وحالة المحصول ومصدر المياه المتاح
          </div>
        </div>
      )}
    </div>
  );
};

export default IrrigationSection;
