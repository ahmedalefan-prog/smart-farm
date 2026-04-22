import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { colors } from '../theme/theme';
import Field from './shared/Field';
import Modal from './shared/Modal';

const recipes = [
  // ============ أبقار ============
  {
    id: 'cattle-high',
    name: 'أبقار حلوب - عالي الإنتاج',
    category: 'أبقار',
    icon: '🐄',
    protein: '16-18%',
    energy: '1.72-1.76 ميجاكال/كغ NEL',
    dailyFeed: 12,
    unit: 'كغ/رأس/يوم',
    ingredients: {
      'ذرة صفراء مجروشة': 32,
      'شعير مجروش': 15,
      'كسبة فول الصويا (48%)': 18,
      'نخالة القمح': 12,
      'دريس برسيم (جت)': 15,
      'مولاس': 5,
      'حجر جيري': 1.5,
      'ملح طعام': 0.5,
      'فوسفات ثنائي الكالسيوم': 0.5,
      'مخلوط فيتامينات ومعادن': 0.5
    },
    feedingStrategy: {
      'المواعيد': '3-4 وجبات يومياً',
      'الأعلاف الخشنة': 'مع 8-10 كغ سيلاج ذرة أو 6-8 كغ دريس برسيم يومياً',
      'الماء': '80-120 لتر/يوم، متوفرة باستمرار',
      'التحول': 'تغيير العلف تدريجياً على 7-10 أيام'
    },
    targetAnimal: 'أبقار حلوب تنتج 30-40 لتر/يوم',
    notes: 'للأبقار الأعلى إنتاجاً (>40 لتر) ارفع كسبة الصويا إلى 22% واخفض الذرة.'
  },
  {
    id: 'cattle-medium',
    name: 'أبقار حلوب - متوسط الإنتاج',
    category: 'أبقار',
    icon: '🐄',
    protein: '14-16%',
    energy: '1.65-1.70 ميجاكال/كغ NEL',
    dailyFeed: 10,
    unit: 'كغ/رأس/يوم',
    ingredients: {
      'ذرة صفراء مجروشة': 28,
      'شعير مجروش': 18,
      'كسبة فول الصويا (48%)': 12,
      'نخالة القمح': 18,
      'دريس برسيم (جت)': 16,
      'مولاس': 5,
      'حجر جيري': 1.5,
      'ملح طعام': 0.5,
      'فوسفات ثنائي الكالسيوم': 0.5,
      'مخلوط فيتامينات ومعادن': 0.5
    },
    feedingStrategy: {
      'المواعيد': '2-3 وجبات يومياً',
      'الأعلاف الخشنة': 'مع 6-8 كغ سيلاج ذرة أو 5-7 كغ دريس برسيم يومياً',
      'الماء': '70-100 لتر/يوم'
    },
    targetAnimal: 'أبقار حلوب تنتج 20-30 لتر/يوم'
  },
  {
    id: 'cattle-fattening',
    name: 'عجول تسمين - مرحلة النمو',
    category: 'أبقار',
    icon: '🐂',
    protein: '16-18%',
    energy: '1.80-1.85 ميجاكال/كغ NEm',
    dailyFeed: 10,
    unit: 'كغ/رأس/يوم',
    ingredients: {
      'ذرة صفراء مجروشة': 45,
      'شعير مجروش': 15,
      'كسبة فول الصويا (48%)': 18,
      'نخالة القمح': 10,
      'دريس برسيم (جت)': 8,
      'حجر جيري': 1.5,
      'ملح طعام': 0.5,
      'مخلوط فيتامينات ومعادن': 0.5,
      'بيكربونات صوديوم': 1.0,
      'يوريا': 0.5
    },
    feedingStrategy: {
      'المواعيد': '2-3 وجبات يومياً',
      'الأعلاف الخشنة': 'مع 2-3 كغ تبن أو دريس يومياً',
      'التدريج': 'التدريج على العلف المركز خلال 14-21 يوم',
      'الماء': '40-60 لتر/يوم'
    },
    targetAnimal: 'عجول وزن 150-350 كغ',
    notes: '⚠️ اليوريا بحذر شديد. لا تتجاوز 1% من العلف. لا تُستخدم للعجول أقل من 150 كغ.'
  },
  {
    id: 'cattle-finisher',
    name: 'عجول تسمين - مرحلة التشطيب',
    category: 'أبقار',
    icon: '🐂',
    protein: '13-14%',
    energy: '1.90-1.95 ميجاكال/كغ NEm',
    dailyFeed: 12,
    unit: 'كغ/رأس/يوم',
    ingredients: {
      'ذرة صفراء مجروشة': 55,
      'شعير مجروش': 20,
      'كسبة فول الصويا (48%)': 10,
      'نخالة القمح': 8,
      'مولاس': 4,
      'حجر جيري': 1.2,
      'ملح طعام': 0.5,
      'مخلوط فيتامينات ومعادن': 0.5,
      'بيكربونات صوديوم': 0.8
    },
    feedingStrategy: {
      'المواعيد': '2 وجبات يومياً',
      'الأعلاف الخشنة': 'مع 1-2 كغ تبن فقط',
      'الماء': '50-70 لتر/يوم'
    },
    targetAnimal: 'عجول وزن 350-500 كغ (آخر 60-90 يوم قبل التسويق)',
    notes: 'نسبة حبوب عالية لتكوين الدهن والرخامية. مراقبة الأظلاف والحموضة.'
  },

  // ============ أغنام ============
  {
    id: 'sheep-fattening',
    name: 'حملان تسمين',
    category: 'أغنام',
    icon: '🐑',
    protein: '16-18%',
    energy: '2.6-2.8 ميجاكال/كغ ME',
    dailyFeed: 1.6,
    unit: 'كغ/رأس/يوم',
    ingredients: {
      'شعير مجروش': 50,
      'ذرة صفراء مجروشة': 15,
      'كسبة فول الصويا (48%)': 20,
      'نخالة القمح': 10,
      'حجر جيري': 1.5,
      'ملح طعام': 0.5,
      'مخلوط فيتامينات ومعادن': 0.5,
      'بيكربونات صوديوم': 0.5,
      'فوسفات ثنائي الكالسيوم': 1.5
    },
    feedingStrategy: {
      'المواعيد': '2 وجبات يومياً (صباح ومساء)',
      'الأعلاف الخشنة': 'مع 0.5-0.8 كغ دريس برسيم أو تبن يومياً',
      'التدريج': 'التدريج على العلف المركز خلال 10 أيام',
      'الماء': '4-6 لتر/يوم'
    },
    targetAnimal: 'حملان وزن 20-45 كغ',
    notes: 'يفضل الشعير كحبوب رئيسية للأغنام. أضف 2% حجر جيري للوقاية من حصوات البول.'
  },
  {
    id: 'sheep-ewe-pregnancy',
    name: 'نعاج حوامل (آخر 6 أسابيع)',
    category: 'أغنام',
    icon: '🐑',
    protein: '16-18%',
    energy: '2.5-2.7 ميجاكال/كغ ME',
    dailyFeed: 1.2,
    unit: 'كغ/رأس/يوم',
    ingredients: {
      'شعير مجروش': 40,
      'ذرة صفراء مجروشة': 10,
      'كسبة فول الصويا (48%)': 22,
      'نخالة القمح': 15,
      'دريس برسيم مجروش': 10,
      'حجر جيري': 1.2,
      'ملح طعام': 0.5,
      'مخلوط فيتامينات ومعادن': 0.8,
      'فوسفات ثنائي الكالسيوم': 0.5
    },
    feedingStrategy: {
      'المواعيد': '2 وجبات يومياً',
      'الأعلاف الخشنة': 'مع 1-1.5 كغ دريس برسيم عالي الجودة يومياً',
      'الماء': '6-8 لتر/يوم (دافئة شتاءً)'
    },
    targetAnimal: 'نعاج في آخر 6 أسابيع من الحمل',
    notes: 'الكالسيوم والفوسفور مهمان للوقاية من حمى الحليب بعد الولادة.'
  },
  {
    id: 'sheep-ewe-lactating',
    name: 'نعاج مرضعة (توأم)',
    category: 'أغنام',
    icon: '🐑',
    protein: '18-20%',
    energy: '2.8-3.0 ميجاكال/كغ ME',
    dailyFeed: 1.8,
    unit: 'كغ/رأس/يوم',
    ingredients: {
      'شعير مجروش': 45,
      'ذرة صفراء مجروشة': 15,
      'كسبة فول الصويا (48%)': 25,
      'نخالة القمح': 8,
      'دريس برسيم مجروش': 5,
      'حجر جيري': 0.8,
      'ملح طعام': 0.5,
      'مخلوط فيتامينات ومعادن': 0.7
    },
    feedingStrategy: {
      'المواعيد': '3 وجبات يومياً أو تغذية حرة',
      'الأعلاف الخشنة': 'مع 1.5-2 كغ دريس برسيم ممتاز يومياً',
      'الماء': '8-10 لتر/يوم (إنتاج الحليب يحتاج ماء كثير)'
    },
    targetAnimal: 'نعاج ترضع توأم أو ثلاثة توائم',
    notes: 'أعلى احتياجات غذائية في دورة حياة النعجة. أي نقص يؤثر مباشرة على نمو الحملان.'
  },

  // ============ دواجن ============
  {
    id: 'poultry-prestarter',
    name: 'دواجن بادئ ممتاز (Prestarter)',
    category: 'دواجن',
    icon: '🐤',
    protein: '23-24%',
    energy: '3000-3050 كيلوكالوري/كغ',
    dailyFeed: 0.018,
    unit: 'كغ/طائر/يوم',
    ingredients: {
      'ذرة صفراء مجروشة ناعم': 52,
      'كسبة فول الصويا (48%)': 38,
      'زيت نباتي': 3,
      'فوسفات ثنائي الكالسيوم': 2,
      'حجر جيري': 1.5,
      'ملح طعام': 0.3,
      'مخلوط فيتامينات ومعادن': 1.5,
      'DL-ميثيونين': 0.3,
      'L-لايسين': 0.2,
      'مضاد كوكسيديا': 0.5,
      'بروبيوتيك': 0.2
    },
    feedingStrategy: {
      'المواعيد': 'علف متاح باستمرار 24 ساعة',
      'الشكل': 'مجروش ناعم أو محبب صغير (Crumb)',
      'الماء': 'ماء نظيف باستمرار، 1.8-2 ضعف كمية العلف'
    },
    targetAnimal: 'كتاكيت عمر 1-10 أيام',
    notes: 'أعلى نسبة بروتين في حياة الطائر. جودة الأحماض الأمينية أهم من الكمية.'
  },
  {
    id: 'poultry-starter',
    name: 'دواجن بادئ (Starter)',
    category: 'دواجن',
    icon: '🐤',
    protein: '21-22%',
    energy: '3050-3100 كيلوكالوري/كغ',
    dailyFeed: 0.035,
    unit: 'كغ/طائر/يوم',
    ingredients: {
      'ذرة صفراء مجروشة': 55,
      'كسبة فول الصويا (48%)': 34,
      'زيت نباتي': 3.5,
      'فوسفات ثنائي الكالسيوم': 1.8,
      'حجر جيري': 1.5,
      'ملح طعام': 0.3,
      'مخلوط فيتامينات ومعادن': 1.5,
      'DL-ميثيونين': 0.25,
      'L-لايسين': 0.15,
      'مضاد كوكسيديا': 0.5
    },
    feedingStrategy: {
      'المواعيد': 'علف متاح باستمرار',
      'الشكل': 'مجروش أو محبب صغير',
      'الماء': 'ماء نظيف باستمرار'
    },
    targetAnimal: 'كتاكيت عمر 11-21 يوم'
  },
  {
    id: 'poultry-grower',
    name: 'دواجن نامي (Grower)',
    category: 'دواجن',
    icon: '🐔',
    protein: '19-20%',
    energy: '3100-3150 كيلوكالوري/كغ',
    dailyFeed: 0.075,
    unit: 'كغ/طائر/يوم',
    ingredients: {
      'ذرة صفراء مجروشة': 60,
      'كسبة فول الصويا (48%)': 28,
      'زيت نباتي': 4,
      'فوسفات ثنائي الكالسيوم': 1.5,
      'حجر جيري': 1.5,
      'ملح طعام': 0.3,
      'مخلوط فيتامينات ومعادن': 1.5,
      'DL-ميثيونين': 0.2,
      'L-لايسين': 0.1
    },
    feedingStrategy: {
      'المواعيد': 'علف متاح 20-22 ساعة/يوم',
      'الشكل': 'محبب (Pellet)',
      'الماء': 'ماء نظيف باستمرار'
    },
    targetAnimal: 'دواجن عمر 22-35 يوم'
  },
  {
    id: 'poultry-finisher',
    name: 'دواجن تشطيب (Finisher)',
    category: 'دواجن',
    icon: '🐔',
    protein: '18-19%',
    energy: '3150-3200 كيلوكالوري/كغ',
    dailyFeed: 0.16,
    unit: 'كغ/طائر/يوم',
    ingredients: {
      'ذرة صفراء مجروشة': 65,
      'كسبة فول الصويا (48%)': 22,
      'زيت نباتي': 5,
      'فوسفات ثنائي الكالسيوم': 1.3,
      'حجر جيري': 1.5,
      'ملح طعام': 0.3,
      'مخلوط فيتامينات ومعادن': 1.5,
      'DL-ميثيونين': 0.18,
      'L-لايسين': 0.12
    },
    feedingStrategy: {
      'المواعيد': 'علف متاح 20 ساعة/يوم',
      'الشكل': 'محبب (Pellet)',
      'الماء': 'ماء نظيف باستمرار',
      'قبل التسويق': 'وقف أي إضافات دوائية 5-7 أيام قبل التسويق'
    },
    targetAnimal: 'دواجن عمر 36-42 يوم (حتى التسويق)',
    notes: 'وقف الكوكسيديا والمضادات الحيوية قبل التسويق إلزامي.'
  },
  {
    id: 'poultry-layer',
    name: 'دواجن بياض (Layer)',
    category: 'دواجن',
    icon: '🐓',
    protein: '17-18%',
    energy: '2800-2850 كيلوكالوري/كغ',
    dailyFeed: 0.115,
    unit: 'كغ/طائر/يوم',
    ingredients: {
      'ذرة صفراء مجروشة': 58,
      'كسبة فول الصويا (48%)': 24,
      'نخالة القمح': 5,
      'حجر جيري (كربونات كالسيوم)': 8.5,
      'فوسفات ثنائي الكالسيوم': 1.5,
      'ملح طعام': 0.3,
      'مخلوط فيتامينات ومعادن': 1.5,
      'DL-ميثيونين': 0.15,
      'صبغة صفراء (مارجولد)': 0.5
    },
    feedingStrategy: {
      'المواعيد': 'علف متاح 16 ساعة/يوم مع الإضاءة',
      'الكالسيوم': '50% من الكالسيوم كمصدر خشن (صدف أو حجر جيري خشن)',
      'الماء': 'ماء نظيف باستمرار'
    },
    targetAnimal: 'دجاج بياض في مرحلة الإنتاج',
    notes: 'الكالسيوم العالي (8.5%) ضروري لتكوين قشرة البيض. الصبغة لتلوين الصفار.'
  },

  // ============ أسماك ============
  {
    id: 'fish-tilapia-fry',
    name: 'بلطي نيلي - إصبعيات',
    category: 'أسماك',
    icon: '🐟',
    protein: '38-40%',
    energy: '3800-4000 كيلوكالوري/كغ',
    dailyFeed: 5,
    unit: '% من وزن الجسم يومياً',
    ingredients: {
      'مسحوق سمك (65% بروتين)': 25,
      'كسبة فول الصويا (48%)': 35,
      'ذرة صفراء مطحونة': 20,
      'نخالة القمح': 8,
      'زيت سمك أو نباتي': 5,
      'فوسفات ثنائي الكالسيوم': 2,
      'مخلوط فيتامينات ومعادن للأسماك': 3,
      'مادة رابطة (Binder)': 2
    },
    feedingStrategy: {
      'المواعيد': '4-6 وجبات يومياً',
      'الشكل': 'مطحون ناعم أو محبب صغير جداً',
      'معدل التغذية': '5-8% من وزن الجسم يومياً',
      'درجة الحرارة المثالية': '28-30°م'
    },
    targetAnimal: 'بلطي من وزن 1-20 غ',
    notes: 'أعلى نسبة بروتين في حياة السمكة. مسحوق السمك (بروتين حيواني) أساسي للإصبعيات.'
  },
  {
    id: 'fish-tilapia-grower',
    name: 'بلطي نيلي - نامي',
    category: 'أسماك',
    icon: '🐟',
    protein: '30-32%',
    energy: '3600-3800 كيلوكالوري/كغ',
    dailyFeed: 3,
    unit: '% من وزن الجسم يومياً',
    ingredients: {
      'مسحوق سمك (65% بروتين)': 15,
      'كسبة فول الصويا (48%)': 40,
      'ذرة صفراء مطحونة': 25,
      'نخالة القمح': 10,
      'زيت سمك أو نباتي': 4,
      'فوسفات ثنائي الكالسيوم': 1.5,
      'مخلوط فيتامينات ومعادن للأسماك': 2.5,
      'مادة رابطة': 2
    },
    feedingStrategy: {
      'المواعيد': '3-4 وجبات يومياً',
      'الشكل': 'محبب طافٍ 2-4 مم',
      'معدل التغذية': '3-4% من وزن الجسم يومياً',
      'درجة الحرارة': '27-30°م'
    },
    targetAnimal: 'بلطي من وزن 20-200 غ'
  },
  {
    id: 'fish-tilapia-finisher',
    name: 'بلطي نيلي - تشطيب',
    category: 'أسماك',
    icon: '🐟',
    protein: '28-30%',
    energy: '3400-3600 كيلوكالوري/كغ',
    dailyFeed: 2,
    unit: '% من وزن الجسم يومياً',
    ingredients: {
      'مسحوق سمك (65% بروتين)': 8,
      'كسبة فول الصويا (48%)': 42,
      'ذرة صفراء مطحونة': 30,
      'نخالة القمح': 12,
      'زيت نباتي': 3,
      'فوسفات ثنائي الكالسيوم': 1.5,
      'مخلوط فيتامينات ومعادن للأسماك': 2,
      'مادة رابطة': 1.5
    },
    feedingStrategy: {
      'المواعيد': '2-3 وجبات يومياً',
      'الشكل': 'محبب طافٍ 4-6 مم',
      'معدل التغذية': '1.5-2.5% من وزن الجسم يومياً',
      'درجة الحرارة': '27-30°م'
    },
    targetAnimal: 'بلطي من وزن 200 غ حتى التسويق (350-500 غ)'
  },
  {
    id: 'fish-carp-grower',
    name: 'كارب (مبروك) - نامي',
    category: 'أسماك',
    icon: '🐠',
    protein: '28-30%',
    energy: '3200-3400 كيلوكالوري/كغ',
    dailyFeed: 2.5,
    unit: '% من وزن الجسم يومياً',
    ingredients: {
      'مسحوق سمك (65% بروتين)': 12,
      'كسبة فول الصويا (48%)': 35,
      'ذرة صفراء مطحونة': 25,
      'نخالة القمح': 15,
      'دريس برسيم مطحون': 5,
      'زيت نباتي': 3,
      'فوسفات ثنائي الكالسيوم': 1.5,
      'مخلوط فيتامينات ومعادن للأسماك': 2,
      'مادة رابطة': 1.5
    },
    feedingStrategy: {
      'المواعيد': '2-3 وجبات يومياً',
      'الشكل': 'محبب غارق (Sinking) 3-4 مم',
      'معدل التغذية': '2-3% من وزن الجسم يومياً',
      'درجة الحرارة': 'مثالية 22-28°م. يتوقف عن الأكل عند <15°م'
    },
    targetAnimal: 'كارب من وزن 50-500 غ',
    notes: '⚠️ الكارب يحتاج علف غارق (ليس طافياً). يأكل من القاع. النخالة والدريس مناسبان لطبيعته.'
  },
  {
    id: 'fish-carp-finisher',
    name: 'كارب (مبروك) - تشطيب',
    category: 'أسماك',
    icon: '🐠',
    protein: '25-27%',
    energy: '3000-3200 كيلوكالوري/كغ',
    dailyFeed: 1.5,
    unit: '% من وزن الجسم يومياً',
    ingredients: {
      'مسحوق سمك (65% بروتين)': 6,
      'كسبة فول الصويا (48%)': 30,
      'ذرة صفراء مطحونة': 30,
      'نخالة القمح': 20,
      'دريس برسيم مطحون': 8,
      'زيت نباتي': 2,
      'فوسفات ثنائي الكالسيوم': 1.5,
      'مخلوط فيتامينات ومعادن للأسماك': 1.5,
      'مادة رابطة': 1
    },
    feedingStrategy: {
      'المواعيد': '1-2 وجبات يومياً',
      'الشكل': 'محبب غارق 5-7 مم',
      'معدل التغذية': '1-1.5% من وزن الجسم يومياً',
      'تغذية الشتاء': 'عند ماء <15°م: مرة أسبوعياً أو التوقف تماماً'
    },
    targetAnimal: 'كارب من وزن 500 غ حتى التسويق (1-2 كغ)',
    notes: 'دورة إنتاج الكارب 12-18 شهر. في الأنبار: يمكن للكارب الشتاء دون تغذية في الأحواض العميقة.'
  },

  // ============ أرانب ============
  {
    id: 'rabbit-fattening',
    name: 'أرانب تسمين',
    category: 'أرانب',
    icon: '🐰',
    protein: '16-18%',
    energy: '2600-2700 كيلوكالوري/كغ',
    dailyFeed: 0.12,
    unit: 'كغ/رأس/يوم',
    ingredients: {
      'شعير مجروش': 25,
      'ذرة صفراء مجروشة': 15,
      'كسبة فول الصويا (48%)': 18,
      'نخالة القمح': 15,
      'دريس برسيم مجروش': 22,
      'حجر جيري': 1.5,
      'ملح طعام': 0.5,
      'مخلوط فيتامينات ومعادن': 1,
      'DL-ميثيونين': 0.15,
      'مضاد كوكسيديا': 0.5,
      'مادة رابطة': 1.35
    },
    feedingStrategy: {
      'المواعيد': 'علف متاح باستمرار أو وجبتين يومياً',
      'الألياف': 'الأرانب تحتاج ألياف عالية (دريس البرسيم يوفرها)',
      'الماء': 'ماء نظيف باستمرار (أهمية قصوى)'
    },
    targetAnimal: 'أرانب من الفطام (4 أسابيع) حتى التسويق (8-10 أسابيع)',
    notes: 'الأرانب حساسة جداً لتغيرات العلف. أي تغيير تدريجياً على مدى 7 أيام على الأقل.'
  }
];

const tabs = [
  { id: 'inventory', name: '📦 المخزون', color: colors.lime },
  { id: 'recipes', name: '📋 الوصفات', color: colors.teal },
  { id: 'calculator', name: '🧮 الحاسبة', color: colors.wheat },
  { id: 'silage', name: '🌽 السيلاج', color: colors.green }
];

const categories = ['الكل', 'أبقار', 'أغنام', 'دواجن', 'أسماك', 'أرانب'];

const categoryColors = {
  'أبقار': colors.soil,
  'أغنام': colors.green,
  'دواجن': colors.orange,
  'أسماك': colors.sky,
  'أرانب': colors.purple
};

const IngredientEditForm = ({ ingredient, onSave, onClose }) => {
  const units = ['كغ', 'طن'];
  const [f, setF] = useState({
    name: ingredient.name,
    quantity: String(ingredient.quantity),
    unit: ingredient.unit || 'كغ',
    minThreshold: String(ingredient.minThreshold || '')
  });
  const [err, setErr] = useState('');
  const save = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.quantity) { setErr('يرجى ملء الاسم والكمية'); return; }
    onSave(ingredient.id, {
      name: f.name.trim(),
      quantity: Number(f.quantity),
      unit: f.unit,
      minThreshold: Number(f.minThreshold) || 0
    });
    onClose();
  };
  return (
    <form onSubmit={save}>
      {err && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '14px' }}>{err}</div>}
      <Field label="اسم المادة" value={f.name} onChange={v => { setErr(''); setF(p => ({ ...p, name: v })); }} required />
      <Field label="الكمية" type="text" inputMode="decimal" unit={f.unit} value={f.quantity} onChange={v => { setErr(''); setF(p => ({ ...p, quantity: v })); }} placeholder="0" required />
      <Field label="الوحدة" type="select" options={units} value={f.unit} onChange={v => setF(p => ({ ...p, unit: v }))} />
      <Field label="الحد الأدنى للتنبيه" type="text" inputMode="decimal" unit={f.unit} value={f.minThreshold} onChange={v => setF(p => ({ ...p, minThreshold: v }))} placeholder="0" hint="سيظهر تنبيه عند النقص" />
      <button type="submit" style={{ width: '100%', padding: '13px', backgroundColor: colors.lime, color: colors.dark, border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'inherit', marginTop: '8px' }}>
        حفظ التعديلات
      </button>
    </form>
  );
};

const FeedSection = () => {
  const { farmData, updateFeedIngredient, deleteFeedIngredient } = useFarm();
  const [activeTab, setActiveTab] = useState('inventory');
  const [editIngredient, setEditIngredient] = useState(null);
  const [pendingDeleteIngId, setPendingDeleteIngId] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [animalCount, setAnimalCount] = useState('');
  const [days, setDays] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const totalKg = farmData.feedInventory.ingredients.reduce((sum, ing) => {
    return sum + (ing.unit === 'طن' ? ing.quantity * 1000 : ing.quantity);
  }, 0);

  const filteredRecipes = selectedCategory === 'الكل'
    ? recipes
    : recipes.filter(r => r.category === selectedCategory);

  const calculateFeedNeeds = (recipe) => {
    const count = Number(animalCount);
    const d = Number(days);
    if (!count || !d) return null;
    const total = count * recipe.dailyFeed * d;
    const ingredients = {};
    Object.entries(recipe.ingredients).forEach(([name, pct]) => {
      ingredients[name] = (total * pct / 100).toFixed(1);
    });
    return { total: total.toFixed(1), ingredients };
  };

  const handleUseInCalculator = (recipe) => {
    setSelectedRecipe(recipe);
    setActiveTab('calculator');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: colors.dark, marginBottom: '20px' }}>🌿 الأعلاف</h2>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '10px 4px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? tab.color : colors.cream,
              color: activeTab === tab.id ? 'white' : colors.dark,
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'inherit'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* المخزون */}
      {activeTab === 'inventory' && (
        <div>
          <div style={{
            backgroundColor: colors.lime + '25',
            padding: '16px', borderRadius: '12px',
            marginBottom: '20px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: colors.soil }}>إجمالي المخزون</div>
            <div style={{ fontSize: '30px', fontWeight: 'bold', color: colors.lime }}>
              {(totalKg / 1000).toFixed(2)} طن
            </div>
          </div>

          {farmData.feedInventory.ingredients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: colors.soil }}>
              <p style={{ fontSize: '48px', marginBottom: '10px' }}>📦</p>
              <p>لا توجد مواد علفية — اضغط ➕ للإضافة</p>
            </div>
          ) : (
            farmData.feedInventory.ingredients.map(ing => {
              const isLow = ing.minThreshold && ing.quantity <= ing.minThreshold;
              const isPendingDelete = pendingDeleteIngId === ing.id;
              return (
                <div key={ing.id} style={{
                  backgroundColor: 'white', padding: '16px', borderRadius: '12px',
                  marginBottom: '12px', border: `2px solid ${isLow ? colors.red : colors.sand}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h3 style={{ color: colors.dark, margin: 0 }}>{ing.name}</h3>
                    {isLow && (
                      <span style={{ backgroundColor: colors.red, color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        ⚠️ منخفض
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', color: colors.soil }}>
                    الكمية: <strong style={{ color: colors.dark }}>{ing.quantity} {ing.unit}</strong>
                    {ing.minThreshold > 0 && ` · الحد الأدنى: ${ing.minThreshold} ${ing.unit}`}
                  </div>
                  {ing.minThreshold > 0 && (
                    <div style={{ marginTop: '10px', height: '6px', backgroundColor: colors.sand, borderRadius: '3px' }}>
                      <div style={{
                        width: `${Math.min(100, (ing.quantity / (ing.minThreshold * 2)) * 100)}%`,
                        height: '100%',
                        backgroundColor: isLow ? colors.red : colors.lime,
                        borderRadius: '3px'
                      }} />
                    </div>
                  )}
                  {isPendingDelete ? (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button onClick={() => { deleteFeedIngredient(ing.id); setPendingDeleteIngId(null); }} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', fontWeight: 'bold' }}>
                        ⚠️ تأكيد الحذف
                      </button>
                      <button onClick={() => setPendingDeleteIngId(null)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${colors.sand}`, backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit' }}>
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button onClick={() => setEditIngredient(ing)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${colors.sand}`, backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', color: colors.dark }}>
                        ✏️ تعديل
                      </button>
                      <button onClick={() => setPendingDeleteIngId(ing.id)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#fee2e2', cursor: 'pointer', fontSize: '13px', fontFamily: 'inherit', color: '#dc2626' }}>
                        🗑️ حذف
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* الوصفات */}
      {activeTab === 'recipes' && (
        <div>
          {/* تصفية حسب الفئة */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '6px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 14px', borderRadius: '16px', border: 'none',
                  backgroundColor: selectedCategory === cat
                    ? (categoryColors[cat] || colors.teal)
                    : colors.cream,
                  color: selectedCategory === cat ? 'white' : colors.dark,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  fontSize: '13px', fontFamily: 'inherit',
                  fontWeight: selectedCategory === cat ? 'bold' : 'normal'
                }}
              >
                {cat} {cat !== 'الكل' && `(${recipes.filter(r => r.category === cat).length})`}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '13px', color: colors.soil, marginBottom: '12px' }}>
            {filteredRecipes.length} وصفة — اضغط لعرض التفاصيل
          </div>

          {filteredRecipes.map(recipe => (
            <div key={recipe.id} style={{
              backgroundColor: 'white', borderRadius: '12px',
              marginBottom: '12px', border: `1px solid ${colors.sand}`, overflow: 'hidden'
            }}>
              {/* رأس الوصفة */}
              <div
                onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                style={{ padding: '14px 16px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '26px' }}>{recipe.icon}</span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: colors.dark, margin: 0, fontSize: '15px' }}>{recipe.name}</h3>
                    <div style={{ fontSize: '12px', color: colors.soil, marginTop: '3px' }}>
                      بروتين: {recipe.protein} · علف: {recipe.dailyFeed} {recipe.unit}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{
                      backgroundColor: (categoryColors[recipe.category] || colors.teal) + '20',
                      color: categoryColors[recipe.category] || colors.teal,
                      padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold'
                    }}>
                      {recipe.category}
                    </span>
                    <span style={{ color: colors.soil, fontSize: '18px' }}>
                      {expandedRecipe === recipe.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
              </div>

              {/* تفاصيل الوصفة */}
              {expandedRecipe === recipe.id && (
                <div style={{ borderTop: `1px solid ${colors.sand}`, padding: '14px 16px' }}>
                  <div style={{ fontSize: '12px', color: colors.soil, marginBottom: '10px' }}>
                    🎯 {recipe.targetAnimal} · طاقة: {recipe.energy}
                  </div>

                  {/* المكونات */}
                  <h4 style={{ color: colors.sky, marginBottom: '8px', fontSize: '13px' }}>📊 المكونات (%)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '12px' }}>
                    {Object.entries(recipe.ingredients).map(([name, pct]) => (
                      <div key={name} style={{
                        padding: '4px 8px', backgroundColor: colors.cream,
                        borderRadius: '6px', fontSize: '12px'
                      }}>
                        <span style={{ color: colors.soil }}>{name}:</span>{' '}
                        <strong style={{ color: colors.dark }}>{pct}%</strong>
                      </div>
                    ))}
                  </div>

                  {/* استراتيجية التغذية */}
                  <h4 style={{ color: colors.green, marginBottom: '8px', fontSize: '13px' }}>📋 استراتيجية التغذية</h4>
                  <div style={{ marginBottom: '12px' }}>
                    {Object.entries(recipe.feedingStrategy).map(([key, val]) => (
                      <div key={key} style={{
                        padding: '5px 8px', marginBottom: '4px',
                        backgroundColor: colors.sky + '15', borderRadius: '6px', fontSize: '12px'
                      }}>
                        <strong style={{ color: colors.dark }}>{key}:</strong>{' '}
                        <span style={{ color: colors.soil }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* ملاحظات */}
                  {recipe.notes && (
                    <div style={{
                      padding: '8px 10px', backgroundColor: colors.gold + '20',
                      borderRadius: '8px', fontSize: '12px', color: colors.soil, marginBottom: '12px'
                    }}>
                      💡 {recipe.notes}
                    </div>
                  )}

                  {/* زر استخدام في الحاسبة */}
                  <button
                    onClick={() => handleUseInCalculator(recipe)}
                    style={{
                      width: '100%', padding: '10px',
                      backgroundColor: colors.teal, color: 'white',
                      border: 'none', borderRadius: '8px',
                      cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px'
                    }}
                  >
                    🧮 استخدام في الحاسبة
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* الحاسبة */}
      {activeTab === 'calculator' && (
        <div>
          {selectedRecipe && (
            <div style={{
              backgroundColor: (categoryColors[selectedRecipe.category] || colors.teal) + '20',
              padding: '10px 14px', borderRadius: '8px', marginBottom: '16px',
              fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span>{selectedRecipe.icon}</span>
              <span style={{ color: colors.dark }}><strong>{selectedRecipe.name}</strong></span>
              <button
                onClick={() => setSelectedRecipe(null)}
                style={{ marginRight: 'auto', background: 'none', border: 'none', color: colors.soil, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          <Field label="عدد الحيوانات" type="text" inputMode="numeric" value={animalCount} onChange={setAnimalCount} placeholder="مثال: 50" />
          <Field label="عدد الأيام" type="text" inputMode="numeric" value={String(days)} onChange={setDays} placeholder="مثال: 30" />

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: colors.dark }}>
              الوصفة
            </label>
            <select
              value={selectedRecipe?.id || ''}
              onChange={(e) => setSelectedRecipe(recipes.find(r => r.id === e.target.value) || null)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                border: `1px solid ${colors.sand}`, fontSize: '14px',
                fontFamily: 'inherit', backgroundColor: 'white'
              }}
            >
              <option value="">-- اختر وصفة --</option>
              {categories.filter(c => c !== 'الكل').map(cat => (
                <optgroup key={cat} label={cat}>
                  {recipes.filter(r => r.category === cat).map(r => (
                    <option key={r.id} value={r.id}>{r.icon} {r.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {selectedRecipe && Number(animalCount) > 0 && Number(days) > 0 && (() => {
            const result = calculateFeedNeeds(selectedRecipe);
            return (
              <div style={{ backgroundColor: colors.lime + '20', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ color: colors.green, marginBottom: '12px' }}>نتيجة الحساب</h4>
                <div style={{
                  backgroundColor: colors.green, color: 'white',
                  padding: '12px', borderRadius: '8px', textAlign: 'center', marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '13px', opacity: 0.9 }}>إجمالي العلف المطلوب</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{result.total} كغ</div>
                  <div style={{ fontSize: '13px', opacity: 0.8 }}>({(result.total / 1000).toFixed(2)} طن)</div>
                </div>
                <h5 style={{ marginBottom: '8px', color: colors.dark }}>المكونات المطلوبة:</h5>
                {Object.entries(result.ingredients).map(([name, amount]) => (
                  <div key={name} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '6px 10px', marginBottom: '4px',
                    backgroundColor: 'white', borderRadius: '6px', fontSize: '13px'
                  }}>
                    <span style={{ color: colors.soil }}>{name}</span>
                    <strong style={{ color: colors.dark }}>{amount} كغ</strong>
                  </div>
                ))}
                {selectedRecipe.unit.includes('%') && (
                  <div style={{
                    marginTop: '10px', padding: '8px', backgroundColor: colors.gold + '20',
                    borderRadius: '6px', fontSize: '12px', color: colors.soil
                  }}>
                    ⚠️ هذه الوصفة تُحسب بـ% من وزن الجسم. المبلغ المحسوب تقديري ويعتمد على الوزن المُدخل كعدد حيوانات.
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* السيلاج */}
      {activeTab === 'silage' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '16px' }}>
            <h3 style={{ color: colors.dark, marginBottom: '12px' }}>ما هو السيلاج؟</h3>
            <p style={{ color: colors.soil, lineHeight: '1.8' }}>
              السيلاج هو علف أخضر محفوظ بالتخمير اللاهوائي. يحافظ على القيمة الغذائية للمحاصيل الخضراء
              لاستخدامها طوال العام خاصة في فترات الجفاف وندرة الأعلاف الخضراء.
            </p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <h4 style={{ color: colors.green, marginBottom: '12px' }}>✅ المحاصيل المناسبة للسيلاج</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: colors.soil }}>
              <div>🌽 ذرة (كامل النبات)</div>
              <div>🌾 سورغم علفي</div>
              <div>🌿 برسيم (بعد ذبول جزئي)</div>
              <div>☘️ جت (برسيم حجازي)</div>
              <div>🌱 شعير (مرحلة العجينة)</div>
              <div>🟡 تبن + يوريا (سيلاج اليوريا)</div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <h4 style={{ color: colors.sky, marginBottom: '12px' }}>📋 خطوات تصنيع السيلاج</h4>
            <ol style={{ paddingRight: '20px', lineHeight: '2', color: colors.soil, margin: 0 }}>
              <li><strong>الحصاد:</strong> عند رطوبة 65-70% (الذرة في مرحلة العجينة)</li>
              <li><strong>التقطيع:</strong> قطع 1-2 سم لتسهيل الكبس وتحسين الجودة</li>
              <li><strong>النقل:</strong> نقل سريع إلى مكان التخزين دون تأخير</li>
              <li><strong>الكبس:</strong> كبس قوي لطرد الهواء بالكامل</li>
              <li><strong>التغطية:</strong> بلاستيك أسود محكم يمنع الهواء والماء</li>
              <li><strong>الانتظار:</strong> 21-45 يوم حسب درجة الحرارة</li>
              <li><strong>التغذية:</strong> يؤخذ يومياً من جهة واحدة دون تعريض الباقي للهواء</li>
            </ol>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <h4 style={{ color: colors.red, marginBottom: '12px' }}>⚠️ أخطاء شائعة تسبب فشل السيلاج</h4>
            <ul style={{ paddingRight: '20px', color: colors.soil, lineHeight: '1.9', margin: 0 }}>
              <li><strong>رطوبة زائدة (&gt;75%):</strong> تعفن وروائح كريهة</li>
              <li><strong>جفاف زائد (&lt;60%):</strong> تخمر غير كامل ونمو فطريات</li>
              <li><strong>كبس ضعيف:</strong> بقاء هواء وفشل التخمر اللاهوائي</li>
              <li><strong>تغطية غير محكمة:</strong> فساد الطبقة العليا</li>
              <li><strong>تأخير التغطية:</strong> نمو بكتيريا هوائية غير مرغوبة</li>
              <li><strong>فتح وإغلاق متكرر:</strong> فساد سريع بعد الفتح</li>
            </ul>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
            <h4 style={{ color: colors.lime, marginBottom: '12px' }}>✅ علامات السيلاج الجيد</h4>
            <ul style={{ paddingRight: '20px', color: colors.soil, lineHeight: '1.9', margin: 0 }}>
              <li>لون زيتوني إلى بني فاتح (وليس أسود)</li>
              <li>رائحة حمضية خفيفة تشبه الخل أو المخلل</li>
              <li>درجة حموضة (pH) بين 3.8-4.2</li>
              <li>خالٍ من العفن الظاهر</li>
              <li>تتقبله الحيوانات بشهية</li>
            </ul>
          </div>

          <div style={{ backgroundColor: colors.gold + '20', padding: '16px', borderRadius: '12px' }}>
            <h4 style={{ color: colors.dark, marginBottom: '12px' }}>📊 معدلات التغذية اليومية (كغ/رأس)</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: colors.gold + '40' }}>
                  <th style={{ padding: '8px', textAlign: 'right', borderBottom: `1px solid ${colors.sand}` }}>الحيوان</th>
                  <th style={{ padding: '8px', textAlign: 'center', borderBottom: `1px solid ${colors.sand}` }}>سيلاج فقط</th>
                  <th style={{ padding: '8px', textAlign: 'center', borderBottom: `1px solid ${colors.sand}` }}>مع علف مركز</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['بقرة حلوب', '25-35', '15-20 + 8-10 علف'],
                  ['عجل تسمين', '15-20', '10-12 + 5-7 علف'],
                  ['نعجة', '4-6', '2-3 + 0.5-1 علف']
                ].map(([animal, solo, mixed], i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? 'white' : colors.cream }}>
                    <td style={{ padding: '8px' }}>{animal}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{solo}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{mixed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {editIngredient && (
        <Modal title={`تعديل: ${editIngredient.name}`} onClose={() => setEditIngredient(null)}>
          <IngredientEditForm
            ingredient={editIngredient}
            onSave={updateFeedIngredient}
            onClose={() => setEditIngredient(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default FeedSection;
