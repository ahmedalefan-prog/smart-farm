import React, { useState } from 'react';
import { colors } from '../theme/theme';
import Field from './shared/Field';

const tabs = [
  { id: 'analysis',    name: '🔬 تحليل التربة',   color: colors.soil },
  { id: 'improvement', name: '🌱 تحسين التربة',   color: colors.lime },
  { id: 'salinity',    name: '🧂 معالجة الملوحة', color: colors.orange },
  { id: 'rotation',    name: '🔄 الدورة الزراعية', color: colors.wheat },
  { id: 'organic',     name: '♻️ السماد العضوي',   color: colors.green }
];

const improvementMethods = [
  {
    id: 'gypsum', name: 'الجبس الزراعي (Gypsum)', icon: '🪨',
    purpose: 'معالجة القلوية وتحسين بنية التربة',
    rate: '2-4 طن/هكتار', timing: 'قبل الحراثة - خريف أو ربيع',
    method: 'ينثر بالتساوي ثم يحرث مع التربة',
    benefits: ['يخفض pH التربة القلوية', 'يحسن نفاذية المياه', 'يزود التربة بالكالسيوم والكبريت', 'يقلل قشرة التربة السطحية'],
    suitable: 'الأراضي القلوية والطينية الثقيلة',
    cost: 'متوسطة', duration: 'يستمر تأثيره 2-3 سنوات'
  },
  {
    id: 'sulfur', name: 'الكبريت الزراعي', icon: '🟡',
    purpose: 'خفض pH التربة القلوية بسرعة',
    rate: '500-1000 كغ/هكتار', timing: 'قبل الزراعة بـ 3-4 أسابيع',
    method: 'يخلط مع التربة السطحية مع الري',
    benefits: ['يخفض pH بسرعة', 'يحسن امتصاص العناصر الصغرى', 'يقاوم بعض أمراض التربة', 'أسرع تأثيراً من الجبس'],
    suitable: 'الأراضي القلوية (pH > 8)',
    cost: 'منخفضة إلى متوسطة', duration: 'موسم زراعي واحد'
  },
  {
    id: 'lime', name: 'الجير الزراعي (Lime)', icon: '⬜',
    purpose: 'رفع pH التربة الحمضية',
    rate: '2-4 طن/هكتار', timing: 'خريف - قبل الحراثة',
    method: 'ينثر ويخلط مع التربة جيداً',
    benefits: ['يرفع pH التربة الحمضية', 'يزود التربة بالكالسيوم', 'يحسن نشاط البكتيريا النافعة', 'يحسن بنية التربة'],
    suitable: 'الأراضي الحمضية (pH < 6) - نادرة في الأنبار',
    cost: 'منخفضة', duration: '3-5 سنوات'
  },
  {
    id: 'organic', name: 'السماد العضوي (كمبوست)', icon: '🌿',
    purpose: 'زيادة المادة العضوية وتحسين الخصوبة',
    rate: '10-30 طن/هكتار', timing: 'قبل الزراعة بشهر',
    method: 'ينثر ويحرث مع التربة',
    benefits: ['يزيد المادة العضوية', 'يحسن احتفاظ التربة بالماء', 'ينشط الكائنات الدقيقة', 'يحرر العناصر الغذائية ببطء', 'أهم معالجة للتربة الرملية والفقيرة'],
    suitable: 'جميع أنواع التربة - خاصة الرملية والفقيرة',
    cost: 'متوسطة إلى عالية', duration: 'يحتاج تجديد سنوي'
  },
  {
    id: 'deep-plowing', name: 'الحراثة العميقة (Subsoiling)', icon: '🚜',
    purpose: 'تكسير الطبقة الصماء وتحسين التصريف',
    rate: 'عمق 60-80 سم', timing: 'خريف - عندما تكون التربة جافة',
    method: 'استخدام محراث تحت التربة (جرار > 150 حصان)',
    benefits: ['تكسر الطبقة الصماء', 'تحسن نفاذية المياه', 'تزيد عمق الجذور', 'تقلل ملوحة السطح', 'تحسن تهوية التربة'],
    suitable: 'الأراضي الثقيلة والمضغوطة',
    cost: 'عالية (تحتاج جرار قوي)', duration: 'كل 3-4 سنوات'
  }
];

const saltTolerantCrops = [
  { crop: 'شعير',       tolerance: 'عالي (حتى 12 ديسي/م)',      yield: 'جيد في الملوحة العالية' },
  { crop: 'بنجر سكري',  tolerance: 'عالي (حتى 10 ديسي/م)',      yield: 'محصول ممتاز للأراضي المالحة' },
  { crop: 'قطن',        tolerance: 'عالي (حتى 10 ديسي/م)',       yield: 'يتحمل الملوحة جيداً' },
  { crop: 'برسيم',      tolerance: 'متوسط إلى عالي (حتى 8 ديسي/م)', yield: 'يتأثر ولكن يبقى منتجاً' },
  { crop: 'طماطم',      tolerance: 'متوسط (حتى 4 ديسي/م)',       yield: 'بعض الأصناف تتحمل' },
  { crop: 'باذنجان',    tolerance: 'متوسط (حتى 4 ديسي/م)',       yield: 'مقاومة متوسطة' }
];

const cropRotationPlans = [
  {
    name: 'دورة 3 سنوات للأراضي المتوسطة',
    years: [
      { year: 1, crops: ['بقوليات (فول / عدس)', 'برسيم'],   benefit: 'تثبيت النيتروجين - تحسين التربة' },
      { year: 2, crops: ['قمح', 'شعير'],                     benefit: 'استفادة من النيتروجين المتبقي' },
      { year: 3, crops: ['ذرة', 'خضروات'],                   benefit: 'تنويع - مكافحة آفات' }
    ]
  },
  {
    name: 'دورة 4 سنوات للأراضي الجيدة',
    years: [
      { year: 1, crops: ['برسيم حجازي (جت)'],                benefit: 'تثبيت نيتروجين - تحسين عميق للتربة' },
      { year: 2, crops: ['برسيم حجازي (جت)'],                benefit: 'استمرار التحسين - إنتاج أعلاف' },
      { year: 3, crops: ['قمح', 'ذرة'],                      benefit: 'استفادة قصوى من النيتروجين' },
      { year: 4, crops: ['خضروات', 'بطاطا'],                 benefit: 'تنويع - عائد اقتصادي أعلى' }
    ]
  },
  {
    name: 'دورة استصلاح الأراضي المالحة',
    years: [
      { year: 1, crops: ['شعير'],                            benefit: 'مقاومة عالية للملوحة - بدء الغسيل' },
      { year: 2, crops: ['برسيم'],                           benefit: 'تحسين التربة - غسيل مستمر' },
      { year: 3, crops: ['بنجر سكري', 'قطن'],               benefit: 'محاصيل اقتصادية متحملة' },
      { year: 4, crops: ['قمح'],                             benefit: 'عودة للمحاصيل الحساسة تدريجياً' }
    ]
  }
];

const SoilReclamation = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [soilInputs, setSoilInputs] = useState({
    ph: '7.5', ec: '2', n: '30', p: '10',
    k: '200', organicMatter: '1.2', soilType: 'غرينية', area: '10'
  });

  const set = (key, val) => setSoilInputs(prev => ({ ...prev, [key]: val }));

  const analysis = (() => {
    const ph = Number(soilInputs.ph);
    const ec = Number(soilInputs.ec);
    const n  = Number(soilInputs.n);
    const p  = Number(soilInputs.p);
    const k  = Number(soilInputs.k);
    const om = Number(soilInputs.organicMatter);

    return [
      {
        label: 'الرقم الهيدروجيني (pH)',
        value: ph,
        status: ph < 6 ? 'حمضي' : ph > 8 ? 'قلوي' : 'مثالي',
        color:  ph >= 6 && ph <= 8 ? colors.green : colors.orange,
        rec:    ph < 6  ? 'أضف جير زراعي 2-4 طن/هكتار' :
                ph > 8  ? 'أضف كبريت زراعي 500-1000 كغ/هكتار أو جبس زراعي 2-3 طن/هكتار' :
                          'الرقم الهيدروجيني مثالي - لا تحتاج معالجة'
      },
      {
        label: 'الملوحة (EC)',
        value: `${ec} ديسي/م`,
        status: ec < 2 ? 'غير مالح' : ec < 4 ? 'قليل الملوحة' : ec < 8 ? 'متوسط' : ec < 16 ? 'عالي' : 'شديد',
        color:  ec < 2 ? colors.green : ec < 4 ? colors.lime : ec < 8 ? colors.orange : colors.red,
        rec:    ec < 2  ? 'لا تحتاج غسيل' :
                ec < 4  ? 'غسيل خفيف: 500-1000 م³/هكتار' :
                ec < 8  ? 'غسيل متوسط: 1500-2500 م³/هكتار' :
                ec < 16 ? 'غسيل كثيف: 3000-5000 م³/هكتار + جبس زراعي' :
                          'استصلاح مكثف: 5000+ م³/هكتار + جبس + محاصيل مقاومة للملوحة'
      },
      {
        label: 'النيتروجين (N)',
        value: `${n} ppm`,
        status: n < 20 ? 'منخفض جداً' : n < 40 ? 'منخفض' : n < 80 ? 'متوسط' : 'جيد',
        color:  n >= 40 ? colors.green : colors.orange,
        rec:    `أضف ${n < 40 ? 150 : n < 80 ? 100 : 50} كغ نيتروجين/هكتار`
      },
      {
        label: 'الفوسفور (P)',
        value: `${p} ppm`,
        status: p < 5 ? 'منخفض جداً' : p < 10 ? 'منخفض' : p < 20 ? 'متوسط' : 'جيد',
        color:  p >= 10 ? colors.green : colors.orange,
        rec:    `أضف ${p < 10 ? 120 : p < 20 ? 80 : 40} كغ فوسفور/هكتار`
      },
      {
        label: 'البوتاسيوم (K)',
        value: `${k} ppm`,
        status: k < 100 ? 'منخفض' : k < 200 ? 'متوسط' : k < 300 ? 'جيد' : 'عالي',
        color:  k >= 150 ? colors.green : colors.orange,
        rec:    `أضف ${k < 200 ? 100 : 50} كغ بوتاسيوم/هكتار`
      },
      {
        label: 'المادة العضوية',
        value: `${om}%`,
        status: om < 1 ? 'فقيرة جداً' : om < 2 ? 'فقيرة' : om < 3 ? 'متوسطة' : om < 5 ? 'جيدة' : 'ممتازة',
        color:  om >= 2 ? colors.green : colors.orange,
        rec:    om < 2 ? 'أضف 20-30 طن سماد عضوي/هكتار' :
                om < 3 ? 'أضف 10-15 طن سماد عضوي/هكتار' :
                         'استمر في إضافة 5-10 طن/هكتار سنوياً للمحافظة'
      }
    ];
  })();

  const leachingCalc = (() => {
    const ec   = Number(soilInputs.ec);
    const area = Number(soilInputs.area) || 1;
    if (ec < 2) return null;
    const lf  = ec < 4 ? 0.10 : ec < 8 ? 0.20 : ec < 12 ? 0.30 : 0.40;
    const wph = 300 * lf;
    return {
      lf:   (lf * 100).toFixed(0),
      wph:  wph.toFixed(0),
      total: (wph * area).toFixed(0),
      gypsum: ec > 4 ? (area * 3).toFixed(0) : 0
    };
  })();

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>🌱 تأهيل الأراضي وتحسين التربة</h2>

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

      {/* ── تحليل التربة ── */}
      {activeTab === 'analysis' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
            <h3 style={{ color: colors.dark, marginBottom: '16px' }}>أدخل نتائج تحليل التربة</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 16px' }}>
              <Field label="pH الرقم الهيدروجيني" type="number" value={soilInputs.ph} onChange={v => set('ph', v)} hint="المثالي: 6-8" />
              <Field label="الملوحة EC (ديسي/م)" type="number" value={soilInputs.ec} onChange={v => set('ec', v)} hint="المثالي: أقل من 2" />
              <Field label="نيتروجين N (ppm)" type="number" value={soilInputs.n} onChange={v => set('n', v)} />
              <Field label="فوسفور P (ppm)" type="number" value={soilInputs.p} onChange={v => set('p', v)} />
              <Field label="بوتاسيوم K (ppm)" type="number" value={soilInputs.k} onChange={v => set('k', v)} />
              <Field label="مادة عضوية (%)" type="number" value={soilInputs.organicMatter} onChange={v => set('organicMatter', v)} hint="المثالي: أكثر من 2%" />
              <Field label="نوع التربة" type="select" options={['رملية', 'غرينية', 'طينية', 'مختلطة']} value={soilInputs.soilType} onChange={v => set('soilType', v)} />
              <Field label="المساحة (هكتار)" type="number" value={soilInputs.area} onChange={v => set('area', v)} />
            </div>
          </div>

          <div style={{ backgroundColor: colors.soil + '15', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ color: colors.soil, marginBottom: '16px' }}>📊 تفسير النتائج والتوصيات</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {analysis.map((item, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px', borderRight: `4px solid ${item.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ color: colors.dark }}>{item.label}</strong>
                    <span style={{ color: item.color, fontWeight: 'bold' }}>{item.status}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: colors.soil, marginBottom: '6px' }}>القيمة: {item.value}</div>
                  <div style={{ fontSize: '13px', padding: '8px', backgroundColor: colors.cream, borderRadius: '6px' }}>
                    💡 {item.rec}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── تحسين التربة ── */}
      {activeTab === 'improvement' && (
        <div style={{ display: 'grid', gap: '14px' }}>
          {improvementMethods.map(m => (
            <div key={m.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', border: `1px solid ${colors.sand}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '30px' }}>{m.icon}</span>
                <div>
                  <h3 style={{ color: colors.dark, margin: '0 0 4px' }}>{m.name}</h3>
                  <div style={{ fontSize: '13px', color: colors.soil }}>{m.purpose}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px', fontSize: '13px' }}>
                <div>⚖️ <strong>المعدل:</strong> {m.rate}</div>
                <div>📅 <strong>التوقيت:</strong> {m.timing}</div>
                <div>💰 <strong>التكلفة:</strong> {m.cost}</div>
                <div>⏱️ <strong>مدة التأثير:</strong> {m.duration}</div>
              </div>
              <div style={{ fontSize: '13px', marginBottom: '10px' }}>🔧 <strong>طريقة التطبيق:</strong> {m.method}</div>
              <div style={{ fontWeight: 'bold', color: colors.green, marginBottom: '6px', fontSize: '13px' }}>✅ الفوائد:</div>
              <ul style={{ paddingRight: '18px', margin: '0 0 10px', fontSize: '13px' }}>
                {m.benefits.map((b, i) => <li key={i} style={{ marginBottom: '3px' }}>{b}</li>)}
              </ul>
              <div style={{ padding: '8px 12px', backgroundColor: colors.gold + '25', borderRadius: '6px', fontSize: '13px' }}>
                💡 <strong>مناسب لـ:</strong> {m.suitable}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── معالجة الملوحة ── */}
      {activeTab === 'salinity' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
            <h3 style={{ color: colors.dark, marginBottom: '16px' }}>💧 حاسبة مياه الغسيل</h3>
            <Field label="الملوحة EC (ديسي/م)" type="number" value={soilInputs.ec} onChange={v => set('ec', v)} />
            <Field label="المساحة (هكتار)" type="number" value={soilInputs.area} onChange={v => set('area', v)} />

            {leachingCalc ? (
              <div style={{ marginTop: '16px', padding: '16px', backgroundColor: colors.orange + '18', borderRadius: '8px' }}>
                <h4 style={{ color: colors.orange, marginBottom: '12px' }}>نتائج الحساب</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '14px' }}>
                  <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ color: colors.soil, fontSize: '12px' }}>نسبة الغسيل المطلوبة</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.orange }}>{leachingCalc.lf}%</div>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ color: colors.soil, fontSize: '12px' }}>مياه الغسيل / هكتار</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.sky }}>{leachingCalc.wph} م³</div>
                  </div>
                  <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', gridColumn: 'span 2' }}>
                    <div style={{ color: colors.soil, fontSize: '12px' }}>إجمالي مياه الغسيل</div>
                    <div style={{ fontSize: '22px', fontWeight: 'bold', color: colors.red }}>{leachingCalc.total} م³</div>
                  </div>
                  {leachingCalc.gypsum > 0 && (
                    <div style={{ backgroundColor: 'white', padding: '10px', borderRadius: '8px', gridColumn: 'span 2' }}>
                      <div style={{ color: colors.soil, fontSize: '12px' }}>الجبس الزراعي المطلوب (للمساعدة)</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: colors.soil }}>{leachingCalc.gypsum} طن</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: colors.green + '18', borderRadius: '8px', color: colors.green, fontSize: '14px' }}>
                ✅ تربة غير مالحة - لا تحتاج غسيل
              </div>
            )}
          </div>

          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px' }}>
            <h3 style={{ color: colors.dark, marginBottom: '14px' }}>🌾 محاصيل مقاومة للملوحة</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: colors.dark, color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'right' }}>المحصول</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>درجة التحمل</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>الإنتاجية</th>
                  </tr>
                </thead>
                <tbody>
                  {saltTolerantCrops.map((c, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${colors.sand}`, backgroundColor: i % 2 === 0 ? 'white' : colors.cream }}>
                      <td style={{ padding: '10px', fontWeight: 'bold' }}>{c.crop}</td>
                      <td style={{ padding: '10px', color: colors.soil }}>{c.tolerance}</td>
                      <td style={{ padding: '10px' }}>{c.yield}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── الدورة الزراعية ── */}
      {activeTab === 'rotation' && (
        <div style={{ display: 'grid', gap: '16px' }}>
          {cropRotationPlans.map((plan, idx) => (
            <div key={idx} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ color: colors.wheat, marginBottom: '14px' }}>{plan.name}</h3>
              {plan.years.map((y, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '10px', marginBottom: '8px', backgroundColor: i % 2 === 0 ? colors.cream : 'white', borderRadius: '8px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: colors.wheat, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                    {y.year}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', color: colors.dark, marginBottom: '3px' }}>{y.crops.join(' - ')}</div>
                    <div style={{ fontSize: '13px', color: colors.soil }}>{y.benefit}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div style={{ padding: '16px', backgroundColor: colors.gold + '25', borderRadius: '12px' }}>
            <h4 style={{ color: colors.dark, marginBottom: '10px' }}>💡 قواعد أساسية للدورة الزراعية</h4>
            <ul style={{ paddingRight: '20px', color: colors.soil, lineHeight: '2', fontSize: '14px' }}>
              <li>لا تزرع نفس المحصول في نفس الأرض سنتين متتاليتين</li>
              <li>أدخل محصولاً بقولياً كل 2-3 سنوات لتثبيت النيتروجين</li>
              <li>تجنب زراعة محاصيل من نفس العائلة بعدها (طماطم بعد بطاطا)</li>
              <li>المحاصيل العميقة الجذور (برسيم) تحسن بنية التربة بعمق</li>
              <li>الحبوب تستفيد من النيتروجين المتبقي من البقوليات</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── السماد العضوي ── */}
      {activeTab === 'organic' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
            <h3 style={{ color: colors.dark, marginBottom: '16px' }}>🧑‍🌾 إنتاج الكمبوست في المزرعة</h3>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: colors.green, marginBottom: '10px' }}>✅ مواد مناسبة للتسميد:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {['مخلفات المحاصيل (تبن - قش)', 'روث الحيوانات (أبقار - أغنام - دواجن)', 'أوراق الأشجار', 'بقايا الخضروات والغذاء النباتي'].map((item, i) => (
                  <div key={i} style={{ padding: '10px', backgroundColor: colors.lime + '18', borderRadius: '8px', fontSize: '13px' }}>✅ {item}</div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: colors.red, marginBottom: '10px' }}>❌ تجنب إضافة:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {['اللحوم والعظام (تجلب القوارض)', 'الزيوت والدهون', 'النباتات المريضة', 'الأعشاب ذات البذور الناضجة'].map((item, i) => (
                  <div key={i} style={{ padding: '10px', backgroundColor: colors.red + '10', borderRadius: '8px', fontSize: '13px' }}>❌ {item}</div>
                ))}
              </div>
            </div>

            <h4 style={{ color: colors.sky, marginBottom: '10px' }}>📋 خطوات التصنيع:</h4>
            <ol style={{ paddingRight: '20px', lineHeight: '2', fontSize: '14px', color: colors.dark }}>
              <li><strong>التجميع:</strong> نسبة 3 أجزاء كربون (جاف) : 1 جزء نيتروجين (أخضر)</li>
              <li><strong>التكويم:</strong> ارتفاع 1-1.5 م وعرض 2-3 م</li>
              <li><strong>الترطيب:</strong> رطوبة 50-60% (مثل الإسفنجة المعصورة جيداً)</li>
              <li><strong>التقليب:</strong> كل 7-10 أيام للتهوية وتسريع التحلل</li>
              <li><strong>النضج:</strong> خلال 2-4 أشهر - لون بني غامق ورائحة ترابية طيبة</li>
            </ol>
          </div>

          <div style={{ backgroundColor: colors.gold + '25', padding: '16px', borderRadius: '12px' }}>
            <h4 style={{ color: colors.dark, marginBottom: '10px' }}>📊 معدلات الاستخدام الموصى بها:</h4>
            <div style={{ display: 'grid', gap: '8px', fontSize: '14px' }}>
              {[
                ['المحاصيل الحقلية (قمح - ذرة)', '10-15 طن/هكتار'],
                ['الخضروات',                       '20-30 طن/هكتار'],
                ['الأشجار المثمرة والنخيل',        '20-30 كغ/شجرة'],
                ['تحسين الأراضي الرملية الفقيرة',  '30-40 طن/هكتار']
              ].map(([label, val], i) => (
                <div key={i} style={{ backgroundColor: 'white', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{label}</span>
                  <strong style={{ color: colors.green }}>{val}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilReclamation;
