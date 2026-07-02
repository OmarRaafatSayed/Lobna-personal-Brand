export const COLORS = {
  rose: '#FD93C3',
  white: '#FBF9F7',
  green: '#B2BA0C',
  blue: '#8EB5D2',
}

/* ─── These are locale-aware via useLanguage t() in components ─── */

export const JOB_STATUS_LABELS_AR: Record<string, string> = {
  employed:       'موظف',
  unemployed:     'غير موظف',
  freelancer:     'فريلانسر',
  business_owner: 'صاحب عمل',
  student:        'طالب',
  other:          'أخرى',
}

export const JOB_STATUS_LABELS_EN: Record<string, string> = {
  employed:       'Employed',
  unemployed:     'Unemployed',
  freelancer:     'Freelancer',
  business_owner: 'Business Owner',
  student:        'Student',
  other:          'Other',
}

export const JOB_TYPE_LABELS_AR: Record<string, string> = {
  full_time:  'دوام كامل',
  part_time:  'دوام جزئي',
  remote:     'عن بُعد',
  freelance:  'فريلانس',
  internship: 'تدريب',
}

export const JOB_TYPE_LABELS_EN: Record<string, string> = {
  full_time:  'Full Time',
  part_time:  'Part Time',
  remote:     'Remote',
  freelance:  'Freelance',
  internship: 'Internship',
}

/* Default export for backward compat — EN */
export const JOB_TYPE_LABELS = JOB_TYPE_LABELS_EN

export const DAY_NAMES_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
export const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/* Default export for backward compat — kept for BookingSection */
export const DAY_NAMES = DAY_NAMES_EN

export const PLATFORM_LABELS: Record<string, string> = {
  google_meet: 'Google Meet',
  zoom:        'Zoom',
}

export const BOOKING_STATUS_LABELS_AR: Record<string, string> = {
  pending:   'في الانتظار',
  confirmed: 'مؤكد',
  cancelled: 'ملغي',
  completed: 'مكتمل',
}

export const BOOKING_STATUS_LABELS_EN: Record<string, string> = {
  pending:   'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

export const BOOKING_STATUS_LABELS = BOOKING_STATUS_LABELS_EN

export const TOOL_CATEGORY_LABELS_AR: Record<string, string> = {
  crm:           'إدارة العملاء (CRM)',
  communication: 'التواصل',
  analytics:     'التحليلات',
  productivity:  'الإنتاجية',
  social:        'التواصل الاجتماعي',
  other:         'أخرى',
}

export const TOOL_CATEGORY_LABELS_EN: Record<string, string> = {
  crm:           'CRM',
  communication: 'Communication',
  analytics:     'Analytics',
  productivity:  'Productivity',
  social:        'Social Media',
  other:         'Other',
}

export const TOOL_CATEGORY_LABELS = TOOL_CATEGORY_LABELS_EN
