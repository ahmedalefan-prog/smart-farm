import React from 'react';
import { colors } from '../theme/theme';

const HelpSection = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>❓ دليل الاستخدام</h2>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ color: colors.green, marginBottom: '16px' }}>🎯 كيف تبدأ؟</h3>
        <ol style={{ paddingRight: '20px', lineHeight: '2', color: colors.soil }}>
          <li>اضغط على زر <strong>➕</strong> لإضافة أول قطعة أرض أو قطيع</li>
          <li>املأ بيانات مزرعتك الفعلية (مساحات، أعداد الحيوانات)</li>
          <li>سجل <strong>سجل يومي</strong> لمتابعة الإنتاج والطقس</li>
          <li>راقب <strong>التنبيهات</strong> 🔔 للبقاء على اطلاع</li>
          <li>استخدم <strong>فلوكي</strong> للحصول على نصائح مخصصة</li>
        </ol>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ color: colors.purple, marginBottom: '16px' }}>📱 الأقسام الرئيسية</h3>
        <div style={{ lineHeight: '2', color: colors.soil, fontSize: '14px' }}>
          <div style={{ padding: '6px 0', borderBottom: `1px solid ${colors.cream}` }}>🏠 <strong>الرئيسية:</strong> ملخص سريع وتنبيهات وسجل يومي</div>
          <div style={{ padding: '6px 0', borderBottom: `1px solid ${colors.cream}` }}>🌾 <strong>المحاصيل:</strong> 13 محصول مع تفاصيل الزراعة والتسميد والتدوير</div>
          <div style={{ padding: '6px 0', borderBottom: `1px solid ${colors.cream}` }}>🥬 <strong>الخضروات:</strong> 20 خضرة مخصصة لمنطقة جزيرة الخالدية</div>
          <div style={{ padding: '6px 0', borderBottom: `1px solid ${colors.cream}` }}>🐄 <strong>الحيوانية:</strong> متابعة الأبقار والأغنام والدواجن والأسماك</div>
          <div style={{ padding: '6px 0', borderBottom: `1px solid ${colors.cream}` }}>🌿 <strong>الأعلاف:</strong> مخزون ووصفات وحاسبة تجميعية</div>
          <div style={{ padding: '6px 0', borderBottom: `1px solid ${colors.cream}` }}>♻️ <strong>الدورة:</strong> تحليل تدفق الموارد ومؤشرات الاكتفاء الذاتي</div>
          <div style={{ padding: '6px 0', borderBottom: `1px solid ${colors.cream}` }}>📚 <strong>الموسوعة:</strong> 19 سلالة حيوانية مع أمراض ولقاحات ومنشآت</div>
          <div style={{ padding: '6px 0' }}>🪖 <strong>فلوكي:</strong> مستشار ذكي يجيب على استفساراتك بناءً على بيانات مزرعتك</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ color: colors.wheat, marginBottom: '16px' }}>📋 زر ➕ ماذا يضيف؟</h3>
        <div style={{ lineHeight: '2', color: colors.soil, fontSize: '14px' }}>
          <div>📝 <strong>سجل يومي:</strong> درجات الحرارة، إنتاج الحليب، استهلاك العلف، ملاحظات</div>
          <div>🌾 <strong>قطعة أرض:</strong> اسم القطعة، المساحة، نوع التربة، طريقة الري</div>
          <div>🐄 <strong>قطيع أبقار:</strong> السلالة، العدد، الغرض، تاريخ الميلاد</div>
          <div>🐔 <strong>قطيع دواجن:</strong> النوع، العدد، تاريخ التفريخ</div>
          <div>🐟 <strong>حوض أسماك:</strong> النوع، الحجم، الكثافة</div>
          <div>🌿 <strong>مادة علفية:</strong> اسم المادة، الكمية، الوحدة، تاريخ الانتهاء</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ color: colors.sky, marginBottom: '16px' }}>📐 وحدات القياس المستخدمة</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <div style={{ backgroundColor: colors.wheat + '25', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>🟫</div>
            <div style={{ fontWeight: 'bold', color: colors.dark, fontSize: '16px' }}>الدونم</div>
            <div style={{ fontSize: '13px', color: colors.soil, marginTop: '4px' }}>= <strong style={{ color: colors.green }}>2500 م²</strong></div>
            <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>= 50 × 50 متر</div>
          </div>
          <div style={{ backgroundColor: colors.green + '20', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>🟩</div>
            <div style={{ fontWeight: 'bold', color: colors.dark, fontSize: '16px' }}>الهكتار</div>
            <div style={{ fontSize: '13px', color: colors.soil, marginTop: '4px' }}>= <strong style={{ color: colors.green }}>10,000 م²</strong></div>
            <div style={{ fontSize: '11px', color: colors.soil, marginTop: '2px' }}>= 100 × 100 متر</div>
          </div>
        </div>
        <div style={{ backgroundColor: colors.cream, borderRadius: '8px', padding: '12px', fontSize: '13px', color: colors.soil, lineHeight: '2' }}>
          <div>🔁 <strong style={{ color: colors.dark }}>1 هكتار</strong> = <strong style={{ color: colors.green }}>4 دونمات</strong></div>
          <div>🔁 <strong style={{ color: colors.dark }}>1 دونم</strong> = <strong style={{ color: colors.green }}>0.25 هكتار</strong></div>
          <div>📌 <strong style={{ color: colors.dark }}>10 دونمات</strong> = <strong style={{ color: colors.green }}>25,000 م²</strong> = 2.5 هكتار</div>
          <div style={{ marginTop: '6px', padding: '8px', backgroundColor: colors.sky + '15', borderRadius: '6px', fontSize: '12px' }}>
            💡 التطبيق يستخدم <strong>الدونم</strong> كوحدة قياس رئيسية لأنها الأشيع في الأنبار والعراق
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: colors.green + '15', borderRadius: '12px', padding: '20px', marginBottom: '16px', borderRight: `4px solid ${colors.green}` }}>
        <h3 style={{ color: colors.green, marginBottom: '12px' }}>💡 نصائح مهمة</h3>
        <ul style={{ paddingRight: '20px', lineHeight: '2', color: colors.soil, fontSize: '14px' }}>
          <li>صدّر بياناتك بانتظام من <strong>الإعدادات ⚙️</strong> للنسخ الاحتياطي</li>
          <li>سجل السجل اليومي كل يوم للحصول على تحليلات دقيقة</li>
          <li>راقب مؤشرات <strong>الدورة المغلقة</strong> لتحسين الاكتفاء الذاتي تدريجياً</li>
          <li>استخدم حاسبة الأعلاف لتخطيط احتياجاتك الشهرية مسبقاً</li>
          <li>⚠️ <strong>الكارب:</strong> اشترِ إصبعيات من مصادر موثوقة - خطر فيروس KHV قاتل</li>
          <li>⚠️ <strong>السورغم:</strong> لا ترعَ أو تحش قبل 60 سم - خطر تسمم</li>
        </ul>
      </div>

      <div style={{ backgroundColor: colors.cream, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
        <p style={{ color: colors.soil, fontSize: '13px', lineHeight: '1.8' }}>
          🌾 <strong>المزرعة الذكية</strong> - نظام إدارة متكامل للاكتفاء الذاتي<br />
          مصمم خصيصاً لمنطقة جزيرة الخالدية - الأنبار - العراق<br />
          <span style={{ color: colors.green }}>الإصدار 1.0 - 2025</span>
        </p>
      </div>
    </div>
  );
};

export default HelpSection;
