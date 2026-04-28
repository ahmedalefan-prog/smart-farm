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
    daysToHarvest: '25-30',
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
    yieldPerHa: '50-80 طن/هكتار',
    waterNeeds: 'متوسطة إلى عالية',
    stages: [
      { name: 'مشتل', days: '25-30', details: 'إنتاج الشتلات' },
      { name: 'نمو خضري', days: '30-40', details: 'تكوين المجموع الخضري' },
      { name: 'تزهير وعقد', days: '15-20', details: 'تكوين الثمار' },
      { name: 'نضج', days: '20-30', details: 'تلوين الثمار' }
    ],
    fertilization: [
      { type: 'سماد متوازن 20-20-20', amount: '500 كغ/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '200 كغ/هكتار', timing: 'بعد 30 يوم' },
      { type: 'سلفات البوتاسيوم', amount: '150 كغ/هكتار', timing: 'مع التزهير' }
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
    yieldPerHa: '40-70 طن/هكتار',
    waterNeeds: 'عالية',
    stages: [
      { name: 'إنبات', days: '5-7', details: 'ظهور البادرات' },
      { name: 'نمو خضري', days: '20-25', details: 'تكوين الأوراق والمحاليق' },
      { name: 'تزهير وإثمار', days: '20-25', details: 'إنتاج مستمر' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '30 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '300 كغ/هكتار', timing: 'مقسمة أسبوعياً' }
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
    yieldPerHa: '40-60 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'مشتل', days: '30-35', details: 'إنتاج الشتلات' },
      { name: 'نمو خضري', days: '30-40', details: 'تكوين الأفرع' },
      { name: 'إثمار', days: '60-90', details: 'إنتاج متواصل' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '20 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'سماد متوازن', amount: '500 كغ/هكتار', timing: 'مع الزراعة' }
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
    yieldPerHa: '20-40 طن/هكتار',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'إنبات', days: '7-10', details: 'ظهور البادرات' },
      { name: 'نمو', days: '30-40', details: 'تكوين الساق' },
      { name: 'إثمار', days: '40-60', details: 'إنتاج القرون' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 طن/هكتار', timing: 'قبل الزراعة' }
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
    yieldPerHa: '30-50 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'إنبات', days: '15-20', details: 'خروج البراعم' },
      { name: 'نمو خضري', days: '30-40', details: 'تكوين المجموع الخضري' },
      { name: 'تكوين الدرنات', days: '30-40', details: 'تضخم الدرنات' },
      { name: 'نضج', days: '15-20', details: 'جفاف العروش' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '1000 كغ/هكتار', timing: 'قبل الزراعة' },
      { type: 'سلفات البوتاسيوم', amount: '500 كغ/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '400 كغ/هكتار', timing: 'بعد 30 يوم' }
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
    yieldPerHa: '20-40 طن/هكتار',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'إنبات', days: '10-14', details: 'ظهور البادرات' },
      { name: 'نمو', days: '60-80', details: 'تكوين الأوراق' },
      { name: 'تضخم الدرنة', days: '40-50', details: 'تكوين البصلة' },
      { name: 'نضج', days: '15-20', details: 'جفاف الأوراق' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'سوبر فوسفات', amount: '600 كغ/هكتار', timing: 'مع الزراعة' }
    ],
    challenges: [
      { problem: 'الذبابة البيضاء', signs: 'اصفرار الأوراق', solution: 'مبيدات حشرية', prevention: 'دورة زراعية' }
    ],
    localTips: 'البصل البلدي الأنباري مشهور بجودته - يصدّر لمحافظات عديدة',
    goodAfter: ['حبوب', 'قمح'],
    avoidAfter: ['بصل', 'ثوم']
  },

  // ── خضروات صيفية إضافية ──
  {
    id: 'pepper',
    name: 'فليفلة',
    icon: '🫑',
    color: '#dc2626',
    season: 'صيفي',
    category: 'خضروات',
    profitability: 4,
    suitability: 'جيدة جداً',
    suitabilityReason: 'تتحمل الحرارة مع الري الجيد',
    bestVarieties: ['كاليفورنيا وندر', 'بلاكي', 'هجين F1'],
    plantingMonths: [3, 4],
    harvestMonths: [6, 7, 8, 9],
    daysToHarvest: '70-85',
    yieldPerHa: '25-40 طن/هكتار',
    waterNeeds: 'متوسطة إلى عالية',
    stages: [
      { name: 'مشتل', days: '30-35', details: 'إنبات البذور وإنتاج الشتلات' },
      { name: 'نمو خضري', days: '30-40', details: 'تكوين الأفرع الرئيسية' },
      { name: 'تزهير وعقد', days: '20-25', details: 'عقد الثمار الأولى' },
      { name: 'نضج', days: '20-30', details: 'تلوين وتكوين الثمار الكاملة' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '20 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '300 كغ/هكتار', timing: 'مقسمة على الموسم' },
      { type: 'سلفات البوتاسيوم', amount: '200 كغ/هكتار', timing: 'عند التزهير' }
    ],
    challenges: [
      { problem: 'لفحة الفيوزاريوم', signs: 'ذبول وتحول أوراق اصفر', solution: 'أصناف مقاومة + دورة زراعية', prevention: 'تجنب التربة الثقيلة' },
      { problem: 'حفار الثمار', signs: 'ثقوب في الثمار', solution: 'مبيدات حشرية مناسبة', prevention: 'رش وقائي مبكر' }
    ],
    localTips: 'الزراعة في البيوت المحمية تضاعف الإنتاج وتمد الموسم — الأنبار تنتج فليفلة ذات جودة عالية',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['طماطم', 'باذنجان', 'فليفلة']
  },
  {
    id: 'zucchini',
    name: 'كوسا',
    icon: '🥒',
    color: '#16a34a',
    season: 'صيفي',
    category: 'خضروات',
    profitability: 4,
    suitability: 'ممتازة',
    suitabilityReason: 'دورة قصيرة جداً — إنتاج سريع وربح مبكر',
    bestVarieties: ['هجين F1', 'كلارا', 'أراندا'],
    plantingMonths: [3, 4, 8],
    harvestMonths: [5, 6, 10],
    daysToHarvest: '40-55',
    yieldPerHa: '25-45 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'إنبات', days: '5-7', details: 'ظهور البادرات بسرعة' },
      { name: 'نمو خضري', days: '20-30', details: 'تكوين الأوراق الكبيرة' },
      { name: 'إثمار مستمر', days: '30-40', details: 'قطف يومي أو يوم بعد يوم' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '25 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '200 كغ/هكتار', timing: 'مقسمة خلال الموسم' }
    ],
    challenges: [
      { problem: 'البياض الدقيقي', signs: 'مسحوق أبيض على الأوراق', solution: 'كبريت زراعي', prevention: 'تهوية جيدة بين النباتات' },
      { problem: 'دودة الثمار', signs: 'تلف الثمار الصغيرة', solution: 'مبيدات حشرية', prevention: 'رش عند ظهور الأزهار' }
    ],
    localTips: 'تُحصد الكوسا صغيرة (15-20 سم) لجودة أفضل وسعر أعلى في السوق',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['خيار', 'كوسا', 'قرع']
  },
  {
    id: 'watermelon',
    name: 'بطيخ',
    icon: '🍉',
    color: '#dc2626',
    season: 'صيفي',
    category: 'خضروات',
    profitability: 4,
    suitability: 'ممتازة',
    suitabilityReason: 'الحرارة الشديدة مثالية له — من أهم محاصيل الأنبار الصيفية',
    bestVarieties: ['كريمسون سويت', 'شوغر بيبي', 'كلودي هجين'],
    plantingMonths: [3, 4, 5],
    harvestMonths: [6, 7, 8],
    daysToHarvest: '80-100',
    yieldPerHa: '35-60 طن/هكتار',
    waterNeeds: 'متوسطة (حساس للإفراط)',
    stages: [
      { name: 'إنبات', days: '5-10', details: 'ظهور البادرات' },
      { name: 'نمو خضري', days: '30-40', details: 'امتداد الجذور الأفقية' },
      { name: 'تزهير وعقد', days: '15-20', details: 'تلقيح وعقد الثمار' },
      { name: 'نضج الثمار', days: '35-45', details: 'تضخم واحمرار اللب' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '20 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'سوبر فوسفات', amount: '400 كغ/هكتار', timing: 'مع الزراعة' },
      { type: 'سلفات البوتاسيوم', amount: '300 كغ/هكتار', timing: 'عند تكوين الثمار' }
    ],
    challenges: [
      { problem: 'ذبول الفيوزاريوم', signs: 'ذبول مفاجئ للنبات', solution: 'أصناف مقاومة', prevention: 'دورة زراعية 4 سنوات' },
      { problem: 'المن', signs: 'حشرات على الأوراق ونقل فيروسات', solution: 'مبيدات حشرية', prevention: 'زراعة مبكرة' }
    ],
    localTips: 'الأنبار مشهورة ببطيخها — أوقف الري قبل 10 أيام من الحصاد لتحسين الحلاوة والمذاق',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['بطيخ', 'شمام', 'خيار']
  },
  {
    id: 'melon',
    name: 'شمام',
    icon: '🍈',
    color: '#f59e0b',
    season: 'صيفي',
    category: 'خضروات',
    profitability: 4,
    suitability: 'ممتازة',
    suitabilityReason: 'الحرارة الجافة تعطيه حلاوة استثنائية',
    bestVarieties: ['الهندي المبكر', 'كانتالوب هجين', 'بلدي أنباري'],
    plantingMonths: [3, 4, 5],
    harvestMonths: [6, 7, 8],
    daysToHarvest: '75-95',
    yieldPerHa: '20-40 طن/هكتار',
    waterNeeds: 'متوسطة (حساس للرطوبة الزائدة)',
    stages: [
      { name: 'إنبات', days: '5-8', details: 'ظهور البادرات' },
      { name: 'نمو خضري', days: '30-40', details: 'امتداد السيقان' },
      { name: 'تزهير وعقد', days: '15-20', details: 'تلقيح الأزهار' },
      { name: 'نضج', days: '30-40', details: 'اصفرار وعطرية' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '150 كغ/هكتار', timing: 'بعد الإنبات' },
      { type: 'سلفات البوتاسيوم', amount: '250 كغ/هكتار', timing: 'مع العقد' }
    ],
    challenges: [
      { problem: 'العفن الرمادي', signs: 'عفن على الثمار الملامسة للتربة', solution: 'رفع الثمار عن التربة', prevention: 'تحسين تصريف التربة' },
      { problem: 'الذبابة البيضاء', signs: 'اصفرار وجفاف الأوراق', solution: 'مبيدات حشرية', prevention: 'رش وقائي منتظم' }
    ],
    localTips: 'الشمام الأنباري ذو رائحة وحلاوة مميزتين بسبب الحرارة الجافة — لا تتجاوز الري في الأسبوع الأخير قبل الحصاد',
    goodAfter: ['حبوب'],
    avoidAfter: ['بطيخ', 'شمام', 'خيار']
  },
  {
    id: 'sweet-corn',
    name: 'ذرة حلوة',
    icon: '🌽',
    color: '#eab308',
    season: 'صيفي',
    category: 'خضروات',
    profitability: 3,
    suitability: 'جيدة',
    suitabilityReason: 'تتحمل الحرارة وتُباع بسعر جيد كخضروات',
    bestVarieties: ['سويت كوين', 'بونفير', 'هجين هاواي'],
    plantingMonths: [3, 4, 8],
    harvestMonths: [5, 6, 10],
    daysToHarvest: '70-85',
    yieldPerHa: '8-14 طن/هكتار',
    waterNeeds: 'عالية',
    stages: [
      { name: 'إنبات', days: '5-8', details: 'ظهور البادرات' },
      { name: 'نمو خضري', days: '35-45', details: 'نمو الساق والأوراق' },
      { name: 'تزهير وحبوب', days: '20-25', details: 'تلقيح وتكوين الكيزان' },
      { name: 'نضج حلو', days: '15-20', details: 'قطف عند نضج الحليبي' }
    ],
    fertilization: [
      { type: 'يوريا', amount: '300 كغ/هكتار', timing: 'مقسمة 3 دفعات' },
      { type: 'سوبر فوسفات', amount: '200 كغ/هكتار', timing: 'مع الزراعة' }
    ],
    challenges: [
      { problem: 'دودة الكيزان', signs: 'تلف قمة الكيز', solution: 'مبيدات حشرية عند ظهور الحرير', prevention: 'رش مبكر' }
    ],
    localTips: 'تُحصد خلال 18-24 ساعة من نضجها لأفضل حلاوة — تُباع مباشرة أو تُشوى',
    goodAfter: ['بقوليات'],
    avoidAfter: ['ذرة', 'ذرة حلوة']
  },

  // ── خضروات شتوية إضافية ──
  {
    id: 'lettuce',
    name: 'خس',
    icon: '🥬',
    color: '#4ade80',
    season: 'شتوي',
    category: 'خضروات',
    profitability: 3,
    suitability: 'جيدة جداً',
    suitabilityReason: 'الشتاء المعتدل مثالي له — طلب عالٍ في المطاعم',
    bestVarieties: ['إيسبرغ', 'رومين', 'باترهيد', 'بلدي'],
    plantingMonths: [9, 10, 11, 12],
    harvestMonths: [11, 12, 1, 2],
    daysToHarvest: '45-65',
    yieldPerHa: '20-35 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'مشتل', days: '15-20', details: 'إنتاج الشتلات' },
      { name: 'نمو', days: '30-40', details: 'تكوين الرأس' },
      { name: 'نضج', days: '5-10', details: 'تماسك الرأس' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '15 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '150 كغ/هكتار', timing: 'مقسمة مرتين' }
    ],
    challenges: [
      { problem: 'العفن الرمادي', signs: 'عفن في قلب الرأس', solution: 'تهوية جيدة وتقليل الري', prevention: 'تباعد مناسب بين النباتات' }
    ],
    localTips: 'يُزرع في الأنفاق البلاستيكية شتاءً لحماية من الصقيع — يُباع طازجاً في نفس اليوم',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: []
  },
  {
    id: 'spinach',
    name: 'سبانخ',
    icon: '🥬',
    color: '#15803d',
    season: 'شتوي',
    category: 'خضروات',
    profitability: 3,
    suitability: 'جيدة',
    suitabilityReason: 'تتحمل البرودة — إنتاج سريع',
    bestVarieties: ['فيكتوريا', 'مازوركا', 'طبيعي'],
    plantingMonths: [9, 10, 11],
    harvestMonths: [11, 12, 1, 2],
    daysToHarvest: '40-55',
    yieldPerHa: '15-25 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'إنبات', days: '7-10', details: 'ظهور البادرات' },
      { name: 'نمو الأوراق', days: '30-40', details: 'توسع الأوراق' },
      { name: 'قطف', days: 'متكرر', details: 'عدة قصات في الموسم' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '15 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '150 كغ/هكتار', timing: 'بعد كل قصة' }
    ],
    challenges: [
      { problem: 'البياض الزغبي', signs: 'زغب أبيض على سطح الأوراق', solution: 'مبيدات فطرية نحاسية', prevention: 'أصناف مقاومة' }
    ],
    localTips: 'السبانخ ذات دورة قصيرة جداً — يمكن 3-4 قصات في الموسم الشتوي الواحد',
    goodAfter: ['حبوب'],
    avoidAfter: []
  },
  {
    id: 'carrot',
    name: 'جزر',
    icon: '🥕',
    color: '#f97316',
    season: 'شتوي',
    category: 'خضروات',
    profitability: 3,
    suitability: 'جيدة جداً',
    suitabilityReason: 'التربة الغرينية الخفيفة مثالية لجزر مستقيم وطويل',
    bestVarieties: ['ناندرين', 'شانتيناي', 'ناقسوس'],
    plantingMonths: [9, 10, 11],
    harvestMonths: [1, 2, 3],
    daysToHarvest: '80-100',
    yieldPerHa: '30-50 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'إنبات', days: '10-14', details: 'إنبات بطيء — يحتاج رطوبة ثابتة' },
      { name: 'نمو الأوراق', days: '40-50', details: 'تطور الأوراق الريشية' },
      { name: 'تضخم الجذر', days: '35-45', details: 'تكوين الجذر اللحمي البرتقالي' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '400 كغ/هكتار', timing: 'قبل الزراعة' },
      { type: 'سلفات البوتاسيوم', amount: '300 كغ/هكتار', timing: 'بعد الإنبات' }
    ],
    challenges: [
      { problem: 'تشقق الجذور', signs: 'جذور متشققة', solution: 'ري منتظم دون انقطاع', prevention: 'تجانس الري' },
      { problem: 'ذبابة الجزر', signs: 'آثار حفر في الجذر', solution: 'مبيدات حشرية', prevention: 'دورة زراعية' }
    ],
    localTips: 'التربة الغرينية الرملية بالأنبار تعطي جزراً ممتازاً — تأكد من خلو التربة من الحجارة والكتل',
    goodAfter: ['حبوب', 'بصل'],
    avoidAfter: ['جزر', 'كرفس']
  },
  {
    id: 'garlic',
    name: 'ثوم',
    icon: '🧄',
    color: '#e2e8f0',
    season: 'شتوي',
    category: 'خضروات',
    profitability: 5,
    suitability: 'جيدة جداً',
    suitabilityReason: 'ربحية عالية مع طلب دائم — يُخزَّن جيداً',
    bestVarieties: ['بلدي عراقي', 'مصري أبيض', 'أحمر الجبال'],
    plantingMonths: [10, 11],
    harvestMonths: [3, 4, 5],
    daysToHarvest: '150-180',
    yieldPerHa: '8-15 طن/هكتار',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'إنبات', days: '10-15', details: 'خروج البادرات من الفصوص' },
      { name: 'نمو خضري', days: '60-80', details: 'تطور الأوراق والجذور' },
      { name: 'تكوين الرأس', days: '60-80', details: 'تضخم الفصوص' },
      { name: 'نضج', days: '15-20', details: 'اصفرار الأوراق' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'سوبر فوسفات', amount: '500 كغ/هكتار', timing: 'مع الزراعة' },
      { type: 'يوريا', amount: '200 كغ/هكتار', timing: 'مقسمة مرتين' }
    ],
    challenges: [
      { problem: 'عفن القاعدة', signs: 'اصفرار وتعفن قاعدة النبات', solution: 'مبيدات فطرية', prevention: 'تهوية جيدة وتجنب الري الزائد' }
    ],
    localTips: 'الثوم البلدي العراقي يُباع بضعف سعر المستورد — أوقف الري 3 أسابيع قبل الحصاد لتجفيف القشرة',
    goodAfter: ['حبوب', 'خضروات'],
    avoidAfter: ['بصل', 'ثوم', 'كراث']
  },
  {
    id: 'cabbage',
    name: 'ملفوف',
    icon: '🥬',
    color: '#4ade80',
    season: 'شتوي',
    category: 'خضروات',
    profitability: 3,
    suitability: 'جيدة',
    suitabilityReason: 'يتحمل البرودة — وزن عالٍ للرأس',
    bestVarieties: ['كوبنهاغن ماركت', 'غولدن أيكر', 'بلدي'],
    plantingMonths: [9, 10],
    harvestMonths: [12, 1, 2, 3],
    daysToHarvest: '80-110',
    yieldPerHa: '40-70 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'مشتل', days: '25-30', details: 'إنتاج الشتلات' },
      { name: 'نمو', days: '40-50', details: 'تكوين الأوراق الخارجية' },
      { name: 'تكوين الرأس', days: '30-40', details: 'التفاف الأوراق' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '25 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '300 كغ/هكتار', timing: 'مقسمة 3 دفعات' }
    ],
    challenges: [
      { problem: 'دودة ورق الملفوف', signs: 'ثقوب في الأوراق', solution: 'مبيدات حشرية أو Bt', prevention: 'رش وقائي' },
      { problem: 'التعفن الجرثومي', signs: 'تعفن داخل الرأس', solution: 'مبيدات جرثومية', prevention: 'تهوية وتقليل رطوبة الأوراق' }
    ],
    localTips: 'الملفوف يُحصد بعد تماسك الرأس — أوزان 1-3 كغ/رأس تُناسب السوق المحلي',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['ملفوف', 'قرنبيط', 'لفت']
  },
  {
    id: 'cauliflower',
    name: 'قرنبيط',
    icon: '🥦',
    color: '#f1f5f9',
    season: 'شتوي',
    category: 'خضروات',
    profitability: 4,
    suitability: 'جيدة',
    suitabilityReason: 'سعر مرتفع نسبياً مع طلب جيد',
    bestVarieties: ['سنو كراون', 'كلودي', 'هجين أبيض'],
    plantingMonths: [9, 10],
    harvestMonths: [12, 1, 2],
    daysToHarvest: '75-95',
    yieldPerHa: '15-25 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'مشتل', days: '25-30', details: 'إنتاج الشتلات' },
      { name: 'نمو خضري', days: '35-45', details: 'تكوين الأوراق الكبيرة' },
      { name: 'تكوين الرأس', days: '20-30', details: 'ظهور وتطور الرأس الأبيض' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '20 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '250 كغ/هكتار', timing: 'مقسمة مرتين' },
      { type: 'بوراكس', amount: '15 كغ/هكتار', timing: 'رشاً على الأوراق', }
    ],
    challenges: [
      { problem: 'اصفرار الرأس', signs: 'اصفرار الرأس الأبيض', solution: 'تغطية الرأس بالأوراق', prevention: 'تغطية مبكرة' },
      { problem: 'التعفن الجرثومي', signs: 'بقع بنية في الرأس', solution: 'مبيدات نحاسية', prevention: 'تجنب الرطوبة الزائدة' }
    ],
    localTips: 'غطِّ رأس القرنبيط بأوراقه الخضراء 2-3 أسابيع قبل الحصاد للحصول على أبيض ناصع',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['ملفوف', 'قرنبيط']
  },
  {
    id: 'radish',
    name: 'فجل',
    icon: '🔴',
    color: '#ef4444',
    season: 'شتوي',
    category: 'خضروات',
    profitability: 3,
    suitability: 'جيدة جداً',
    suitabilityReason: 'دورة قصيرة جداً — يملأ الفجوات بين المحاصيل',
    bestVarieties: ['شيري بيل', 'أبيض ثلجي', 'فرنسي أحمر'],
    plantingMonths: [9, 10, 11, 2, 3],
    harvestMonths: [10, 11, 12, 3, 4],
    daysToHarvest: '25-35',
    yieldPerHa: '20-35 طن/هكتار',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'إنبات', days: '3-5', details: 'إنبات سريع جداً' },
      { name: 'نمو', days: '15-20', details: 'تكوين الجذر والأوراق' },
      { name: 'نضج', days: '7-10', details: 'تضخم الجذر اللحمي' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '10 طن/هكتار', timing: 'قبل الزراعة' }
    ],
    challenges: [
      { problem: 'تشقق الجذور', signs: 'جذور متشققة', solution: 'ري منتظم', prevention: 'تجانس الري' }
    ],
    localTips: 'أسرع خضروات الحديقة — يُحصد بعد 30 يوماً فقط ويُزرع في الفجوات بين المحاصيل الأخرى',
    goodAfter: ['أي محصول'],
    avoidAfter: []
  },
  {
    id: 'turnip',
    name: 'شلغم',
    icon: '🫛',
    color: '#e879f9',
    season: 'شتوي',
    category: 'خضروات',
    profitability: 2,
    suitability: 'جيدة',
    suitabilityReason: 'يتحمل البرودة الشديدة — مقاوم للصقيع',
    bestVarieties: ['بيرپل توب', 'طوكيو كروس', 'بلدي'],
    plantingMonths: [9, 10, 11],
    harvestMonths: [11, 12, 1],
    daysToHarvest: '50-70',
    yieldPerHa: '30-50 طن/هكتار',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'إنبات', days: '5-7', details: 'إنبات سريع' },
      { name: 'نمو خضري', days: '25-35', details: 'تكوين الأوراق' },
      { name: 'تضخم الجذر', days: '25-35', details: 'تكوين الجذر الأبيض-البنفسجي' }
    ],
    fertilization: [
      { type: 'سماد عضوي', amount: '15 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'يوريا', amount: '150 كغ/هكتار', timing: 'بعد الإنبات' }
    ],
    challenges: [
      { problem: 'دودة ورق الملفوف', signs: 'ثقوب في الأوراق', solution: 'مبيدات حشرية', prevention: 'رش مبكر' }
    ],
    localTips: 'الشلغم يُستخدم أوراقه علفاً للحيوانات وجذوره للإنسان — محصول مزدوج الفائدة',
    goodAfter: ['حبوب'],
    avoidAfter: ['ملفوف', 'فجل']
  },

  // ── بقوليات ──
  {
    id: 'fava-bean',
    name: 'فول',
    icon: '🫘',
    color: '#65a30d',
    season: 'شتوي',
    category: 'بقوليات',
    profitability: 3,
    suitability: 'جيدة جداً',
    suitabilityReason: 'يُثبّت النيتروجين ويُحسّن التربة مع غلة جيدة',
    bestVarieties: ['الرومي', 'مصري أخضر', 'نجمة'],
    plantingMonths: [10, 11, 12],
    harvestMonths: [2, 3, 4],
    daysToHarvest: '90-120',
    yieldPerHa: '10-20 طن/هكتار (أخضر) | 2-4 طن جاف',
    waterNeeds: 'منخفضة',
    stages: [
      { name: 'إنبات', days: '7-10', details: 'ظهور البادرات' },
      { name: 'نمو خضري', days: '40-50', details: 'تكوين الأفرع والعقد الجذرية' },
      { name: 'تزهير', days: '20-30', details: 'أزهار بيضاء سوداء' },
      { name: 'امتلاء القرون', days: '25-35', details: 'تضخم الحبوب' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '400 كغ/هكتار', timing: 'قبل الزراعة' },
      { type: 'سلفات البوتاسيوم', amount: '200 كغ/هكتار', timing: 'مع الزراعة' }
    ],
    challenges: [
      { problem: 'التبقع الشوكولاتي', signs: 'بقع بنية على الأوراق', solution: 'مبيدات فطرية', prevention: 'أصناف مقاومة' },
      { problem: 'المن الأسود', signs: 'حشرات سوداء تغطي القمم', solution: 'مبيدات حشرية', prevention: 'قص القمم المصابة' }
    ],
    localTips: 'الفول يُثري التربة بالنيتروجين — يوفر 80-120 كغ نيتروجين/هكتار للمحصول التالي',
    goodAfter: ['حبوب', 'خضروات'],
    avoidAfter: ['فول', 'عدس']
  },
  {
    id: 'lentil',
    name: 'عدس',
    icon: '🫘',
    color: '#92400e',
    season: 'شتوي',
    category: 'بقوليات',
    profitability: 3,
    suitability: 'جيدة',
    suitabilityReason: 'يتحمل التربة الفقيرة ومقاوم للجفاف النسبي',
    bestVarieties: ['أخضر صغير', 'أحمر مصري', 'بلدي عراقي'],
    plantingMonths: [10, 11],
    harvestMonths: [3, 4],
    daysToHarvest: '100-130',
    yieldPerHa: '1-2.5 طن/هكتار (جاف)',
    waterNeeds: 'منخفضة',
    stages: [
      { name: 'إنبات', days: '7-12', details: 'ظهور البادرات' },
      { name: 'نمو خضري', days: '50-60', details: 'تكوين الأفرع الرفيعة' },
      { name: 'تزهير', days: '20-30', details: 'أزهار صغيرة بنفسجية' },
      { name: 'نضج', days: '25-35', details: 'اصفرار وجفاف النبات' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '300 كغ/هكتار', timing: 'قبل الزراعة' }
    ],
    challenges: [
      { problem: 'الصدأ', signs: 'بقع برتقالية على الأوراق', solution: 'مبيدات فطرية', prevention: 'دورة زراعية' }
    ],
    localTips: 'العدس العراقي ذو جودة عالية — يُصدَّر لدول الخليج عند توفر الكميات الكافية',
    goodAfter: ['حبوب'],
    avoidAfter: ['عدس', 'فول']
  },
  {
    id: 'chickpea',
    name: 'حمص',
    icon: '🫘',
    color: '#d97706',
    season: 'شتوي',
    category: 'بقوليات',
    profitability: 3,
    suitability: 'جيدة',
    suitabilityReason: 'يتحمل الجفاف ومناسب للأراضي الجافة',
    bestVarieties: ['دِسي بلدي', 'كابولي هجين', 'ILC-482'],
    plantingMonths: [10, 11],
    harvestMonths: [3, 4],
    daysToHarvest: '100-120',
    yieldPerHa: '1.5-3 طن/هكتار (جاف)',
    waterNeeds: 'منخفضة (يعتمد على المطر)',
    stages: [
      { name: 'إنبات', days: '8-12', details: 'إنبات متوسط السرعة' },
      { name: 'نمو خضري', days: '45-55', details: 'نمو شجيري' },
      { name: 'تزهير', days: '20-25', details: 'أزهار بيضاء أو ورديةأصغيرة' },
      { name: 'نضج', days: '30-40', details: 'تحول القرون للبني' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '300 كغ/هكتار', timing: 'قبل الزراعة' }
    ],
    challenges: [
      { problem: 'حرقة الفيوزاريوم', signs: 'ذبول وتحول بني للجذور', solution: 'أصناف مقاومة', prevention: 'دورة زراعية' },
      { problem: 'حفار القرون', signs: 'تلف الحبوب داخل القرون', solution: 'مبيدات حشرية', prevention: 'رش مبكر' }
    ],
    localTips: 'الحمص يناسب الأراضي الجافة في الأنبار — يُزرع بعيداً عن مناطق الري الغزير',
    goodAfter: ['حبوب'],
    avoidAfter: ['حمص', 'فول', 'عدس']
  },
  {
    id: 'cowpea',
    name: 'لوبيا',
    icon: '🫘',
    color: '#166534',
    season: 'صيفي',
    category: 'بقوليات',
    profitability: 3,
    suitability: 'ممتازة',
    suitabilityReason: 'تتحمل الحرارة الشديدة وتُثبّت النيتروجين',
    bestVarieties: ['بلدي عراقي', 'إيطالي أخضر', 'بلاك آي'],
    plantingMonths: [4, 5, 6],
    harvestMonths: [6, 7, 8],
    daysToHarvest: '60-90',
    yieldPerHa: '10-18 طن/هكتار (أخضر) | 1.5-2.5 طن جاف',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'إنبات', days: '5-8', details: 'إنبات سريع' },
      { name: 'نمو خضري', days: '30-40', details: 'تكوين الأفرع والعقد' },
      { name: 'تزهير وقرون', days: '20-30', details: 'قطف متكرر للقرون الخضراء' }
    ],
    fertilization: [
      { type: 'سوبر فوسفات', amount: '300 كغ/هكتار', timing: 'قبل الزراعة' }
    ],
    challenges: [
      { problem: 'المن', signs: 'حشرات صغيرة على القمم', solution: 'صابون زراعي', prevention: 'رش مبكر' }
    ],
    localTips: 'اللوبيا تتحمل حرارة الأنبار الصيفية بامتياز — قطفها خضراء للتسويق الطازج أو اتركها تجف للبذار',
    goodAfter: ['حبوب'],
    avoidAfter: ['لوبيا', 'فول']
  },

  // ── درنات إضافية ──
  {
    id: 'sweet-potato',
    name: 'بطاطا حلوة',
    icon: '🍠',
    color: '#ea580c',
    season: 'صيفي',
    category: 'درنات',
    profitability: 4,
    suitability: 'جيدة جداً',
    suitabilityReason: 'تتحمل الحرارة — تربة الأنبار الرملية تناسبها',
    bestVarieties: ['بيوريجارد', 'جيول', 'كنتالوب برتقالي'],
    plantingMonths: [4, 5],
    harvestMonths: [8, 9],
    daysToHarvest: '100-125',
    yieldPerHa: '20-35 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'زراعة الشتلات', days: '10-14', details: 'تجذّر الشتلات' },
      { name: 'نمو خضري', days: '40-50', details: 'تمدد السيقان' },
      { name: 'تكوين الدرنات', days: '50-60', details: 'تضخم الجذور اللحمية' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '15 طن/هكتار', timing: 'قبل الزراعة' },
      { type: 'سوبر فوسفات', amount: '400 كغ/هكتار', timing: 'مع الزراعة' },
      { type: 'سلفات البوتاسيوم', amount: '400 كغ/هكتار', timing: 'بعد 45 يوم' }
    ],
    challenges: [
      { problem: 'خنفساء البطاطا الحلوة', signs: 'ثقوب في الدرنات', solution: 'مبيدات حشرية للتربة', prevention: 'حراثة عميقة قبل الزراعة' }
    ],
    localTips: 'البطاطا الحلوة غنية بالفيتامينات — قطعها الشتلية تجذّر في الماء قبل الزراعة لتسريع النمو',
    goodAfter: ['حبوب', 'بقوليات'],
    avoidAfter: ['بطاطا', 'طماطم']
  }
];

// ── بيانات الفواكه والأشجار المثمرة ──
export const fruitsData = [
  {
    id: 'date-palm',
    name: 'نخيل التمر',
    icon: '🌴',
    color: '#92400e',
    season: 'دائم',
    category: 'فواكة',
    type: 'نخيل',
    profitability: 5,
    suitability: 'ممتازة',
    suitabilityReason: 'الأنبار من أهم مناطق النخيل في العراق — بيئة مثالية',
    bestVarieties: ['برحي', 'مكتوم', 'زهدي', 'حلاوي', 'خستاوي', 'أم الخشب'],
    plantingMonths: [3, 4],
    harvestMonths: [7, 8, 9, 10],
    daysToHarvest: 'سنوي',
    yearsToProduction: '5-8 سنوات',
    lifespan: '80-150 سنة',
    spacing: '8×8 م (150-180 نخلة/هكتار)',
    yieldPerHa: '6-15 طن/هكتار (60-100 كغ/نخلة)',
    waterNeeds: 'عالية',
    stages: [
      { name: 'الطلع (إبار)', days: 'فبراير-مارس', details: 'إبار أو تلقيح يدوي أو آلي' },
      { name: 'حبابوك', days: 'أبريل-مايو', details: 'تكوين الثمار الأولية' },
      { name: 'خلال (كيمري)', days: 'مايو-يوليو', details: 'نمو الثمرة — خضراء ثم صفراء' },
      { name: 'رطب', days: 'يوليو-أغسطس', details: 'الطور الطري الحلو' },
      { name: 'تمر', days: 'سبتمبر-أكتوبر', details: 'الطور الجاف الكامل' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '50 كغ/نخلة', timing: 'سنوياً في الخريف' },
      { type: 'يوريا', amount: '2 كغ/نخلة', timing: 'ربيع وبعد الإبار' },
      { type: 'سوبر فوسفات', amount: '3 كغ/نخلة', timing: 'سنوياً' }
    ],
    challenges: [
      { problem: 'سوسة النخيل الحمراء', signs: 'نشارة حمراء في قاعدة الكرب + ذبول', solution: 'مبيدات جهازية + مصائد فرمونية', prevention: 'فحص دوري + قطع الكرب القديمة' },
      { problem: 'حشرة الدوباس', signs: 'اصفرار وتقزم الطلع', solution: 'مبيدات حشرية عند الإبار', prevention: 'رش وقائي في مارس' }
    ],
    localTips: 'النخيل في جزيرة الخالدية ذو إنتاج عالٍ بسبب المياه الوفيرة — الإبار اليدوي يضمن أفضل عقد',
    goodAfter: [],
    avoidAfter: []
  },
  {
    id: 'pomegranate',
    name: 'رمان',
    icon: '🍎',
    color: '#dc2626',
    season: 'دائم',
    category: 'فواكة',
    type: 'شجرة',
    profitability: 4,
    suitability: 'ممتازة',
    suitabilityReason: 'يتحمل الحرارة والجفاف والملوحة — مثالي للأنبار',
    bestVarieties: ['حلو مصري', 'بلدي عراقي', 'وندرفول', 'أحمر نباتي'],
    plantingMonths: [2, 3, 10, 11],
    harvestMonths: [9, 10, 11],
    daysToHarvest: 'سنوي',
    yearsToProduction: '3-5 سنوات',
    lifespan: '30-50 سنة',
    spacing: '4×5 م (500 شجرة/هكتار)',
    yieldPerHa: '20-40 طن/هكتار',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'تزهير', days: 'مارس-مايو', details: 'أزهار حمراء زاهية' },
      { name: 'عقد الثمار', days: 'مايو-يونيو', details: 'تكوين الثمار الصغيرة' },
      { name: 'نمو', days: 'يونيو-أغسطس', details: 'تضخم الثمار' },
      { name: 'نضج', days: 'سبتمبر-نوفمبر', details: 'احمرار القشرة واكتمال الحلاوة' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 كغ/شجرة', timing: 'سنوياً في نوفمبر' },
      { type: 'يوريا', amount: '500 كغ/هكتار', timing: 'مقسمة في الربيع والصيف' }
    ],
    challenges: [
      { problem: 'تشقق الثمار', signs: 'شقوق في الثمار الناضجة', solution: 'ري منتظم دون انقطاع', prevention: 'تغطية التربة حول الأشجار' },
      { problem: 'حشرة المن', signs: 'تجعد الأوراق والقمم', solution: 'مبيدات حشرية', prevention: 'رش الزيت المعدني شتاءً' }
    ],
    localTips: 'الرمان الأنباري ذو قشرة رفيعة وحبوب حمراء غنية — يُقاوم العطش أفضل من أي فاكهة أخرى',
    goodAfter: [],
    avoidAfter: []
  },
  {
    id: 'olive',
    name: 'زيتون',
    icon: '🫒',
    color: '#4d7c0f',
    season: 'دائم',
    category: 'فواكة',
    type: 'شجرة',
    profitability: 4,
    suitability: 'جيدة جداً',
    suitabilityReason: 'يتحمل الجفاف والحرارة — توجه استثماري ذو عائد طويل الأمد',
    bestVarieties: ['رومي عراقي', 'أربيكينا', 'صوري', 'منزانيلو'],
    plantingMonths: [2, 3, 10, 11],
    harvestMonths: [10, 11, 12],
    daysToHarvest: 'سنوي',
    yearsToProduction: '5-8 سنوات',
    lifespan: '100-500 سنة',
    spacing: '7×7 م (200 شجرة/هكتار)',
    yieldPerHa: '3-8 طن زيتون/هكتار (600-1500 لتر زيت)',
    waterNeeds: 'منخفضة (مقاوم للجفاف بعد التأسيس)',
    stages: [
      { name: 'تزهير', days: 'مارس-أبريل', details: 'عناقيد صغيرة من الأزهار البيضاء' },
      { name: 'عقد الثمار', days: 'أبريل-مايو', details: 'تكوين الثمار بعد التلقيح' },
      { name: 'نمو الزيت', days: 'يونيو-سبتمبر', details: 'تراكم الزيت في الثمار' },
      { name: 'حصاد', days: 'أكتوبر-ديسمبر', details: 'حسب الغرض: أخضر للتخليل أو أسود للزيت' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 كغ/شجرة', timing: 'سنوياً في نوفمبر' },
      { type: 'يوريا', amount: '300 كغ/هكتار', timing: 'مقسمة في الربيع' },
      { type: 'سلفات البوتاسيوم', amount: '200 كغ/هكتار', timing: 'يوليو' }
    ],
    challenges: [
      { problem: 'ذبابة الزيتون', signs: 'ثقوب في الثمار + يرقات', solution: 'مصائد فرمونية + مبيدات', prevention: 'رش في يوليو-أغسطس' },
      { problem: 'عين الطاووس', signs: 'بقع دائرية بنية-صفراء على الأوراق', solution: 'مبيدات نحاسية', prevention: 'تقليم لتحسين التهوية' }
    ],
    localTips: 'الزيتون استثمار طويل الأمد — بعد التأسيس (7 سنوات) لا يحتاج ريًا صيفياً إلا في حالات القحط الشديد',
    goodAfter: [],
    avoidAfter: []
  },
  {
    id: 'grape',
    name: 'عنب',
    icon: '🍇',
    color: '#7c3aed',
    season: 'دائم',
    category: 'فواكة',
    type: 'كرمة',
    profitability: 4,
    suitability: 'جيدة جداً',
    suitabilityReason: 'الحرارة الجافة تُنضج العنب بحلاوة عالية',
    bestVarieties: ['حلواني', 'رومي أحمر', 'تومسون بدون بذر', 'كارديناله'],
    plantingMonths: [2, 3],
    harvestMonths: [7, 8, 9],
    daysToHarvest: 'سنوي',
    yearsToProduction: '3-4 سنوات',
    lifespan: '30-60 سنة',
    spacing: '3×4 م (800 كرمة/هكتار)',
    yieldPerHa: '15-35 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'تفتح البراعم', days: 'مارس-أبريل', details: 'ظهور الأوراق الأولى' },
      { name: 'تزهير', days: 'أبريل-مايو', details: 'أزهار صغيرة تلقيح ذاتي' },
      { name: 'نمو العناقيد', days: 'مايو-يوليو', details: 'تضخم الحبات' },
      { name: 'نضج', days: 'يوليو-سبتمبر', details: 'تلوين وزيادة السكريات' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 كغ/كرمة', timing: 'سنوياً في نوفمبر' },
      { type: 'يوريا', amount: '200 كغ/هكتار', timing: 'بعد التفتح' },
      { type: 'سلفات البوتاسيوم', amount: '300 كغ/هكتار', timing: 'عند نضج الحبات' }
    ],
    challenges: [
      { problem: 'البياض الدقيقي', signs: 'مسحوق أبيض على الأوراق والثمار', solution: 'كبريت زراعي', prevention: 'رش وقائي دوري' },
      { problem: 'العنكبوت الأحمر', signs: 'بقع صفراء ونسيج رفيع', solution: 'مبيدات أكاروسية', prevention: 'رطوبة مناسبة' }
    ],
    localTips: 'التقليم الصحيح في فبراير هو سر الإنتاج الوفير — اترك 2-3 براعم على كل عرش',
    goodAfter: [],
    avoidAfter: []
  },
  {
    id: 'fig',
    name: 'تين',
    icon: '🫐',
    color: '#86198f',
    season: 'دائم',
    category: 'فواكة',
    type: 'شجرة',
    profitability: 3,
    suitability: 'جيدة جداً',
    suitabilityReason: 'يتحمل الحرارة والجفاف — ينمو في أفقر التربات',
    bestVarieties: ['بلدي عراقي', 'براون تركي', 'بياضي', 'سياهي'],
    plantingMonths: [2, 3, 10, 11],
    harvestMonths: [7, 8, 9],
    daysToHarvest: 'سنوي (موسمان)',
    yearsToProduction: '3-5 سنوات',
    lifespan: '50-100 سنة',
    spacing: '5×6 م (330 شجرة/هكتار)',
    yieldPerHa: '12-25 طن/هكتار',
    waterNeeds: 'منخفضة (مقاوم للجفاف)',
    stages: [
      { name: 'تفتح الأوراق', days: 'مارس-أبريل', details: 'خروج الأوراق والثمار الأولى (قطفة أولى)' },
      { name: 'الموسم الأول', days: 'يونيو-يوليو', details: 'الثمار الكبيرة - جودة أعلى' },
      { name: 'الموسم الثاني', days: 'أغسطس-أكتوبر', details: 'إنتاج أوفر وثمار أصغر' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 كغ/شجرة', timing: 'سنوياً في ديسمبر' },
      { type: 'يوريا', amount: '200 كغ/هكتار', timing: 'ربيع وبداية الصيف' }
    ],
    challenges: [
      { problem: 'حفار ساق التين', signs: 'نشارة حول القاعدة + ذبول', solution: 'مبيدات حقنية للساق', prevention: 'طلاء الجذع بالكلس' },
      { problem: 'الخنافس على الثمار', signs: 'ثقوب في الثمار الناضجة', solution: 'جمع الثمار الساقطة', prevention: 'حصاد دوري' }
    ],
    localTips: 'التين البلدي الأنباري حلو وذو رائحة مميزة — يُجفَّف في الصيف تحت الشمس لمخزون طويل الأمد',
    goodAfter: [],
    avoidAfter: []
  },
  {
    id: 'lemon',
    name: 'ليمون',
    icon: '🍋',
    color: '#eab308',
    season: 'دائم',
    category: 'فواكة',
    type: 'شجرة',
    profitability: 4,
    suitability: 'جيدة',
    suitabilityReason: 'يحتاج حماية من الصقيع — مربح جداً مع الري الجيد',
    bestVarieties: ['يوريكا', 'لزبون', 'بلدي'],
    plantingMonths: [3, 4, 10],
    harvestMonths: [10, 11, 12, 1, 2],
    daysToHarvest: 'سنوي',
    yearsToProduction: '3-5 سنوات',
    lifespan: '30-50 سنة',
    spacing: '5×6 م (330 شجرة/هكتار)',
    yieldPerHa: '20-40 طن/هكتار',
    waterNeeds: 'متوسطة إلى عالية',
    stages: [
      { name: 'تزهير متكرر', days: 'طوال السنة', details: 'الليمون يزهر ويثمر باستمرار' },
      { name: 'نضج', days: 'أكتوبر-فبراير', details: 'اصفرار وعصارة كاملة' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 كغ/شجرة', timing: 'سنوياً' },
      { type: 'يوريا', amount: '400 كغ/هكتار', timing: 'مقسمة 4 دفعات' },
      { type: 'سلفات البوتاسيوم', amount: '250 كغ/هكتار', timing: 'الخريف' }
    ],
    challenges: [
      { problem: 'الصقيع', signs: 'تلف الأوراق والثمار عند أقل من صفر', solution: 'تدفئة + تغطية عند الصقيع', prevention: 'اختيار مواقع محمية' },
      { problem: 'حشرة الدرع البيضاء', signs: 'قشور بيضاء على الأغصان', solution: 'زيت معدني + مبيدات', prevention: 'رش شتوي بالزيت' }
    ],
    localTips: 'ابن مصدات ريحية جنوب وغرب الحديقة لحماية الليمون من الصقيع الشتوي',
    goodAfter: [],
    avoidAfter: []
  },
  {
    id: 'orange',
    name: 'برتقال',
    icon: '🍊',
    color: '#f97316',
    season: 'دائم',
    category: 'فواكة',
    type: 'شجرة',
    profitability: 4,
    suitability: 'جيدة',
    suitabilityReason: 'يحتاج حماية من الصقيع الشديد — طلب سوقي دائم',
    bestVarieties: ['نافلي', 'فالنسيا', 'واشنطن ناول', 'بلدي'],
    plantingMonths: [3, 4, 10],
    harvestMonths: [11, 12, 1, 2, 3],
    daysToHarvest: 'سنوي',
    yearsToProduction: '4-6 سنوات',
    lifespan: '30-50 سنة',
    spacing: '5×6 م (330 شجرة/هكتار)',
    yieldPerHa: '25-50 طن/هكتار',
    waterNeeds: 'متوسطة إلى عالية',
    stages: [
      { name: 'تزهير', days: 'فبراير-أبريل', details: 'أزهار بيضاء عطرة — زهر البرتقال' },
      { name: 'عقد الثمار', days: 'أبريل-مايو', details: 'تكوين الثمار الصغيرة' },
      { name: 'نمو', days: 'مايو-أكتوبر', details: 'تضخم الثمار' },
      { name: 'نضج', days: 'نوفمبر-مارس', details: 'تحول البرتقالي وزيادة العصير' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '25 كغ/شجرة', timing: 'سنوياً في أكتوبر' },
      { type: 'يوريا', amount: '500 كغ/هكتار', timing: 'مقسمة 3 دفعات' },
      { type: 'سلفات البوتاسيوم', amount: '300 كغ/هكتار', timing: 'يوليو-أغسطس' }
    ],
    challenges: [
      { problem: 'الصقيع', signs: 'تلف الأوراق والثمار', solution: 'ري قبل الصقيع + تغطية', prevention: 'مواقع دافئة محمية' },
      { problem: 'حفار الفاكهة', signs: 'ثمار تسقط مبكراً', solution: 'مبيدات حشرية', prevention: 'مصائد فرمونية' }
    ],
    localTips: 'البرتقال يحتاج ريًا منتظماً في الصيف لتفادي سقوط الثمار — يُباع طازجاً أو يُعصر محلياً',
    goodAfter: [],
    avoidAfter: []
  },
  {
    id: 'apricot',
    name: 'مشمش',
    icon: '🍑',
    color: '#fb923c',
    season: 'دائم',
    category: 'فواكة',
    type: 'شجرة',
    profitability: 4,
    suitability: 'جيدة جداً',
    suitabilityReason: 'يتحمل الحرارة جيداً ويكافئ بثمار ذهبية',
    bestVarieties: ['بلدي عراقي', 'هاركوت', 'تومكوت', 'شفيعي'],
    plantingMonths: [2, 3, 11, 12],
    harvestMonths: [5, 6, 7],
    daysToHarvest: 'سنوي',
    yearsToProduction: '3-5 سنوات',
    lifespan: '30-40 سنة',
    spacing: '5×6 م (330 شجرة/هكتار)',
    yieldPerHa: '10-25 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'تزهير مبكر', days: 'فبراير-مارس', details: 'أزهار وردية قبل الأوراق' },
      { name: 'عقد الثمار', days: 'مارس-أبريل', details: 'تكوين الثمار الصغيرة' },
      { name: 'نضج', days: 'مايو-يوليو', details: 'اصفرار وإحمرار الثمار' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 كغ/شجرة', timing: 'سنوياً في نوفمبر' },
      { type: 'يوريا', amount: '300 كغ/هكتار', timing: 'بعد الحصاد وفي الربيع' }
    ],
    challenges: [
      { problem: 'ثقب الرصاصة', signs: 'ثقوب دائرية في الأوراق', solution: 'مبيدات نحاسية', prevention: 'تقليم الأغصان المصابة' },
      { problem: 'التزهير المبكر والصقيع', signs: 'تلف الأزهار بالصقيع', solution: 'رش مائي وقت الصقيع', prevention: 'اختيار أصناف متأخرة التزهير' }
    ],
    localTips: 'المشمش الأنباري المبكر يُسوَّق قبل المشمش الشمالي بشهر كامل — ميزة تسويقية كبرى',
    goodAfter: [],
    avoidAfter: []
  },
  {
    id: 'peach',
    name: 'خوخ',
    icon: '🍑',
    color: '#fda4af',
    season: 'دائم',
    category: 'فواكة',
    type: 'شجرة',
    profitability: 4,
    suitability: 'جيدة',
    suitabilityReason: 'يحتاج ساعات برودة — أصناف استوائية تناسب الأنبار',
    bestVarieties: ['فلورداسان', 'أوراسار', 'شبرا الخيمة'],
    plantingMonths: [2, 3, 11, 12],
    harvestMonths: [5, 6, 7],
    daysToHarvest: 'سنوي',
    yearsToProduction: '3-4 سنوات',
    lifespan: '15-25 سنة',
    spacing: '4×5 م (500 شجرة/هكتار)',
    yieldPerHa: '15-30 طن/هكتار',
    waterNeeds: 'متوسطة',
    stages: [
      { name: 'تزهير', days: 'فبراير-مارس', details: 'أزهار وردية زاهية' },
      { name: 'عقد الثمار', days: 'مارس-أبريل', details: 'تكوين الثمار مع ترقيق إذا لزم' },
      { name: 'نضج', days: 'مايو-يوليو', details: 'تلون الثمار وطراوتها' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '20 كغ/شجرة', timing: 'سنوياً في الخريف' },
      { type: 'يوريا', amount: '300 كغ/هكتار', timing: 'ربيع وبعد الحصاد' }
    ],
    challenges: [
      { problem: 'تجعد الأوراق', signs: 'تشوه وتجعد الأوراق الصغيرة', solution: 'مبيدات نحاسية قبل التبرعم', prevention: 'رش شتوي' },
      { problem: 'حفار النواة', signs: 'ثقوب في الثمار وسقوطها', solution: 'مبيدات حشرية', prevention: 'تدمير ثمار الساقطة' }
    ],
    localTips: 'اختر أصناف ذات احتياجات برودة منخفضة (LHC) لضمان الإنتاج في مناخ الأنبار الدافئ',
    goodAfter: [],
    avoidAfter: []
  },
  {
    id: 'almond',
    name: 'لوز',
    icon: '🌰',
    color: '#92400e',
    season: 'دائم',
    category: 'فواكة',
    type: 'شجرة',
    profitability: 4,
    suitability: 'جيدة',
    suitabilityReason: 'يتحمل الجفاف والتربة الجيرية — ربحية عالية للكغ',
    bestVarieties: ['بلدي عراقي', 'أوف رهام', 'بريشنسكي', 'نون بريل'],
    plantingMonths: [2, 3, 11, 12],
    harvestMonths: [8, 9],
    daysToHarvest: 'سنوي',
    yearsToProduction: '4-6 سنوات',
    lifespan: '40-60 سنة',
    spacing: '6×7 م (240 شجرة/هكتار)',
    yieldPerHa: '1.5-4 طن/هكتار (منقوص القشرة)',
    waterNeeds: 'منخفضة إلى متوسطة',
    stages: [
      { name: 'تزهير مبكر', days: 'يناير-فبراير', details: 'أول أشجار الفاكهة تزهيراً' },
      { name: 'عقد الثمار', days: 'فبراير-مارس', details: 'يحتاج صنفين للتلقيح المتبادل' },
      { name: 'نضج', days: 'أغسطس-سبتمبر', details: 'تشقق القشرة الخضراء وتعرض اللوزة' }
    ],
    fertilization: [
      { type: 'سماد بلدي', amount: '15 كغ/شجرة', timing: 'سنوياً في أكتوبر' },
      { type: 'يوريا', amount: '200 كغ/هكتار', timing: 'ربيع' }
    ],
    challenges: [
      { problem: 'الصقيع على الأزهار', signs: 'تلف الأزهار المبكرة', solution: 'رش مائي ليلاً وقت الصقيع', prevention: 'أصناف متأخرة التزهير' }
    ],
    localTips: 'ازرع صنفين على الأقل لتلقيح متبادل — سعر اللوز العراقي في السوق المحلي مرتفع',
    goodAfter: [],
    avoidAfter: []
  }
];
