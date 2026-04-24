/* ──────────────────────────────────────────────────────────
   خصائص الغرض
────────────────────────────────────────────────────────── */
export const PURPOSE_LABELS = {
  dairy:     'حلوب',
  fattening: 'تسمين',
  breeding:  'تكاثر',
  laying:    'بياض',
  mixed:     'مزدوج'
};

export const PURPOSE_COLORS = {
  dairy:     '#0ea5e9',
  fattening: '#f97316',
  breeding:  '#8b5cf6',
  laying:    '#eab308',
  mixed:     '#14b8a6'
};

/* ──────────────────────────────────────────────────────────
   القوالب
────────────────────────────────────────────────────────── */
export const BREEDING_TEMPLATES = {

  /* ══════════ أبقار ══════════ */

  cattle_dairy_holstein: {
    label: 'فريزيان / هولشتاين',
    icon: '🐄', animalType: 'cattle', purpose: 'dairy',
    totalDays: 305,
    targets: { main: '25-35 لتر/يوم ذروة', secondary: '7000-9000 لتر/موسم', fcr: 'ذروة الإنتاج: يوم 60-70' },
    commonDiseases: ['حمى الحليب (نقص كالسيوم)', 'الكيتوسيس', 'إزاحة الكرش', 'التهاب الضرع الإكلينيكي', 'تقرح الأقدام'],
    phases: [
      { name: 'الانتقال وذروة الإنتاج', startDay: 0, endDay: 100, feedType: 'TMR عالي طاقة — مركزة 60% + سيلاج + ذرة صفراء', feedKgPerHead: 22, notes: 'حلب 3 مرات/يوم، اختبر البول للكيتوسيس أسبوعياً' },
      { name: 'منتصف الموسم', startDay: 101, endDay: 200, feedType: 'TMR متوازن — مركزة 50%', feedKgPerHead: 18, notes: '0.45 كغ مركزة / لتر حليب فوق 20 لتر، حلب مرتين/يوم' },
      { name: 'نهاية الموسم', startDay: 201, endDay: 244, feedType: 'TMR منخفض الطاقة — مركزة 35%', feedKgPerHead: 13, notes: 'أوقف الحلب تدريجياً (يوم واحد بين كل حلبة)' },
      { name: 'فترة الجفاف', startDay: 245, endDay: 305, feedType: 'عليقة جفاف — أعلاف خشنة 70% + مركزة 30%', feedKgPerHead: 10, notes: 'مكمل Vit E + Se + Zn قبل 3 أسابيع من الولادة المتوقعة' }
    ],
    vaccines: [
      { name: 'حمى قلاعية (FMD)', day: 0, dose: '2 مل', method: 'حقن عضلي' },
      { name: 'حمى قلاعية تعزيزي', day: 150, dose: '2 مل', method: 'حقن عضلي' },
      { name: 'إغلاق الجفاف (داخل الضرع)', day: 244, dose: 'ربع ضرع', method: 'حقن داخل الضرع' },
      { name: 'حمى الولادة الوقائي (Vit D3)', day: 280, dose: '10 مل', method: 'حقن عضلي' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 21, text: 'فترة الانتقال أخطر مرحلة — راقب يومياً: الشهية، البراز، درجة الحرارة. تحذير: نقص كالسيوم يحدث خلال 48 ساعة بعد الولادة' },
      { fromDay: 22, toDay: 100, text: 'ادعم ذروة الإنتاج بـ TMR حر + أملاح تمريرية (Bypass fat, Bypass protein) — تجنب نقص الطاقة السلبي أكثر من 3 أسابيع' },
      { fromDay: 101, toDay: 200, text: 'عدّل كمية المركزة وفق الإنتاج الفعلي أسبوعياً — خفض الإنتاج أكثر من 15% يعني مشكلة صحية أو تغذوية' },
      { fromDay: 201, toDay: 244, text: 'استهدف BCS 3.0-3.5 عند الجفاف — البقرة السمينة أكثر عرضة للكيتوسيس في الموسم التالي' },
      { fromDay: 245, toDay: 305, text: 'وفّر مرعى راحة مريح، راقب الحركة والشهية يومياً — انتبه لأعراض الولادة قبل 2-3 أيام' }
    ]
  },

  cattle_dairy_buffalo: {
    label: 'جاموس (نيلي-راوي / محلي)',
    icon: '🐃', animalType: 'cattle', purpose: 'dairy',
    totalDays: 270,
    targets: { main: '10-18 لتر/يوم', secondary: '1800-2500 لتر/موسم', fcr: 'دهون الحليب 7-8% (ممتاز للجبن)' },
    commonDiseases: ['التهاب الضرع', 'ديدان الكبد (فاشيولا)', 'الطفيليات الخارجية', 'ضربة الشمس (حساس للحرارة)'],
    phases: [
      { name: 'ذروة الإنتاج', startDay: 0, endDay: 90, feedType: 'علف تركيز جاموس 18% بروتين + أعلاف خشنة', feedKgPerHead: 14, notes: 'حلب مرتين/يوم، وفّر وحل أو حوض تبريد صيفاً' },
      { name: 'منتصف الموسم', startDay: 91, endDay: 180, feedType: 'مركزة 16% بروتين + قش + حشيشة', feedKgPerHead: 11, notes: 'الجاموس يستهلك أعلافاً خشنة أكثر من الأبقار' },
      { name: 'نهاية الموسم', startDay: 181, endDay: 270, feedType: 'أعلاف خشنة 70% + مركزة 30%', feedKgPerHead: 9, notes: 'جفاف 60 يوماً قبل الولادة المتوقعة' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 0, dose: '3 مل', method: 'حقن عضلي' },
      { name: 'علاج ديدان الكبد (Fasciola)', day: 30, dose: 'حسب الوزن', method: 'شرب / حقن' },
      { name: 'حمى قلاعية تعزيزي', day: 120, dose: '3 مل', method: 'حقن عضلي' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 90, text: 'الجاموس حساس جداً للحرارة فوق 35°م — وفّر ظل وتبريد ومياه وفيرة لتجنب انخفاض الإنتاج صيفاً' },
      { fromDay: 91, toDay: 270, text: 'الجاموس يعطي حليباً أعلى دهناً — مناسب جداً لإنتاج الجبن والقيمر. راقب ديدان الكبد كل 3 أشهر' }
    ]
  },

  cattle_fat_exotic: {
    label: 'أنغوس / شاروليه / سيمنتال — تسمين',
    icon: '🐂', animalType: 'cattle', purpose: 'fattening',
    totalDays: 150,
    targets: { main: 'زيادة يومية 1.5-2 كغ/يوم', secondary: 'وزن تسويق 450-550 كغ', fcr: 'معدل تحويل 6-7:1' },
    commonDiseases: ['الحماض الكروشي', 'الانتفاخ الكروشي', 'التهاب الأقدام', 'الحمى التنفسية عند الاستقبال'],
    phases: [
      { name: 'استقبال وتأقلم', startDay: 0, endDay: 21, feedType: 'تبن حر + مركزة 20% (تدريجي)', feedKgPerHead: 8, notes: 'علاج طفيليات يوم 1، لقاحات، راحة واسعة — لا تضغط على الحيوانات' },
      { name: 'تسمين متوسط', startDay: 22, endDay: 90, feedType: 'مركزة ذرة+صويا 50% + تبن 50%', feedKgPerHead: 12, notes: 'زد المركزة 0.5 كغ/أسبوع حتى الحد المحدد' },
      { name: 'تسمين مكثف', startDay: 91, endDay: 150, feedType: 'مركزة ذرة+شعير 65% + تبن 35%', feedKgPerHead: 15, notes: 'راقب النفخة يومياً — Lasalocid أو Monensin وقائي' }
    ],
    vaccines: [
      { name: 'حمى قلاعية (FMD)', day: 1, dose: '2 مل', method: 'حقن عضلي' },
      { name: 'التسمم الدموي (HS) + تورم خبيث', day: 3, dose: '2 مل', method: 'حقن تحت الجلد' },
      { name: 'الحمى النزلية البقرية (BVD)', day: 7, dose: '2 مل', method: 'حقن عضلي' },
      { name: 'حمى قلاعية تعزيزي', day: 28, dose: '2 مل', method: 'حقن عضلي' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 21, text: 'أسبوعا الاستقبال الأكثر خطراً — وفّر بيئة هادئة، ماء نقي بحرية، تبن حر. الزيادة السريعة في المركزة تقتل' },
      { fromDay: 22, toDay: 90, text: 'زن الدفعة كل أسبوعين — الزيادة الطبيعية 1.5-2 كغ/يوم، أي انخفاض يعني مشكلة' },
      { fromDay: 91, toDay: 150, text: 'راقب علامات الانتفاخ (الجانب الأيسر منتفخ) — اتصل بالطبيب فوراً. جهز للتسويق عند بلوغ الوزن المستهدف' }
    ]
  },

  cattle_fat_local: {
    label: 'محلي عراقي / شامي — تسمين',
    icon: '🐄', animalType: 'cattle', purpose: 'fattening',
    totalDays: 180,
    targets: { main: 'زيادة يومية 0.8-1.2 كغ', secondary: 'وزن تسويق 280-380 كغ', fcr: 'معدل تحويل 8-9:1' },
    commonDiseases: ['حمى قلاعية (إذا لم تُحصَّن)', 'طفيليات داخلية', 'التهاب الأقدام الصيفي'],
    phases: [
      { name: 'تأقلم واستقبال', startDay: 0, endDay: 30, feedType: 'أعلاف خشنة حرة + مركزة 25%', feedKgPerHead: 6, notes: 'المحلي يتأقلم بسرعة مع الحرارة، علاج طفيليات يوم 1' },
      { name: 'تسمين تدريجي', startDay: 31, endDay: 120, feedType: 'شعير + نخالة قمح + كسبة قطن 45%', feedKgPerHead: 9, notes: 'الشعير المحلي أوفر من الذرة — يعطي أداءً جيداً مع المحلي' },
      { name: 'تشطيب', startDay: 121, endDay: 180, feedType: 'مركزة تشطيب ذرة 55% + تبن', feedKgPerHead: 11, notes: 'راقب جودة الشحم والتغطية قبل التسويق' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 0, dose: '2 مل', method: 'حقن عضلي' },
      { name: 'التسمم الدموي (HS)', day: 7, dose: '2 مل', method: 'حقن تحت الجلد' },
      { name: 'حمى قلاعية تعزيزي', day: 60, dose: '2 مل', method: 'حقن عضلي' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 30, text: 'المحلي لا يحتاج فترة تأقلم طويلة — قدّم الأعلاف المتاحة محلياً (تبن، نخالة، شعير)' },
      { fromDay: 31, toDay: 180, text: 'الشعير + كسبة القطن + النخالة مزيج اقتصادي جيد للمحلي — وفّر ظلاً وتهوية صيفاً' }
    ]
  },

  /* ══════════ أغنام ══════════ */

  sheep_fat_awassi: {
    label: 'عواسي — تسمين حملان',
    icon: '🐑', animalType: 'sheep', purpose: 'fattening',
    totalDays: 90,
    targets: { main: 'زيادة يومية 200-280 غ', secondary: 'وزن تسويق 38-48 كغ', fcr: 'معدل تحويل 4.5-5.5:1' },
    commonDiseases: ['الديدان المعوية (هيمونكوس)', 'التسمم الغذائي (Clostridial)', 'جدري الأغنام', 'تقرح الفم'],
    phases: [
      { name: 'تأقلم واستقبال', startDay: 0, endDay: 14, feedType: 'تبن حر + مركزة 20% (200 غ/رأس)', feedKgPerHead: 0.8, notes: 'علاج ديدان معوية يوم 1-2، وزن الدفعة عند الاستقبال، اعزل المرضى' },
      { name: 'تسمين مبكر', startDay: 15, endDay: 45, feedType: 'شعير + كسبة فول + نخالة 40%', feedKgPerHead: 1.4, notes: 'زد المركزة 100 غ/أسبوع حتى 40% من الحصة' },
      { name: 'تسمين مكثف', startDay: 46, endDay: 90, feedType: 'مركزة شعير وصويا 55% + تبن', feedKgPerHead: 2, notes: 'وزن كل 3 أسابيع، استهدف 40+ كغ للتسويق' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 1, dose: '1 مل', method: 'حقن عضلي' },
      { name: 'جدري أغنام', day: 3, dose: '0.5 مل', method: 'حقن تحت الجلد' },
      { name: 'المطثيات والحمى المتعفنة (7-in-1)', day: 5, dose: '1 مل', method: 'حقن تحت الجلد' },
      { name: 'حمى قلاعية تعزيزي', day: 28, dose: '1 مل', method: 'حقن عضلي' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 14, text: 'فحص قوة الساقين والعيون — العواسي الضعيف يحتاج فيتامين AD3E عند الاستقبال. لا تزد المركزة قبل إزالة الديدان' },
      { fromDay: 15, toDay: 45, text: 'الشعير المحلي أساس اقتصادي — أضف نخالة 20% + كسبة فول 10% لتحسين البروتين' },
      { fromDay: 46, toDay: 90, text: 'زن عينة 10 حملان كل 3 أسابيع — الوزن دون التوقع يشير لإصابة بالديدان أو نقص بروتين' }
    ]
  },

  sheep_fat_najdi: {
    label: 'نجدي — تسمين',
    icon: '🐑', animalType: 'sheep', purpose: 'fattening',
    totalDays: 75,
    targets: { main: 'زيادة يومية 280-380 غ', secondary: 'وزن تسويق 50-70 كغ', fcr: 'معدل تحويل 3.8-4.5:1' },
    commonDiseases: ['الديدان المعوية', 'التهاب الأطراف', 'الحمى القلاعية'],
    phases: [
      { name: 'تأقلم (مهم جداً)', startDay: 0, endDay: 10, feedType: 'تبن حر + ماء نظيف — بدون مركزة أول 3 أيام', feedKgPerHead: 0.9, notes: 'النجدي يأتي من ظروف مختلفة — التأقلم التدريجي يمنع 80% من النفوق' },
      { name: 'تسمين مبكر', startDay: 11, endDay: 35, feedType: 'مركزة تسمين 40% (شعير+ذرة+صويا)', feedKgPerHead: 1.8, notes: 'زد 200 غ/يومين حتى بلوغ 1.8 كغ' },
      { name: 'تسمين مكثف', startDay: 36, endDay: 75, feedType: 'مركزة تسمين 55% + تبن بحرية', feedKgPerHead: 2.5, notes: 'النجدي يتحمل المركزة العالية — أداء ممتاز مع تبن حر' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 1, dose: '1 مل', method: 'حقن عضلي' },
      { name: 'المطثيات (Clostridial)', day: 3, dose: '1 مل', method: 'حقن تحت الجلد' },
      { name: 'علاج طفيليات', day: 2, dose: 'حسب الوزن', method: 'شرب' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 10, text: 'اليوم الأول أحياناً يموت النجدي من صدمة النقل — وفّر الهدوء والماء والتبن فقط. لا مركزة أول 3 أيام' },
      { fromDay: 11, toDay: 75, text: 'النجدي يرد مكاسب ممتازة مع التغذية الجيدة — الهدف 300 غ/يوم حد أدنى. الأداء الرديء يعني مشكلة صحية' }
    ]
  },

  sheep_fat_hamdani: {
    label: 'حمداني / كردي — تسمين',
    icon: '🐑', animalType: 'sheep', purpose: 'fattening',
    totalDays: 100,
    targets: { main: 'زيادة يومية 180-250 غ', secondary: 'وزن تسويق 42-52 كغ', fcr: 'معدل تحويل 5-6:1' },
    commonDiseases: ['الديدان المعوية', 'جدري الأغنام', 'التهاب العيون (الكيراتو)'],
    phases: [
      { name: 'تأقلم', startDay: 0, endDay: 14, feedType: 'مرعى + تبن + مركزة 20%', feedKgPerHead: 1.0, notes: 'الحمداني معتاد على المراعي — التحول للتغذية المكثفة يحتاج صبراً' },
      { name: 'تسمين', startDay: 15, endDay: 100, feedType: 'شعير + نخالة + كسبة 45%', feedKgPerHead: 1.8, notes: 'أضف ملح ومعادن يومياً (10 غ/رأس)' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 1, dose: '1 مل', method: 'حقن عضلي' },
      { name: 'جدري أغنام', day: 5, dose: '0.5 مل', method: 'حقن تحت الجلد' },
      { name: 'المطثيات', day: 7, dose: '1 مل', method: 'حقن تحت الجلد' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 14, text: 'الحمداني يتأقلم ببطء مع المركزة — قدم التبن بحرية طول الفترة لمنع الانتفاخ' },
      { fromDay: 15, toDay: 100, text: 'أداء متوسط لكن مقبول اقتصادياً مع الأعلاف المحلية الرخيصة (شعير + نخالة + قش)' }
    ]
  },

  sheep_dairy_awassi: {
    label: 'عواسي محسّن — حلوب',
    icon: '🥛', animalType: 'sheep', purpose: 'dairy',
    totalDays: 180,
    targets: { main: '1.5-3 لتر/يوم', secondary: '150-300 لتر/موسم', fcr: 'دهن الحليب 6-7%' },
    commonDiseases: ['التهاب الضرع (مشكلة رئيسية)', 'الديدان المعوية', 'مشاكل الولادة'],
    phases: [
      { name: 'ذروة الإنتاج', startDay: 0, endDay: 60, feedType: 'علف تركيز 18% بروتين + تبن', feedKgPerHead: 1.5, notes: 'حلب مرتين/يوم — نظافة الضرع ضرورية لمنع الماستيتس' },
      { name: 'منتصف الموسم', startDay: 61, endDay: 120, feedType: 'مركزة 16% بروتين + مرعى', feedKgPerHead: 1.2, notes: 'إذا توفر مرعى خفض المركزة 30%' },
      { name: 'نهاية الموسم', startDay: 121, endDay: 180, feedType: 'تبن + مركزة 0.5 كغ/رأس', feedKgPerHead: 0.8, notes: 'تجفيف 45-60 يوماً قبل الولادة القادمة' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 0, dose: '1 مل', method: 'حقن عضلي' },
      { name: 'المطثيات + تيتانوس', day: 14, dose: '1 مل', method: 'حقن تحت الجلد' },
      { name: 'حمى قلاعية تعزيزي', day: 90, dose: '1 مل', method: 'حقن عضلي' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 60, text: 'التهاب الضرع يكلف 40-60% من إنتاج الموسم — افحص الضرع يومياً قبل الحلب (اختبار كاليفورنيا CMT)' },
      { fromDay: 61, toDay: 180, text: 'أحسب الجدوى الاقتصادية: إنتاج الحليب يعوّض تكلفة المركزة أم لا؟ — النعجة التي تنتج أقل من 500 مل/يوم غير اقتصادية' }
    ]
  },

  sheep_breed_awassi: {
    label: 'عواسي — تكاثر وإنتاج حملان',
    icon: '🐑', animalType: 'sheep', purpose: 'breeding',
    totalDays: 210,
    targets: { main: 'معدل تكاثر 110-130%', secondary: 'وزن الحمل عند الفطام 22-28 كغ', fcr: 'فترة الحمل: 150 يوم' },
    commonDiseases: ['عسر الولادة (الحملان الكبيرة)', 'الديدان المعوية', 'مشاكل البروسيلا'],
    phases: [
      { name: 'الإعداد للإخصاب', startDay: 0, endDay: 30, feedType: 'مركزة تحسين 0.3-0.5 كغ + مرعى', feedKgPerHead: 1.5, notes: 'Flushing: زد 200 غ مركزة أسبوعين قبل الإدخال — يرفع التوأم 15%' },
      { name: 'حمل مبكر', startDay: 31, endDay: 100, feedType: 'مركزة حمل 0.5 كغ + تبن', feedKgPerHead: 1.4, notes: 'تغذية ثابتة — التذبذب يزيد الإجهاض في هذه المرحلة' },
      { name: 'حمل متأخر (أهم مرحلة)', startDay: 101, endDay: 150, feedType: 'مركزة 0.8 كغ + تبن + فيتامينات', feedKgPerHead: 1.9, notes: 'الجنين يضاعف وزنه آخر 50 يوم — زد 30% من العلف ببطء' },
      { name: 'رضاعة ورعاية الحملان', startDay: 151, endDay: 210, feedType: 'مركزة 1 كغ + تبن حر + ملح', feedKgPerHead: 2.2, notes: 'فطام عند 60-90 يوم، وزن الحمل عند الفطام يعكس جودة الأم' }
    ],
    vaccines: [
      { name: 'حمى قلاعية', day: 0, dose: '1 مل', method: 'حقن عضلي' },
      { name: 'البروسيلا (للحلوب غير المحصنة)', day: 14, dose: '1 مل', method: 'حقن تحت الجلد' },
      { name: 'المطثيات (Clostridial 7-in-1)', day: 120, dose: '1 مل', method: 'حقن تحت الجلد' },
      { name: 'جدري الأغنام (قبل الولادة)', day: 130, dose: '0.5 مل', method: 'حقن تحت الجلد' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 30, text: 'Flushing قبل الإدخال أثبت فعاليته — أضف 200-300 غ مركزة لمدة أسبوعين فقط قبل تعريض الكباش' },
      { fromDay: 101, toDay: 150, text: 'آخر 50 يوم قبل الولادة أحرج مرحلة — نقص الطاقة يسبب الكيتوسيس الحملي ويقتل النعجة' },
      { fromDay: 151, toDay: 210, text: 'افحص الحملان خلال ساعة من الولادة — كلوستروم اللبأ أول 6 ساعات ضروري للمناعة' }
    ]
  },

  /* ══════════ دواجن ══════════ */

  poultry_broiler_ross308: {
    label: 'روس 308 — لاحم',
    icon: '🐔', animalType: 'poultry', purpose: 'fattening',
    totalDays: 42,
    targets: { main: 'وزن تسويق 2.8-3.2 كغ/يوم 42', secondary: 'FCR: 1.65-1.80', fcr: 'نفوق طبيعي: أقل من 3%' },
    commonDiseases: ['متلازمة النفوق المفاجئ (SDS)', 'جمبورو (IBD)', 'نيوكاسل', 'التهاب الكيس الهوائي', 'التهاب الأمعاء (NE)'],
    phases: [
      { name: 'مرحلة البداية (Starter)', startDay: 0, endDay: 10, feedType: 'بادئ روس — 23% بروتين، 3000 kcal', feedKgPerHead: 0.04, notes: 'حرارة 33°م تحت الدفايات، إضاءة 23 ساعة، تقليم المناقير اختياري' },
      { name: 'مرحلة النمو (Grower)', startDay: 11, endDay: 24, feedType: 'ناشئ روس — 21% بروتين، 3100 kcal', feedKgPerHead: 0.12, notes: 'حرارة 28-30°م، تهوية 0.15 م/ث، تجنب الأمونيا >20 ppm' },
      { name: 'مرحلة التشطيب (Finisher)', startDay: 25, endDay: 35, feedType: 'ناهٍ روس — 19% بروتين، 3200 kcal', feedKgPerHead: 0.18, notes: 'قلل الإضاءة إلى 20 ساعة للنوم — يحسن FCR' },
      { name: 'مرحلة السحب (Withdrawal)', startDay: 36, endDay: 42, feedType: 'علف سحب بدون مضادات — 18% بروتين', feedKgPerHead: 0.22, notes: 'أوقف كل المضادات والمنشطات 5 أيام قبل التسويق — إلزامي' }
    ],
    vaccines: [
      { name: 'نيوكاسل + IB (H120)', day: 1, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'جمبورو (IBD Intermediate)', day: 10, dose: '1 قطرة/طير', method: 'قطرة عين أو ماء' },
      { name: 'نيوكاسل LaSota', day: 18, dose: '1 قطرة/طير أو ماء', method: 'ماء الشرب' },
      { name: 'جمبورو تعزيزي (Hot strain)', day: 21, dose: 'ماء الشرب', method: 'ماء الشرب' },
      { name: 'نيوكاسل Clone 30', day: 32, dose: 'ماء الشرب', method: 'ماء الشرب' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 3, text: 'يومي 1-3 أحرج مرحلة — حرارة 33°م، إضاءة مستمرة 24 ساعة، علف وماء أمام الكتاكيت مباشرة عند التسليم' },
      { fromDay: 4, toDay: 10, text: 'راقب توزيع الكتاكيت كل ساعتين — تمركز حول الدفاية = برد، تباعد = حر. المثالي: توزيع منتظم' },
      { fromDay: 11, toDay: 24, text: 'أمونيا > 25 ppm تضر الجهاز التنفسي وتخفض الأداء 15-20% — تهوية مستمرة حتى ليلاً' },
      { fromDay: 25, toDay: 42, text: 'وزّن 50 طيراً كل 5 أيام — الوزن أقل من جدول روس 308 يعني مشكلة. جهز للتسويق عند 2.8+ كغ' }
    ]
  },

  poultry_broiler_cobb500: {
    label: 'كوب 500 — لاحم',
    icon: '🐔', animalType: 'poultry', purpose: 'fattening',
    totalDays: 42,
    targets: { main: 'وزن تسويق 2.7-3.1 كغ/يوم 42', secondary: 'FCR: 1.60-1.75', fcr: 'نفوق طبيعي: أقل من 3%' },
    commonDiseases: ['نيوكاسل', 'جمبورو (IBD)', 'الالتهاب الرئوي المزمن (CRD)', 'داء المفاصل الجرثومي'],
    phases: [
      { name: 'بداية (Starter)', startDay: 0, endDay: 10, feedType: 'بادئ كوب — 22% بروتين، 3050 kcal', feedKgPerHead: 0.04, notes: 'الكوب 500 أثقل وزناً مبكراً من روس — يحتاج بروتين عالي في البداية' },
      { name: 'نمو (Grower)', startDay: 11, endDay: 24, feedType: 'ناشئ كوب — 20% بروتين، 3150 kcal', feedKgPerHead: 0.12, notes: 'الكوب أكثر كفاءة في FCR — راقب استهلاك الماء: 1.8 × الأكل' },
      { name: 'تشطيب (Finisher)', startDay: 25, endDay: 35, feedType: 'ناهٍ كوب — 18% بروتين، 3200 kcal', feedKgPerHead: 0.18, notes: 'الكوب يتقبل إضاءة 18 ساعة — يقلل التوتر ويحسن FCR' },
      { name: 'سحب (Withdrawal)', startDay: 36, endDay: 42, feedType: 'علف سحب 17% بروتين — بدون مضادات', feedKgPerHead: 0.22, notes: '5 أيام بدون مضادات إلزامية قبل التسليم للمسلخ' }
    ],
    vaccines: [
      { name: 'نيوكاسل + IB', day: 1, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'جمبورو (IBD)', day: 10, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'نيوكاسل تعزيزي', day: 18, dose: 'ماء الشرب', method: 'ماء الشرب' },
      { name: 'جمبورو تعزيزي', day: 22, dose: 'ماء الشرب', method: 'ماء الشرب' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 10, text: 'الكوب 500 أسرع نمواً — يحتاج 5% أكثر في مساحة التغذية لتجنب التزاحم على العلف' },
      { fromDay: 11, toDay: 42, text: 'الميزة الرئيسية للكوب: FCR أقل من روس — تتبع جدول الوزن الرسمي لكوب للمقارنة' }
    ]
  },

  poultry_broiler_hubbard: {
    label: 'هوبارد كلاسيك / F15 — لاحم',
    icon: '🐔', animalType: 'poultry', purpose: 'fattening',
    totalDays: 45,
    targets: { main: 'وزن تسويق 2.9-3.3 كغ/يوم 45', secondary: 'FCR: 1.75-1.90', fcr: 'أقوى مقاومة للأمراض' },
    commonDiseases: ['نيوكاسل', 'جمبورو', 'متلازمة الوذمة البطنية (Ascites)'],
    phases: [
      { name: 'بداية', startDay: 0, endDay: 14, feedType: 'بادئ هوبارد — 22% بروتين', feedKgPerHead: 0.06, notes: 'الهوبارد أبطأ نمواً لكن أقوى بنية — أنسب لظروف الإجهاد الحراري' },
      { name: 'نمو وتشطيب', startDay: 15, endDay: 35, feedType: 'ناشئ هوبارد — 20% بروتين', feedKgPerHead: 0.15, notes: 'مقاومة أفضل للحرارة العالية مقارنة بروس وكوب' },
      { name: 'سحب وتسويق', startDay: 36, endDay: 45, feedType: 'ناهٍ + سحب — 18% بروتين', feedKgPerHead: 0.20, notes: 'مناسب للتسويق المتأخر أو إذا احتجت أوزان أعلى' }
    ],
    vaccines: [
      { name: 'نيوكاسل + IB', day: 1, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'جمبورو', day: 12, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'نيوكاسل تعزيزي', day: 21, dose: 'ماء الشرب', method: 'ماء الشرب' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 45, text: 'الهوبارد خيار ممتاز في الأنبار وبيئات الحرارة العالية — مقاومته للإجهاد الحراري أفضل من روس وكوب. خطط للتسويق يوم 43-48' }
    ]
  },

  poultry_layer_hyline: {
    label: 'هاي لاين براون — بياض',
    icon: '🥚', animalType: 'poultry', purpose: 'laying',
    totalDays: 476,
    targets: { main: 'ذروة إنتاج 95-97%', secondary: 'إجمالي 330-345 بيضة/دجاجة', fcr: 'وزن البيضة: 62-65 غ' },
    commonDiseases: ['النيوكاسل', 'التهاب القصبات المعدي (IB)', 'الإنفلونزا الطيور', 'التهاب الأمعاء (NE)', 'الانقلاب المبيضي'],
    phases: [
      { name: 'بداية (0-6 أسابيع)', startDay: 0, endDay: 42, feedType: 'بادئ بياض 19% بروتين', feedKgPerHead: 0.035, notes: '23-24 ساعة إضاءة، درجة حرارة 32-35°م' },
      { name: 'ناشئ (7-15 أسبوع)', startDay: 43, endDay: 105, feedType: 'ناشئ بياض 16% بروتين', feedKgPerHead: 0.065, notes: 'قلل الإضاءة إلى 10 ساعات لمنع النضج المبكر — يزيد الإنتاج لاحقاً' },
      { name: 'قبل الإنتاج (16-18 أسبوع)', startDay: 106, endDay: 126, feedType: 'قبل إنتاج 17% بروتين + 2% كالسيوم', feedKgPerHead: 0.095, notes: 'زد الإضاءة أسبوعياً بساعة حتى 16 ساعة — يحفز بدء الإنتاج' },
      { name: 'إنتاج مبكر وذروة (18-40 أسبوع)', startDay: 127, endDay: 280, feedType: 'علف طور I بياض — 18% بروتين + 3.8% كالسيوم', feedKgPerHead: 0.115, notes: 'الذروة يوم 140-210 — لا تقلص العلف في الذروة أبداً' },
      { name: 'إنتاج متوسط ومتأخر (40+ أسبوع)', startDay: 281, endDay: 476, feedType: 'علف طور II — 16% بروتين + 4% كالسيوم', feedKgPerHead: 0.11, notes: 'اقتصادية الدجاجة تنخفض — احسب هل إزالة الدجاجات الضعيفة توفر التكلفة' }
    ],
    vaccines: [
      { name: 'نيوكاسل + IB (H120)', day: 1, dose: '1 قطرة/طير', method: 'قطرة عين أو رش' },
      { name: 'نيوكاسل', day: 14, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'جمبورو (IBD)', day: 18, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'جمبورو تعزيزي', day: 25, dose: 'ماء الشرب', method: 'ماء الشرب' },
      { name: 'نيوكاسل + IB تعزيزي', day: 35, dose: 'ماء الشرب', method: 'ماء الشرب' },
      { name: 'جدري دواجن', day: 42, dose: 'وخز جناح', method: 'وخز' },
      { name: 'ILT (لاروتراكيئيتس)', day: 56, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'نيوكاسل معجون', day: 70, dose: '1 مل', method: 'حقن تحت الجلد' },
      { name: 'IB + EDS تعزيزي', day: 112, dose: '1 مل', method: 'حقن تحت الجلد' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 42, text: '23-24 ساعة إضاءة في الأسابيع الأولى — تغذية حرة، راقب معدل النمو الأسبوعي وفق دليل هاي لاين' },
      { fromDay: 43, toDay: 105, text: 'تقليل الإضاءة إلى 10 ساعات ضروري — الإضاءة الزائدة تنضج الدجاجة مبكراً وتقلل إجمالي الإنتاج' },
      { fromDay: 106, toDay: 126, text: 'زد الإضاءة أسبوعياً 30 دقيقة حتى 16 ساعة — حدد تاريخ البيضة الأولى المتوقع وحضّر الأعشاش' },
      { fromDay: 127, toDay: 280, text: 'الذروة تتطلب 18% بروتين + 3.8% كالسيوم — نقص الكالسيوم يسبب بيض ناعم وكسر العظام' },
      { fromDay: 281, toDay: 476, text: 'ارفع الكالسيوم إلى 4%، خفض البروتين إلى 16% — احسب تكلفة الدجاجة مقابل إنتاجها شهرياً' }
    ]
  },

  poultry_layer_lohmann: {
    label: 'لوهمان براون / LSL — بياض',
    icon: '🥚', animalType: 'poultry', purpose: 'laying',
    totalDays: 476,
    targets: { main: 'ذروة إنتاج 93-96%', secondary: 'إجمالي 320-335 بيضة/دجاجة', fcr: 'FCR: 2.0-2.3 كغ/12 بيضة' },
    commonDiseases: ['نيوكاسل', 'IB (التهاب القصبات)', 'مرض ماريك', 'التهاب الطحال (Marek)'],
    phases: [
      { name: 'بداية ونمو', startDay: 0, endDay: 105, feedType: 'بادئ وناشئ لوهمان — 19% ثم 16% بروتين', feedKgPerHead: 0.055, notes: 'نفس بروتوكول هاي لاين — 24 ساعة إضاءة أول 3 أيام ثم تدريجي لـ10 ساعات' },
      { name: 'قبل إنتاج وإنتاج', startDay: 106, endDay: 476, feedType: 'علف إنتاج لوهمان — 17% بروتين + 4% كالسيوم', feedKgPerHead: 0.112, notes: 'اللوهمان أقل استهلاكاً من الهاي لاين — وفّر 5-8% في علف' }
    ],
    vaccines: [
      { name: 'ماريك (في المفقسة غالباً)', day: 0, dose: '1 مل', method: 'حقن تحت الجلد' },
      { name: 'نيوكاسل + IB', day: 1, dose: '1 قطرة/طير', method: 'قطرة عين' },
      { name: 'نيوكاسل', day: 14, dose: 'قطرة عين', method: 'قطرة عين' },
      { name: 'جمبورو', day: 18, dose: 'قطرة عين', method: 'قطرة عين' },
      { name: 'نيوكاسل تعزيزي', day: 35, dose: 'ماء الشرب', method: 'ماء الشرب' },
      { name: 'ILT', day: 56, dose: 'قطرة عين', method: 'قطرة عين' },
      { name: 'نيوكاسل حقن', day: 70, dose: '0.5 مل', method: 'حقن تحت الجلد' },
      { name: 'IB + EDS', day: 112, dose: '0.5 مل', method: 'حقن تحت الجلد' }
    ],
    recommendations: [
      { fromDay: 0, toDay: 105, text: 'برنامج الإضاءة نفسه كالهاي لاين — تقليل الإضاءة في النمو يحسن إجمالي الإنتاج بنسبة 8-12%' },
      { fromDay: 106, toDay: 476, text: 'اللوهمان أقل استهلاكاً للعلف من الهاي لاين — وفّر في العلف مع الحفاظ على نفس الإنتاج تقريباً' }
    ]
  },

  /* ══════════ أسماك ══════════ */

  fish_tilapia_nile: {
    label: 'بلطي نيلي (Oreochromis niloticus)',
    icon: '🐟', animalType: 'fish', purpose: 'fattening',
    totalDays: 180,
    targets: { main: 'وزن تسويق 400-600 غ', secondary: 'معدل نمو يومي 3-5 غ', fcr: 'FCR: 1.5-2.2' },
    commonDiseases: ['التقرح الجلدي (Aeromonas)', 'الديدان الخيطية', 'التهاب الخياشيم', 'نقص الأكسجين'],
    phases: [
      { name: 'إصبعيات (Fingerlings)', startDay: 0, endDay: 30, feedType: 'بادئ بلطي 35% بروتين — حبة 1.5 مم', feedKgPerHead: 0.002, notes: '4-5 وجبات/يوم، 5% من وزن الجسم. درجة حرارة: 28-30°م، أكسجين: ≥5 mg/L' },
      { name: 'نمو مبكر', startDay: 31, endDay: 90, feedType: 'نمو بلطي 30% بروتين — حبة 2-3 مم', feedKgPerHead: 0.006, notes: '3 وجبات/يوم، 3% من وزن الجسم. تبديل 20% من الماء أسبوعياً' },
      { name: 'تسمين وتشطيب', startDay: 91, endDay: 180, feedType: 'تشطيب بلطي 25% بروتين — حبة 4-5 مم', feedKgPerHead: 0.012, notes: 'مرتين/يوم، 2% من وزن الجسم. أوقف العلف 24-48 ساعة قبل الصيد' }
    ],
    vaccines: [],
    recommendations: [
      { fromDay: 0, toDay: 30, text: 'الفترة الأولى الأكثر حساسية — راقب الأكسجين كل صباح (أقل استهلاكاً ليلاً). الموت المفاجئ = نقص أكسجين' },
      { fromDay: 31, toDay: 90, text: 'pH أسبوعياً (6.5-8.5)، غيّر 20% من الماء أسبوعياً، قيس وزن عينة 30 سمكة كل 3 أسابيع' },
      { fromDay: 91, toDay: 180, text: 'البلطي يتكاثر في الأحواض — افصل الذكور للتسمين (يكبر أسرع)، أوقف العلف 48 ساعة قبل الصيد' }
    ]
  },

  fish_tilapia_red: {
    label: 'بلطي أحمر (Red Tilapia)',
    icon: '🐠', animalType: 'fish', purpose: 'fattening',
    totalDays: 200,
    targets: { main: 'وزن تسويق 500-700 غ', secondary: 'معدل نمو يومي 3-4 غ', fcr: 'FCR: 1.8-2.5' },
    commonDiseases: ['التقرح (Columnaris)', 'نقص فيتامين C', 'مشاكل الغازات المذابة'],
    phases: [
      { name: 'إصبعيات', startDay: 0, endDay: 45, feedType: 'بادئ 35% بروتين، حبة 1.5 مم', feedKgPerHead: 0.002, notes: '4 وجبات/يوم. البلطي الأحمر أبطأ نمواً لكن سعره أعلى' },
      { name: 'نمو', startDay: 46, endDay: 130, feedType: 'نمو 28% بروتين، حبة 3 مم', feedKgPerHead: 0.008, notes: '3 وجبات/يوم، 2.5% من وزن الجسم' },
      { name: 'تشطيب', startDay: 131, endDay: 200, feedType: 'تشطيب 25% بروتين، حبة 5 مم', feedKgPerHead: 0.014, notes: 'مرتين/يوم. السعر في السوق أعلى من النيلي بـ20-30%' }
    ],
    vaccines: [],
    recommendations: [
      { fromDay: 0, toDay: 200, text: 'البلطي الأحمر أغلى في السوق العراقي — مناسب لمن لديه قناة تسويق للمطاعم. يحتاج إدارة مياه أفضل من النيلي' }
    ]
  },

  fish_carp_common: {
    label: 'كارب شائع (Cyprinus carpio)',
    icon: '🐡', animalType: 'fish', purpose: 'fattening',
    totalDays: 240,
    targets: { main: 'وزن تسويق 800-1200 غ', secondary: 'معدل نمو 4-6 غ/يوم', fcr: 'FCR: 2.5-3.5' },
    commonDiseases: ['القرحة (Koi Herpesvirus - KHV)', 'الطفيليات الخارجية', 'نقص الأكسجين (حساس جداً)'],
    phases: [
      { name: 'إصبعيات', startDay: 0, endDay: 30, feedType: 'بادئ كارب 30% بروتين', feedKgPerHead: 0.003, notes: 'كثافة مخففة — لا تتجاوز 2 سمكة/م³ أبداً. هوّاء مستمر ليلاً إلزامي' },
      { name: 'نمو', startDay: 31, endDay: 150, feedType: 'نمو كارب 25% بروتين + مخلفات نباتية', feedKgPerHead: 0.008, notes: 'الكارب يقبل مخلفات الذرة والخضروات — وفّر 30-40% من تكلفة العلف' },
      { name: 'تشطيب', startDay: 151, endDay: 240, feedType: 'تشطيب كارب 22% بروتين', feedKgPerHead: 0.012, notes: 'مرتين/يوم. الكارب يكبر أسرع في درجة حرارة 22-28°م' }
    ],
    vaccines: [],
    recommendations: [
      { fromDay: 0, toDay: 60, text: 'الكارب حساس للأكسجين المنخفض — أي مشكلة في الهوّاء ليلاً تقتله قبل الصباح. كثافة 2 سمكة/م³ حد أقصى' },
      { fromDay: 61, toDay: 240, text: 'مخلفات الذرة والخضروات علف مكمّل اقتصادي ممتاز — الكارب يمكن تربيته بتكلفة أقل من البلطي مع أسعار مناسبة' }
    ]
  },

  fish_catfish: {
    label: 'جريث / كاتفيش (Clarias / Silurus)',
    icon: '🐟', animalType: 'fish', purpose: 'fattening',
    totalDays: 150,
    targets: { main: 'وزن تسويق 500-900 غ', secondary: 'معدل نمو 5-8 غ/يوم', fcr: 'FCR: 1.3-1.8' },
    commonDiseases: ['التقرح الجلدي (Aeromonas)', 'الطفيليات الخارجية', 'التهابات جرثومية'],
    phases: [
      { name: 'إصبعيات', startDay: 0, endDay: 30, feedType: 'بادئ لاحم 40% بروتين (مشتق حيواني)', feedKgPerHead: 0.003, notes: 'الجريث لاحم — يحتاج بروتيناً حيوانياً (سمك مجفف أو دقيق سمك) في البداية' },
      { name: 'نمو وتشطيب', startDay: 31, endDay: 150, feedType: 'نمو لاحم 35% بروتين', feedKgPerHead: 0.01, notes: 'مرتين/يوم. الجريث يتحمل كثافة أعلى من الكارب — يصل 10 سمكة/م³' }
    ],
    vaccines: [],
    recommendations: [
      { fromDay: 0, toDay: 30, text: 'الجريث سمكة لاحمة — يأكل زملاءه إذا كانوا أصغر. افرز السمك بالحجم كل شهر لمنع الأكانيبالية' },
      { fromDay: 31, toDay: 150, text: 'الجريث يتحمل ملوحة ومستوى أكسجين أدنى من البلطي — سهل التربية في الأنبار. سعر السوق مرتفع نسبياً' }
    ]
  },

  fish_mullet: {
    label: 'بياح / بوري (Mugil cephalus)',
    icon: '🐟', animalType: 'fish', purpose: 'fattening',
    totalDays: 270,
    targets: { main: 'وزن تسويق 400-700 غ', secondary: 'معدل نمو 2-3 غ/يوم', fcr: 'FCR: 2.0-3.0' },
    commonDiseases: ['التهاب الخياشيم', 'نقص الأكسجين', 'الطفيليات الخارجية'],
    phases: [
      { name: 'نمو مبكر', startDay: 0, endDay: 90, feedType: 'علف نباتي 25% بروتين + فيتامينات', feedKgPerHead: 0.004, notes: 'البياح نباتي الغذاء — أرخص تكلفة من البلطي. يتغذى على الطحالب والمواد العضوية' },
      { name: 'تسمين', startDay: 91, endDay: 270, feedType: 'علف نمو 20% بروتين', feedKgPerHead: 0.009, notes: 'يتكيف مع ملوحة متوسطة — ميزة في منطقة الفرات' }
    ],
    vaccines: [],
    recommendations: [
      { fromDay: 0, toDay: 270, text: 'البياح محلي العراق (نهر الفرات) — يتأقلم ممتازاً مع مياه الأنبار. تكلفة علفه أقل 40% من البلطي' }
    ]
  }
};

/* ── مساعدات ── */
export const getTemplatesForType = (animalType) =>
  Object.entries(BREEDING_TEMPLATES).filter(([, t]) => t.animalType === animalType);

export const getTemplatesByPurpose = (animalType, purpose) =>
  getTemplatesForType(animalType).filter(([, t]) => !purpose || t.purpose === purpose);

export const getPurposesForType = (animalType) =>
  [...new Set(getTemplatesForType(animalType).map(([, t]) => t.purpose))];

export const getGeneralRecs = (animalType) => ({
  cattle: [
    'زن الحيوانات كل أسبوعين وسجّل الزيادة اليومية',
    'وفّر ماءً نظيفاً دائماً (50-80 لتر/رأس/يوم)',
    'راقب درجة حرارة الجسم الطبيعية 38-39°م',
    'احتفظ بسجل علاجات ولقاحات لكل حيوان'
  ],
  sheep: [
    'اعزل المرضى فور ظهور أعراض لمنع التفشي',
    'علاج الطفيليات الداخلية كل 3-4 أشهر',
    'وفّر ماء نظيف دائماً (3-5 لتر/رأس/يوم)',
    'افحص الأسنان والأظلاف شهرياً'
  ],
  poultry: [
    'راقب نسبة النفوق اليومية — طبيعي أقل من 0.5%',
    'درجة الحرارة مناسبة عند توزع الطيور بشكل منتظم',
    'سجّل استهلاك العلف والماء يومياً لاكتشاف الانحرافات مبكراً',
    'عدم استهلاك العلف يشير لمشكلة صحية أو بيئية'
  ],
  fish: [
    'راقب سلوك الأسماك — الصعود للسطح = نقص أكسجين فوري',
    'أوقف العلف عند ارتفاع درجة الحرارة فوق 35°م',
    'قيس الوزن بعينة 30 سمكة كل 3 أسابيع',
    'احتفظ بسجل يومي للـ pH والأكسجين ودرجة الحرارة'
  ]
}[animalType] || []);
