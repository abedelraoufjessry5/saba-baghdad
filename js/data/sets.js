/* Product groups used by the home cards, the banners and the category tree.

   The server (api/products.js?set=<id>) turns a group into an Odoo search:
     terms    the product NAME contains at least one of these
     without  ... and none of these
     exclude  product ids that never show in this group
     q        free search (name + description), like the search box
     vitamins true = supplements only: also leaves out creams, washes, sprays...

   Product names in Odoo hold the English name and an Arabic description, so a
   term matches either. To move a product out of a group, add its id to
   "exclude"; to keep a word from pulling in the wrong products, add it to
   "without". */

export const NOT_SUPPLEMENT = ["lotion", "لوشن", "spray", "بخاخ", "shampoo", "شامبو", "cream", "كريم", " gel", "جل ", "roll-on", "stick", "deodorant", "مضاد تعرق", "serum", "سيروم", "toner", "تونر", "wash", "غسول", "mask", "ماسك", "soap", "صابون", "remover", "مزيل", "sunscreen", "واقي"];

export const SETS = {
  "pigmentation": {
    terms: ["pigment", "تصبغ", "تصبّغ", "depigment", "dark spot", "anti-spot", "anti spot", "كلف", "brightening", "تفتيح", "lightening", "whitening", "arbutin", "kojic", "neotone", "depiderm", "d-clar", "mela b3", "melascreen", "melaclear", "clairial", "unitone", "trio white", "pigmentclar", "azelac"],
    without: ["toothpaste", "معجون", "deodorant", "مزيل عرق", "intimate", "vaginal", "lip", "شفاه", "shampoo", "شامبو", "supplement", "مكمل", "capsule", "glutathione", "kit", "مجموعة"]
  },
  "dark-circles": {
    terms: ["dark circle", "هالات", "eye cream", "eye contour", "eye serum", "eye care", "eyes", "كريم العين", "كريم للعين", "للعينين", "حول العين", "محيط العين", "eye roller", "eye lift", "eye gel", "eye cream-gel", "eye contour fluid", "eye contour gel"],
    without: ["make-up remover", "makeup remover", "مزيل مكياج", "demaquillant", "eyelash", "eyebrow", "رموش", "حواجب", "ضماد", "غطاء عين", "4 step", "kit", "مجموعة", "2 in 1", "cleanser"]
  },
  "dryness": {
    terms: ["dry skin", "very dry", "extra dry", "dry to very", "للبشرة الجافة", "urea", "xerial", "xerodiane", "xemose", "xerolact", "atoderm", "lipikar", "cold cream", "trixera", "xeracalm", "secalia", "topialyse", "aquareva", "hydraline", "dexyane", "roughness relief", "intensive repair", "healing lotion", "emollient", "anti-dry", "ultra rich", "extra rich", "nutri-filler", "dermasoothe", "itch"],
    without: ["shampoo", "شامبو", "dandruff", "قشرة", "hair", "شعر", "deodorant", "مزيل عرق", "مضاد تعرق", "dry touch", "dry control", "sunscreen", "واقي شمس", "foot", "feet", "pieds", "القدم", "للقدمين", "lip", "شفاه", "kit", "مجموعة", "keratolytic", "urea 25", "urea 50", "urea 20", "urea 30", "hand", "لليدين", "mains", "bb cream", "oily", "الدهنية", "exfoliant", "primer", "spf", "serum", "سيروم", "micellar"]
  },
  "sun": {
    terms: ["واقي شمس", "واقي الشمس", "واقٍ من الشمس", "واقي من الشمس", "sunscreen", "sunblock", "sun cream", "suncream", "sun serum", "sun stick", "sun milk", "sun fluid", "sun lotion", "sun spray", "sun ampoule", "sun secure", "sun system", "anthelios", "uveblock", "uvblock", "photoderm", "fotoprotector", "capital soleil", "bariesun", "bergasol", "uv-defence", "uv defence", "protective shield", "spf50", "spf 50", "spf30", "spf 30"],
    without: ["deodorant", "مزيل عرق", "lip", "شفاه", "hand cream", "لليدين", "after sun", "scars", "ندبات", "kit", "cleansing", "تنظيف", "غسول", "cleanser"]
  },
  "sweating": {
    terms: ["perspirant", "deodorant", "transpirant", "antiperspirant", "hidrosis", "تعرق", "مزيل عرق", "مزيل رائحة", "spirial", "control spray talc"],
    without: ["intimate", "للمناطق الحساسة", "المنطقة الحساسة", "make-up", "مكياج"],
    exclude: [3068]
  },
  "sensitive": {
    terms: ["المناطق الحساسة", "مناطق حساسة", "intimate", "intimo", "vaginal", "مهبل", "غسول نسائي", "gyno", "genital", "intime"]
  },
  "makeup": {
    terms: ["maybelline", "nyx", "makeup primer", "setting spray", "lipstick", "lip gloss", "lifter gloss", "foundation", "concealer", "كونسيلر", "mascara", "blush", "بلاشر", "أحمر شفاه", "bb cream", "cc cream", "tinted"],
    without: ["remover", "مزيل", "hair", "شعر", "sunscreen", "واقي شمس", "spf", "sun", "anthelios"]
  },
  "makeup-remover": {
    terms: ["make-up remover", "makeup remover", "مزيل مكياج", "مزيل للمكياج", "مزيل المكياج", "micellar", "micellaire", "miceller", "ميسيلار", "demaquillant", "cleansing water", "acqua micellare"],
    without: ["gel wash"]
  },
  "face-toner": {
    terms: ["toner", "تونر", "tonic", "تونك", "toning solution", "lotion tonique"],
    without: ["hair", "شعر", "pad", "وسادات", "cleanser", "غسول", "micellar"]
  },
  "lashes-brows": {
    terms: ["eyelash", "eyebrow", "lash", "رموش", "حواجب", "mascara"],
    without: ["remover", "مزيل", "lip"]
  },
  "thermal-water": {
    terms: ["thermal water", "eau thermale", "مياه حرارية", "ماء حراري", "مياه افين", "الحرارية"],
    without: ["cream", "كريم", "mask", "ماسك"]
  },
  "face-soap": {
    terms: ["soap", "صابون", "صابونة", "cleansing bar", "syndet", "dermatological bar", "قالب تنظيف", "perobar"],
    without: ["vaginal", "مهبل", "intimate", "مناطق حساسة", "baby", "للأطفال", "hand wash", "body wash", "free cream", "syndet ap+"]
  },
  "face-wash": {
    terms: ["face wash", "facial wash", "facial cleanser", "face cleanser", "cleansing gel", "cleansing foam", "foaming gel", "gel moussant", "foam cleanser", "gel cleanser", "cleanser", "غسول وجه", "غسول للوجه", "غسول الوجه", "غسول رغوي", "جل منظف", "washing foam", "wash gel", "foaming wash", "foam wash", "cleansing milk", "cleansing oil", "cleansing balm", "oil to foam", "huile lavant", "hidraven", "sebium h2o"],
    without: ["body", "للجسم", "الجسم", "hair", "شعر", "شامبو", "intimate", "المناطق الحساسة", "vaginal", "genital", "baby", "للأطفال", "hand", "لليدين", "make-up remover", "micellar", "ميسيلار", "شرائط"]
  },
  "face-serum": {
    terms: ["serum", "سيروم", "ampoule", "أمبول", "booster shot", "boosting shot", "exosome shot", "ncef-shot", "time-filler shot", "concentrate", "essence"],
    without: ["lipstick", "gloss", "أحمر شفاه", "ملمع", "hair", "شعر", "scalp", "فروة", "sun serum", "sun ampoule", "واقي شمس", "spf", "body", "للجسم", "stretch", "تمدد", "vaginal", "pad", "وسادات", "mask", "ماسك", "قناع", "foam", "toner", "تونر", "kit", "مجموعة", "duo set", "ampoules", "أمبولات", "eye", "للعين", "dandruff", "loss", "supplement", "kertyol"]
  },
  "face-mask": {
    terms: ["mask", "masque", "ماسك", "قناع", "sleeping pack", "pack cleanser", "peel off"],
    without: ["hair", "شعر", "lip", "شفاه", "socks", "feet", "pieds", "للقدمين", "headband", "ربطة", "eye mask", "غطاء عين", "تطعيم", "lift", "serum", "سيروم", "essence", "pads", "وسادات"]
  },
  "face-care": {
    terms: ["face cream", "facial cream", "face & neck", "face and neck", "للوجه", "day cream", "night cream", "كريم نهاري", "كريم ليلي", "gel-cream", "gel cream", "جل كريم"],
    without: ["body", "للجسم", "hand", "لليدين", "foot", "للقدمين", "hair", "شعر", "wash", "غسول", "cleanser", "مزيل", "sun", "واقي شمس", "serum", "سيروم", "mask", "ماسك", "قناع", "toner", "تونر", "cleansing", "تنظيف", "soap", "صابون", "peel", "مقشر", "scrub", "mist", "baby", "bebe", "للأطفال", "eye", "عين", "foaming"]
  },
  "lip-care": {
    terms: ["lip balm", "lip stick", "lip care", "lip therapy", "lip defense", "lip mask", "lips moisturizer", "lips", "levres", "lèvres", "مرطب شفاه", "مرطب للشفاه", "بلسم شفاه", "مرطب الشفاه", "للشفاه", "cold cream lip", "stic levres", "nutri-filler lips"],
    without: ["lipstick", "gloss", "أحمر شفاه", "ملمع", "maybelline", "nyx", "spf 8"]
  },
  "face-repair": {
    terms: ["cica", "سيكا", "repair cream", "repairing cream", "مرمم", "cicalfate", "cicaplast", "baume b5", "barrier cream", "barrier support", "regenerating", "restoring", "healing", "reconstructive", "neocica", "cicadiane", "bariederm", "post peeling", "aftercare", "madeca", "relief cream"],
    without: ["hair", "شعر", "shampoo", "شامبو", "hand", "لليدين", "foot", "pieds", "للقدمين", "body", "للجسم", "lip", "شفاه", "toner", "تونر", "pad", "وسادات", "ampoule", "أمبول", "serum", "سيروم", "mask", "ماسك", "foam", "غسول", "cleansing", "sun", "spf", "mist", "kit", "مجموعة", "duo", "shower", "syndet", "bar", "eye"]
  },
  "face-moisturizer": {
    terms: ["moisturizer", "moisturiser", "moisturizing cream", "moisturising cream", "moisture cream", "hydrating cream", "water cream", "hydra cream", "jelly cream", "مرطب للوجه", "كريم مرطب", "مرطب يومي", "hydraphase", "aquareva", "hydra-hyal cream", "gel-crème", "gel creme", "sensylia", "hydrating gel cream", "lait-crème", "soft cream"],
    without: ["body", "للجسم", "hand", "لليدين", "foot", "للقدمين", "pieds", "lip", "شفاه", "hair", "شعر", "baby", "للأطفال", "bebe", "spf", "sun", "lotion", "لوشن", "cleanser", "foam", "anthelios", "eye", "tinted"]
  },
  "treatment-gel": {
    terms: ["spot gel", "spot treatment", "spot control", "spot cream", "spot removal", "drying lotion", "drying gel", "anti-pimple gel", "anti acne gel", "anti-acne gel", "active gel", "جل موضعي", "علاج موضعي", "جل مجفف", "localized", "on the spot", "everclean", "roll-on", "sos drying", "cicapeel"],
    without: ["hair", "شعر", "body", "للجسم", "pads", "وسادات", "mask", "قناع", "ماسك", "deodorant", "مضاد تعرق", "perspirant", "مزيل عرق", "تعرق", "eye"]
  },
  "mesotherapy": {
    terms: ["meso", "ميزو", "derma roller", "درما رولر", "ديرما رولر", "booster shot", "boosting shot", "exosome shot", "ncef-shot", "shot 5xp", "filler shot", "shot supreme"],
    without: ["mask", "ماسك", "قناع", "cream", "كريم"]
  },
  "acne-patches": {
    terms: ["patch", "لاصقات شفافة لعلاج الحبوب", "spot cover", "hydrocolloid", "acne patch", "pimple patch"],
    without: ["nose", "noz", "cough", "virus", "سعال"]
  },
  "face-exfoliants": {
    terms: ["peel", "peeling", "exfoliant", "exfoliating", "scrub", "مقشر", "تقشير", "aha", "glycolic", "resurfacing"],
    without: ["hair", "شعر", "scalp", "body", "للجسم", "foot", "feet", "pieds", "للقدمين", "socks", "pads", "وسادات", "mask", "قناع", "ماسك", "powder", "باودر", "shampoo", "شامبو", "soap", "صابون", "syndet", "bar", "toner", "تونر", "cleanser", "غسول", "wash", "foam", "micellar", "lotion 10", "post peeling", "night cream", "eye", "supplement", "urea", "يوريا", "kit", "balm", "cleansing", "starter"]
  },
  "anti-aging": {
    terms: ["wrinkle", "تجاعيد", "anti-age", "anti-aging", "anti aging", "age lift", "age correct", "age defense", "age defence", "age-r", "time-filler", "time filler", "lift", "retinol", "retinal", "ريتينول", "firming", "peptide", "hydrotenseur", "noveane", "q10", "bakuchiol", "ncef", "collagen specialist", "rejuline", "expert age"],
    without: ["supplement", "مكمل", "capsule", "tablet", "softgel", "hair", "شعر", "sun cream", "واقي شمس", "toner", "تونر", "pad", "وسادات", "kit", "مجموعة", "body lotion", "eye", "عين", "lipstick", "مكياج", "maybelline", "gloss", "nyx", "olaplex", "curl", "anthelios", "bergasol", "sunblock", "sunsafe"]
  },
  "lipstick": {
    terms: ["lipstick", "lip gloss", "lifter gloss", "gloss serum", "أحمر شفاه", "ملمع شفاه"]
  },
  "foundation": {
    terms: ["foundation", "concealer", "كونسيلر", "bb cream", "cc cream", "فاونديشن"],
    without: ["sun", "واقي شمس", "spf50"]
  },
  "blush": {
    terms: ["blush", "بلاشر"]
  },
  "primer": {
    terms: ["makeup primer", "setting spray", "برايمر", "مثبت للمكياج", "مثبت المكياج"]
  },
  "shampoo": {
    terms: ["shampoo", "شامبو", "wash |", ".wash", "foam shampoo", "dry shampoo"],
    without: ["body", "للجسم", "face", "للوجه", "hand", "لليدين", "intimate", "baby", "للأطفال", "kids", "newborn", "vaginal", "genital", "facial", "cleansing gel", "shower", "استحمام", "douche", "مناطق حساسة", "rinse", "conditioner", "بلسم"]
  },
  "conditioner": {
    terms: ["conditioner", "بلسم للشعر", "بلسم الشعر", "بلسم مرطب للشعر", "بلسم مغذي", "بلسم لتنعيم", "بلسم يعيد", "بلسم لإصلاح", ".rinse", "rinse |"],
    without: ["lip", "شفاه"]
  },
  "hair-serum-oil": {
    terms: ["hair oil", "hair serum", "scalp serum", "hair & scalp oil", "scalp & hair oil", "زيت شعر", "زيت للشعر", "زيت الشعر", "سيروم شعر", "سيروم للشعر", "bonding oil", "argan oil", "hair perfector", "shimmer shine", "سيروم مهدئ لفروة", "pro! intensive serum", "sebamed pro", "repair & moisture booster serum", "serum for hair", "scalp spa serum"],
    without: ["shampoo", "شامبو", "soap", "صابون", "shower", "استحمام", "body", "للجسم", "mask", "ماسك"]
  },
  "hair-mask": {
    terms: ["hair mask", "hair masque", "masque", "ماسك شعر", "ماسك للشعر", "ماسك الشعر", "ماسك معالج للشعر", "ماسك مكثف للشعر", "nutricerat mask", "moisturebmask", "intensive hair", "scalp spa tretment"],
    without: ["face", "للوجه", "clay", "طين", "salicylic", "eye", "night", "ليلي", "sleeping"]
  },
  "leave-in-cream": {
    terms: ["leave-in", "leave in", "ليف ان", "styling", "تصفيف", "hair cream", "كريم شعر", "كريم الشعر", "smoother", "curl", "twirls", "soufflé", "heat primer", "detangling", "hair spray", "hair mist", "تثبيت تسريحات", "مثبت للشعر", "spiking gel", "hold", "رذاذ لتصفيف"],
    without: ["shampoo", "شامبو", "rinse", "conditioner", "wash"]
  },
  "hair-loss-treatment": {
    terms: ["hair loss", "hairloss", "تساقط", "anaphase", "aminexil", "minoxidil", "rogaine", "anticaduta", "anti hair fall", "thinning", "densi", "denisage", "caffeine shampoo", "caffeine liquid", "c1 caffeine", "hair density", "fortifying lotion", "neoptide", "seskavel", "bio-force", "h-stimupurin", "anp2+", "stimulate-me", "thick.again"],
    without: ["supplement", "مكمل", "capsule", "كبسول", "tablet", "dht blocker"]
  },
  "scalp": {
    terms: ["shampoo", "شامبو", "wash |", ".wash", "foam shampoo", "dry shampoo", "hair loss", "hairloss", "تساقط", "anaphase", "aminexil", "minoxidil", "rogaine", "anticaduta", "anti hair fall", "thinning", "densi", "denisage", "caffeine liquid", "hair density", "fortifying lotion", "neoptide", "seskavel", "bio-force", "anp2+", "scalp", "فروة الرأس"],
    without: ["body", "للجسم", "face", "للوجه", "hand", "لليدين", "intimate", "baby", "للأطفال", "kids", "newborn", "vaginal", "genital", "facial", "cleansing gel", "shower", "استحمام", "douche", "مناطق حساسة", "rinse", "conditioner", "بلسم", "supplement", "مكمل", "capsule", "كبسول", "tablet", "dht blocker", "cradle cap"]
  },
  "body-lightening": {
    terms: ["body peel", "body peeling", "body scrub", "مقشر للجسم", "مقشر رغوي", "تفتيح الجسم", "لتفتيح الجسم", "bodytone", "neotone body", "glyco-a body", "exfoliating body lotion", "gly + sal", "pigment corrector body", "targeted areas body", "peeling shot", "sensitive areas 75", "chemical body"]
  },
  "body-moisturizer": {
    terms: ["body lotion", "body milk", "body cream", "body butter", "body gel", "body balm", "lait corps", "لوشن مرطب للجسم", "لوشن الجسم", "مرطب للجسم", "كريم مرطب للجسم", "skin moisturizer 250", "daily moisturizing lotion", "moisturising lotion", "moisturizing lotion", "ultra hydrating lotion", "daily advance", "original healing lotion", "roughness relief", "lipikar", "atoderm", "secalia ultra", "xemose", "trixera nutrition", "vaseline blueseal", "petroleum jelly", "soft cream"],
    without: ["face", "للوجه", "baby", "للأطفال", "bebe", "spf", "sun", "anti acne", "glycolic", "gly + sal", "exfoliating", "مقشر", "firming", "stretch", "تمدد", "syndet", "lip", "شفاه"]
  },
  "body-wash": {
    terms: ["shower gel", "shower cream", "body wash", "جل استحمام", "جل الاستحمام", "غسول للجسم", "غسول جسم", "غسول الجسم", "douche", "wash emulsion", "body cleanser", "face & body wash", "face and body wash", "cleansing gel 500", "extra rich dermatological gel", "syndet ap+", "hand wash", "غسول لليدين"],
    without: ["baby", "للأطفال", "bebe", "intimate", "vaginal", "kids", "newborn", "genital"]
  },
  "body-oil": {
    terms: ["body oil", "skin care oil", "زيت الجسم", "زيت للجسم", "زيت العناية", "dry oil", "زيت جاف", "magnesium oil", "argan oil", "زيت الأرجان", "skin renewing gel oil", "dry skin gel"],
    without: ["hair", "شعر", "cleansing", "تنظيف", "baby", "للأطفال", "capsule", "softgel", "stretch", "تمدد", "soap", "صابون", "shower", "استحمام"]
  },
  "stretch-marks": {
    terms: ["stretch mark", "stretch-mark", "تمدد", "smagliature", "liporeducer", "ultra firming"],
    without: ["eye", "sun", "spf"]
  },
  "hair-removal": {
    terms: ["hair removal", "إزالة الشعر", "إزالة شعر", "مزيل شعر", "مزيل الشعر", "depilatory"],
    without: ["perspirant", "تعرق"]
  },
  "foot-care": {
    terms: ["القدم", "للقدمين", "foot", "feet", "pieds", "heel", "الكعب", "corn caps", "corn plaster", "مسمار قدم", "دبان"],
    without: ["head to toe"],
    exclude: [2952]
  },
  "foot-cream": {
    terms: ["foot cream", "crème pieds", "creme pieds", "كريم قدم", "كريم للقدم", "كريم للقدمين", "acti-foot", "hand & foot"]
  },
  "heel-cracks": {
    terms: ["heel", "الكعب", "الكعبين", "تشقق", "cracked", "fissures", "cracks"],
    without: ["lip", "شفاه", "hand", "لليدين", "nipple", "دبان", "سليكون", "stretch", "تمدد", "smagliature"]
  },
  "dead-skin": {
    terms: ["exfoliating socks", "socks mask", "xerial peel", "تقشير للقدمين", "keratolytic", "kerato", "urea 25", "urea 50", "urea 20", "corn caps", "corn plaster", "مسمار القدم", "مسمار قدم"],
    without: ["shampoo", "شامبو", "face", "للوجه", "kelual"]
  },
  "foot-odor": {
    terms: ["foot spray", "foot deodorant", "control spray talc", "رائحة القدم", "spirial crème"]
  },
  "foot-insoles": {
    terms: ["دبان", "مسند سقوط القدم", "كاحل القدم", "ابهام القدم", "مسند قدم"]
  },
  "mens-face-wash": {
    terms: ["face wash men", "men cleansing", "men foam", "للرجال"],
    without: ["deodorant", "مضاد تعرق", "مزيل عرق", "مزيل رائحة", "shampoo", "شامبو", "genital", "intime", "foam daily disinfectant", "sun", "واقي", "after shave", "supplement", "مكمل", "capsule", "tablet", "lotion", "لوشن", "hair", "شعر", "corset", "كورسيه", "vitamin", "saintly"]
  },
  "aftershave": {
    terms: ["after shave", "aftershave", "بعد الحلاقة", "shave", "حلاقة"]
  },
  "mens-hair-loss": {
    terms: ["men's rogaine", "minoxidil", "aminexil clinical 5 men", "(for male)", "thinning hair men", "men way anti hair fall", "alpecin", "hair biotic"],
    without: ["capsule", "tablet"]
  },
  "mens-deodorant": {
    terms: ["nivea men", "for men", "clinical control men", "deodorant sensitive for men", "arm & hammer"],
    without: ["genital", "face wash", "sun", "واقي", "shampoo", "شامبو", "gel", "جل", "hair", "lotion", "capsule"]
  },
  "mens-body-care": {
    terms: ["genital cleansing gel men", "turkuaz man", "saintly girl men", "men foam", "حمالة خصية"]
  },
  "kids": {
    terms: ["baby", "bebe", "kids", "children", "pediatric", "للأطفال", "الأطفال", "اطفال", "newborn", "حفاض", "nappy", "diaper"],
    without: ["حمالة", "حزام", "ضماد", "لصقة جروح", "bandage"],
    exclude: [619,1664]
  },
  "pregnancy-followup": {
    terms: ["pregna", "prenatal", "materna", "mamacare", "mama care", "pregnancy", "للحامل", "الحمل", "pregnav", "awapreg", "well-pregna", "اختبار الحمل", "fertil", "ovatop", "ova-max", "twini", "conception"],
    without: ["stretch", "تمدد", "spf"]
  },
  "sleep-breastfeeding": {
    terms: ["breastfeeding", "الرضاعة", "nursing", "nipple", "calmosine"]
  },
  "child-health": {
    terms: ["happy noz", "kids anti", "chest rub", "liv.52 drops", "cough", "سعال", "لصقة خافض حرارة", "koflet", "bresol"],
    without: ["strepsils", "lozenges"]
  },
  "baby-skin": {
    terms: ["baby", "bebe", "newborn", "حفاض", "nappy", "diaper", "للأطفال حديثي", "cradle cap", "للرضع"],
    without: ["supplement", "مكمل", "gummies"],
    exclude: [619]
  },
  "baby-bath": {
    terms: ["baby shampoo", "baby wash", "baby bar", "baby cleansing", "2 in 1 cleansing gel", "gentle cleansing gel", "foam shampoo for newborns", "gentle shampoo", "kids care shampoo", "kids care head to toe", "أكواريل كيدز شامبو", "no rinse cleansing", "cleansing wipes"],
    without: ["intimate", "adult"]
  },
  "stretch-marks-mom": {
    terms: ["stretch mark", "stretch-mark", "تمدد", "smagliature", "nursing comfort", "مشد بطن بعد الولادة", "مشد نفاس"]
  },
  "nail-strengtheners": {
    terms: ["nail", "أظافر", "الأظافر", "للأظافر"],
    without: ["supplement", "مكمل", "capsule", "tablet", "كبسول", "triple active", "derma-life", "food supplement", "snail", "collagen", "كولاجين"]
  },
  "hand-care": {
    terms: ["hand cream", "hand & nail", "hand and nail", "كريم لليدين", "كريم اليدين", "cicaplast mains", "topialyse mains", "repairing hand cream", "hands & stronger", "hand & foot", "mains"],
    without: ["wash", "غسول", "sanitizer", "معقم"]
  },
  "toothpaste": {
    terms: ["toothpaste", "معجون أسنان", "معجون اسنان", "parodontax", "blancheur"]
  },
  "toothbrush": {
    terms: ["toothbrush", "فرشاة أسنان", "فرشة اسنان", "فرشاة اسنان"]
  },
  "mouthwash": {
    terms: ["mouthwash", "غسول الفم", "غسول فم"]
  },
  "breath-strips": {
    terms: ["fresh breath", "شرائط منعشة", "fixative cream", "أطقم الأسنان", "أطقم الاسنان"]
  },
  "energy-activity-vitamins": {
    terms: ["b complex", "b-complex", "b-12", "b12", "vitamin b-1", "carnitine", "co q10", "coq10", "coenzyme", "nad+ 500", "nmn 250", "energy", "الطاقة", "argivit", "stimol", "potenciator", "arginine", "beet root", "shilajit", "spirulina", "mct oil"],
    vitamins: true
  },
  "immunity-vitamins": {
    terms: ["vitamin c", "vita c", "c-1000", "c 1000", "zinc", "زنك", "immun", "المناعة", "selenium", "elderberry", "echinacea"],
    without: ["glow", "eye", "lip", "foam", "booster", "ampoule", "fluid", "suspension", "cleanser", "syndet", "pyrithione", "radiance", "brightening", "c-factor", "intense c", "pure vitamin c10", "liftactiv"],
    vitamins: true
  },
  "skin-beauty-vitamins": {
    terms: ["collagen", "كولاجين", "glutathione", "جلوتاثيون", "super light", "skinage", "pearly caps", "hair, nail & skin", "skin, hair & nails", "triple active", "beauty"],
    without: ["قناع", "pad", "وسادات", "gel", "جل", "joints", "المفاصل", "jointace", "formula", "formulas", "pdrn", "glow", "mist", "of joseon", "bar", "peel", "oil", "زيت"],
    vitamins: true
  },
  "hair-nails-vitamins": {
    terms: ["biotin", "hair vitamins", "hair, nail", "hair boost", "priorin", "perfectil", "derma-life", "aktiv shiny", "anacaps", "ecrinal food supplement", "dht blocker", "triple active"],
    vitamins: true
  },
  "bones-joints-vitamins": {
    terms: ["calcium", "كالسيوم", "vitamin d", "d3", "d-3", "k2", "mk-7", "mk7", "osteo", "bone", "العظام", "joint", "المفاصل", "jointace", "msm", "boron", "kal d3", "glovit-cal", "uni-cal"],
    without: ["orlistat"],
    vitamins: true
  },
  "heart-circulation-vitamins": {
    terms: ["omega", "أوميغا", "fish oil", "co q10", "coq10", "coenzyme", "garlic", "beet root", "arginine", "nattokinase", "dha"],
    without: ["vaseline"],
    vitamins: true
  },
  "focus-memory-vitamins": {
    terms: ["ginkgo", "جنكو", "focus", "memory", "ginplex", "ginkgolie", "magtein", "threonate", "migranol", "dopa mucuna", "gaba"],
    vitamins: true
  },
  "sleep-relaxation-vitamins": {
    terms: ["sleep", "النوم", "melatonin", "gaba", "magnesium glycinate", "magnesium taurate", "magtein", "relax", "الاسترخاء"],
    without: ["night cream", "sleeping", "غطاء عين"],
    vitamins: true
  },
  "mens-vitamins": {
    terms: ["centrum men", "silver men", "prosta", "motility", "speman", "for men", "الرجال", "للرجال", "dhea", "shilajit", "tri-chromium"],
    without: ["rogaine", "rogain", "foam", "after shave", "hair", "شعر", "aminexil"],
    vitamins: true
  },
  "womens-vitamins": {
    terms: ["women", "للنساء", "المرأة", "meno", "metriomed", "fertilimax", "ova-max", "ovatop", "polysitol", "inositol", "evening primrose", "twini", "intimate flora", "royal-plus"],
    without: ["corset", "كورسيه", "dryses", "scrub", "مقشر", "aminexil", "hair", "شعر"],
    vitamins: true
  },
  "pregnancy-vitamins": {
    terms: ["pregna", "prenatal", "materna", "mamacare", "pregnav", "awapreg", "well-pregna", "folic", "للحامل", "breastfeeding"],
    without: ["stretch", "تمدد", "اختبار", "spf", "fulica"],
    vitamins: true
  },
  "kids-vitamins": {
    terms: ["kids", "children", "pediatric", "tumee", "appetite", "chewable", "gummies"],
    without: ["toothbrush", "فرشاة", "toothpaste", "معجون", "bandage", "لاصقات", "patch", "ضماد", "حمالة", "حزام", "calcium plus", "حفاض", "baby", "bebe", "spf", "fotoprotector", "noz", "vinegar", "sleep", "prebiotic", "collagen"],
    vitamins: true
  },
  "seniors-vitamins": {
    terms: ["50+", "silver", "senior", "كبار السن"],
    without: ["spf", "sun"],
    vitamins: true
  },
  "general-supplements": {
    terms: ["multi-vitamin", "multivitamin", "multi vitamin", "multivitamins", "a-z", "a–z", "centrum", "glovit", "vitaplex", "one daily", "max immun", "متعدد الفيتامينات"],
    vitamins: true
  },
  "antioxidants": {
    terms: ["antioxidant", "مضادات الأكسدة", "مضاد للأكسدة", "glutathione", "alpha lipoic", "nac ", "n-acetyl", "curcumin", "turmeric", "spirulina", "selenium", "astablue", "blueberry", "chlorophyll", "milk thistle", "vitamin e", "e-400"],
    without: ["pad", "وسادات", "cleanser", "jelly", "blueseal", "body", "oil 1000"],
    vitamins: true
  },
  "omega-fish-oils": {
    terms: ["omega", "أوميغا", "fish oil", "زيت السمك", "dha"],
    vitamins: true
  },
  "probiotics-digestive": {
    terms: ["probiotic", "بروبيوتيك", "prebiotic", "بريبايوتك", "flora", "digestion", "الهضم", "الجهاز الهضمي", "apple cider", "خل التفاح", "liv.52", "milk thistle"],
    without: ["cleanser", "ampoule", "cica"],
    vitamins: true
  },
  "mineral-deficiency-vitamins": {
    terms: ["iron", "حديد", "الحديد", "ferr", "fero", "fer ", "hema", "haemat", "sideral", "globifer", "magnesium", "مغنيسيوم", "zinc", "زنك", "copper", "kelp"],
    without: ["syndet", "bar", "oil spray", "ture trip", "مسند", "حزام"],
    vitamins: true
  },
  "diabetes-vitamins": {
    terms: ["chromium", "الكروم", "berberine", "diabecon", "alpha lipoic", "sweetener", "تحلية", "glucose support"],
    without: ["test strips", "شرائط"],
    vitamins: true
  },
  "nerve-vitamins": {
    terms: ["b complex", "b-complex", "b-12", "b12", "vitamin b-1", "alpha lipoic", "الأعصاب", "الاعصاب", "neuro"],
    vitamins: true
  },
  "weight-loss": {
    terms: ["orlistat", "أورليستات", "slim", "weight loss", "الوزن", "glucomannan", "apple cider", "خل التفاح", "منحف", "water out", "carnitine"],
    without: ["corset", "كورسيه", "ميزان"],
    vitamins: true
  },
  "glucose-monitors": {
    terms: ["test strips", "شرائط اختبار", "lancets", "إبر وخز", "lancing device", "قلم وخز", "accu-chek", "contour blood", "حافظة باردة للانسولين"]
  },
  "blood-pressure-monitors": {
    terms: ["جهاز ضغط", "كف جهاز ضغط", "blood pressure"]
  },
  "thermometers": {
    terms: ["محرار", "thermometer", "مقياس حرارة", "لصقة خافض حرارة"]
  },
  "support-braces": {
    terms: ["مشد", "مسند", "حزام", "ياخة", "حمالة", "جبيرة", "كورسيه", "جواريب دوالي", "brace", "support belt"],
    without: ["خصية"]
  },
  "catheters": {
    terms: ["كيتر"]
  },
  "first-aid": {
    terms: ["bandage", "باندج", "لاصقات جروح", "لصقة جروح", "plaster", "بلاستر", "لاصق عمليات", "شاش", "قطن رول", "جبسونا", "اسعافات اولية", "first aid", "لاصق كانولا", "سفراتول", "لفاف مطاط", "كريب باندج"],
    without: ["corn plaster", "corn caps"]
  },
  "acne": {
    q: "حب الشباب",
    exclude: [59]
  }
};
