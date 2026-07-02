/* ══════════════════════════════════════════════════
   i18n — Simple internationalization system
══════════════════════════════════════════════════ */

export type Locale = 'ar' | 'en'

export const translations = {
  ar: {
    // Navbar
    about: 'عني',
    jobs: 'الوظائف',
    tools: 'الأدوات',
    blog: 'المدونة',
    bookNow: 'احجزي الآن ✨',
    menu: 'القائمة',
    
    // Hero
    tagline: 'تقديم الدعم بالحب',
    title: 'خبيرة المبيعات · مدربة تطوير مهني · مستشارة',
    bio: 'أبني جسور الثقة مع مجتمع المبيعات وأُمكّن المحترفين من تحقيق إمكاناتهم الكاملة — بعلم حقيقي ودعم من القلب.',
    bookConsultation: 'احجزي استشارتك الآن ✨',
    getToKnow: 'تعرّفي علي',
    
    // Stats
    statClients: 'عميل راضٍ',
    statExperience: 'سنوات خبرة',
    statCompanies: 'شركة كبرى',
    statSuccess: 'نسبة النجاح',
    
    // About
    aboutTitle: 'من أنا',
    aboutHeading: 'تعرفي على',
    aboutSubheading: 'لبنى',
    workedWith: 'عملت مع',
    yearsExp: 'سنوات خبرة',
    inSalesField: 'في مجال المبيعات',
    downloadCV: 'تحميل السيرة الذاتية',
    bookConsultationShort: 'احجزي استشارة',
    testimonialsTitle: 'آراء العملاء',
    testimonialsHeading: 'ماذا قالوا عني',
    
    // Booking
    bookingTitle: 'الحجز',
    bookingHeading: 'احجزي',
    bookingSubheading: 'استشارتك',
    bookingDesc: 'جلسة خاصة معك لمساعدتك في تحقيق أهدافك بكل حب',
    personalInfo: 'بياناتك الشخصية',
    fullName: 'الاسم الكامل *',
    whatsapp: 'رقم الواتساب *',
    jobStatus: 'الحالة الوظيفية *',
    message: 'رسالتك المسبقة – أخبريني بما تودين مناقشته *',
    platform: 'المنصة',
    nextStep: 'التالي: اختاري موعدك →',
    prevStep: '← السابق',
    selectDateTime: 'اختاري الموعد المناسب',
    availableSlots: 'المواعيد المتاحة',
    noSlots: 'لا مواعيد متاحة في هذا اليوم',
    confirmBooking: 'تأكيد الحجز ✨',
    booking: 'جاري الحجز...',
    bookingSuccess: 'تم الحجز! 🎉',
    yourAppointment: 'موعدك:',
    at: 'الساعة',
    whatsappConfirm: 'سيتم التواصل معك على الواتساب لتأكيد الموعد',
    bookAnother: 'حجز موعد آخر',
    
    // Jobs
    jobsTitle: 'الوظائف',
    jobsHeading: 'أحدث',
    jobsSubheading: 'الوظائف',
    jobsDesc: 'وظائف مختارة بعناية في مجال المبيعات والتسويق',
    applyNow: 'قدّمي الآن',
    viewAllJobs: 'عرض كل الوظائف',
    
    // Tools
    toolsTitle: 'الأدوات',
    toolsHeading: 'أدوات',
    toolsSubheading: 'المبيعات',
    toolsDesc: 'الأدوات التي أستخدمها وأوصي بها لرفع كفاءتك',
    visitTool: 'زيارة الأداة',
    viewAllTools: 'عرض كل الأدوات',
    
    // Blog
    blogTitle: 'المدونة',
    blogHeading: 'أحدث',
    blogSubheading: 'المقالات',
    blogDesc: 'نصائح وخبرات من قلب تجربتي في عالم المبيعات',
    readMore: 'اقرئي أكثر ←',
    viewAllArticles: 'عرض كل المقالات',
    minRead: 'دقائق',
    
    // Footer
    footerDesc: 'تقديم الدعم بالحب وبناء جسور الثقة مع مجتمع المبيعات. أنا هنا لأساعدك في تحقيق أهدافك.',
    quickLinks: 'روابط سريعة',
    contactMe: 'تواصل معي',
    workDays: 'الاثنين – الخميس',
    workHours: '9 صباحاً – 12 ظهراً',
    whatsappAfterBooking: 'عبر الواتساب بعد الحجز',
    copyright: 'لبنى — جميع الحقوق محفوظة',
    madeWith: 'صُنع بـ 💖 لمجتمع المبيعات',
    
    // Job statuses
    employed: 'موظف',
    unemployed: 'غير موظف',
    freelancer: 'فريلانسر',
    businessOwner: 'صاحب عمل',
    student: 'طالب',
    other: 'أخرى',
    required: 'مطلوب',
  },
  en: {
    // Navbar
    about: 'About',
    jobs: 'Jobs',
    tools: 'Tools',
    blog: 'Blog',
    bookNow: 'Book Now ✨',
    menu: 'Menu',
    
    // Hero
    tagline: 'Supporting with Love',
    title: 'Sales Expert · Professional Development Coach · Consultant',
    bio: 'Building trust bridges with the sales community and empowering professionals to achieve their full potential — with real knowledge and heartfelt support.',
    bookConsultation: 'Book Your Consultation ✨',
    getToKnow: 'Get to Know Me',
    
    // Stats
    statClients: 'Happy Clients',
    statExperience: 'Years Experience',
    statCompanies: 'Major Companies',
    statSuccess: 'Success Rate',
    
    // About
    aboutTitle: 'Who I Am',
    aboutHeading: 'Get to Know',
    aboutSubheading: 'Lobna',
    workedWith: 'Worked With',
    yearsExp: 'Years Experience',
    inSalesField: 'in Sales Field',
    downloadCV: 'Download CV',
    bookConsultationShort: 'Book Consultation',
    testimonialsTitle: 'Client Reviews',
    testimonialsHeading: 'What They Said',
    
    // Booking
    bookingTitle: 'Booking',
    bookingHeading: 'Book Your',
    bookingSubheading: 'Consultation',
    bookingDesc: 'A special session with you to help achieve your goals with love',
    personalInfo: 'Your Personal Information',
    fullName: 'Full Name *',
    whatsapp: 'WhatsApp Number *',
    jobStatus: 'Employment Status *',
    message: 'Your Message – Tell me what you\'d like to discuss *',
    platform: 'Platform',
    nextStep: 'Next: Choose Your Time →',
    prevStep: '← Previous',
    selectDateTime: 'Select a Suitable Time',
    availableSlots: 'Available Slots',
    noSlots: 'No available slots on this day',
    confirmBooking: 'Confirm Booking ✨',
    booking: 'Booking...',
    bookingSuccess: 'Booking Confirmed! 🎉',
    yourAppointment: 'Your appointment:',
    at: 'at',
    whatsappConfirm: 'You will be contacted via WhatsApp to confirm the appointment',
    bookAnother: 'Book Another Appointment',
    
    // Jobs
    jobsTitle: 'Jobs',
    jobsHeading: 'Latest',
    jobsSubheading: 'Opportunities',
    jobsDesc: 'Carefully selected jobs in sales and marketing',
    applyNow: 'Apply Now',
    viewAllJobs: 'View All Jobs',
    
    // Tools
    toolsTitle: 'Tools',
    toolsHeading: 'Sales',
    toolsSubheading: 'Tools',
    toolsDesc: 'Tools I use and recommend to boost your efficiency',
    visitTool: 'Visit Tool',
    viewAllTools: 'View All Tools',
    
    // Blog
    blogTitle: 'Blog',
    blogHeading: 'Latest',
    blogSubheading: 'Articles',
    blogDesc: 'Tips and experiences from my sales journey',
    readMore: 'Read More →',
    viewAllArticles: 'View All Articles',
    minRead: 'min read',
    
    // Footer
    footerDesc: 'Supporting with love and building trust bridges with the sales community. I\'m here to help you achieve your goals.',
    quickLinks: 'Quick Links',
    contactMe: 'Contact Me',
    workDays: 'Monday – Thursday',
    workHours: '9 AM – 12 PM',
    whatsappAfterBooking: 'Via WhatsApp after booking',
    copyright: 'Lobna — All Rights Reserved',
    madeWith: 'Made with 💖 for the sales community',
    
    // Job statuses
    employed: 'Employed',
    unemployed: 'Unemployed',
    freelancer: 'Freelancer',
    businessOwner: 'Business Owner',
    student: 'Student',
    other: 'Other',
    required: 'Required',
  },
} as const

export function getTranslation(locale: Locale, key: keyof typeof translations['ar']): string {
  const translation = translations[locale]?.[key] || translations['ar']?.[key]
  return translation || key
}
