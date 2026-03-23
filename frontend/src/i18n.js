import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      browseServices: 'Browse Services',
      myBookings: 'My Bookings',
      totalBookings: 'Total Bookings',
      completed: 'Completed',
      pending: 'Pending',
      reviewsGiven: 'Reviews Given',
      availableServices: 'Available Services',
      recentBookings: 'Recent Bookings',
      viewAll: 'View all',
      logout: 'Logout',
      goodMorning: 'Good Morning',
      goodAfternoon: 'Good Afternoon',
      goodEvening: 'Good Evening',
      overview: "Here's an overview of your home services activity.",
      noBookingsYet: 'No bookings yet',
      bookAService: 'Book a Service',
      customer: 'Customer',
      provider: 'Service Provider',
      admin: 'Admin',
      settings: 'Settings',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      welcomeMessage: 'Welcome to GharSewa! Find the best professionals.'
    }
  },
  hi: {
    translation: {
      dashboard: 'डैशबोर्ड',
      browseServices: 'सेवाएं खोजें',
      myBookings: 'मेरी बुकिंग',
      totalBookings: 'कुल बुकिंग',
      completed: 'पूरा हुआ',
      pending: 'लंबित',
      reviewsGiven: 'दिए गए रिव्यू',
      availableServices: 'उपलब्ध सेवाएं',
      recentBookings: 'हाल की बुकिंग',
      viewAll: 'सभी देखें',
      logout: 'लॉग आउट',
      goodMorning: 'सुप्रभात',
      goodAfternoon: 'शुभ दोपहर',
      goodEvening: 'शुभ संध्या',
      overview: 'यहां आपकी होम सर्विस गतिविधि का अवलोकन है।',
      noBookingsYet: 'अभी तक कोई बुकिंग नहीं',
      bookAService: 'सर्विस बुक करें',
      customer: 'ग्राहक',
      provider: 'सेवा प्रदाता',
      admin: 'एडमिन',
      settings: 'सेटिंग्स',
      language: 'भाषा',
      theme: 'थीम',
      light: 'लाइट',
      dark: 'डार्क'
    }
  },
  bn: {
    translation: {
      dashboard: 'ড্যাশবোর্ড',
      browseServices: 'পরিষেবা খুঁজুন',
      myBookings: 'আমার বুকিং',
      totalBookings: 'মোট বুকিং',
      completed: 'সম্পন্ন',
      pending: 'অপেক্ষমান',
      reviewsGiven: 'দেওয়া রিভিউ',
      availableServices: 'উপলব্ধ পরিষেবা',
      recentBookings: 'সাম্প্রতিক বুকিং',
      viewAll: 'সব দেখুন',
      logout: 'লগ আউট',
      goodMorning: 'সুপ্রভাত',
      goodAfternoon: 'শুভ বিকাল',
      goodEvening: 'শুভ সন্ধ্যা',
      overview: 'এখানে আপনার হোম সার্ভিস কার্যকলাপের একটি ওভারভিউ রয়েছে।',
      noBookingsYet: 'এখনও কোনো বুকিং নেই',
      bookAService: 'একটি পরিষেবা বুক করুন',
      customer: 'গ্রাহক',
      provider: 'পরিষেবা প্রদানকারী',
      admin: 'অ্যাডমিন',
      settings: 'সেটিংস',
      language: 'ভাষা',
      theme: 'থিম',
      light: 'হালকা',
      dark: 'গাঢ়'
    }
  },
  ta: {
    translation: {
      dashboard: 'முகப்பு',
      browseServices: 'சேவைகளை உலாவுக',
      myBookings: 'எனது முன்பதிவுகள்',
      totalBookings: 'மொத்த முன்பதிவுகள்',
      completed: 'முடிந்தது',
      pending: 'நிலுவையில்',
      reviewsGiven: 'வழங்கப்பட்ட விமர்சனங்கள்',
      availableServices: 'கிடைக்கும் சேவைகள்',
      recentBookings: 'சமீபத்திய முன்பதிவுகள்',
      viewAll: 'அனைத்தையும் காண்க',
      logout: 'வெளியேறு',
      goodMorning: 'காலை வணக்கம்',
      goodAfternoon: 'மதிய வணக்கம்',
      goodEvening: 'மாலை வணக்கம்',
      overview: 'உங்கள் வீட்டுச் சேவை செயல்பாட்டின் கண்ணோட்டம் இங்கே.',
      noBookingsYet: 'இதுவரை முன்பதிவுகள் இல்லை',
      bookAService: 'சேவையை முன்பதிவு செய்யவும்',
      customer: 'வாடிக்கையாளர்',
      provider: 'சேவை வழங்குநர்',
      admin: 'நிர்வாகி',
      settings: 'அமைப்புகள்',
      language: 'மொழி',
      theme: 'தீம்',
      light: 'ஒளி',
      dark: 'இருள்'
    }
  },
  gu: {
    translation: {
      dashboard: 'ડેશબોર્ડ',
      browseServices: 'સેવાઓ બ્રાઉઝ કરો',
      myBookings: 'મારી બુકિંગ્સ',
      totalBookings: 'કુલ બુકિંગ્સ',
      completed: 'પૂર્ણ',
      pending: 'બાકી',
      reviewsGiven: 'આપેલ સમીક્ષાઓ',
      availableServices: 'ઉપલબ્ધ સેવાઓ',
      recentBookings: 'તાજેતરના બુકિંગ્સ',
      viewAll: 'બધા જુઓ',
      logout: 'લૉગઆઉટ',
      goodMorning: 'સુપ્રભાત',
      goodAfternoon: 'શુભ બપોર',
      goodEvening: 'શુભ સાંજ',
      overview: 'અહીં તમારી હોમ સર્વિસ એક્ટિવિટીની ઝાંખી છે.',
      noBookingsYet: 'હજી સુધી કોઈ બુકિંગ નથી',
      bookAService: 'સેવા બુક કરો',
      customer: 'ગ્રાહક',
      provider: 'સેવા પ્રદાતા',
      admin: 'એડમિન',
      settings: 'સેટિંગ્સ',
      language: 'ભાષા',
      theme: 'થીમ',
      light: 'પ્રકાશ',
      dark: 'શ્યામ'
    }
  },
  mr: {
    translation: {
      dashboard: 'डॅशबोर्ड',
      browseServices: 'सेवा शोधा',
      myBookings: 'माझे बुकिंग',
      totalBookings: 'एकूण बुकिंग',
      completed: 'पूर्ण',
      pending: 'प्रलंबित',
      reviewsGiven: 'दिलेले पुनरावलोकन',
      availableServices: 'उपलब्ध सेवा',
      recentBookings: 'अलीकडील बुकिंग',
      viewAll: 'सर्व पहा',
      logout: 'लॉगआउट',
      goodMorning: 'शुभ सकाळ',
      goodAfternoon: 'शुभ दुपार',
      goodEvening: 'शुभ संध्याकाळ',
      overview: 'येथे तुमच्या गृह सेवा क्रियाकलापाचे विहंगावलोकन आहे.',
      noBookingsYet: 'अद्याप कोणतीही बुकिंग नाही',
      bookAService: 'सेवा बुक करा',
      customer: 'ग्राहक',
      provider: 'सेवा प्रदाता',
      admin: 'प्रशासक',
      settings: 'सेटिंग्ज',
      language: 'भाषा',
      theme: 'थीम',
      light: 'प्रकाश',
      dark: 'गडद'
    }
  },
  te: {
    translation: {
      dashboard: 'డాష్‌బోర్డ్',
      browseServices: 'సేవలను బ్రౌజ్ చేయండి',
      myBookings: 'నా బుకింగ్‌లు',
      totalBookings: 'మొత్తం బుకింగ్‌లు',
      completed: 'పూర్తయింది',
      pending: 'పెండింగ్‌లో ఉంది',
      reviewsGiven: 'ఇచ్చిన సమీక్షలు',
      availableServices: 'అందుబాటులో ఉన్న సేవలు',
      recentBookings: 'ఇటీవలి బుకింగ్‌లు',
      viewAll: 'అన్నింటినీ వీక్షించండి',
      logout: 'లాగౌట్',
      goodMorning: 'శుభోదయం',
      goodAfternoon: 'శుభ మధ్యాహ్నం',
      goodEvening: 'శుభ సాయంత్రం',
      overview: 'మీ హోమ్ సర్వీస్ కార్యాచరణ యొక్క అవలోకనం ఇక్కడ ఉంది.',
      noBookingsYet: 'ఇంకా బుకింగ్‌లు లేవు',
      bookAService: 'సేవను బుక్ చేయండి',
      customer: 'కస్టమర్',
      provider: 'సేవా ప్రదాత',
      admin: 'అడ్మిన్',
      settings: 'సెట్టింగ్‌లు',
      language: 'భాష',
      theme: 'థీమ్',
      light: 'లైట్',
      dark: 'డార్క్'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('app_lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
