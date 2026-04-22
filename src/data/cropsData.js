export const cropsData = [
  {
    id: 'wheat',
    name: 'قمح',
    icon: '🌾',
    color: '#C9963A',
    category: 'حبوب',
    soilEffect: 'يستهلك النيتروجين',
    season: 'شتوي',
    daysToHarvest: '150-180',
    yieldPerHa: '4-7 طن',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'إنبات', days: '7-10', details: 'ظهور البادرات' },
      { name: 'تفريع', days: '30-40', details: 'تكوين الأشطاء' },
      { name: 'استطالة', days: '40-50', details: 'نمو الساق' },
      { name: 'تزهير', days: '20-30', details: 'تكوين السنابل' },
      { name: 'نضج', days: '30-40', details: 'اصفرار وجفاف' }
    ],
    irrigation: [
      { name: 'ري الزراعة', timing: 'عند الزراعة', amount: '40-50 مم' },
      { name: 'ري التفريع', timing: 'بعد 30 يوم', amount: '40-50 مم' },
      { name: 'ري التزهير', timing: 'عند التزهير', amount: '50-60 مم' }
    ],
    fertilization: [
      { type: 'يوريا', amount: '100 كغ/هكتار', timing: 'مع الزراعة' },
      { type: 'سوبر فوسفات', amount: '150 كغ/هكتار', timing: 'مع الزراعة' },
      { type: 'يوريا', amount: '100 كغ/هكتار', timing: 'عند التفريع' }
    ],
    challenges: [
      { problem: 'الصدأ', signs: 'بقع برتقالية على الأوراق', solution: 'مبيدات فطرية', prevention: 'أصناف مقاومة' },
      { problem: 'المن', signs: 'حشرات صغيرة على الأوراق', solution: 'مبيدات حشرية', prevention: 'زراعة مبكرة' }
    ],
    goodAfter: ['بقوليات', 'برسيم', 'جت'],
    goodBefore: ['بقوليات', 'برسيم'],
    avoidAfter: ['شعير', 'ذرة']
  },
  {
    id: 'barley',
    name: 'شعير',
    icon: '🌿',
    color: '#C9963A',
    category: 'حبوب',
    soilEffect: 'محايد',
    season: 'شتوي',
    daysToHarvest: '130-150',
    yieldPerHa: '3-5 طن',
    waterNeeds: 'منخفضة',
    stages: [
      { name: 'إنبات', days: '5-7', details: 'ظهور البادرات' },
      { name: 'تفريع', days: '25-35', details: 'تكوين الأشطاء' },
      { name: 'استطالة', days: '35-45', details: 'نمو الساق' },
      { name: 'تزهير', days: '15-25', details: 'تكوين السنابل' },
      { name: 'نضج', days: '25-35', details: 'اصفرار' }
    ],
    irrigation: [
      { name: 'ري الزراعة', timing: 'عند الزراعة', amount: '35-45 مم' },
      { name: 'ري تكميلي', timing: 'عند الحاجة', amount: '40 مم' }
    ],
    fertilization: [
      { type: 'يوريا', amount: '80 كغ/هكتار', timing: 'مع الزراعة' },
      { type: 'سوبر فوسفات', amount: '100 كغ/هكتار', timing: 'مع الزراعة' }
    ],
    challenges: [
      { problem: 'التبقع الشبكي', signs: 'بقع بنية شبكية', solution: 'مبيدات فطرية', prevention: 'دورة زراعية' }
    ],
    goodAfter: ['بقوليات', 'قمح'],
    goodBefore: ['بقوليات'],
    avoidAfter: ['شعير']
  },
  {
    id: 'corn',
    name: 'ذرة',
    icon: '🌽',
    color: '#E07B39',
    category: 'حبوب',
    soilEffect: 'يستهلك النيتروجين والبوتاسيوم',
    season: 'صيفي',
    daysToHarvest: '90-120',
    yieldPerHa: '6-10 طن',
    waterNeeds: 'عالية',
    stages: [
      { name: 'إنبات', days: '5-10', details: 'ظهور البادرات' },
      { name: 'نمو خضري', days: '30-40', details: 'نمو الأوراق' },
      { name: 'تزهير', days: '15-20', details: 'خروج النورات' },
      { name: 'تكوين الحبوب', days: '25-35', details: 'امتلاء الحبوب' },
      { name: 'نضج', days: '15-20', details: 'جفاف' }
    ],
    irrigation: [
      { name: 'ري الزراعة', timing: 'عند الزراعة', amount: '40-50 مم' },
      { name: 'ري النمو الخضري', timing: 'كل 10-14 يوم', amount: '50-60 مم' },
      { name: 'ري التزهير', timing: 'عند التزهير', amount: '60-70 مم' },
      { name: 'ري امتلاء الحبوب', timing: 'كل 7-10 أيام', amount: '50-60 مم' }
    ],
    fertilization: [
      { type: 'يوريا', amount: '200 كغ/هكتار', timing: 'مقسمة على 3 دفعات' },
      { type: 'سوبر فوسفات', amount: '150 كغ/هكتار', timing: 'مع الزراعة' },
      { type: 'سلفات البوتاسيوم', amount: '100 كغ/هكتار', timing: 'مع الزراعة' }
    ],
    challenges: [
      { problem: 'دودة القصب', signs: 'ثقوب في الساق', solution: 'مبيدات حشرية', prevention: 'حراثة عميقة' },
      { problem: 'الذبول', signs: 'ذبول الأوراق', solution: 'ري منتظم', prevention: 'أصناف مقاومة' }
    ],
    goodAfter: ['بقوليات', 'برسيم'],
    goodBefore: ['بقوليات'],
    avoidAfter: ['ذرة', 'سورغم']
  },
  {
    id: 'berseem',
    name: 'برسيم',
    icon: '☘️',
    color: '#52B788',
    category: 'أعلاف',
    soilEffect: 'يضيف نيتروجين - محسن تربة',
    season: 'شتوي',
    daysToHarvest: '50-60',
    yieldPerHa: '40-60 طن أخضر/هكتار/سنة',
    waterNeeds: 'متوسطة إلى عالية',
    stages: [
      { name: 'إنبات', days: '5-7', details: 'سرعة إنبات عالية' },
      { name: 'نمو خضري', days: '40-50', details: 'حشة أولى' },
      { name: 'حشات متتالية', days: 'كل 25-30 يوم', details: '4-6 حشات/موسم' }
    ],
    irrigation: [
      { name: 'ري منتظم', timing: 'كل 7-10 أيام', amount: '40-50 مم' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '150 كغ/هكتار', timing: 'قبل الزراعة' },
      { type: 'سلفات البوتاسيوم', amount: '100 كغ/هكتار', timing: 'قبل الزراعة' }
    ],
    challenges: [
      { problem: 'دودة ورق القطن', signs: 'ثقوب في الأوراق', solution: 'مبيدات حشرية', prevention: 'حصاد مبكر' }
    ],
    goodAfter: ['حبوب', 'خضروات'],
    goodBefore: ['حبوب'],
    avoidAfter: []
  },
  {
    id: 'sorghum',
    name: 'سورغم علفي',
    icon: '🌾',
    color: '#C9963A',
    category: 'أعلاف',
    soilEffect: 'محايد - يتحمل الجفاف',
    season: 'صيفي',
    daysToHarvest: '60-80',
    yieldPerHa: '50-80 طن أخضر/هكتار',
    waterNeeds: 'منخفضة (يتحمل الجفاف)',
    stages: [
      { name: 'إنبات', days: '5-10', details: 'نمو بطيء في البداية' },
      { name: 'نمو سريع', days: '30-40', details: 'ينمو بسرعة بعد 30 يوم' },
      { name: 'حشة', days: '60-70', details: 'يمكن حشه عدة مرات' }
    ],
    irrigation: [
      { name: 'ري خفيف', timing: 'كل 10-14 يوم', amount: '40-50 مم' }
    ],
    fertilization: [
      { type: 'يوريا', amount: '150 كغ/هكتار', timing: 'مقسمة بعد كل حشة' }
    ],
    challenges: [
      { problem: 'حفار الساق', signs: 'سقوط النبات', solution: 'مبيدات حشرية', prevention: 'حراثة عميقة' },
      { problem: 'تسمم حمض البروسيك', signs: 'في النباتات الصغيرة أو المجهدة', solution: 'لا ترعى قبل 60 سم ارتفاع', prevention: 'تجنب الرعي المبكر' }
    ],
    goodAfter: ['بقوليات'],
    goodBefore: ['حبوب'],
    avoidAfter: ['ذرة', 'سورغم']
  },
  {
    id: 'soybean-feed',
    name: 'فول الصويا (علف)',
    icon: '🫘',
    color: '#8B5E3C',
    category: 'أعلاف',
    soilEffect: 'يضيف نيتروجين - محسن تربة ممتاز',
    season: 'صيفي',
    daysToHarvest: '100-130',
    yieldPerHa: '2-4 طن حبوب/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'إنبات', days: '5-10', details: 'يحتاج رطوبة كافية' },
      { name: 'نمو خضري', days: '40-50', details: 'تكوين العقد الجذرية' },
      { name: 'تزهير', days: '20-30', details: 'أزهار بنفسجية' },
      { name: 'تكوين القرون', days: '30-40', details: 'امتلاء القرون' }
    ],
    irrigation: [
      { name: 'ري التزهير', timing: 'حرج - لا تهمل', amount: '50-60 مم' },
      { name: 'ري امتلاء القرون', timing: 'مهم جداً', amount: '50-60 مم' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '200 كغ/هكتار', timing: 'قبل الزراعة' }
    ],
    challenges: [
      { problem: 'دودة القرون', signs: 'ثقوب في القرون', solution: 'مبيدات حشرية', prevention: 'زراعة مبكرة' }
    ],
    goodAfter: ['حبوب'],
    goodBefore: ['حبوب', 'خضروات'],
    avoidAfter: ['فول الصويا']
  },
  {
    id: 'cottonseed',
    name: 'بذرة القطن',
    icon: '🌿',
    color: '#E8D5B7',
    category: 'أعلاف',
    soilEffect: 'مستهلك للتربة',
    season: 'صيفي',
    daysToHarvest: '150-180',
    yieldPerHa: '1.5-2.5 طن بذور/هكتار',
    waterNeeds: 'عالية',
    stages: [
      { name: 'إنبات', days: '7-10', details: 'يحتاج حرارة وري' },
      { name: 'نمو خضري', days: '60-80', details: 'نمو بطيء للتفريع' },
      { name: 'تزهير وتكوين اللوز', days: '60-90', details: 'يحتاج رعاية' }
    ],
    irrigation: [
      { name: 'ري منتظم', timing: 'كل 7-10 أيام', amount: '50-60 مم' }
    ],
    fertilization: [
      { type: 'يوريا', amount: '200 كغ/هكتار', timing: 'مقسمة' }
    ],
    challenges: [
      { problem: 'دودة اللوز', signs: 'تلف اللوز', solution: 'مبيدات حشرية', prevention: 'مكافحة متكاملة' }
    ],
    goodAfter: ['بقوليات'],
    goodBefore: ['حبوب'],
    avoidAfter: ['قطن']
  },
  {
    id: 'alfalfa',
    name: 'جت (برسيم حجازي)',
    icon: '🍀',
    color: '#52B788',
    category: 'أعلاف',
    soilEffect: 'يضيف 100-200 كغ نيتروجين/هكتار',
    season: 'دائم',
    daysToHarvest: 'متعدد القصات كل 25-30 يوم',
    yieldPerHa: '15-25 طن/سنة',
    waterNeeds: 'عالية',
    stages: [
      { name: 'إنبات', days: '7-14', details: 'تكوين الجذور' },
      { name: 'نمو', days: '20-30', details: 'نمو خضري' },
      { name: 'قص', days: 'كل 25-30 يوم', details: '8-10 قصات/سنة' }
    ],
    irrigation: [
      { name: 'ري منتظم', timing: 'كل 7-10 أيام صيفاً', amount: '60-80 مم' },
      { name: 'ري بعد القص', timing: 'مباشرة بعد القص', amount: '50-60 مم' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '200 كغ/هكتار', timing: 'سنوياً في الخريف' },
      { type: 'سلفات البوتاسيوم', amount: '150 كغ/هكتار', timing: 'سنوياً' }
    ],
    challenges: [
      { problem: 'المن', signs: 'حشرات على الأوراق', solution: 'مبيدات حشرية', prevention: 'قص مبكر' },
      { problem: 'التبقع الورقي', signs: 'بقع بنية', solution: 'مبيدات فطرية', prevention: 'تهوية جيدة' }
    ],
    goodAfter: ['جميع المحاصيل'],
    goodBefore: ['حبوب'],
    avoidAfter: []
  }
];

export const vegetablesData = [
  {
    id: 'summer-tomato',
    name: 'طماطم صيفية',
    icon: '🍅',
    color: '#E07B39',
    season: 'صيفي',
    category: 'خضروات',
    profitability: 4,
    suitability: 'ممتازة',
    suitabilityReason: 'تتحمل الحرارة فوق 40°م',
    bestVarieties: ['هجين F1', 'سوبر مارماند', 'موني ميكر'],
    plantingMonths: [4, 5, 6, 7],
    harvestMonths: [6, 7, 8, 9],
    daysToHarvest: '70-90',
    yieldPerDonum: '5-8 طن',
    waterNeeds: 'متوسطة إلى عالية',
    stages: [
      { name: 'مشتل', days: '25-30', details: 'إنتاج الشتلات' },
      { name: 'نمو خضري', days: '30-40', details: 'تكوين المجموع الخضري' },
      { name: 'تزهير وعقد', days: '15-20', details: 'تكوين الثمار' },
      { name: 'نضج', days: '20-30', details: 'تلوين الثمار' }
    ],
    fertilization: [
      { type: 'سماد متوازن 20-20-20', amount: '50 كغ/دونم', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '20 كغ/دونم', timing: 'بعد 30 يوم' },
      { type: 'سلفات البوتاسيوم', amount: '15 كغ/دونم', timing: 'مع التزهير' }
    ],
    challenges: [
      { problem: 'لفحة مبكرة', signs: 'بقع بنية على الأوراق', solution: 'مبيدات فطرية', prevention: 'تهوية جيدة' },
      { problem: 'ذبابة الفاكهة', signs: 'ثقوب في الثمار', solution: 'مصائد فرمونية', prevention: 'تغطية المحصول' }
    ],
    localTips: 'الزراعة في الأنفاق البلاستيكية تعطي إنتاجية مضاعفة وتحمي من الحرارة الشديدة',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['طماطم', 'فليفلة', 'باذنجان']
  },
  {
    id: 'cucumber',
    name: 'خيار',
    icon: '🥒',
    color: '#52B788',
    season: 'صيفي',
    category: 'خضروات',
    profitability: 4,
    suitability: 'جيدة جداً',
    suitabilityReason: 'دورة قصيرة - يتحمل الحرارة',
    bestVarieties: ['هجين بيتا ألفا', 'سوبر دومينوس', 'باساندرا'],
    plantingMonths: [3, 4, 8, 9],
    harvestMonths: [5, 6, 10, 11],
    daysToHarvest: '45-55',
    yieldPerDonum: '4-7 طن',
    waterNeeds: 'عالية',
    stages: [
      { name: 'إنبات', days: '5-7', details: 'ظهور البادرات' },
      { name: 'نمو خضري', days: '20-25', details: 'تكوين الأوراق والمحاليق' },
      { name: 'تزهير وإثمار', days: '20-25', details: 'إنتاج مستمر' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '3 طن/دونم', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '30 كغ/دونم', timing: 'مقسمة أسبوعياً' }
    ],
    challenges: [
      { problem: 'البياض الدقيقي', signs: 'مسحوق أبيض على الأوراق', solution: 'كبريت زراعي', prevention: 'تهوية' },
      { problem: 'العنكبوت الأحمر', signs: 'بقع صفراء', solution: 'مبيدات أكاروسية', prevention: 'رطوبة عالية' }
    ],
    localTips: 'الزراعة في الأنفاق البلاستيكية تضاعف الإنتاج وتقلل الأمراض',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['خيار', 'قرع']
  },
  {
    id: 'eggplant',
    name: 'باذنجان',
    icon: '🍆',
    color: '#7B5EA7',
    season: 'صيفي',
    category: 'خضروات',
    profitability: 4,
    suitability: 'ممتازة',
    suitabilityReason: 'يتحمل الحرارة الشديدة جيداً',
    bestVarieties: ['بلاك بيوتي', 'هجين F1', 'طويل أسود'],
    plantingMonths: [3, 4, 5],
    harvestMonths: [6, 7, 8, 9, 10],
    daysToHarvest: '65-80',
    yieldPerDonum: '4-6 طن',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'مشتل', days: '30-35', details: 'إنتاج الشتلات' },
      { name: 'نمو خضري', days: '30-40', details: 'تكوين الأفرع' },
      { name: 'إثمار', days: '60-90', details: 'إنتاج متواصل' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '2 طن/دونم', timing: 'قبل الزراعة' },
      { type: 'سماد متوازن', amount: '50 كغ/دونم', timing: 'مع الزراعة' }
    ],
    challenges: [
      { problem: 'حفار الساق', signs: 'ذبول النبات', solution: 'مبيدات حشرية', prevention: 'حراثة عميقة' },
      { problem: 'ذبول الفيوزاريوم', signs: 'اصفرار وذبول', solution: 'أصناف مقاومة', prevention: 'دورة زراعية' }
    ],
    localTips: 'يزرع في الأنبار بنجاح كبير - يتحمل حرارة الصيف جيداً',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['طماطم', 'فليفلة', 'باذنجان']
  },
  {
    id: 'okra',
    name: 'بامية',
    icon: '🌿',
    color: '#52B788',
    season: 'صيفي',
    category: 'خضروات',
    profitability: 3,
    suitability: 'ممتازة',
    suitabilityReason: 'الحرارة أكثر من الممتازة',
    bestVarieties: ['بلدي', 'كليمسون', 'إمرالد'],
    plantingMonths: [3, 4, 5],
    harvestMonths: [5, 6, 7, 8, 9],
    daysToHarvest: '55-65',
    yieldPerDonum: '2-4 طن',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'إنبات', days: '7-10', details: 'ظهور البادرات' },
      { name: 'نمو', days: '30-40', details: 'تكوين الساق' },
      { name: 'إثمار', days: '40-60', details: 'إنتاج القرون' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '2 طن/دونم', timing: 'قبل الزراعة' }
    ],
    challenges: [
      { problem: 'المن', signs: 'تجعد الأوراق', solution: 'صابون زراعي', prevention: 'زراعة مبكرة' }
    ],
    localTips: 'من أكثر المحاصيل تحملاً للحرارة - مثالية لصيف الأنبار',
    goodAfter: ['حبوب'],
    avoidAfter: []
  },
  {
    id: 'potato',
    name: 'بطاطا',
    icon: '🥔',
    color: '#C9963A',
    season: 'شتوي',
    category: 'درنات',
    profitability: 4,
    suitability: 'ممتازة',
    suitabilityReason: 'تعطي درنات كبيرة ونظيفة',
    bestVarieties: ['سبونتا', 'أجريا', 'ديامونت'],
    plantingMonths: [10, 11],
    harvestMonths: [1, 2, 3],
    daysToHarvest: '90-110',
    yieldPerDonum: '3-5 طن',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'إنبات', days: '15-20', details: 'خروج البراعم' },
      { name: 'نمو خضري', days: '30-40', details: 'تكوين المجموع الخضري' },
      { name: 'تكوين الدرنات', days: '30-40', details: 'تضخم الدرنات' },
      { name: 'نضج', days: '15-20', details: 'جفاف العروش' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '100 كغ/دونم', timing: 'قبل الزراعة' },
      { type: 'سلفات البوتاسيوم', amount: '50 كغ/دونم', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '40 كغ/دونم', timing: 'بعد 30 يوم' }
    ],
    challenges: [
      { problem: 'الندوة المتأخرة', signs: 'بقع بنية على الأوراق', solution: 'مبيدات فطرية', prevention: 'أصناف مقاومة' }
    ],
    localTips: 'التربة الغرينية الخفيفة مثالية للبطاطا - أفضل المحاصيل الشتوية ربحاً',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['بطاطا', 'طماطم']
  },
  {
    id: 'onion',
    name: 'بصل',
    icon: '🧅',
    color: '#C9963A',
    season: 'شتوي',
    category: 'خضروات',
    profitability: 4,
    suitability: 'جيدة جداً',
    suitabilityReason: 'يتحمل التربة الغرينية الجيدة',
    bestVarieties: ['تكساس غرانكس', 'أبو نمر', 'بلدي'],
    plantingMonths: [10, 11, 12],
    harvestMonths: [3, 4, 5],
    daysToHarvest: '120-150',
    yieldPerDonum: '2-4 طن',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'إنبات', days: '10-14', details: 'ظهور البادرات' },
      { name: 'نمو', days: '60-80', details: 'تكوين الأوراق' },
      { name: 'تضخم الدرنة', days: '40-50', details: 'تكوين البصلة' },
      { name: 'نضج', days: '15-20', details: 'جفاف الأوراق' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '2 طن/دونم', timing: 'قبل الزراعة' },
      { type: 'سوبر فوسفات', amount: '60 كغ/دونم', timing: 'مع الزراعة' }
    ],
    challenges: [
      { problem: 'الذبابة البيضاء', signs: 'اصفرار الأوراق', solution: 'مبيدات حشرية', prevention: 'دورة زراعية' }
    ],
    localTips: 'البصل البلدي الأنباري مشهور بجودته - يصدّر لمحافظات عديدة',
    goodAfter: ['حبوب', 'قمح'],
    avoidAfter: ['بصل', 'ثوم']
  }
];
