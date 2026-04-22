import React, { useState, useMemo } from 'react';
import { colors } from '../theme/theme';

const breeds = [
  // أبقار - 6 سلالات
  { id: 'holstein', name: 'هولشتاين', animal: 'أبقار', icon: '🐄', origin: 'هولندا', purpose: 'حليب',
    pros: ['أعلى إنتاج حليب في العالم', 'كفاءة تحويل عالية', 'تتكيف مع الأنظمة المكثفة'],
    cons: ['حساسة للإجهاد الحراري', 'تحتاج رعاية بيطرية مكثفة', 'مقاومة أقل للأمراض'],
    tempIdeal: '10-20°م', tempMax: '30°م',
    breedingPeriod: 'حمل 9 شهور - إنتاج 305 يوم', milkProduction: '8000-12000 لتر/سنة',
    diseases: [
      { name: 'التهاب الضرع', symptoms: 'تورم الضرع - تغير لون الحليب', treatment: 'مضادات حيوية - تجفيف', prevention: 'نظافة الحظيرة - تعقيم الحلمات' },
      { name: 'حمى الحليب', symptoms: 'ضعف - عدم القدرة على الوقوف', treatment: 'كالسيوم وريدي', prevention: 'غذاء متوازن قبل الولادة' }
    ],
    vaccines: [
      { name: 'الحمى القلاعية', timing: 'كل 6 أشهر', notes: 'إلزامي في العراق' },
      { name: 'البروسيلا', timing: 'سنوياً للإناث', notes: 'من عمر 4-8 شهور' }
    ] },

  { id: 'angus', name: 'أنجوس', animal: 'أبقار', icon: '🐂', origin: 'اسكتلندا', purpose: 'لحم',
    pros: ['جودة لحم ممتازة (رخامي)', 'سهولة الولادة', 'تتحمل الظروف القاسية', 'كفاءة تحويل عالية'],
    cons: ['بطيئة النمو نسبياً', 'حساسة للحرارة العالية', 'لون أسود يمتص الحرارة'],
    tempIdeal: '5-25°م', tempMax: '35°م',
    breedingPeriod: 'حمل 9 شهور - عجول صغيرة الحجم', weightGain: '1.2-1.5 كغ/يوم',
    diseases: [
      { name: 'الإجهاد الحراري', symptoms: 'لهاث - قلة أكل', treatment: 'تبريد - مياه باردة', prevention: 'مراوح - رشاشات' }
    ],
    vaccines: [
      { name: 'الحمى القلاعية', timing: 'كل 6 أشهر' },
      { name: 'الكلوستريديا', timing: 'سنوياً' }
    ] },

  { id: 'brahman', name: 'براهمان', animal: 'أبقار', icon: '🐃', origin: 'الهند/أمريكا', purpose: 'لحم - مقاومة الحرارة',
    pros: ['مقاومة ممتازة للحرارة والرطوبة', 'مقاومة للأمراض والطفيليات', 'تعيش في ظروف قاسية', 'سنام مميز'],
    cons: ['جودة لحم أقل', 'نمو أبطأ', 'لحوم أقل طراوة'],
    tempIdeal: '20-35°م', tempMax: '45°م',
    breedingPeriod: 'حمل 9.5 شهور', weightGain: '1.0-1.3 كغ/يوم',
    diseases: [
      { name: 'مقاومة طبيعية عالية', symptoms: '-', treatment: '-', prevention: 'أقل احتياجاً للرعاية من السلالات الأوروبية' }
    ],
    vaccines: [
      { name: 'الحمى القلاعية', timing: 'كل 6 أشهر' }
    ] },

  { id: 'simmental', name: 'سيمنتال', animal: 'أبقار', icon: '🐄', origin: 'سويسرا', purpose: 'حليب ولحم (ثنائي الغرض)',
    pros: ['إنتاج حليب جيد', 'نمو سريع للعجول', 'قوة تحمل', 'خصوبة عالية'],
    cons: ['حجم كبير يحتاج مساحة', 'استهلاك علف أعلى'],
    tempIdeal: '5-20°م', tempMax: '32°م',
    breedingPeriod: 'حمل 9 شهور', milkProduction: '6000-9000 لتر/سنة', weightGain: '1.3-1.6 كغ/يوم',
    diseases: [
      { name: 'التهاب الضرع', symptoms: 'تورم', treatment: 'مضادات حيوية', prevention: 'نظافة ونظام حلب منتظم' }
    ],
    vaccines: [
      { name: 'الحمى القلاعية', timing: 'كل 6 أشهر' },
      { name: 'البروسيلا', timing: 'سنوياً' }
    ] },

  { id: 'baladi', name: 'بلدي (جنوبي)', animal: 'أبقار', icon: '🐮', origin: 'العراق', purpose: 'حليب ولحم - محلي',
    pros: ['متأقلمة تماماً مع المناخ المحلي', 'مقاومة للأمراض المحلية', 'تحمل الحرارة والجفاف', 'قليلة التكاليف'],
    cons: ['إنتاجية منخفضة', 'بطيئة النمو', 'حجم صغير'],
    tempIdeal: '15-40°م', tempMax: '48°م',
    breedingPeriod: 'حمل 9 شهور', milkProduction: '1500-2500 لتر/سنة', weightGain: '0.7-1.0 كغ/يوم',
    diseases: [
      { name: 'مقاومة عالية للأمراض المحلية', symptoms: '-', treatment: '-', prevention: 'أقل عرضة للأمراض' }
    ],
    vaccines: [
      { name: 'الحمى القلاعية', timing: 'سنوياً' }
    ] },

  { id: 'friesian', name: 'فريزيان', animal: 'أبقار', icon: '🐄', origin: 'ألمانيا/هولندا', purpose: 'حليب',
    pros: ['إنتاج حليب عالي', 'ضرع مثالي للحلب الآلي', 'هدوء الطباع'],
    cons: ['حساسة للحرارة', 'تحتاج عناية مكثفة'],
    tempIdeal: '10-20°م', tempMax: '28°م',
    breedingPeriod: 'حمل 9 شهور', milkProduction: '7000-10000 لتر/سنة',
    diseases: [
      { name: 'العرج', symptoms: 'صعوبة المشي', treatment: 'تقليم أظلاف', prevention: 'أرضية جافة ونظيفة' }
    ],
    vaccines: [
      { name: 'الحمى القلاعية', timing: 'كل 6 أشهر' }
    ] },

  // أغنام - 5 سلالات
  { id: 'awassi', name: 'عواسي', animal: 'أغنام', icon: '🐑', origin: 'الشرق الأوسط', purpose: 'حليب ولحم وصوف',
    pros: ['متأقلمة مع المنطقة', 'إنتاج حليب جيد', 'صوف خشن متعدد الاستخدامات', 'تتحمل الظروف القاسية'],
    cons: ['صوف أقل جودة من المارينو', 'نمو متوسط'],
    tempIdeal: '10-35°م', tempMax: '42°م',
    breedingPeriod: 'حمل 5 شهور - توأم شائع', milkProduction: '200-400 لتر/موسم', weightGain: '200-300 غ/يوم',
    diseases: [
      { name: 'جدري الأغنام', symptoms: 'حبوب جلدية', treatment: 'عزل - مضادات حيوية ثانوية', prevention: 'لقاح سنوي' },
      { name: 'الالتهاب الرئوي', symptoms: 'كحة - صعوبة تنفس', treatment: 'مضادات حيوية', prevention: 'تهوية جيدة' }
    ],
    vaccines: [
      { name: 'جدري الأغنام', timing: 'سنوياً', notes: 'إلزامي' },
      { name: 'الحمى القلاعية', timing: 'كل 6-8 أشهر' }
    ] },

  { id: 'najdi', name: 'نجدي', animal: 'أغنام', icon: '🐏', origin: 'نجد - السعودية', purpose: 'لحم وصوف',
    pros: ['تتحمل الحرارة والجفاف', 'لحم طيب', 'وجه مميز (أسود)', 'ترعى في ظروف قاسية'],
    cons: ['إنتاج حليب منخفض', 'حجم متوسط'],
    tempIdeal: '15-40°م', tempMax: '48°م',
    breedingPeriod: 'حمل 5 شهور', weightGain: '180-250 غ/يوم',
    diseases: [
      { name: 'الطفيليات الداخلية', symptoms: 'هزال - إسهال', treatment: 'مضادات طفيليات', prevention: 'تجريع دوري كل 3 شهور' }
    ],
    vaccines: [
      { name: 'جدري الأغنام', timing: 'سنوياً' },
      { name: 'الحمى القلاعية', timing: 'كل 6 أشهر' }
    ] },

  { id: 'merino', name: 'مارينو', animal: 'أغنام', icon: '🐑', origin: 'إسبانيا', purpose: 'صوف فاخر',
    pros: ['أفضل صوف في العالم', 'ناعم - كثيف - عالي القيمة', 'يتكيف مع مناخات مختلفة'],
    cons: ['حساس للحرارة العالية', 'يحتاج جز منتظم', 'عرضة للإصابة بالحشرات'],
    tempIdeal: '5-20°م', tempMax: '30°م',
    breedingPeriod: 'حمل 5 شهور', woolProduction: '4-6 كغ/سنة',
    diseases: [
      { name: 'ذبابة الصوف', symptoms: 'يرقات في الصوف', treatment: 'مبيدات حشرية', prevention: 'جز منتظم - قص منطقة الذيل' }
    ],
    vaccines: [
      { name: 'جدري الأغنام', timing: 'سنوياً' }
    ] },

  { id: 'niami', name: 'نعيمي', animal: 'أغنام', icon: '🐏', origin: 'سوريا/الأردن', purpose: 'لحم (طرائد)',
    pros: ['لحم ممتاز - طري', 'مطلوب بشدة في الأسواق', 'وجه بني مميز', 'خصوبة عالية'],
    cons: ['إنتاج حليب منخفض', 'حساس للرطوبة العالية'],
    tempIdeal: '10-30°م', tempMax: '38°م',
    breedingPeriod: 'حمل 5 شهور - توائم شائعة', weightGain: '250-350 غ/يوم',
    diseases: [
      { name: 'الحمى القلاعية', symptoms: 'تقرحات الفم', treatment: 'عزل - رعاية داعمة', prevention: 'لقاح دوري' }
    ],
    vaccines: [
      { name: 'جدري الأغنام', timing: 'سنوياً' },
      { name: 'الحمى القلاعية', timing: 'كل 6 أشهر' }
    ] },

  { id: 'dorper', name: 'دور (دورپر)', animal: 'أغنام', icon: '🐑', origin: 'جنوب أفريقيا', purpose: 'لحم',
    pros: ['نمو سريع جداً', 'جودة لحم عالية', 'خصوبة عالية - توائم', 'إنتاج على مدار السنة'],
    cons: ['حساس للبرودة الشديدة', 'يحتاج تغذية جيدة'],
    tempIdeal: '15-30°م', tempMax: '38°م',
    breedingPeriod: 'كل 8 شهور - توأم وثلاثة توائم شائعة', weightGain: '300-450 غ/يوم',
    diseases: [
      { name: 'الالتهاب الرئوي', symptoms: 'كحة - أنف سائل', treatment: 'مضادات حيوية', prevention: 'تهوية - تجنب الرطوبة' }
    ],
    vaccines: [
      { name: 'جدري الأغنام', timing: 'سنوياً' },
      { name: 'الحمى القلاعية', timing: 'كل 6 أشهر' },
      { name: 'الباستريلا', timing: 'كل 6 أشهر' }
    ] },

  // دواجن - 4 سلالات
  { id: 'ross308', name: 'روس 308', animal: 'دواجن', icon: '🐔', origin: 'عالمي', purpose: 'لحم (برويلر)',
    pros: ['أسرع نمو', 'كفاءة تحويل ممتازة (1.5-1.6 كغ علف/كغ لحم)', 'أكثر سلالة انتشاراً', 'تجانس عالي'],
    cons: ['حساسة للإجهاد الحراري', 'عرضة للاستسقاء', 'ضعف في الأرجل أحياناً'],
    tempIdeal: '20-25°م', tempMax: '32°م',
    breedingPeriod: 'دورة 35-42 يوم', weightGain: '2.5-3.0 كغ عند التسويق',
    diseases: [
      { name: 'الاستسقاء', symptoms: 'انتفاخ البطن - سائل', treatment: 'لا علاج - ذبح', prevention: 'تهوية جيدة - تقليل صوديوم العلف' },
      { name: 'الكوكسيديا', symptoms: 'إسهال دموي', treatment: 'أمبروليوم', prevention: 'مضادات كوكسيديا في العلف' },
      { name: 'النيوكاسل', symptoms: 'أعراض تنفسية وعصبية', treatment: 'لا علاج', prevention: 'لقاح إجباري' }
    ],
    vaccines: [
      { name: 'نيوكاسل', timing: 'يوم 7 و 21', notes: 'ماء شرب أو رذاذ' },
      { name: 'جمبورو', timing: 'يوم 14', notes: 'ماء شرب' },
      { name: 'برونشيت', timing: 'يوم 1', notes: 'رذاذ' }
    ] },

  { id: 'cobb500', name: 'كوب 500', animal: 'دواجن', icon: '🐔', origin: 'عالمي', purpose: 'لحم (برويلر)',
    pros: ['كفاءة تحويل ممتازة', 'صدر كبير', 'مقاومة أفضل للأمراض', 'منافس رئيسي لروس'],
    cons: ['حساسة للحرارة', 'تحتاج تهوية ممتازة'],
    tempIdeal: '20-25°م', tempMax: '32°م',
    breedingPeriod: 'دورة 38-42 يوم', weightGain: '2.7-3.2 كغ عند التسويق',
    diseases: [
      { name: 'الكوكسيديا', symptoms: 'إسهال', treatment: 'علاج دوائي', prevention: 'وقاية في العلف' }
    ],
    vaccines: [
      { name: 'نيوكاسل', timing: 'يوم 7 و 21' },
      { name: 'جمبورو', timing: 'يوم 14' }
    ] },

  { id: 'lohmann', name: 'لوهان براون', animal: 'دواجن', icon: '🐓', origin: 'ألمانيا', purpose: 'بيض',
    pros: ['إنتاج بيض عالي (320 بيضة/سنة)', 'بيض بني كبير', 'هادئة - مناسبة للأقفاص', 'كفاءة تحويل جيدة'],
    cons: ['حساسة للإضاءة', 'عرضة لأكل الريش'],
    tempIdeal: '18-24°م', tempMax: '30°م',
    breedingPeriod: 'إنتاج 14-16 شهر', eggProduction: '300-320 بيضة/سنة',
    diseases: [
      { name: 'التهاب القصبات', symptoms: 'صعوبة تنفس - صوت خشن', treatment: 'مضادات حيوية', prevention: 'لقاح برونشيت' }
    ],
    vaccines: [
      { name: 'نيوكاسل', timing: 'كل 3-4 أشهر' },
      { name: 'برونشيت', timing: 'كل 3 أشهر' }
    ] },

  { id: 'arbor', name: 'أربور أيكرز', animal: 'دواجن', icon: '🐔', origin: 'أمريكا', purpose: 'لحم (برويلر)',
    pros: ['نمو سريع', 'صدر كبير', 'جودة لحم جيدة'],
    cons: ['حساسة للحرارة', 'أقل انتشاراً من روس وكوب'],
    tempIdeal: '20-25°م', tempMax: '32°م',
    breedingPeriod: 'دورة 38-42 يوم', weightGain: '2.5-3.0 كغ',
    diseases: [
      { name: 'الكوكسيديا', symptoms: 'إسهال - هزال', treatment: 'علاج دوائي', prevention: 'وقاية في العلف' }
    ],
    vaccines: [
      { name: 'نيوكاسل', timing: 'يوم 7 و 21' }
    ] },

  // أسماك - 4 أنواع
  { id: 'tilapia', name: 'بلطي نيلي', animal: 'أسماك', icon: '🐟', origin: 'أفريقيا', purpose: 'استزراع',
    pros: ['سريع النمو', 'يتكاثر بسهولة في الأحواض', 'يتحمل كثافة عالية', 'يأكل أعلاف نباتية', 'مقاوم للأمراض'],
    cons: ['حساس للبرودة الشديدة', 'يتوقف عن الأكل تحت 18°م', 'تكاثر مفرط في الأحواض'],
    tempIdeal: '25-30°م', tempMax: '38°م', tempMin: '12°م (مميت)',
    breedingPeriod: 'تفريخ كل 4-6 أسابيع في الظروف المثالية',
    harvestWeight: '250-500 غ في 6-8 أشهر',
    density: '3-5 سمكة/م³ في الأحواض الترابية',
    feedConversion: '1.5-1.8 كغ علف/كغ سمك',
    diseases: [
      { name: 'بكتيريا السبحية', symptoms: 'عيون بارزة - انتفاخ البطن', treatment: 'مضادات حيوية في العلف', prevention: 'جودة مياه - عدم إجهاد الأسماك' },
      { name: 'الفطريات', symptoms: 'زغب أبيض على الجلد', treatment: 'ملح طعام - فورمالين', prevention: 'تجنب الجروح - نظافة الأحواض' }
    ],
    vaccines: [] },

  { id: 'carp', name: 'كارب (مبروك)', animal: 'أسماك', icon: '🐠', origin: 'آسيا/أوروبا', purpose: 'استزراع - استهلاك محلي',
    pros: ['يتحمل البرودة', 'يعيش في مياه عكرة', 'يتغذى على القاع', 'لحم مطلوب في العراق'],
    cons: ['نمو أبطأ من البلطي', 'عرضة لفيروس KHV القاتل', 'يحتاج علف غارق', 'كثافة أقل في الأحواض'],
    tempIdeal: '20-28°م', tempMax: '35°م', tempMin: '4°م (يتحمل)',
    breedingPeriod: 'تفريخ ربيعي فقط عند 18-20°م - لا يتكاثر في الأسر بسهولة',
    harvestWeight: '1-2 كغ في 12-18 شهر',
    density: '2 سمكة/م³ فقط في الأحواض الترابية',
    feedConversion: '2.0-2.5 كغ علف/كغ سمك',
    feedingHabit: 'يأكل من القاع - يحتاج علف غارق وليس طافٍ',
    diseases: [
      {
        name: '⚠️ فيروس KHV (هربس الكارب)',
        symptoms: 'نفوق جماعي مفاجئ (80-100%) - تآكل الخياشيم - سلوك غير طبيعي - بقع بيضاء على الخياشيم',
        treatment: 'لا يوجد علاج - إتلاف فوري للقطيع بالكامل',
        prevention: 'شراء إصبعيات من مصادر موثوقة - حجر صحي - تطهير الأحواض'
      },
      {
        name: 'قرحة الربيع',
        symptoms: 'تقرحات جلدية حمراء',
        treatment: 'ملح - مضادات حيوية',
        prevention: 'تجنب الإجهاد في فصل الربيع'
      }
    ],
    vaccines: [],
    specialNotes: [
      'دورة إنتاج 12-18 شهر (أطول من البلطي)',
      'يحتاج علف غارق - ليس طافٍ',
      'تفريخ ربيعي فقط عند 18-20°م',
      'كثافة قليلة: 2 سمكة/م³ فقط',
      '⚠️ خطر KHV: نفوق 100% - لا علاج - إتلاف فوري'
    ] },

  { id: 'seabream', name: 'دنيس (قاروص)', animal: 'أسماك', icon: '🐟', origin: 'البحر المتوسط', purpose: 'استزراع بحري',
    pros: ['لحم فاخر - سعر مرتفع', 'سريع النمو في الظروف المثالية', 'مطلوب في الأسواق'],
    cons: ['يحتاج مياه مالحة', 'حساس لجودة المياه', 'تكاليف استزراع أعلى'],
    tempIdeal: '18-26°م', tempMax: '30°م',
    breedingPeriod: 'يفرخ في المفرخات البحرية', harvestWeight: '300-400 غ في 12-16 شهر',
    density: 'منخفضة - يحتاج أكسجين عالٍ',
    diseases: [
      { name: 'الفيبريو', symptoms: 'نزيف - خمول', treatment: 'مضادات حيوية', prevention: 'نظافة الأحواض - تجنب الإجهاد' }
    ],
    vaccines: [] },

  { id: 'seabass', name: 'قاروس (سي باس)', animal: 'أسماك', icon: '🐟', origin: 'البحر المتوسط', purpose: 'استزراع بحري',
    pros: ['لحم أبيض ممتاز', 'سعر مرتفع', 'نمو سريع'],
    cons: ['يحتاج مياه مالحة أو قليلة الملوحة', 'حساس للأمراض', 'يأكل الأسماك الصغيرة'],
    tempIdeal: '20-28°م', tempMax: '32°م',
    breedingPeriod: 'يفرخ في المفرخات', harvestWeight: '400-500 غ في 12-18 شهر',
    density: 'منخفضة', feedType: 'علف بروتيني عالٍ (أسماك)',
    diseases: [
      { name: 'الفيبريو', symptoms: 'نزيف - فقدان شهية', treatment: 'مضادات حيوية', prevention: 'نظافة - تجنب الإجهاد' }
    ],
    vaccines: [] }
];

const facilities = [
  { id: 'feedlot', name: 'حظيرة تسمين مفتوحة', animal: 'أبقار', area: '15-25 م²/رأس', suitable: 'تسمين اللحم في مناخ جاف', notes: 'توفر ظل كافٍ وماء دائم' },
  { id: 'freestall', name: 'حظيرة حليب مغلقة', animal: 'أبقار', area: '8-12 م²/رأس', suitable: 'أبقار حلوب في مناخ حار', notes: 'تحتاج تبريد صناعي صيفاً' },
  { id: 'sheep-pen', name: 'زريبة أغنام مفتوحة', animal: 'أغنام', area: '1.5-2 م²/رأس', suitable: 'مناخ جاف معتدل', notes: 'توفر مظلة للولادة والفطام' },
  { id: 'poultry-open', name: 'عنبر دواجن مفتوح', animal: 'دواجن', area: '10-12 طير/م²', suitable: 'مناخ حار جاف - برويلر', notes: 'يعتمد على التهوية الطبيعية' },
  { id: 'poultry-closed', name: 'عنبر دواجن مغلق (كنترولد)', animal: 'دواجن', area: '12-16 طير/م²', suitable: 'إنتاج مكثف - كل المناخات', notes: 'تهوية ميكانيكية وتبريد تبخيري' },
  { id: 'fish-pond', name: 'حوض أسماك ترابي', animal: 'أسماك', area: '0.25-1 هكتار', suitable: 'بلطي وكارب', notes: 'عمق 1.5-2 متر، تهوية ضرورية عند الكثافة العالية' },
  { id: 'fish-tank', name: 'خزانات بلاستيكية (IBC)', animal: 'أسماك', area: '1000-2000 سمكة/م³', suitable: 'استزراع مكثف في مساحة صغيرة', notes: 'يحتاج فلترة وتهوية مستمرة' }
];

const animalFilters = ['الكل', 'أبقار', 'أغنام', 'دواجن', 'أسماك'];

const EncyclopediaSection = () => {
  const [activeTab, setActiveTab] = useState('breeds');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('الكل');
  const [expandedBreed, setExpandedBreed] = useState(null);

  const filteredBreeds = useMemo(() => {
    return breeds.filter(b => {
      const matchAnimal = selectedAnimal === 'الكل' || b.animal === selectedAnimal;
      const q = searchTerm.trim().toLowerCase();
      const matchSearch = !q || b.name.includes(q) || b.purpose.includes(q) || b.origin.includes(q) || b.animal.includes(q);
      return matchAnimal && matchSearch;
    });
  }, [selectedAnimal, searchTerm]);

  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => {
      const matchAnimal = selectedAnimal === 'الكل' || f.animal === selectedAnimal;
      const q = searchTerm.trim().toLowerCase();
      const matchSearch = !q || f.name.includes(q) || f.suitable.includes(q) || f.animal.includes(q);
      return matchAnimal && matchSearch;
    });
  }, [selectedAnimal, searchTerm]);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>📚 الموسوعة الزراعية</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('breeds')}
          style={{
            flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
            backgroundColor: activeTab === 'breeds' ? colors.purple : colors.cream,
            color: activeTab === 'breeds' ? 'white' : colors.dark,
            cursor: 'pointer', fontFamily: 'inherit'
          }}
        >
          🧬 السلالات ({breeds.length})
        </button>
        <button
          onClick={() => setActiveTab('facilities')}
          style={{
            flex: 1, padding: '12px', borderRadius: '8px', border: 'none',
            backgroundColor: activeTab === 'facilities' ? colors.purple : colors.cream,
            color: activeTab === 'facilities' ? 'white' : colors.dark,
            cursor: 'pointer', fontFamily: 'inherit'
          }}
        >
          🏗️ المنشآت
        </button>
      </div>

      <input
        type="text"
        placeholder="🔍 بحث..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%', padding: '12px', borderRadius: '8px',
          border: `1px solid ${colors.sand}`, fontSize: '16px',
          fontFamily: 'inherit', marginBottom: '10px', boxSizing: 'border-box'
        }}
      />

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
        {animalFilters.map(animal => (
          <button
            key={animal}
            onClick={() => setSelectedAnimal(animal)}
            style={{
              padding: '8px 14px', borderRadius: '20px', border: 'none',
              backgroundColor: selectedAnimal === animal ? colors.purple : colors.cream,
              color: selectedAnimal === animal ? 'white' : colors.dark,
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit', fontSize: '13px'
            }}
          >
            {animal}
          </button>
        ))}
      </div>

      {activeTab === 'breeds' && (
        <div>
          {filteredBreeds.length === 0 && (
            <p style={{ textAlign: 'center', color: colors.soil, padding: '30px' }}>لا توجد نتائج</p>
          )}
          {filteredBreeds.map(breed => (
            <div
              key={breed.id}
              style={{
                backgroundColor: 'white', borderRadius: '12px', marginBottom: '12px',
                border: `1px solid ${colors.sand}`, overflow: 'hidden'
              }}
            >
              <div
                onClick={() => setExpandedBreed(expandedBreed === breed.id ? null : breed.id)}
                style={{
                  padding: '16px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}
              >
                <span style={{ fontSize: '32px' }}>{breed.icon}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: colors.dark, margin: '0 0 4px' }}>{breed.name}</h3>
                  <div style={{ fontSize: '13px', color: colors.soil }}>
                    {breed.animal} · {breed.purpose} · الأصل: {breed.origin}
                  </div>
                </div>
                <span style={{ color: colors.purple, fontSize: '12px' }}>
                  {expandedBreed === breed.id ? '▲' : '▼'}
                </span>
              </div>

              {expandedBreed === breed.id && (
                <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${colors.sand}` }}>

                  <h4 style={{ color: colors.green, margin: '12px 0 6px' }}>✅ مميزات</h4>
                  <ul style={{ margin: 0, paddingRight: '20px' }}>
                    {breed.pros.map((p, i) => <li key={i} style={{ marginBottom: '4px' }}>{p}</li>)}
                  </ul>

                  <h4 style={{ color: colors.red, margin: '12px 0 6px' }}>❌ عيوب</h4>
                  <ul style={{ margin: 0, paddingRight: '20px' }}>
                    {breed.cons.map((c, i) => <li key={i} style={{ marginBottom: '4px' }}>{c}</li>)}
                  </ul>

                  <h4 style={{ color: colors.sky, margin: '12px 0 6px' }}>🌡️ درجة الحرارة</h4>
                  <p style={{ margin: 0 }}>
                    مثالية: {breed.tempIdeal} · قصوى: {breed.tempMax}
                    {breed.tempMin && ` · دنيا: ${breed.tempMin}`}
                  </p>

                  {(breed.breedingPeriod || breed.milkProduction || breed.weightGain || breed.woolProduction || breed.eggProduction || breed.harvestWeight || breed.density || breed.feedConversion || breed.feedingHabit || breed.feedType) && (
                    <>
                      <h4 style={{ color: colors.teal, margin: '12px 0 6px' }}>📊 بيانات الإنتاج</h4>
                      <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                        {breed.breedingPeriod && <div>🔄 <strong>دورة التربية:</strong> {breed.breedingPeriod}</div>}
                        {breed.milkProduction && <div>🥛 <strong>إنتاج الحليب:</strong> {breed.milkProduction}</div>}
                        {breed.weightGain && <div>⚖️ <strong>معدل النمو:</strong> {breed.weightGain}</div>}
                        {breed.woolProduction && <div>🧶 <strong>إنتاج الصوف:</strong> {breed.woolProduction}</div>}
                        {breed.eggProduction && <div>🥚 <strong>إنتاج البيض:</strong> {breed.eggProduction}</div>}
                        {breed.harvestWeight && <div>🎣 <strong>وزن الحصاد:</strong> {breed.harvestWeight}</div>}
                        {breed.density && <div>📐 <strong>الكثافة:</strong> {breed.density}</div>}
                        {breed.feedConversion && <div>🌾 <strong>معامل التحويل:</strong> {breed.feedConversion}</div>}
                        {breed.feedingHabit && <div>🍽️ <strong>طريقة التغذية:</strong> {breed.feedingHabit}</div>}
                        {breed.feedType && <div>🐟 <strong>نوع العلف:</strong> {breed.feedType}</div>}
                      </div>
                    </>
                  )}

                  {breed.diseases && breed.diseases.length > 0 && (
                    <>
                      <h4 style={{ color: colors.orange, margin: '12px 0 6px' }}>🦠 أمراض شائعة</h4>
                      {breed.diseases.map((d, i) => (
                        <div key={i} style={{
                          backgroundColor: colors.cream, borderRadius: '8px',
                          padding: '10px', marginBottom: '8px', fontSize: '14px'
                        }}>
                          <div><strong>{d.name}</strong></div>
                          {d.symptoms !== '-' && <div style={{ color: colors.soil }}>الأعراض: {d.symptoms}</div>}
                          {d.treatment !== '-' && <div style={{ color: colors.green }}>العلاج: {d.treatment}</div>}
                          {d.prevention && d.prevention !== '-' && <div style={{ color: colors.purple }}>الوقاية: {d.prevention}</div>}
                        </div>
                      ))}
                    </>
                  )}

                  {breed.vaccines && breed.vaccines.length > 0 && (
                    <>
                      <h4 style={{ color: colors.lime, margin: '12px 0 6px' }}>💉 اللقاحات</h4>
                      {breed.vaccines.map((v, i) => (
                        <div key={i} style={{ fontSize: '14px', marginBottom: '4px' }}>
                          {v.name}: <strong>{v.timing}</strong>
                          {v.notes && <span style={{ color: colors.soil }}> ({v.notes})</span>}
                        </div>
                      ))}
                    </>
                  )}

                  {breed.specialNotes && breed.specialNotes.length > 0 && (
                    <>
                      <h4 style={{ color: colors.red, margin: '12px 0 6px' }}>⚠️ ملاحظات خاصة</h4>
                      <ul style={{ margin: 0, paddingRight: '20px' }}>
                        {breed.specialNotes.map((note, i) => (
                          <li key={i} style={{ marginBottom: '4px', fontSize: '14px' }}>{note}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'facilities' && (
        <div>
          {filteredFacilities.length === 0 && (
            <p style={{ textAlign: 'center', color: colors.soil, padding: '30px' }}>لا توجد نتائج</p>
          )}
          {filteredFacilities.map(facility => (
            <div key={facility.id} style={{
              backgroundColor: 'white', padding: '16px', borderRadius: '12px',
              marginBottom: '12px', border: `1px solid ${colors.sand}`
            }}>
              <h3 style={{ color: colors.dark, marginBottom: '10px' }}>🏗️ {facility.name}</h3>
              <div style={{ fontSize: '14px', color: colors.soil, display: 'grid', gap: '6px' }}>
                <div>🐄 <strong>الحيوان:</strong> {facility.animal}</div>
                <div>📐 <strong>الكثافة/المساحة:</strong> {facility.area}</div>
                <div>✅ <strong>مناسب لـ:</strong> {facility.suitable}</div>
                <div style={{ color: colors.teal }}>💡 {facility.notes}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EncyclopediaSection;
