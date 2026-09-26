/* Texts in the three languages. Arabic is written in a neutral form (plural
   "you" / plain nouns) so it reads right for every customer - there is no
   male/female choice anywhere in the app.
   A key missing from "ku" falls back to Arabic, then to the key itself. */
import { KEYS } from "./config.js";

const ar = {
  "brand.name": "صيدلية صبا بغداد",
  "brand.short": "صبا بغداد",
  "brand.tagline": "عنوانكم للصحة والجمال",

  "tab.home": "الرئيسية",
  "tab.categories": "الأقسام",
  "tab.products": "المنتجات",
  "tab.cart": "سلتي",
  "tab.account": "الحساب",

  "search.placeholder": "اكتبوا هنا … وإحنا نساعدكم",
  "search.empty": "ما لگينا شي بهالاسم",
  "search.all": "كل النتائج",

  "concern.label": "ابدأوا من هنا",
  "concern.title": "شنو تحتاجون اليوم؟",
  "concern.sub": "اختاروا الحالة وإحنا ندلكم على المنتجات المناسبة",

  "cats.label": "تصفّح",
  "cats.title": "الأقسام",
  "cats.count": "قسم فرعي",

  "brands.label": "موثوق",
  "brands.title": "ماركات نجيبها",
  "brands.sub": "أصلية ومستوردة",

  "products.label": "مختارات",
  "products.title": "منتجات مميزة",
  "products.range": "عرض التشكيلة",


  "trend.label": "الأكثر طلب",
  "trend.title": "منتجات ترند",
  "trend.sub": "كوري وأصلي، وصلنا هسه",


  "trust.title": "ليش تشترون من صبا بغداد",
  "trust.price": "أحسن سعر بالعراق",
  "trust.priceSub": "نقايس أسعار السوق",
  "trust.original": "منتجات أصلية",
  "trust.originalSub": "مستوردة ومضمونة",
  "trust.guarantee": "صيدلي يجاوبكم",
  "trust.guaranteeSub": "استشارة مجانية قبل الشراء",
  "trust.shipping": "توصيل لكل العراق",
  "trust.shippingSub": "كل المحافظات",

  "contact.label": "إحنا هنا",
  "contact.title": "تواصلوا ويانا",
  "contact.sub": "اسألوا الصيدلي مباشرة بالواتساب",
  "contact.whatsapp": "راسلونا هسه بالواتساب",
  "contact.pick": "شنو تحتاجون؟",
  "contact.msg1": "أريد أسأل عن منتج",
  "contact.msg2": "أريد أطلب منتج معيّن",
  "contact.msg3": "أريد استشارة عن بشرتي",
  "contact.location": "وين الصيدلية",
  "contact.follow": "تابعونا",
  "contact.services": "الخدمات والآراء",
  "contact.about": "من نحن",

  "welcome.pick": "اختيار اللغة",
  "lang.change": "تغيير اللغة",
  close: "إغلاق",
  back: "رجوع",
  loading: "ثانية...",
  empty: "ماكو نتائج",
  err: "صار خلل، جرّبوا مرة ثانية",
  offline: "ماكو اتصال بالإنترنت",
  showAll: "عرض الكل",
  showLess: "عرض أقل",
  loadMore: "عرض المزيد",
  all: "الكل",
  currency: "د.ع",

  "shop.search": "بحث عن منتج أو ماركة...",
  "shop.add": "إضافة للسلة",
  "shop.added": "✓ انضاف",
  "shop.qty": "الكمية",

  "cart.empty": "السلة فارغة",
  "cart.subtotal": "المنتجات",
  "cart.delivery": "التوصيل",
  "cart.total": "الكلي",
  "cart.zone": "التوصيل إلى",
  "zone.baghdad": "بغداد",
  "zone.provinces": "باقي المحافظات",
  "cart.checkout": "إتمام الطلب — الدفع عند الاستلام",
  "cart.name": "الاسم",
  "cart.phone": "رقم الهاتف",
  "cart.phoneHint": "مثال: 07xx xxx xxxx",
  "cart.address": "العنوان",
  "cart.notes": "ملاحظات (اختياري)",
  "cart.sending": "جاري إرسال الطلب...",
  "cart.badPhone": "رقم الهاتف لازم يكون رقم موبايل عراقي، مثل 07701234567",
  "cart.done": "وصلنا طلبكم رقم",
  "cart.doneTotal": "الكلي",
  "cart.doneSub": "رح نتصل بيكم نأكّد التوصيل. الدفع عند الاستلام.",
  "cart.continue": "متابعة التسوق",
  "cart.remove": "حذف",

  "acc.login": "تسجيل الدخول",
  "acc.register": "حساب جديد",
  "acc.email": "الإيميل",
  "acc.password": "كلمة المرور",
  "acc.passwordHint": "٨ أحرف أو أكثر",
  "acc.phone": "رقم الهاتف (اختياري)",
  "acc.enter": "دخول",
  "acc.create": "إنشاء الحساب",
  "acc.toRegister": "ما عندكم حساب؟ إنشاء حساب جديد",
  "acc.toLogin": "عندكم حساب؟ تسجيل الدخول",
  "acc.mine": "حسابي",
  "acc.hello": "أهلاً",
  "acc.logout": "تسجيل الخروج",
  "acc.delete": "حذف الحساب",
  "acc.deleteWarn": "هذا الإجراء يوقف الحساب نهائياً ويمسح البيانات الشخصية. اكتبوا كلمة المرور للتأكيد.",
  "acc.deleteConfirm": "تأكيد حذف الحساب",
  "acc.deleted": "انحذف الحساب.",
  "acc.cancel": "تراجع",
  "acc.sessionOver": "انتهت الجلسة، سجّلوا الدخول مرة ثانية",

  "orders.title": "طلباتي",
  "orders.empty": "لسه ماكو طلبات",
  "orders.signinHint": "سجّلوا الدخول حتى تبين طلباتكم على كل الأجهزة",
  "orders.reorder": "اطلبه مرة ثانية",
  "orders.issue": "عندكم مشكلة بالطلب؟",
  "orders.issueMsg": "مرحبا، عندي استفسار عن طلبي",
  "orders.total": "الكلي",
  "st.new": "وصلنا طلبكم",
  "st.prep": "قيد التجهيز",
  "st.way": "بالطريق",
  "st.done": "تم التسليم",
  "st.cancel": "ملغي",

  "page.about": "من نحن",
  "page.services": "الخدمات والآراء"
};

const en = {
  "brand.name": "Saba Baghdad Pharmacy",
  "brand.short": "Saba Baghdad",
  "brand.tagline": "Your address for health & beauty",
  "tab.home": "Home",
  "tab.categories": "Categories",
  "tab.products": "Products",
  "tab.cart": "Cart",
  "tab.account": "Account",
  "search.placeholder": "Type here… we will help you",
  "search.empty": "No products found",
  "search.all": "See all results",
  "concern.label": "Start here",
  "concern.title": "What do you need today?",
  "concern.sub": "Pick your concern and we'll take you to what treats it",
  "cats.label": "Browse",
  "cats.title": "Categories",
  "cats.count": "subcategories",
  "brands.label": "Trusted",
  "brands.title": "Brands we carry",
  "brands.sub": "Authentic and imported",
  "products.label": "Selected",
  "products.title": "Featured products",
  "products.range": "See the range",
  "trend.label": "Most wanted",
  "trend.title": "Trending products",
  "trend.sub": "Korean and authentic, just arrived",
  "trust.title": "Why buy from Saba Baghdad",
  "trust.price": "Best price in Iraq",
  "trust.priceSub": "We match market prices",
  "trust.original": "Authentic products",
  "trust.originalSub": "Imported and guaranteed",
  "trust.guarantee": "A pharmacist answers",
  "trust.guaranteeSub": "Free advice before you buy",
  "trust.shipping": "Shipping across Iraq",
  "trust.shippingSub": "All provinces",
  "contact.label": "We're here",
  "contact.title": "Contact us",
  "contact.sub": "Ask the pharmacist directly on WhatsApp",
  "contact.whatsapp": "Message us on WhatsApp",
  "contact.pick": "What do you need?",
  "contact.msg1": "I'd like to ask about a product",
  "contact.msg2": "I'd like to order a specific product",
  "contact.msg3": "I'd like advice about my skin",
  "contact.location": "Pharmacy location",
  "contact.follow": "Follow us",
  "contact.services": "Services & reviews",
  "contact.about": "About us",
  "welcome.pick": "Choose your language",
  "lang.change": "Change language",
  close: "Close",
  back: "Back",
  loading: "Loading...",
  empty: "No results",
  err: "Something went wrong, please try again",
  offline: "No internet connection",
  showAll: "Show all",
  showLess: "Show less",
  loadMore: "Show more",
  all: "All",
  currency: "IQD",
  "shop.search": "Search products, brands...",
  "shop.add": "Add to cart",
  "shop.added": "✓ Added",
  "shop.qty": "Quantity",
  "cart.empty": "Your cart is empty",
  "cart.subtotal": "Products",
  "cart.delivery": "Delivery",
  "cart.total": "Total",
  "cart.zone": "Deliver to",
  "zone.baghdad": "Baghdad",
  "zone.provinces": "Other provinces",
  "cart.checkout": "Place order (cash on delivery)",
  "cart.name": "Name",
  "cart.phone": "Phone",
  "cart.phoneHint": "e.g. 07xx xxx xxxx",
  "cart.address": "Address",
  "cart.notes": "Notes (optional)",
  "cart.sending": "Sending...",
  "cart.badPhone": "Please enter an Iraqi mobile number, e.g. 07701234567",
  "cart.done": "Order received",
  "cart.doneTotal": "Total",
  "cart.doneSub": "We'll call you to confirm delivery. Pay on arrival.",
  "cart.continue": "Continue shopping",
  "cart.remove": "Remove",
  "acc.login": "Sign in",
  "acc.register": "New account",
  "acc.email": "Email",
  "acc.password": "Password",
  "acc.passwordHint": "8 characters or more",
  "acc.phone": "Phone (optional)",
  "acc.enter": "Sign in",
  "acc.create": "Create account",
  "acc.toRegister": "No account? Create one",
  "acc.toLogin": "Have an account? Sign in",
  "acc.mine": "My account",
  "acc.hello": "Hello",
  "acc.logout": "Sign out",
  "acc.delete": "Delete my account",
  "acc.deleteWarn": "This permanently closes your account and removes your personal data. Enter your password to confirm.",
  "acc.deleteConfirm": "Confirm deletion",
  "acc.deleted": "Your account has been deleted.",
  "acc.cancel": "Cancel",
  "acc.sessionOver": "Your session ended, please sign in again",
  "orders.title": "My orders",
  "orders.empty": "No orders yet",
  "orders.signinHint": "Sign in to see your orders on every device",
  "orders.reorder": "Order again",
  "orders.issue": "Problem with this order?",
  "orders.issueMsg": "Hello, I have a question about my order",
  "orders.total": "Total",
  "st.new": "Order received",
  "st.prep": "Being prepared",
  "st.way": "On its way",
  "st.done": "Delivered",
  "st.cancel": "Cancelled",
  "page.about": "About us",
  "page.services": "Services & reviews"
};

const ku = {
  "brand.name": "دەرمانخانەی سەبا بەغدا",
  "brand.short": "سەبا بەغدا",
  "brand.tagline": "ناونیشانتان بۆ تەندروستی و جوانی",
  "tab.home": "سەرەکی",
  "tab.categories": "بەشەکان",
  "tab.products": "بەرهەمەکان",
  "tab.cart": "سەبەتە",
  "tab.account": "هەژمار",
  "search.placeholder": "لێرە بنووسە… ئێمە یارمەتیت دەدەین",
  "search.empty": "هیچ بەرهەمێک نەدۆزرایەوە",
  "search.all": "هەموو ئەنجامەکان",
  "concern.label": "لێرە دەست پێبکە",
  "concern.title": "ئەمڕۆ چی پێویستە؟",
  "concern.sub": "کێشەکەت هەڵبژێرە و ئێمە بەرهەمی گونجاوت پێ دەڵێین",
  "cats.label": "بگەڕێ",
  "cats.title": "بەشەکان",
  "cats.count": "بەشی لاوەکی",
  "brands.label": "متمانەپێکراو",
  "brands.title": "براندەکانی ئێمە",
  "brands.sub": "ئەسڵی و هاوردەکراو",
  "products.label": "هەڵبژاردە",
  "products.title": "بەرهەمی تایبەت",
  "trend.label": "زۆرترین داواکاری",
  "trend.title": "بەرهەمە باوەکان",
  "trend.sub": "کۆری و ڕەسەن، تازە گەیشتوون",
  "trust.title": "بۆچی لە سەبا بەغدا بکڕە",
  "trust.price": "باشترین نرخ لە عێراق",
  "trust.priceSub": "نرخی بازاڕ دەگرینەوە",
  "trust.original": "بەرهەمی ئەسڵی",
  "trust.originalSub": "هاوردەکراو و گەرەنتی",
  "trust.guarantee": "دەرمانساز وەڵامت دەداتەوە",
  "trust.guaranteeSub": "ڕاوێژی خۆڕایی پێش کڕین",
  "trust.shipping": "ناردن بۆ هەموو عێراق",
  "trust.shippingSub": "هەموو پارێزگاکان",
  "contact.label": "ئێمە لێرەین",
  "contact.title": "پەیوەندی",
  "contact.sub": "ڕاستەوخۆ لە واتسئاپ پرسیار لە دەرمانساز بکە",
  "contact.whatsapp": "لە واتسئاپ پەیام بنێرە",
  "contact.pick": "چی پێویستە؟",
  "contact.msg1": "دەمەوێت لەسەر بەرهەمێک بپرسم",
  "contact.msg2": "دەمەوێت بەرهەمێکی دیاریکراو داوا بکەم",
  "contact.msg3": "دەمەوێت ڕاوێژ لەسەر پێستم",
  "contact.location": "شوێنی دەرمانخانە",
  "contact.follow": "شوێنمان بکە",
  "contact.services": "خزمەتگوزاری و بۆچوونەکان",
  "contact.about": "دەربارەی ئێمە",
  "welcome.pick": "زمانەکەت هەڵبژێرە",
  close: "داخستن",
  back: "گەڕانەوە",
  showAll: "هەمووی پیشان بدە",
  showLess: "کەمتر پیشان بدە",
  currency: "د.ع"
};

const DICTS = { ar, en, ku };
export const LANGS = [
  { code: "ar", label: "العربية", sub: "اللغة العربية" },
  { code: "en", label: "English", sub: "English" },
  { code: "ku", label: "کوردی", sub: "زمانی کوردی" }
];

let current = readLang() || "ar";

// Some app views and sandboxed frames refuse cookies and storage outright
// (reading them throws) - the app must still start, in Arabic.
function readCookie(name) {
  try {
    const m = document.cookie.match("(?:^|; )" + name.replace(".", "\\.") + "=([^;]*)");
    return m ? decodeURIComponent(m[1]) : null;
  } catch (e) {
    return null;
  }
}

// Stored twice: some WebViews wipe localStorage between launches, the cookie survives.
function readLang() {
  let v = null;
  try { v = localStorage.getItem(KEYS.lang); } catch (e) { /* storage blocked */ }
  if (!v) v = readCookie(KEYS.lang);
  return DICTS[v] ? v : null;
}

let chosenThisVisit = false;
export function langChosen() {
  return chosenThisVisit || readLang() !== null;
}

export function lang() {
  return current;
}

export function isRTL() {
  return current !== "en";
}

export function setLang(code) {
  if (!DICTS[code]) return;
  current = code;
  try { localStorage.setItem(KEYS.lang, code); } catch (e) { /* ignore */ }
  try {
    document.cookie = KEYS.lang + "=" + code + ";path=/;max-age=" + 60 * 60 * 24 * 365 * 5 + ";samesite=lax";
  } catch (e) { /* cookies blocked */ }
  chosenThisVisit = true;
  applyDocumentLang();
}

export function applyDocumentLang() {
  document.documentElement.lang = current;
  document.documentElement.dir = isRTL() ? "rtl" : "ltr";
}

export function t(key) {
  const v = DICTS[current][key] ?? ar[key];
  return v === undefined ? key : v;
}

// For content objects shaped like { ar, en, ku }.
export function pickLang(obj) {
  if (!obj || typeof obj !== "object") return obj || "";
  return obj[current] || obj.ar || "";
}
