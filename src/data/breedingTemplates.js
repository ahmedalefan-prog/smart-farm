export const BREEDING_TEMPLATES = {
  poultry_broiler: {
    label: 'دواجن لاحم (روس 308)',
    icon: '🐔',
    animalType: 'poultry',
    totalDays: 42,
    phases: [
      { name: 'مرحلة البداية', startDay: 0, endDay: 14, feedType: 'علف بادئ 22% بروتين', feedKgPerHead: 0.08, notes: 'حرارة الحظيرة 33-35°م، تقليل 1° كل يومين، تغذية حرة' },
      { name: 'مرحلة النمو', startDay: 15, endDay: 28, feedType: 'علف ناشئ 20% بروتين', feedKgPerHead: 0.13, notes: 'تهوية جيدة، حرارة 28-30°م، أمونيا أقل من 25 ppm' },
      { name: 'مرحلة التسمين', startDay: 29, endDay: 42, feedType: 'علف ناهٍ 18% بروتين', feedKgPerHead: 0.18, notes: 'أوقف المضادات 5 أيام قبل التسويق، زن عينة 50 طير' }
    ],
    vaccines: [
      { name: 'نيوكاسل + IB', day: 1, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'نيوكاسل', day: 7, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'جمبورو (IBD)', day: 14, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'نيوكاسل تعزيزي', day: 21, dose: '1 قطرة/طير', method: 'ماء الشرب' },
      { name: 'جمبورو تعزيزي', day: 24, dose: '1 قطرة/طير', method: 'ماء الشرب' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 7, text: 'حافظ على 33-35°م — راقب تمركز الكتاكيت حول مصادر الدفء' },
      { fromDay: 8, toDay: 14, text: 'قلل الحرارة تدريجياً، تأكد من استهلاك الماء الطبيعي (1.8× الأكل)' },
      { fromDay: 15, toDay: 28, text: 'تهوية منتظمة، مؤشر الأمونيا لا يتجاوز 25 ppm' },
      { fromDay: 29, toDay: 42, text: 'اعزم التسويق عند يوم 38-42، أوقف المضادات قبل 5 أيام' }
    ]
  },

  poultry_layer: {
    label: 'دواجن بياض',
    icon: '🥚',
    animalType: 'poultry',
    totalDays: 140,
    phases: [
      { name: 'مرحلة البداية', startDay: 0, endDay: 42, feedType: 'علف بادئ بياض 20% بروتين', feedKgPerHead: 0.04, notes: 'إضاءة 23 ساعة، تغذية حرة' },
      { name: 'مرحلة النمو', startDay: 43, endDay: 112, feedType: 'علف ناشئ بياض 16% بروتين', feedKgPerHead: 0.07, notes: 'قلل الإضاءة إلى 12 ساعة لمنع النضج المبكر' },
      { name: 'ما قبل الإنتاج', startDay: 113, endDay: 140, feedType: 'علف قبل إنتاج 17% بروتين + كالسيوم', feedKgPerHead: 0.1, notes: 'زد الإضاءة تدريجياً إلى 16 ساعة لتحفيز الإنتاج' }
    ],
    vaccines: [
      { name: 'نيوكاسل + IB', day: 1, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'نيوكاسل', day: 14, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'جمبورو (IBD)', day: 18, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'جمبورو تعزيزي', day: 25, dose: '1 قطرة/طير', method: 'ماء الشرب' },
      { name: 'نيوكاسل + IB تعزيزي', day: 35, dose: '1 قطرة/طير', method: 'ماء الشرب' },
      { name: 'جدري دواجن', day: 42, dose: 'وخز جناح', method: 'وخز' },
      { name: 'لاروتراكيئيتس (LT)', day: 56, dose: '1 قطرة/طير', method: 'قطرة عين' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 42, text: '23 ساعة إضاءة، تغذية حرة، راقب معدل النمو الأسبوعي' },
      { fromDay: 43, toDay: 112, text: 'قلل الإضاءة تدريجياً — النضج المبكر يضر بالإنتاج على المدى البعيد' },
      { fromDay: 113, toDay: 140, text: 'زد الإضاءة أسبوعياً بساعة حتى 16 ساعة — محفز أساسي لبدء البيض' }
    ]
  },

  cattle_fattening: {
    label: 'أبقار تسمين',
    icon: '🐄',
    animalType: 'cattle',
    totalDays: 180,
    phases: [
      { name: 'مرحلة التأقلم', startDay: 0, endDay: 30, feedType: 'أعلاف خشنة + مركزة 30%', feedKgPerHead: 7, notes: 'علاج طفيليات، تطعيمات، تعود تدريجي على العلف المركز' },
      { name: 'مرحلة التسمين', startDay: 31, endDay: 180, feedType: 'علف تسمين مركزة 60%', feedKgPerHead: 12, notes: 'الزيادة اليومية المستهدفة 1-1.5 كغ، زن كل أسبوعين' }
    ],
    vaccines: [
      { name: 'حمى قلاعية (FMD)', day: 1, dose: '2 مل', method: 'حقن عضلي' },
      { name: 'التسمم الدموي (HS)', day: 7, dose: '2 مل', method: 'حقن تحت الجلد' },
      { name: 'البروسيلا', day: 14, dose: '2 مل', method: 'حقن تحت الجلد' },
      { name: 'حمى قلاعية تعزيزي', day: 28, dose: '2 مل', method: 'حقن عضلي' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 30, text: 'لا تزد المركزة فوق 30% — خطر الحماض الكروشي، أعطِ التبن بحرية' },
      { fromDay: 31, toDay: 90, text: 'زن الدفعة كل أسبوعين، الزيادة المستهدفة 1-1.5 كغ/يوم' },
      { fromDay: 91, toDay: 180, text: 'جهز للتسويق عند بلوغ الوزن المستهدف، راقب مؤشر الجسم BCS' }
    ]
  },

  cattle_dairy: {
    label: 'أبقار حلوب',
    icon: '🥛',
    animalType: 'cattle',
    totalDays: 305,
    phases: [
      { name: 'ذروة الإنتاج', startDay: 0, endDay: 100, feedType: 'عليقة عالية طاقة (60% مركزة)', feedKgPerHead: 14, notes: 'مراقبة البيتوسيس، حلب 3 مرات/يوم' },
      { name: 'منتصف الموسم', startDay: 101, endDay: 200, feedType: 'عليقة متوازنة (50% مركزة)', feedKgPerHead: 11, notes: 'عدّل العلف وفق إنتاج الحليب الفعلي' },
      { name: 'نهاية الموسم', startDay: 201, endDay: 305, feedType: 'عليقة جفاف (40% مركزة)', feedKgPerHead: 9, notes: 'جفف البقرة 60 يوماً قبل الولادة المتوقعة' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 1, dose: '2 مل', method: 'حقن عضلي' },
      { name: 'حمى قلاعية تعزيزي', day: 180, dose: '2 مل', method: 'حقن عضلي' },
      { name: 'التهاب الضرع (قبل الجفاف)', day: 245, dose: '5 مل', method: 'حقن عضلي' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 30, text: 'اختبر البول للبيتوسيس بعد الولادة بأسبوعين — توفر كميات طاقة كافية' },
      { fromDay: 31, toDay: 200, text: 'راقب BCS — يجب 3-3.5، عدّل العلف وفق الإنتاج الفعلي' },
      { fromDay: 201, toDay: 305, text: 'جفف البقرة، انتقل لعليقة الجفاف، أعطِ مكمل معادن وفيتامينات' }
    ]
  },

  sheep_fattening: {
    label: 'أغنام تسمين',
    icon: '🐑',
    animalType: 'sheep',
    totalDays: 90,
    phases: [
      { name: 'مرحلة التأقلم', startDay: 0, endDay: 15, feedType: 'أعلاف خشنة + مركزة 20%', feedKgPerHead: 1.2, notes: 'علاج طفيليات، تطعيمات، تعود بطيء' },
      { name: 'مرحلة التسمين', startDay: 16, endDay: 90, feedType: 'علف تسمين 50% مركزة', feedKgPerHead: 2, notes: 'هدف الزيادة 200-300 غ/يوم، زن كل 3 أسابيع' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 1, dose: '1 مل', method: 'حقن عضلي' },
      { name: 'جدري الأغنام', day: 5, dose: '0.5 مل', method: 'حقن تحت الجلد' },
      { name: 'حمى قلاعية تعزيزي', day: 21, dose: '1 مل', method: 'حقن عضلي' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 15, text: 'لا تحمّل المركزة مبكراً — إمداد الألياف ضروري لتجنب الانتفاخ' },
      { fromDay: 16, toDay: 90, text: 'زن كل 3 أسابيع، استهدف 35-45 كغ عند التسويق' }
    ]
  },

  sheep_breeding: {
    label: 'أغنام تكاثر',
    icon: '🐑',
    animalType: 'sheep',
    totalDays: 150,
    phases: [
      { name: 'مرحلة الإعداد', startDay: 0, endDay: 30, feedType: 'علف تحسين خصوبة', feedKgPerHead: 1.5, notes: 'تحسين مؤشر الجسم BCS إلى 3-3.5 قبل الإخصاب' },
      { name: 'مرحلة الحمل المبكر', startDay: 31, endDay: 100, feedType: 'علف حمل متوسط', feedKgPerHead: 1.5, notes: 'تغذية ثابتة، مراقبة عدم زيادة الوزن الزائدة' },
      { name: 'مرحلة الحمل المتأخر', startDay: 101, endDay: 150, feedType: 'علف حمل متأخر + مكمل معادن', feedKgPerHead: 2, notes: 'زد 30% في آخر 6 أسابيع، فيتامين E+Se قبل الولادة' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 1, dose: '1 مل', method: 'حقن عضلي' },
      { name: 'مرض الحدود (Border Disease)', day: 30, dose: '2 مل', method: 'حقن عضلي' },
      { name: 'المطثيات (Clostridial)', day: 100, dose: '2 مل', method: 'حقن تحت الجلد' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 30, text: 'حسّن مؤشر الجسم BCS — كل وحدة زيادة ترفع معدل التوأم 15%' },
      { fromDay: 31, toDay: 100, text: 'تغذية ثابتة — التذبذب الغذائي في الحمل المبكر يزيد نسبة الإجهاض' },
      { fromDay: 101, toDay: 150, text: 'أعطِ فيتامين E + سيلينيوم قبل الولادة بـ3 أسابيع لتقوية الحملان' }
    ]
  },

  fish_tilapia: {
    label: 'بلطي نيلي',
    icon: '🐟',
    animalType: 'fish',
    totalDays: 180,
    phases: [
      { name: 'مرحلة الإصبعيات', startDay: 0, endDay: 30, feedType: 'علف بادئ 32% بروتين', feedKgPerHead: 0.002, notes: 'تغذية 4 مرات/يوم، 5% من وزن الجسم، حجم حبة 1.5 مم' },
      { name: 'مرحلة النمو', startDay: 31, endDay: 120, feedType: 'علف نمو 28% بروتين', feedKgPerHead: 0.005, notes: 'تغذية 3 مرات/يوم، 3% من وزن الجسم، حجم حبة 2-3 مم' },
      { name: 'مرحلة التسويق', startDay: 121, endDay: 180, feedType: 'علف تشطيب 25% بروتين', feedKgPerHead: 0.008, notes: 'أوقف العلف 48 ساعة قبل الصيد' }
    ],
    vaccines: [],
    recommendations: [
      { fromDay: 0, toDay: 30, text: 'أكسجين ≥5 mg/L يومياً، درجة حرارة مثلى 28-30°م' },
      { fromDay: 31, toDay: 120, text: 'pH أسبوعياً (6.5-8.5)، غيّر 20% من الماء أسبوعياً' },
      { fromDay: 121, toDay: 180, text: 'أوقف العلف 48 ساعة قبل الصيد، احتفظ بمستوى أكسجين مرتفع' }
    ]
  },

  fish_carp: {
    label: 'كارب',
    icon: '🐠',
    animalType: 'fish',
    totalDays: 240,
    phases: [
      { name: 'مرحلة النمو الأولي', startDay: 0, endDay: 60, feedType: 'علف بادئ كارب 30% بروتين', feedKgPerHead: 0.003, notes: 'تغذية مرتين/يوم، كثافة لا تتجاوز 2 سمكة/م³' },
      { name: 'مرحلة التسمين', startDay: 61, endDay: 240, feedType: 'علف نمو كارب 25% بروتين', feedKgPerHead: 0.006, notes: 'الكارب يقبل مخلفات نباتية كعلف مكمّل' }
    ],
    vaccines: [],
    recommendations: [
      { fromDay: 0, toDay: 60, text: 'الكارب حساس جداً للأكسجين — هوّاء مستمر ليلاً، لا تتجاوز 2 سمكة/م³' },
      { fromDay: 61, toDay: 240, text: 'مخلفات الذرة والخضروات علف مكمّل مجاني — قلل تكلفة الإنتاج' }
    ]
  }
};

export const getTemplatesForType = (animalType) =>
  Object.entries(BREEDING_TEMPLATES).filter(([, t]) => t.animalType === animalType);

export const getGeneralRecs = (animalType) => ({
  cattle: [
    'زن الحيوانات كل أسبوعين وسجّل الزيادة اليومية',
    'ابدأ العلف المركز تدريجياً لتجنب الحماض الكروشي',
    'وفّر ماءً نظيفاً دائماً (50-80 لتر/رأس/يوم)',
    'راقب درجة حرارة الجسم الطبيعية 38-39°م'
  ],
  sheep: [
    'اعزل المرضى فور ظهور أعراض لمنع التفشي',
    'علاج الطفيليات الداخلية كل 3-4 أشهر',
    'وفّر ماء نظيف دائماً (3-5 لتر/رأس/يوم)',
    'مؤشر الجسم المثالي BCS = 3 عند الإخصاب'
  ],
  poultry: [
    'راقب نسبة النفوق اليومية — طبيعي أقل من 0.5%',
    'درجة الحرارة مناسبة عند توزع الطيور بشكل منتظم',
    'عدم استهلاك العلف يشير لمشكلة صحية أو بيئية',
    'سجّل استهلاك العلف والماء يومياً لاكتشاف الانحرافات'
  ],
  fish: [
    'راقب سلوك الأسماك — الصعود للسطح يعني نقص أكسجين',
    'أوقف العلف فوراً عند ارتفاع درجة الحرارة فوق 35°م',
    'عيّن الوزن بعينة 30 سمكة كل 3 أسابيع',
    'احتفظ بسجل يومي لـ pH والأكسجين ودرجة الحرارة'
  ]
}[animalType] || []);
