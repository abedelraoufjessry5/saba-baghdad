/* Everything the home and categories screens show that does NOT come
   live from Odoo: banners, concern cards, the category tree, brand logos and
   the hand-picked product rails. Edit here to change what the app shows.

   Image names without "http" live in the content folder (see IMG_BASE in
   config.js). Every item says where a tap goes:
     set:     open the product list for a product group in data/sets.js
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
      "ar": "قطرات تصنع الفرق في نضارة البشرة",
      "en": "A few drops, visible glow",
      "ku": "چەند دڵۆپێک، درەوشانەوەیەکی دیار"
    },
    "set": "face-serum"
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
    "set": "sun"
  },
  {
    "id": "scalp",
    "image": "Screenshot-2026-02-02-at-14-41-12-Woman-doing-herself-a-scalp-massage-Free-Photo.png",
    "title": {
      "ar": "العناية بالشعر وفروة الرأس",
      "en": "Scalp care",
      "ku": "چاودێری سەری سەر"
    },
    "sub": {
      "ar": "علاجات لكل مشاكل الشعر وفروة الرأس",
      "en": "Shampoos and hair treatments",
      "ku": "شامپۆ و چارەسەری قژ"
    },
    "set": "scalp"
  },
  {
    "id": "mask",
    "image": "woman-wearing-bathrobe-towel-with-facemask(1).jpg",
    "title": {
      "ar": "ماسكات لبشرة أنضر",
      "en": "Mask night",
      "ku": "شەوی ماسک"
    },
    "sub": {
      "ar": "عناية مركّزة طوال الليل",
      "en": "Masks that work while you sleep",
      "ku": "ماسک کە لە خەودا کار دەکات"
    },
    "set": "face-mask"
  },
  {
    "id": "eyes",
    "image": "woman-using-eye-cream-side-view(1).jpg",
    "title": {
      "ar": "وداعاً للهالات السوداء",
      "en": "Goodbye dark circles",
      "ku": "ماڵئاوایی خولکەی ڕەش"
    },
    "sub": {
      "ar": "كريمات وسيرومات للعين",
      "en": "Eye creams and serums",
      "ku": "کرێم و سیرۆمی چاو"
    },
    "set": "dark-circles"
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
    "set": "acne"
  },
  {
    "id": "pigmentation",
    "name": {
      "ar": "تصبّغات البشرة",
      "en": "Pigmentation",
      "ku": "ڕەنگی پێست"
    },
    "image": "portrait-young-woman-being-confident-with-acne(1).jpg",
    "set": "pigmentation"
  },
  {
    "id": "dark-circles",
    "name": {
      "ar": "الهالات السوداء",
      "en": "Dark circles",
      "ku": "خولکەی ڕەش"
    },
    "image": "woman-using-eye-cream-side-view(1).jpg",
    "set": "dark-circles"
  },
  {
    "id": "dryness",
    "name": {
      "ar": "جفاف البشرة",
      "en": "Dry skin",
      "ku": "پێستی وشک"
    },
    "image": "woman-looking-her-rosacea-mirror(1).jpg",
    "set": "dryness"
  },
  {
    "id": "sun",
    "name": {
      "ar": "الحماية من الشمس",
      "en": "Sun protection",
      "ku": "پارێزەری خۆر"
    },
    "image": "view-man-applying-lotion-sunburn-skin-beach(1).jpg",
    "set": "sun"
  },
  {
    "id": "sweating",
    "name": {
      "ar": "زيادة التعرّق",
      "en": "Excess sweating",
      "ku": "ئارەقی زۆر"
    },
    "image": "close-up-woman-applying-deodorant-arm(1).jpg",
    "set": "sweating"
  },
  {
    "id": "sensitive",
    "name": {
      "ar": "المناطق الحسّاسة",
      "en": "Intimate care",
      "ku": "ناوچە هەستیارەکان"
    },
    "image": "portrait-cheerful-attractive-young-lady-holding-tampon-sanitary-napkin(1).jpg",
    "set": "sensitive"
  },
  {
    "id": "foot-care",
    "name": {
      "ar": "العناية بالقدم",
      "en": "Foot care",
      "ku": "چاودێری پێ"
    },
    "image": "woman-having-foot-treatment.jpg",
    "set": "foot-care"
  },
  {
    "id": "makeup",
    "name": {
      "ar": "المكياج ومستحضرات التجميل",
      "en": "Makeup & cosmetics",
      "ku": "مەیکئەپ و جوانکاری"
    },
    "image": "front-view-young-attractive-female-doing-her-make-up-with-mascara-dark-pink-wall-model-color-female-young-girl(1).jpg",
    "set": "makeup"
  },
  {
    "id": "kids",
    "name": {
      "ar": "العناية بالأطفال",
      "en": "Baby & kids care",
      "ku": "چاودێری منداڵ"
    },
    "image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop",
    "set": "kids"
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
        "id": "sensitive",
        "name": "العناية بالمناطق الحساسة",
        "image": "portrait-cheerful-attractive-young-lady-holding-tampon-sanitary-napkin(1).jpg",
        "set": "sensitive"
      },
      {
        "id": "womens-vitamins-w",
        "name": "فيتامينات ومكملات المرأة",
        "image": "front-view-young-woman-posing.jpg",
        "set": "womens-vitamins"
      },
      {
        "id": "anti-wrinkle",
        "name": "مكافحة التجاعيد",
        "image": "8610838.jpg",
        "set": "anti-aging"
      },
      {
        "id": "brightening",
        "name": "تفتيح وتوحيد لون البشرة",
        "image": "woman-doing-her-selfcare-ritual.jpg",
        "set": "pigmentation"
      },
      {
        "id": "stretch-marks-women",
        "name": "علامات التمدد",
        "image": "high-angle-hand-holding-cream-container.jpg",
        "set": "stretch-marks"
      },
      {
        "id": "hair-removal-women",
        "name": "إزالة الشعر",
        "image": "front-view-young-female-with-clock-towel-her-head-pink-background.jpg",
        "set": "hair-removal"
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
        "id": "eye-care",
        "name": "حول العين",
        "image": "woman-posing-with-avocado-front-view.jpg",
        "set": "dark-circles"
      },
      {
        "id": "face-toner",
        "name": "تونر وجه",
        "image": "young-female-pink-bathrobe-holding-make-up-flasks-blue(1).jpg",
        "set": "face-toner"
      },
      {
        "id": "thermal-water",
        "name": "مياه حرارية",
        "image": "front-view-young-beautiful-lady-bathrobe-smiles-cleans-away-all-make-up(1).jpg",
        "set": "thermal-water"
      },
      {
        "id": "face-soap",
        "name": "صابون للوجه",
        "image": "young-woman-taking-care-herself-home(1).jpg",
        "set": "face-soap"
      },
      {
        "id": "face-wash",
        "name": "غسول وجه",
        "image": "beautiful-woman-delicately-moisturizes-skin-with-cosmetic-tonic-portrait-lady-with-healthy-skin-without-makeup-isolated-wall(1).jpg",
        "set": "face-wash"
      },
      {
        "id": "face-serum",
        "name": "سيروم وجه",
        "image": "woman-applying-serum-her-face(1).jpg",
        "set": "face-serum"
      },
      {
        "id": "sunscreen",
        "name": "واقي شمس",
        "image": "woman-applying-sunscreen-beach-summer-skincare(1).jpg",
        "set": "sun"
      },
      {
        "id": "face-mask",
        "name": "ماسك وجه",
        "image": "woman-wearing-bathrobe-towel-with-facemask(1).jpg",
        "set": "face-mask"
      },
      {
        "id": "lip-care",
        "name": "العناية بالشفاه",
        "image": "woman-using-lip-gloss-front-view.jpg",
        "set": "lip-care"
      },
      {
        "id": "face-repair",
        "name": "مرمم للوجه",
        "image": "woman-looking-away-from-camera.jpg",
        "set": "face-repair"
      },
      {
        "id": "face-moisturizer",
        "name": "مرطب وجه",
        "image": "woman-applying-face-cream-front-view.jpg",
        "set": "face-moisturizer"
      },
      {
        "id": "face-exfoliants",
        "name": "مقشرات الوجه",
        "image": "woman-doing-her-selfcare-ritual.jpg",
        "set": "face-exfoliants"
      },
      {
        "id": "treatment-gel",
        "name": "علاجات موضعية للحبوب",
        "image": "clear-gel-being-poured-onto-finger.jpg",
        "set": "treatment-gel"
      },
      {
        "id": "mesotherapy",
        "name": "بوسترات وشوتات مركّزة",
        "image": "cosmetologist-makes-beauty-injection-woman-s-face-clinic.jpg",
        "set": "mesotherapy"
      },
      {
        "id": "acne-patches",
        "name": "لاصقات حب الشباب",
        "image": "1681037440058434300.jpg.webp",
        "set": "acne-patches"
      },
      {
        "id": "beauty-tools",
        "name": "أدوات العناية بالبشرة",
        "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
        "set": "beauty-tools"
      }
    ]
  },
  {
    "id": "makeup",
    "name": "المكياج ومستحضرات التجميل",
    "icon": "💄",
    "image": "front-view-young-attractive-female-doing-her-make-up-with-mascara-dark-pink-wall-model-color-female-young-girl(1).jpg",
    "subs": [
      {
        "id": "lipstick",
        "name": "أحمر وملمع الشفاه",
        "image": "woman-using-lip-gloss-front-view.jpg",
        "set": "lipstick"
      },
      {
        "id": "foundation",
        "name": "فاونديشن وكونسيلر",
        "image": "young-female-pink-bathrobe-holding-make-up-flasks-blue(1).jpg",
        "set": "foundation"
      },
      {
        "id": "blush",
        "name": "بلاشر",
        "image": "front-view-young-attractive-female-doing-her-make-up-with-mascara-dark-pink-wall-model-color-female-young-girl(1).jpg",
        "set": "blush"
      },
      {
        "id": "primer",
        "name": "برايمر ومثبت المكياج",
        "image": "beautiful-woman-delicately-moisturizes-skin-with-cosmetic-tonic-portrait-lady-with-healthy-skin-without-makeup-isolated-wall(1).jpg",
        "set": "primer"
      },
      {
        "id": "lashes-brows",
        "name": "الرموش والحواجب",
        "image": "front-view-young-attractive-female-doing-her-make-up-with-mascara-dark-pink-wall-model-color-female-young-girl(1).jpg",
        "set": "lashes-brows"
      },
      {
        "id": "makeup-remover-mk",
        "name": "مزيل المكياج",
        "image": "front-view-young-beautiful-lady-bathrobe-smiles-cleans-away-all-make-up(1).jpg",
        "set": "makeup-remover"
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
        "set": "shampoo"
      },
      {
        "id": "conditioner",
        "name": "بلسم",
        "image": "Screenshot-2026-02-02-at-14-36-48-Woman-brushing-hair-after-washing-it-Free-Photo.png",
        "set": "conditioner"
      },
      {
        "id": "hair-serum-oil",
        "name": "سيروم وزيوت للشعر",
        "image": "medium-shot-young-woman-using-serum.jpg",
        "set": "hair-serum-oil"
      },
      {
        "id": "hair-mask",
        "name": "ماسك شعر",
        "image": "Screenshot-2026-02-02-at-14-38-19-Young-woman-applying-anti-dandruff-product-Free-Photo.png",
        "set": "hair-mask"
      },
      {
        "id": "leave-in-cream",
        "name": "ليف إن وتصفيف الشعر",
        "image": "young-woman-applying-anti-dandruff-product.jpg",
        "set": "leave-in-cream"
      },
      {
        "id": "hair-loss-treatment",
        "name": "علاج تساقط الشعر",
        "image": "Screenshot-2026-02-02-at-14-41-12-Woman-doing-herself-a-scalp-massage-Free-Photo.png",
        "set": "hair-loss-treatment"
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
        "id": "foot-cream",
        "name": "كريم قدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7791-efa132b4/128701.webp",
        "set": "foot-cream"
      },
      {
        "id": "heel-cracks",
        "name": "تشققات الكعب",
        "image": "https://saba-baghdad.odoo.com/web/image/7792-545ac3f6/woman-cracked-heels-with-white-background-foot-healthy-concept.webp",
        "set": "heel-cracks"
      },
      {
        "id": "dead-skin",
        "name": "الجلد الميت ومسمار القدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7791-efa132b4/128701.webp",
        "set": "dead-skin"
      },
      {
        "id": "foot-odor",
        "name": "رائحة وتعرق القدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7789-47e8f03b/92672761_10004424.webp",
        "set": "foot-odor"
      },
      {
        "id": "foot-insoles",
        "name": "دبانات ومساند القدم",
        "image": "https://saba-baghdad.odoo.com/web/image/7793-f21ee788/acupressure-big-toe-pad-foot-reflexology-session.webp",
        "set": "foot-insoles"
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
        "id": "aftershave",
        "name": "الحلاقة وما بعد الحلاقة",
        "image": "https://saba-baghdad.odoo.com/web/image/7812-ab96ed87/2148883824.webp",
        "set": "aftershave"
      },
      {
        "id": "mens-hair-loss",
        "name": "شعر الرجال والتساقط",
        "image": "https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=400&h=400&fit=crop",
        "set": "mens-hair-loss"
      },
      {
        "id": "mens-deodorant",
        "name": "مزيلات العرق للرجال",
        "image": "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop",
        "set": "mens-deodorant"
      },
      {
        "id": "mens-body-care",
        "name": "العناية الشخصية للرجال",
        "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "set": "mens-body-care"
      },
      {
        "id": "mens-vitamins-m",
        "name": "فيتامينات الرجال",
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        "set": "mens-vitamins"
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
        "name": "الحمل والخصوبة",
        "image": "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&h=400&fit=crop",
        "set": "pregnancy-followup"
      },
      {
        "id": "sleep-breastfeeding",
        "name": "الرضاعة",
        "image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop",
        "set": "sleep-breastfeeding"
      },
      {
        "id": "baby-skin",
        "name": "العناية ببشرة الطفل",
        "image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop",
        "set": "baby-skin"
      },
      {
        "id": "kids-vitamins-m",
        "name": "فيتامينات وتغذية الأطفال",
        "image": "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&h=400&fit=crop",
        "set": "kids-vitamins"
      },
      {
        "id": "child-health",
        "name": "صحة الطفل",
        "image": "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=400&h=400&fit=crop",
        "set": "child-health"
      }
    ]
  },
  {
    "id": "nail-care",
    "name": "العناية بالأظافر واليدين",
    "icon": "💅",
    "image": "front-view-working-woman-holding-cup-coffee-desk.jpg",
    "subs": [
      {
        "id": "nail-strengtheners",
        "name": "مقويات الأظافر",
        "image": "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=400&fit=crop",
        "set": "nail-strengtheners"
      },
      {
        "id": "hand-care",
        "name": "كريمات اليدين",
        "image": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
        "set": "hand-care"
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
        "image": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop",
        "set": "body-lightening"
      },
      {
        "id": "body-moisturizer",
        "name": "ترطيب الجسم",
        "image": "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop",
        "set": "body-moisturizer"
      },
      {
        "id": "body-wash",
        "name": "غسول الجسم",
        "image": "https://plain-eeur-prod-public.komododecks.com/202603/25/84ZGv22cWibwwqDNI73R/image.png",
        "set": "body-wash"
      },
      {
        "id": "body-oil",
        "name": "زيت للجسم",
        "image": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
        "set": "body-oil"
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
        "id": "toothpaste",
        "name": "معجون أسنان",
        "image": "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?w=400&h=400&fit=crop",
        "set": "toothpaste"
      },
      {
        "id": "toothbrush",
        "name": "فرشاة أسنان",
        "image": "https://images.unsplash.com/photo-1559131397-f94da358f7ca?w=400&h=400&fit=crop",
        "set": "toothbrush"
      },
      {
        "id": "mouthwash",
        "name": "غسول الفم",
        "image": "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop",
        "set": "mouthwash"
      },
      {
        "id": "breath-strips",
        "name": "معطرات الفم ومثبت الأطقم",
        "image": "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=400&h=400&fit=crop",
        "set": "breath-strips"
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
        "image": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop",
        "set": "energy-activity-vitamins"
      },
      {
        "id": "immunity-vitamins",
        "name": "فيتامينات المناعة",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
        "set": "immunity-vitamins"
      },
      {
        "id": "skin-beauty-vitamins",
        "name": "فيتامينات البشرة والجمال",
        "image": "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&h=400&fit=crop",
        "set": "skin-beauty-vitamins"
      },
      {
        "id": "hair-nails-vitamins",
        "name": "فيتامينات الشعر والأظافر",
        "image": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop",
        "set": "hair-nails-vitamins"
      },
      {
        "id": "bones-joints-vitamins",
        "name": "فيتامينات العظام والمفاصل",
        "image": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=400&fit=crop",
        "set": "bones-joints-vitamins"
      },
      {
        "id": "heart-circulation-vitamins",
        "name": "فيتامينات القلب والدورة الدموية",
        "image": "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?w=400&h=400&fit=crop",
        "set": "heart-circulation-vitamins"
      },
      {
        "id": "focus-memory-vitamins",
        "name": "فيتامينات التركيز والذاكرة",
        "image": "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&h=400&fit=crop",
        "set": "focus-memory-vitamins"
      },
      {
        "id": "sleep-relaxation-vitamins",
        "name": "فيتامينات النوم والراحة",
        "image": "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=400&fit=crop",
        "set": "sleep-relaxation-vitamins"
      },
      {
        "id": "general-supplements",
        "name": "مكملات غذائية عامة",
        "image": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
        "set": "general-supplements"
      },
      {
        "id": "antioxidants",
        "name": "مضادات الأكسدة",
        "image": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=400&fit=crop",
        "set": "antioxidants"
      },
      {
        "id": "probiotics-digestive",
        "name": "البروبيوتيك وصحة الجهاز الهضمي",
        "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop",
        "set": "probiotics-digestive"
      },
      {
        "id": "mineral-deficiency-vitamins",
        "name": "فيتامينات نقص العناصر",
        "image": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
        "set": "mineral-deficiency-vitamins"
      },
      {
        "id": "diabetes-vitamins",
        "name": "فيتامينات لمرضى السكري",
        "image": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop",
        "set": "diabetes-vitamins"
      },
      {
        "id": "weight-loss",
        "name": "التنحيف وإدارة الوزن",
        "image": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop",
        "set": "weight-loss"
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
        "name": "أجهزة وشرائط فحص السكر",
        "image": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=400&fit=crop",
        "set": "glucose-monitors"
      },
      {
        "id": "blood-pressure-monitors",
        "name": "أجهزة فحص الضغط",
        "image": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=400&fit=crop",
        "set": "blood-pressure-monitors"
      },
      {
        "id": "thermometers",
        "name": "مقياس حرارة",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
        "set": "thermometers"
      },
      {
        "id": "first-aid",
        "name": "الإسعافات الأولية والضمادات",
        "image": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=400&fit=crop",
        "set": "first-aid"
      },
      {
        "id": "support-braces",
        "name": "مشدات ومساند طبية",
        "image": "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&h=400&fit=crop",
        "set": "support-braces"
      },
      {
        "id": "catheters",
        "name": "كيترات الركبة والكاحل",
        "image": "https://images.unsplash.com/photo-1583912267550-d974311a9a6e?w=400&h=400&fit=crop",
        "set": "catheters"
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

// Korean best sellers, all live on Odoo with their photos (prices refresh from Odoo).
export const TRENDING = [
  {
    "id": 165,
    "key": "165",
    "brand": "COSRX",
    "name": "COSRX Advanced Snail 96 Mucin Essence — خلاصة الحلزون ٩٦",
    "price": 16000,
    "badge": "رائج",
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/165/image_512"
  },
  {
    "id": 1914,
    "key": "1914",
    "brand": "SKIN1004",
    "name": "SKIN1004 Madagascar Centella Ampoule 55ml — أمبول السنتيلا",
    "price": 22500,
    "badge": "الأكثر مبيعاً",
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1914/image_512"
  },
  {
    "id": 171,
    "key": "171",
    "brand": "Anua",
    "name": "Anua Heartleaf Pore Control Cleansing Oil — زيت منظف للمسام",
    "price": 25000,
    "badge": "كوري",
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/171/image_512"
  },
  {
    "id": 1697,
    "key": "1697",
    "brand": "Beauty of Joseon",
    "name": "Beauty of Joseon Relief Sun SPF50+ — واقي شمس الأرز",
    "price": 22000,
    "badge": "الأكثر مبيعاً",
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1697/image_512"
  },
  {
    "id": 1733,
    "key": "1733",
    "brand": "MEDICUBE",
    "name": "Medicube Glutathione Glow Serum — سيروم الجلوتاثيون للإشراقة",
    "price": 26000,
    "badge": "رائج",
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1733/image_512"
  },
  {
    "id": 1808,
    "key": "1808",
    "brand": "SOME BY MI",
    "name": "SOME BY MI 30 Days Miracle Serum — سيروم للبشرة المعرضة للحبوب",
    "price": 24000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1808/image_512"
  },
  {
    "id": 209,
    "key": "209",
    "brand": "TOCOBO",
    "name": "TOCOBO Bio Watery Sun Cream SPF50 — واقي شمس بقوام مائي",
    "price": 26000,
    "badge": "كوري",
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/209/image_512"
  },
  {
    "id": 1701,
    "key": "1701",
    "brand": "EQQUAL BERRY",
    "name": "EQQUALBERRY Vitamin Illuminating Serum — سيروم الفيتامينات",
    "price": 27000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1701/image_512"
  },
  {
    "id": 174,
    "key": "174",
    "brand": "Anua",
    "name": "Anua Niacinamide 10% + TXA 4% Serum — سيروم النياسيناميد",
    "price": 27000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/174/image_512"
  },
  {
    "id": 1956,
    "key": "1956",
    "brand": "SKIN1004",
    "name": "SKIN1004 Hyalu-Cica Water-Fit Sun Serum SPF50+ — واقي شمس سيروم",
    "price": 21500,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1956/image_512"
  },
  {
    "id": 1714,
    "key": "1714",
    "brand": "MEDICUBE",
    "name": "Medicube PDRN Pink Collagen Exosome Shot — سيروم الكولاجين",
    "price": 25000,
    "badge": "رائج",
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1714/image_512"
  },
  {
    "id": 1694,
    "key": "1694",
    "brand": "Beauty of Joseon",
    "name": "Beauty of Joseon Glow Deep Serum — سيروم الأرز والألفا أربوتين",
    "price": 20000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1694/image_512"
  },
  {
    "id": 164,
    "key": "164",
    "brand": "COSRX",
    "name": "COSRX The Niacinamide 15 Serum — سيروم النياسيناميد ١٥٪",
    "price": 21000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/164/image_512"
  },
  {
    "id": 1793,
    "key": "1793",
    "brand": "SOME BY MI",
    "name": "SOME BY MI 30 Days Miracle Toner — تونر للبشرة المعرضة للحبوب",
    "price": 19000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1793/image_512"
  },
  {
    "id": 207,
    "key": "207",
    "brand": "TOCOBO",
    "name": "TOCOBO Cica Cooling Sun Stick SPF50+ — واقي شمس ستيك",
    "price": 21000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/207/image_512"
  },
  {
    "id": 1773,
    "key": "1773",
    "brand": "EQQUAL BERRY",
    "name": "EQQUALBERRY Swimming Pool Ampoule — أمبول مرطب",
    "price": 27000,
    "badge": "كوري",
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1773/image_512"
  },
  {
    "id": 3465,
    "key": "3465",
    "brand": "Centellian 24",
    "name": "Centellian24 Madeca Cream Time Reverse — كريم ماديكا",
    "price": 20000,
    "badge": "كوري",
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/3465/image_512"
  },
  {
    "id": 1749,
    "key": "1749",
    "brand": "MEDICUBE",
    "name": "Medicube PDRN Pink Collagen Bubble Serum — سيروم فقاعات الكولاجين",
    "price": 26000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1749/image_512"
  },
  {
    "id": 1695,
    "key": "1695",
    "brand": "Beauty of Joseon",
    "name": "Beauty of Joseon Light On Serum — سيروم السنتيلا وفيتامين سي",
    "price": 24000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/1695/image_512"
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
    "id": 3361,
    "key": "3361",
    "brand": null,
    "name": "SVR Sebiaclear — غسول جل رغوي للبشرة الدهنية ٤٠٠ مل",
    "price": 29000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/3361/image_512"
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
    "id": 3369,
    "key": "3369",
    "brand": null,
    "name": "SVR Topialyse — زيت منظف للبشرة الجافة والحساسة ٤٠٠ مل",
    "price": 28000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/3369/image_512"
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
    "id": 2970,
    "key": "2970",
    "brand": null,
    "name": "Rilastil D-Clar — قطرات مركّزة لعلاج التصبّغات",
    "price": 36000,
    "badge": null,
    "image": "https://saba-baghdad.odoo.com/web/image/product.template/2970/image_512"
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


// The name to show on the product list for a product group (data/sets.js).
export function setTitle(id) {
  const concern = CONCERNS.find((c) => c.set === id);
  if (concern) return concern.name;
  for (const c of CATEGORIES) {
    const s = c.subs.find((x) => x.set === id);
    if (s) return s.name;
  }
  const slide = HERO.find((h) => h.set === id);
  return slide ? slide.title : null;
}
