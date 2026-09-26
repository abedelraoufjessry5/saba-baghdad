/* Everything the home and categories screens show that does NOT come
   live from Odoo: banners, concern cards, the category tree, brand logos and
   the hand-picked product rails. Edit here to change what the app shows.

   Image names without "http" live in the content folder (see IMG_BASE in
   config.js). Every item says where a tap goes:
     q:       open the product list searching for this text
     cat:     open the product list for this Odoo website category id
     product: open this Odoo product (product.template id)            */

export const HERO_INTERVAL_MS = 4500;

export const HERO = [
  {
    "id": "serum",
    "image": "woman-applying-serum-her-face(1).jpg",
    "title": {
      "ar": "روتين السيروم اليومي",
      "en": "Your daily serum ritual",
      "ku": "ڕۆتینی ڕۆژانەی سیرۆم"
    },
    "sub": {
      "ar": "قطرات تفرق بنضارة البشرة",
      "en": "A few drops, visible glow",
      "ku": "چەند دڵۆپێک، درەوشانەوەیەکی دیار"
    },
    "q": "سيروم"
  },
  {
    "id": "sun",
    "image": "woman-applying-sunscreen-beach-summer-skincare(1).jpg",
    "title": {
      "ar": "حماية من شمس العراق",
      "en": "Protection from the sun",
      "ku": "پاراستن لە خۆر"
    },
    "sub": {
      "ar": "واقيات بحماية ٥٠+",
      "en": "SPF 50+ sunscreens",
      "ku": "پارێزەری خۆر SPF 50+"
    },
    "q": "واقي شمس"
  },
  {
    "id": "scalp",
    "image": "Screenshot-2026-02-02-at-14-41-12-Woman-doing-herself-a-scalp-massage-Free-Photo.png",
    "title": {
      "ar": "عناية بفروة الراس",
      "en": "Scalp care",
      "ku": "چاودێری سەری سەر"
    },
    "sub": {
      "ar": "شامبوهات وعلاجات للتساگط",
      "en": "Shampoos and hair treatments",
      "ku": "شامپۆ و چارەسەری قژ"
    },
    "q": "شامبو"
  },
  {
    "id": "mask",
    "image": "woman-wearing-bathrobe-towel-with-facemask(1).jpg",
    "title": {
      "ar": "ليلة ماسك ونضارة",
      "en": "Mask night",
      "ku": "شەوی ماسک"
    },
    "sub": {
      "ar": "ماسكات تشتغل طول الليل",
      "en": "Masks that work while you sleep",
      "ku": "ماسک کە لە خەودا کار دەکات"
    },
    "q": "ماسك"
  },
  {
    "id": "eyes",
    "image": "woman-using-eye-cream-side-view(1).jpg",
    "title": {
      "ar": "خلصنا من الهالات السودة",
      "en": "Goodbye dark circles",
      "ku": "ماڵئاوایی خولکەی ڕەش"
    },
    "sub": {
      "ar": "كريمات وسيرومات للعين",
      "en": "Eye creams and serums",
      "ku": "کرێم و سیرۆمی چاو"
    },
    "q": "الهالات السوداء"
  }
];

export const CONCERNS = [
  {
    "id": "acne",
    "name": {
      "ar": "حب الشباب",
      "en": "Acne",
      "ku": "دانەی لاوان"
    },
    "image": "side-view-smiley-man-with-skin-problems(1).jpg",
    "q": "حب الشباب"
  },
  {
    "id": "pigmentation",
    "name": {
      "ar": "تصبّغات البشرة",
      "en": "Pigmentation",
      "ku": "ڕەنگی پێست"
    },
    "image": "portrait-young-woman-being-confident-with-acne(1).jpg",
    "q": "تصبغات"
  },
  {
    "id": "dark-circles",
    "name": {
      "ar": "الهالات السوداء",
      "en": "Dark circles",
      "ku": "خولکەی ڕەش"
    },
    "image": "woman-using-eye-cream-side-view(1).jpg",
    "q": "هالات"
  },
  {
    "id": "dryness",
    "name": {
      "ar": "جفاف البشرة",
      "en": "Dry skin",
      "ku": "پێستی وشک"
    },
    "image": "woman-looking-her-rosacea-mirror(1).jpg",
    "q": "جافة"
  },
  {
    "id": "sun",
    "name": {
      "ar": "الحماية من الشمس",
      "en": "Sun protection",
      "ku": "پارێزەری خۆر"
    },
    "image": "view-man-applying-lotion-sunburn-skin-beach(1).jpg",
    "q": "واقي شمس"
  },
  {
    "id": "sweating",
    "name": {
      "ar": "زيادة التعرّق",
      "en": "Excess sweating",
      "ku": "ئارەقی زۆر"
    },
    "image": "close-up-woman-applying-deodorant-arm(1).jpg",
    "q": "تعرق"
  },
  {
    "id": "sensitive",
    "name": {
      "ar": "المناطق الحسّاسة",
      "en": "Sensitive areas",
      "ku": "ناوچە هەستیارەکان"
    },
    "image": "portrait-cheerful-attractive-young-lady-holding-tampon-sanitary-napkin(1).jpg",
    "q": "حساسة"
  },
  {
    "id": "foot-fungus",
    "name": {
      "ar": "فطريات القدم",
      "en": "Foot fungus",
      "ku": "کەپرەکی پێ"
    },
    "image": "woman-having-foot-treatment.jpg",
    "q": "فطريات"
  }
];

export const CATEGORIES = [
  {
    "id": "womens-care",
    "name": "العناية بالمرأة",
    "icon": "👩",
    "image": "portrait-cheerful-attractive-young-lady-holding-tampon-sanitary-napkin(1).jpg",
    "subs": [
      {
        "id": "nail-care-sub",
        "name": "عناية المرأة الموظفة",
        "image": "front-view-working-woman-holding-cup-coffee-desk.jpg",
        "q": "عناية المرأة الموظفة"
      },
      {
        "id": "personal-care-sub",
        "name": "العناية الشخصية",
        "image": "front-view-young-woman-posing.jpg",
        "q": "العناية الشخصية"
      },
      {
        "id": "brittle-split",
        "name": "عناية بعد يوم طويل",
        "image": "front-view-young-female-with-clock-towel-her-head-pink-background.jpg",
        "q": "عناية بعد يوم طويل"
      },
      {
        "id": "cuticles-care",
        "name": "عناية السفر",
        "image": "high-angle-hand-holding-cream-container.jpg",
        "q": "عناية السفر"
      },
      {
        "id": "anti-wrinkle",
        "name": "مكافحة التجاعيد",
        "image": "8610838.jpg",
        "q": "مكافحة التجاعيد"
      },
      {
        "id": "morning-evening-routine",
        "name": "روتين صباحي / مسائي",
        "image": "woman-doing-her-selfcare-ritual.jpg",
        "q": "روتين صباحي مسائي"
      },
      {
        "id": "natural-chemical-masks",
        "name": "ماسكات طبيعية وكيميائية",
        "image": "portrait-woman-wearing-face-mask.jpg",
        "q": "ماسكات طبيعية كيميائية"
      },
      {
        "id": "Winter-care-Summer-care",
        "name": "عناية الشتاء / عناية الصيف",
        "image": "beautiful-woman-white-dress-lavander-field.jpg",
        "q": "عناية الشتاء عناية الصيف"
      }
    ]
  },
  {
    "id": "skincare",
    "name": "العناية بالبشرة",
    "icon": "🧴",
    "image": "woman-applying-face-cream-front-view.jpg",
    "subs": [
      {
        "id": "makeup-remover",
        "name": "مزيل مكياج",
        "image": "young-female-pajamas-sleep-mask-holding-spray-pink(1).jpg",
        "q": "مزيل مكياج"
      },
      {
        "id": "eye-care",
        "name": "حول العين",
        "image": "woman-posing-with-avocado-front-view.jpg",
        "q": "حول العين"
      },
      {
        "id": "face-toner",
        "name": "تونر وجه",
        "image": "young-female-pink-bathrobe-holding-make-up-flasks-blue(1).jpg",
        "q": "تونر"
      },
      {
        "id": "lashes-brows",
        "name": "الرموش والحواجب",
        "image": "front-view-young-attractive-female-doing-her-make-up-with-mascara-dark-pink-wall-model-color-female-young-girl(1).jpg",
        "q": "رموش حواجب"
      },
      {
        "id": "thermal-water",
        "name": "مياه حرارية",
        "image": "front-view-young-beautiful-lady-bathrobe-smiles-cleans-away-all-make-up(1).jpg",
        "q": "مياه حرارية"
      },
      {
        "id": "face-soap",
        "name": "صابون للوجه",
        "image": "young-woman-taking-care-herself-home(1).jpg",
        "q": "صابون وجه"
      },
      {
        "id": "face-wash",
        "name": "غسول وجه",
        "image": "beautiful-woman-delicately-moisturizes-skin-with-cosmetic-tonic-portrait-lady-with-healthy-skin-without-makeup-isolated-wall(1).jpg",
        "q": "غسول وجه"
      },
      {
        "id": "face-serum",
        "name": "سيروم وجه",
        "image": "woman-applying-serum-her-face(1).jpg",
        "q": "سيروم وجه"
      },
      {
        "id": "sunscreen",
        "name": "واقي شمس",
        "image": "woman-applying-sunscreen-beach-summer-skincare(1).jpg",
        "q": "واقي شمس"
      },
      {
        "id": "face-mask",
        "name": "ماسك وجه",
        "image": "woman-wearing-bathrobe-towel-with-facemask(1).jpg",
        "q": "ماسك وجه"
      },
      {
        "id": "face-care",
        "name": "العناية بالوجه",
        "image": "young-woman-bathrobe-holding-cream.jpg",
        "q": "العناية بالوجه"
      },
      {
        "id": "lip-care",
        "name": "العناية بالشفاه",
        "image": "woman-using-lip-gloss-front-view.jpg",
        "q": "العناية بالشفاه"
      },
      {
        "id": "face-repair",
        "name": "مرمم للوجه",
        "image": "woman-looking-away-from-camera.jpg",
        "q": "مرمم وجه"
      },
      {
        "id": "face-moisturizer",
        "name": "مرطب وجه",
        "image": "woman-applying-face-cream-front-view.jpg",
        "q": "مرطب وجه"
      },
      {
        "id": "treatment-gel",
        "name": "جل معالج",
        "image": "clear-gel-being-poured-onto-finger.jpg",
        "q": "جل معالج"
      },
      {
        "id": "mesotherapy",
        "name": "ميزوثيرابي",
        "image": "cosmetologist-makes-beauty-injection-woman-s-face-clinic.jpg",
        "q": "ميزوثيرابي"
      },
      {
        "id": "acne-patches",
        "name": "لاصقات حب الشباب",
        "image": "1681037440058434300.jpg.webp",
        "q": "لاصقات حب الشباب"
      }
    ]
  },
  {
    "id": "haircare",
    "name": "العناية بالشعر",
    "icon": "💇‍♀️",
    "image": "Screenshot-2026-02-02-at-14-36-48-Woman-brushing-hair-after-washing-it-Free-Photo.png",
    "subs": [
      {
        "id": "shampoo",
        "name": "شامبو",
        "image": "young-woman-applying-anti-dandruff-product.jpg",
        "q": "شامبو"
      },
      {
        "id": "conditioner",
        "name": "بلسم",
        "image": "Screenshot-2026-02-02-at-14-36-48-Woman-brushing-hair-after-washing-it-Free-Photo.png",
        "q": "بلسم"
      },
      {
        "id": "hair-serum-oil",
        "name": "سيروم وزيوت للشعر",
        "image": "medium-shot-young-woman-using-serum.jpg",
        "q": "سيروم زيت شعر"
      },
      {
        "id": "hair-mask",
        "name": "ماسك شعر",
        "image": "Screenshot-2026-02-02-at-14-38-19-Young-woman-applying-anti-dandruff-product-Free-Photo.png",
        "q": "ماسك شعر"
      },
      {
        "id": "leave-in-cream",
        "name": "ليف ان كريم",
        "image": "young-woman-applying-anti-dandruff-product.jpg",
        "q": "ليف ان كريم"
      },
      {
        "id": "hair-loss-treatment",
        "name": "علاج تساقط الشعر",
        "image": "Screenshot-2026-02-02-at-14-41-12-Woman-doing-herself-a-scalp-massage-Free-Photo.png",
        "q": "علاج تساقط الشعر"
      }
    ]
  },
  {
    "id": "footcare",
    "name": "العناية بالقدم",
    "icon": "🦶",
    "image": "woman-having-foot-treatment.jpg",
    "subs": [
      {
        "id": "foot-wash",
        "name": "غسول قدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7779-4095b7d9/9399445_35007.webp",
        "q": "غسول قدم"
      },
      {
        "id": "foot-soap",
        "name": "صابون قدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7796-b72890ec/flat-lay-natural-self-care-products-composition.webp",
        "q": "صابون قدم"
      },
      {
        "id": "foot-cream",
        "name": "كريم قدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7791-efa132b4/128701.webp",
        "q": "كريم قدم"
      },
      {
        "id": "heel-cracks",
        "name": "تشققات الكعب",
        "image": "https://saba-baghdad.odoo.com/web/image/7792-545ac3f6/woman-cracked-heels-with-white-background-foot-healthy-concept.webp",
        "q": "تشققات الكعب"
      },
      {
        "id": "dead-skin",
        "name": "إزالة الجلد الميت",
        "image": "https://saba-baghdad.odoo.com/web/image/7791-efa132b4/128701.webp",
        "q": "إزالة الجلد الميت"
      },
      {
        "id": "foot-fungus",
        "name": "فطريات القدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7790-9c4946ae/representation-microorganisms-with-foot.webp",
        "q": "فطريات القدم"
      },
      {
        "id": "foot-odor",
        "name": "رائحة القدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7789-47e8f03b/92672761_10004424.webp",
        "q": "رائحة القدم"
      },
      {
        "id": "toenails",
        "name": "أظافر القدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7794-cefaea0b/beautiful-female-feet-with-pink-glitter-pedicure.webp",
        "q": "أظافر القدم"
      },
      {
        "id": "foot-massage",
        "name": "مساج القدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7793-f21ee788/acupressure-big-toe-pad-foot-reflexology-session.webp",
        "q": "مساج القدم"
      }
    ]
  },
  {
    "id": "mens-care",
    "name": "العناية للرجال",
    "icon": "🧔‍♂️",
    "image": "side-view-smiley-man-with-skin-problems(1).jpg",
    "subs": [
      {
        "id": "mens-face-wash",
        "name": "غسول الوجه للرجال",
        "image": "https://saba-baghdad.odoo.com/web/image/7810-8fbb58b8/2148088261.webp",
        "q": "غسول وجه رجال"
      },
      {
        "id": "mens-moisturizer",
        "name": "كريمات الترطيب",
        "image": "https://saba-baghdad.odoo.com/web/image/7808-4ff54612/2149438533.webp",
        "q": "كريم ترطيب رجال"
      },
      {
        "id": "beard-care",
        "name": "العناية باللحية",
        "image": "https://saba-baghdad.odoo.com/web/image/7809-fcb57c4a/14681.webp",
        "q": "العناية باللحية"
      },
      {
        "id": "beard-oil",
        "name": "زيوت اللحية",
        "image": "https://saba-baghdad.odoo.com/web/image/7816-87948cd5/2148883819.webp",
        "q": "زيت لحية"
      },
      {
        "id": "aftershave",
        "name": "ما بعد الحلاقة",
        "image": "https://saba-baghdad.odoo.com/web/image/7812-ab96ed87/2148883824.webp",
        "q": "بعد الحلاقة"
      },
      {
        "id": "mens-haircare",
        "name": "العناية بالشعر",
        "image": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=200&h=200&fit=crop",
        "q": "شعر رجال"
      },
      {
        "id": "mens-hair-loss",
        "name": "تساقط الشعر",
        "image": "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=200&h=200&fit=crop",
        "q": "تساقط شعر رجال"
      },
      {
        "id": "mens-deodorant",
        "name": "مزيلات العرق",
        "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&h=200&fit=crop",
        "q": "مزيل عرق رجال"
      },
      {
        "id": "mens-body-care",
        "name": "عناية الجسم للرجال",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
        "q": "جسم رجال"
      },
      {
        "id": "mens-sensitive-skin",
        "name": "منتجات البشرة الحساسة",
        "image": "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=200&h=200&fit=crop",
        "q": "بشرة حساسة رجال"
      },
      {
        "id": "mens-daily-care",
        "name": "العناية اليومية",
        "image": "https://images.unsplash.com/photo-1581750082458-a7e10a575c2a?w=200&h=200&fit=crop",
        "q": "عناية يومية رجال"
      }
    ]
  },
  {
    "id": "mom-baby",
    "name": "العناية بالأم والطفل",
    "icon": "👶",
    "image": "front-view-young-female-with-clock-towel-her-head-pink-background.jpg",
    "subs": [
      {
        "id": "pregnancy-followup",
        "name": "متابعة الحمل",
        "image": "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=200&h=200&fit=crop",
        "q": "متابعة الحمل"
      },
      {
        "id": "vaccinations",
        "name": "التطعيمات",
        "image": "https://images.unsplash.com/photo-1632053002928-1919605ee6f7?w=200&h=200&fit=crop",
        "q": "التطعيمات"
      },
      {
        "id": "health-nutrition",
        "name": "الصحة والتغذية",
        "image": "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=200&h=200&fit=crop",
        "q": "الصحة والتغذية"
      },
      {
        "id": "mental-health",
        "name": "الصحة النفسية",
        "image": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=200&h=200&fit=crop",
        "q": "الصحة النفسية"
      },
      {
        "id": "child-growth",
        "name": "نمو الطفل",
        "image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop",
        "q": "نمو الطفل"
      },
      {
        "id": "child-vaccinations",
        "name": "تطعيمات الطفل",
        "image": "https://images.unsplash.com/photo-1578307992223-0b424892f3cf?w=200&h=200&fit=crop",
        "q": "تطعيمات الطفل"
      },
      {
        "id": "sleep-breastfeeding",
        "name": "النوم والرضاعة",
        "image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=200&h=200&fit=crop",
        "q": "النوم والرضاعة"
      },
      {
        "id": "child-health",
        "name": "صحة الطفل",
        "image": "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=200&h=200&fit=crop",
        "q": "صحة الطفل"
      }
    ]
  },
  {
    "id": "nail-care",
    "name": "العناية بالأظافر",
    "icon": "💅",
    "image": "front-view-working-woman-holding-cup-coffee-desk.jpg",
    "subs": [
      {
        "id": "nail-strengtheners",
        "name": "مقويات الأظافر",
        "image": "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=200&h=200&fit=crop",
        "q": "مقويات الأظافر"
      },
      {
        "id": "nail-clippers",
        "name": "قصّافات أظافر",
        "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop",
        "q": "قصافات أظافر"
      },
      {
        "id": "nail-files",
        "name": "مبارد",
        "image": "https://images.unsplash.com/photo-1610992015732-2449b0dd2b3f?w=200&h=200&fit=crop",
        "q": "مبارد أظافر"
      },
      {
        "id": "care-kits",
        "name": "مجموعات عناية (Kit)",
        "image": "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=200&h=200&fit=crop",
        "q": "مجموعات عناية أظافر"
      },
      {
        "id": "crack-treatment",
        "name": "منتجات علاج التشقق",
        "image": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&h=200&fit=crop",
        "q": "علاج تشقق أظافر"
      },
      {
        "id": "antifungals",
        "name": "مضادات الفطريات",
        "image": "https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=200&h=200&fit=crop",
        "q": "مضادات فطريات أظافر"
      }
    ]
  },
  {
    "id": "body-care",
    "name": "العناية بالجسم",
    "icon": "🧼",
    "image": "close-up-woman-applying-deodorant-arm(1).jpg",
    "subs": [
      {
        "id": "body-lightening",
        "name": "تفتيح وتقشير",
        "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop",
        "q": "تفتيح تقشير"
      },
      {
        "id": "body-moisturizer",
        "name": "ترطيب الجسم",
        "image": "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=200&h=200&fit=crop",
        "q": "ترطيب جسم"
      },
      {
        "id": "body-wash",
        "name": "غسول الجسم",
        "image": "https://plain-eeur-prod-public.komododecks.com/202603/25/84ZGv22cWibwwqDNI73R/image.png",
        "q": "غسول جسم"
      },
      {
        "id": "body-oil",
        "name": "زيت للجسم",
        "image": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=200&h=200&fit=crop",
        "q": "زيت جسم"
      },
      {
        "id": "stretch-marks",
        "name": "علامات التمدد",
        "image": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
        "q": "علامات التمدد"
      },
      {
        "id": "hair-removal",
        "name": "إزالة الشعر",
        "image": "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=200&h=200&fit=crop",
        "q": "إزالة الشعر"
      }
    ]
  },
  {
    "id": "oral-care",
    "name": "العناية بالفم",
    "icon": "🦷",
    "image": "front-view-young-woman-posing.jpg",
    "subs": [
      {
        "id": "mouth-gel",
        "name": "جل للفم",
        "image": "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=200&h=200&fit=crop",
        "q": "جل فم"
      },
      {
        "id": "toothpaste",
        "name": "معجون اسنان",
        "image": "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=200&h=200&fit=crop",
        "q": "معجون اسنان"
      },
      {
        "id": "toothbrush",
        "name": "فرشة اسنان",
        "image": "https://images.unsplash.com/photo-1559131397-f94da358f7ca?w=200&h=200&fit=crop",
        "q": "فرشة اسنان"
      },
      {
        "id": "mouthwash",
        "name": "غسول الفم",
        "image": "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=200&h=200&fit=crop",
        "q": "غسول الفم"
      },
      {
        "id": "dental-floss",
        "name": "خيط اسنان ومستلزمات",
        "image": "https://images.unsplash.com/photo-1606819717115-9159c900370b?w=200&h=200&fit=crop",
        "q": "خيط اسنان"
      }
    ]
  },
  {
    "id": "vitamins",
    "name": "الفيتامينات",
    "icon": "🍊",
    "image": "woman-posing-with-avocado-front-view.jpg",
    "subs": [
      {
        "id": "energy-activity-vitamins",
        "name": "فيتامينات الطاقة والنشاط",
        "image": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop",
        "q": "فيتامينات الطاقة والنشاط"
      },
      {
        "id": "immunity-vitamins",
        "name": "فيتامينات المناعة",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
        "q": "فيتامينات المناعة"
      },
      {
        "id": "skin-beauty-vitamins",
        "name": "فيتامينات البشرة والجمال",
        "image": "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&h=200&fit=crop",
        "q": "فيتامينات البشرة والجمال"
      },
      {
        "id": "hair-nails-vitamins",
        "name": "فيتامينات الشعر والأظافر",
        "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop",
        "q": "فيتامينات الشعر والأظافر"
      },
      {
        "id": "bones-joints-vitamins",
        "name": "فيتامينات العظام والمفاصل",
        "image": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&h=200&fit=crop",
        "q": "فيتامينات العظام والمفاصل"
      },
      {
        "id": "heart-circulation-vitamins",
        "name": "فيتامينات القلب والدورة الدموية",
        "image": "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=200&h=200&fit=crop",
        "q": "فيتامينات القلب والدورة الدموية"
      },
      {
        "id": "focus-memory-vitamins",
        "name": "فيتامينات التركيز والذاكرة",
        "image": "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=200&h=200&fit=crop",
        "q": "فيتامينات التركيز والذاكرة"
      },
      {
        "id": "sleep-relaxation-vitamins",
        "name": "فيتامينات النوم والراحة",
        "image": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&h=200&fit=crop",
        "q": "فيتامينات النوم والراحة"
      },
      {
        "id": "mens-vitamins",
        "name": "فيتامينات للرجال",
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop",
        "q": "فيتامينات للرجال"
      },
      {
        "id": "womens-vitamins",
        "name": "فيتامينات للنساء",
        "image": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop",
        "q": "فيتامينات للنساء"
      },
      {
        "id": "pregnancy-vitamins",
        "name": "فيتامينات للحامل",
        "image": "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=200&h=200&fit=crop",
        "q": "فيتامينات للحامل"
      },
      {
        "id": "kids-vitamins",
        "name": "فيتامينات للأطفال",
        "image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop",
        "q": "فيتامينات للأطفال"
      },
      {
        "id": "seniors-vitamins",
        "name": "فيتامينات لكبار السن",
        "image": "https://images.unsplash.com/photo-1447005497901-b3e9ee359928?w=200&h=200&fit=crop",
        "q": "فيتامينات لكبار السن"
      },
      {
        "id": "general-supplements",
        "name": "مكملات غذائية عامة",
        "image": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200&h=200&fit=crop",
        "q": "مكملات غذائية عامة"
      },
      {
        "id": "antioxidants",
        "name": "مضادات الأكسدة",
        "image": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&h=200&fit=crop",
        "q": "مضادات الأكسدة"
      },
      {
        "id": "omega-fish-oils",
        "name": "الأوميغا وزيوت السمك",
        "image": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop",
        "q": "أوميغا زيوت السمك"
      },
      {
        "id": "probiotics-digestive",
        "name": "البروبيوتيك وصحة الجهاز الهضمي",
        "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop",
        "q": "بروبيوتيك صحة الجهاز الهضمي"
      },
      {
        "id": "mineral-deficiency-vitamins",
        "name": "فيتامينات نقص العناصر",
        "image": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
        "q": "فيتامينات نقص العناصر حديد مغنيسيوم زنك"
      },
      {
        "id": "diabetes-vitamins",
        "name": "فيتامينات لمرضى السكري",
        "image": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=200&fit=crop",
        "q": "فيتامينات لمرضى السكري"
      },
      {
        "id": "nerve-vitamins",
        "name": "فيتامينات مرضى الاعصاب",
        "image": "https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=200&h=200&fit=crop",
        "q": "فيتامينات مرضى الاعصاب"
      }
    ]
  },
  {
    "id": "medical-supplies",
    "name": "المستلزمات الطبية",
    "icon": "🩺",
    "image": "cosmetologist-makes-beauty-injection-woman-s-face-clinic.jpg",
    "subs": [
      {
        "id": "glucose-monitors",
        "name": "أجهزة فحص السكر",
        "image": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=200&fit=crop",
        "q": "أجهزة فحص السكر"
      },
      {
        "id": "blood-pressure-monitors",
        "name": "أجهزة فحص الضغط",
        "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200&h=200&fit=crop",
        "q": "أجهزة فحص الضغط"
      },
      {
        "id": "thermometers",
        "name": "مقياس حرارة",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
        "q": "مقياس حرارة"
      },
      {
        "id": "pulse-oximeters",
        "name": "أجهزة قياس الأوكسجين",
        "image": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=200&h=200&fit=crop",
        "q": "أجهزة قياس الأوكسجين"
      },
      {
        "id": "support-braces",
        "name": "مشدات",
        "image": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=200&h=200&fit=crop",
        "q": "مشدات طبية"
      },
      {
        "id": "catheters",
        "name": "كيترات",
        "image": "https://images.unsplash.com/photo-1583912267550-d974311a9a6e?w=200&h=200&fit=crop",
        "q": "كيترات"
      }
    ]
  }
];

// Logo files on the old Mocha server have meaningless names (zz.png, zzz.webp…);
// each one below was checked against the logo it actually shows.
export const BRANDS = [
  {
    "name": "La Roche-Posay",
    "image": "La-Roche-Posay-Logo.png",
    "cat": 13
  },
  {
    "name": "VICHY",
    "image": "723_vichylabolatories.jpg",
    "cat": 40
  },
  {
    "name": "Bioderma",
    "image": "zz.png",
    "cat": 11
  },
  {
    "name": "Avène",
    "image": "Av_new-logo-2022_eau-thermale-avene.png",
    "cat": 60
  },
  {
    "name": "CeraVe",
    "image": "cerave.png",
    "q": "CeraVe"
  },
  {
    "name": "SVR",
    "image": "svr-logo-png_seeklogo-460716.png",
    "cat": 12
  },
  {
    "name": "FILORGA Paris",
    "image": "1.jpg",
    "cat": 71
  },
  {
    "name": "ACM",
    "image": "zzz.webp",
    "cat": 59
  },
  {
    "name": "Noreva",
    "image": "zzzz.jpg",
    "cat": 39
  },
  {
    "name": "Sebamed",
    "image": "images.png",
    "cat": 18
  },
  {
    "name": "Arencia",
    "image": "local:arencia.png",
    "q": "Arencia"
  },
  {
    "name": "COSRX",
    "image": "3585.jpg",
    "cat": 44
  },
  {
    "name": "The Purest Solutions",
    "image": "9b292484-8010-4dab-aeed-8db1cdf161c3.jpg",
    "cat": 17
  },
  {
    "name": "ISISPHARMA",
    "image": "yyRE31Abuz3z9AU2jJo2vz1JhvWQeNblzH6wQS9c.webp",
    "cat": 37
  },
  {
    "name": "Skincode",
    "image": "loho.jpg",
    "cat": 48
  },
  {
    "name": "SKIN1004",
    "image": "news-p.v1.20241101.683ea9001d4c4f4684d592d4f425a3df_P1.jpg",
    "cat": 50
  },
  {
    "name": "Anua",
    "image": "anua-927001.webp",
    "cat": 46
  },
  {
    "name": "Beauty of Joseon",
    "image": "boj2.jpg",
    "cat": 86
  },
  {
    "name": "PERFECT Image",
    "image": "perfect-IMAGE.jpg",
    "cat": 49
  },
  {
    "name": "Cotton Mixtures",
    "image": "9dcac4eb-c69b-4cc6-9487-856b2d58b123.png",
    "cat": 45
  }
];

export const TRENDING = [
  {
    "id": 165,
    "key": "165",
    "brand": "COSRX",
    "name": "COSRX Advanced Snail 96 Mucin Essence — خلاصة الحلزون ٩٦",
    "price": 16000,
    "badge": "ترند",
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/165/image_512"
  },
  {
    "id": 167,
    "key": "167",
    "brand": "COSRX",
    "name": "COSRX Low pH Good Morning Cleanser — غسول جل منخفض الحموضة",
    "price": 12000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/167/image_512"
  },
  {
    "id": 1697,
    "key": "1697",
    "brand": "Beauty of Joseon",
    "name": "Beauty of Joseon Relief Sun SPF50+ — واقي شمس الأرز والبروبيوتيك",
    "price": 22000,
    "badge": "الأكثر مبيعاً",
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/1697/image_512"
  },
  {
    "id": 1694,
    "key": "1694",
    "brand": "Beauty of Joseon",
    "name": "Beauty of Joseon Glow Deep Serum — سيروم الأرز والألفا أربوتين",
    "price": 20000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/1694/image_512"
  },
  {
    "id": null,
    "key": "anua-1",
    "brand": "Anua",
    "name": "Anua Heartleaf 77% Toner — تونر ورق القلب ٧٧٪",
    "price": null,
    "badge": "كوري",
    "image": null,
    "cat": 46
  },
  {
    "id": null,
    "key": "anua-2",
    "brand": "Anua",
    "name": "Anua Heartleaf Cleansing Oil — غسول زيتي بورق القلب",
    "price": null,
    "badge": null,
    "image": null,
    "cat": 46
  },
  {
    "id": null,
    "key": "sk-1",
    "brand": "SKIN1004",
    "name": "SKIN1004 Centella Ampoule — أمبولة السنتيلا المهدّئة",
    "price": null,
    "badge": "كوري",
    "image": null,
    "cat": 50
  },
  {
    "id": null,
    "key": "sk-2",
    "brand": "SKIN1004",
    "name": "SKIN1004 Centella Ampoule Foam — غسول رغوي بالسنتيلا",
    "price": null,
    "badge": null,
    "image": null,
    "cat": 50
  },
  {
    "id": null,
    "key": "sbm-1",
    "brand": "SOME BY MI",
    "name": "SOME BY MI AHA·BHA·PHA 30 Days Miracle Toner — تونر الـ٣٠ يوم",
    "price": null,
    "badge": "كوري",
    "image": null,
    "cat": 66
  },
  {
    "id": null,
    "key": "sbm-2",
    "brand": "SOME BY MI",
    "name": "SOME BY MI Miracle Acne Clear Foam — غسول لحب الشباب",
    "price": null,
    "badge": null,
    "image": null,
    "cat": 66
  },
  {
    "id": null,
    "key": "toc-1",
    "brand": "TOCOBO",
    "name": "TOCOBO Bio Watery Sun Cream — واقي شمس مائي",
    "price": null,
    "badge": "كوري",
    "image": null,
    "cat": 51
  },
  {
    "id": null,
    "key": "toc-2",
    "brand": "TOCOBO",
    "name": "TOCOBO Coconut Clay Cleansing Balm — بالم تنظيف بالطين",
    "price": null,
    "badge": null,
    "image": null,
    "cat": 51
  },
  {
    "id": null,
    "key": "med-1",
    "brand": "MEDICUBE",
    "name": "Medicube Collagen Night Wrapping Mask — ماسك الكولاجين الليلي",
    "price": null,
    "badge": "كوري",
    "image": null,
    "cat": 88
  },
  {
    "id": null,
    "key": "med-2",
    "brand": "MEDICUBE",
    "name": "Medicube Zero Pore Pad — باد تنظيف وتضييق المسام",
    "price": null,
    "badge": null,
    "image": null,
    "cat": 88
  },
  {
    "id": null,
    "key": "eq-1",
    "brand": "EQQUAL BERRY",
    "name": "EQQUALBERRY Vitamin Illuminating Serum — سيروم فيتامين للإشراق",
    "price": null,
    "badge": "كوري",
    "image": null,
    "cat": 87
  },
  {
    "id": null,
    "key": "eq-2",
    "brand": "EQQUAL BERRY",
    "name": "EQQUALBERRY Hydrating Toner — تونر مرطّب",
    "price": null,
    "badge": null,
    "image": null,
    "cat": 87
  },
  {
    "id": null,
    "key": "ar-1",
    "brand": "Arencia",
    "name": "Arencia Fresh Cleansing Bar — صابونة تنظيف طازجة مقطّعة يدوياً",
    "price": null,
    "badge": "جديد",
    "image": null,
    "q": "Arencia"
  },
  {
    "id": null,
    "key": "ar-2",
    "brand": "Arencia",
    "name": "Arencia Clay Mask Bar — ماسك الطين الكوري",
    "price": null,
    "badge": null,
    "image": null,
    "q": "Arencia"
  },
  {
    "id": 164,
    "key": "164",
    "brand": "COSRX",
    "name": "COSRX The Niacinamide 15 Serum — سيروم النياسيناميد ١٥٪",
    "price": 21000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/164/image_512"
  },
  {
    "id": 166,
    "key": "166",
    "brand": "COSRX",
    "name": "COSRX Advanced Snail Peptide Eye Cream — كريم العين بالحلزون",
    "price": 28000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/166/image_512"
  }
];

export const FEATURED = [
  {
    "id": 25,
    "key": "25",
    "brand": null,
    "name": "La Roche-Posay Hyalu B5 — سيروم علاج التجاعيد ٣٠ مل",
    "price": 69000,
    "badge": "الأكثر مبيعاً",
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/25/image_512"
  },
  {
    "id": 11,
    "key": "11",
    "brand": null,
    "name": "Sesderma K-VIT — سيروم الهالات السوداء",
    "price": 50000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/11/image_512"
  },
  {
    "id": 10,
    "key": "10",
    "brand": null,
    "name": "Sesderma SES Vitamin-C — فلويد فيتامين سي للنضارة",
    "price": 44000,
    "badge": "موصى به",
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/10/image_512"
  },
  {
    "id": 16,
    "key": "16",
    "brand": null,
    "name": "BIODERMA Sebium H2O — مايسلر للبشرة الدهنية ٢٥٠ مل",
    "price": 16000,
    "badge": "أرخص سعر",
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/16/image_512"
  },
  {
    "id": 15,
    "key": "15",
    "brand": null,
    "name": "BIODERMA Sébium Pore Refiner — لعلاج المسامات ٣٠ مل",
    "price": 27000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/15/image_512"
  },
  {
    "id": 17,
    "key": "17",
    "brand": null,
    "name": "BIODERMA Sensibio — جل رغوي للبشرة الحساسة ٥٠٠ مل",
    "price": 26000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/17/image_512"
  },
  {
    "id": 18,
    "key": "18",
    "brand": null,
    "name": "BIODERMA Sébium Gel Moussant — غسول للبشرة الدهنية ٥٠٠ مل",
    "price": 25000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/18/image_512"
  },
  {
    "id": 24,
    "key": "24",
    "brand": null,
    "name": "La Roche-Posay Anthelios Kids SPF50+ — واقي شمس للأطفال",
    "price": 39000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/24/image_512"
  },
  {
    "id": 12,
    "key": "12",
    "brand": null,
    "name": "Sesderma Repaskin Dry Touch — واقي شمس دراي تاتش",
    "price": 23000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/12/image_512"
  },
  {
    "id": 9,
    "key": "9",
    "brand": null,
    "name": "Sesderma Silkses — كريم مرطب ومرمم للبشرة",
    "price": 32000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/9/image_512"
  },
  {
    "id": 13,
    "key": "13",
    "brand": null,
    "name": "Sesderma Hidraven — غسول رغوي خالٍ من الصابون",
    "price": 24000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/13/image_512"
  },
  {
    "id": 14,
    "key": "14",
    "brand": null,
    "name": "Sesderma Seskavel Growth — لوشن مضاد لتساقط الشعر",
    "price": 30000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/14/image_512"
  },
  {
    "id": 19,
    "key": "19",
    "brand": null,
    "name": "SVR Sebiaclear — غسول جل للبشرة الدهنية ٤٠٠ مل",
    "price": 27000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/19/image_512"
  },
  {
    "id": 21,
    "key": "21",
    "brand": null,
    "name": "SVR Topialyse — غسول للبشرة الجافة والحساسة ٤٠٠ مل",
    "price": 28500,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/21/image_512"
  },
  {
    "id": 22,
    "key": "22",
    "brand": null,
    "name": "SVR Topialyse Cleansing Oil — غسول زيتي ٤٠٠ مل",
    "price": 25000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/22/image_512"
  },
  {
    "id": 29,
    "key": "29",
    "brand": null,
    "name": "The INKEY List Retinol Serum — سيروم الريتينول ٣٠ مل",
    "price": 23000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/29/image_512"
  },
  {
    "id": 30,
    "key": "30",
    "brand": null,
    "name": "The INKEY List — كريم ريتينول حول العين",
    "price": 30000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/30/image_512"
  },
  {
    "id": 31,
    "key": "31",
    "brand": null,
    "name": "RILASTIL D-Clar — سيروم مركّز لعلاج التصبّغات",
    "price": 35000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/31/image_512"
  },
  {
    "id": 2,
    "key": "2",
    "brand": null,
    "name": "Foltène Pharma — شامبو نسائي لتقوية الشعر",
    "price": 22000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/2/image_512"
  },
  {
    "id": 7,
    "key": "7",
    "brand": null,
    "name": "Foltène Pharma — علاج الشعر وفروة الرأس للرجال",
    "price": 45000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.product/7/image_512"
  }
];

