// Comprehensive mock data for AayStyle SaaS platform

export const INITIAL_BUSINESS_PROFILE = {
  name: "Apex Digital Solutions",
  type: "Agency / B2B Services",
  industry: "Marketing & Technology",
  website: "https://apexdigital.example.com",
  phone: "+1 (800) 555-0199",
  email: "support@apexdigital.example.com",
  address: "750 Innovation Way, Suite 400",
  city: "Austin",
  state: "TX",
  country: "United States",
  timezone: "Central Time (US & Canada) - GMT-6",
  description: "Premier AI-powered digital growth agency helping enterprise B2B brands scale revenue and automate customer inquiries 24/7.",
  businessHours: "Monday - Friday: 8:00 AM - 6:00 PM CST\nSaturday: 9:00 AM - 2:00 PM CST\nSunday: Closed",
  services: [
    "AI Customer Support Automation",
    "Omnichannel Lead Generation",
    "Smart Call Receptionist & Booking",
    "Custom CRM & Workflow Integration"
  ],
  offers: [
    "Free 14-Day AI Automation Audit",
    "20% Off Annual Enterprise Plans",
    "Complimentary Knowledge Base Setup"
  ],
  policies: "30-day money-back guarantee on all service tiers. 99.9% uptime SLA for enterprise clients."
};

export const INITIAL_LEADS_MARKETPLACE = [
  {
    id: "lead-101",
    name: "Nexus Solar Tech",
    industry: "Renewable Energy",
    type: "Enterprise",
    country: "United States",
    state: "California",
    city: "San Francisco",
    address: "100 Green Tech Blvd",
    email: "contact@nexussolar.example.com",
    phone: "+1 (415) 555-8921",
    website: "https://nexussolar.example.com",
    source: "Google Business Profile",
    score: 94,
    status: "Verified",
    addedToMaster: false
  },
  {
    id: "lead-102",
    name: "Vanguard Health Clinic",
    industry: "Healthcare",
    type: "Medical Practice",
    country: "United States",
    state: "Texas",
    city: "Dallas",
    address: "450 Medical Parkway",
    email: "info@vanguardhealth.example.com",
    phone: "+1 (214) 555-3410",
    website: "https://vanguardhealth.example.com",
    source: "Instagram & Facebook",
    score: 88,
    status: "Verified",
    addedToMaster: true
  },
  {
    id: "lead-103",
    name: "BlueSky Logistics",
    industry: "Transportation",
    type: "B2B Logistics",
    country: "United States",
    state: "Illinois",
    city: "Chicago",
    address: "88 Cargo Terminal Way",
    email: "dispatch@blueskylogistics.example.com",
    phone: "+1 (312) 555-7788",
    website: "https://blueskylogistics.example.com",
    source: "Google Business Profile",
    score: 91,
    status: "Verified",
    addedToMaster: false
  },
  {
    id: "lead-104",
    name: "Summit Real Estate Group",
    industry: "Real Estate",
    type: "Brokerage",
    country: "United States",
    state: "Florida",
    city: "Miami",
    address: "1200 Ocean Drive Suite 90",
    email: "sales@summitrealty.example.com",
    phone: "+1 (305) 555-9011",
    website: "https://summitrealty.example.com",
    source: "Instagram",
    score: 96,
    status: "Verified",
    addedToMaster: true
  },
  {
    id: "lead-105",
    name: "Nova Financial Partners",
    industry: "Finance & Banking",
    type: "Advisory Firm",
    country: "United States",
    state: "New York",
    city: "New York",
    address: "55 Wall Street 14th Fl",
    email: "advisors@novafast.example.com",
    phone: "+1 (212) 555-4422",
    website: "https://novafast.example.com",
    source: "Facebook",
    score: 89,
    status: "Verified",
    addedToMaster: false
  },
  {
    id: "lead-106",
    name: "Quantum Dental Care",
    industry: "Healthcare",
    type: "Dental Practice",
    country: "United States",
    state: "Washington",
    city: "Seattle",
    address: "320 Pine Street",
    email: "reception@quantumdental.example.com",
    phone: "+1 (206) 555-1200",
    website: "https://quantumdental.example.com",
    source: "Google & Instagram",
    score: 85,
    status: "Verified",
    addedToMaster: false
  },
  {
    id: "lead-107",
    name: "Velocity Auto Motors",
    industry: "Automotive",
    type: "Dealership",
    country: "United States",
    state: "Georgia",
    city: "Atlanta",
    address: "990 Peachtree Rd",
    email: "vip@velocityauto.example.com",
    phone: "+1 (404) 555-6677",
    website: "https://velocityauto.example.com",
    source: "Facebook",
    score: 82,
    status: "Verified",
    addedToMaster: false
  },
  {
    id: "lead-108",
    name: "Zenith Architecture Lab",
    industry: "Construction & Design",
    type: "Architecture",
    country: "United States",
    state: "Colorado",
    city: "Denver",
    address: "140 Mile High Way",
    email: "projects@zenitharch.example.com",
    phone: "+1 (303) 555-8833",
    website: "https://zenitharch.example.com",
    source: "Google Business Profile",
    score: 93,
    status: "Verified",
    addedToMaster: true
  }
];

export const INITIAL_MASTER_LEADS = [
  {
    id: "mlead-1",
    name: "Vanguard Health Clinic",
    contactPerson: "Dr. Robert Chen",
    industry: "Healthcare",
    location: "Dallas, TX",
    email: "info@vanguardhealth.example.com",
    phone: "+1 (214) 555-3410",
    status: "Contacted",
    campaign: "Q3 Healthcare Outreach",
    lastContact: "2026-08-16",
    notes: "Interested in AI receptionist to manage after-hours patient appointments.",
    tags: ["High Priority", "Medical", "Interested"],
    score: 88
  },
  {
    id: "mlead-2",
    name: "Summit Real Estate Group",
    contactPerson: "Amanda Sterling",
    industry: "Real Estate",
    location: "Miami, FL",
    email: "sales@summitrealty.example.com",
    phone: "+1 (305) 555-9011",
    status: "Qualified",
    campaign: "Real Estate Lead Boost",
    lastContact: "2026-08-17",
    notes: "Requested a demo of the website chat widget with CRM sync.",
    tags: ["Hot Lead", "Real Estate", "Demo Scheduled"],
    score: 96
  },
  {
    id: "mlead-3",
    name: "Zenith Architecture Lab",
    contactPerson: "Marcus Vance",
    industry: "Construction & Design",
    location: "Denver, CO",
    email: "projects@zenitharch.example.com",
    phone: "+1 (303) 555-8833",
    status: "New",
    campaign: "Unassigned",
    lastContact: "2026-08-14",
    notes: "Imported from marketplace. Ready for initial email sequence.",
    tags: ["New", "Architecture"],
    score: 93
  },
  {
    id: "mlead-4",
    name: "Starlight Hospitality Group",
    contactPerson: "Elena Rostova",
    industry: "Hospitality",
    location: "Las Vegas, NV",
    email: "reservations@starlightnv.example.com",
    phone: "+1 (702) 555-0900",
    status: "Closed Won",
    campaign: "Hospitality AI Booking",
    lastContact: "2026-08-12",
    notes: "Signed Premium Annual plan. AI Receptionist active.",
    tags: ["Customer", "Enterprise"],
    score: 99
  }
];

export const INITIAL_CAMPAIGNS = [
  {
    id: "camp-1",
    name: "Q3 Healthcare AI Outreach",
    status: "Active",
    leadsCount: 140,
    sent: 140,
    opened: 98,
    replies: 24,
    created: "2026-08-01",
    subject: "Automate patient bookings at {{business_name}} with AI",
    templateBody: "Hi {{first_name}},\n\nWe noticed {{business_name}} in {{city}} is expanding patient care hours. Our AI Receptionist can field patient calls, schedule appointments, and sync directly with your system 24/7.\n\nWould you be open to a 5-minute preview this week?\n\nBest regards,\nApex Digital Team"
  },
  {
    id: "camp-2",
    name: "Real Estate Lead Boost 2026",
    status: "Active",
    leadsCount: 210,
    sent: 210,
    opened: 155,
    replies: 42,
    created: "2026-08-05",
    subject: "Never miss a home buyer query in {{city}}",
    templateBody: "Hello {{first_name}},\n\nBuyers looking for properties in {{city}} expect instant answers. With AayStyle's Chat Widget, {{business_name}} can capture qualified home buyers automatically.\n\nLet's chat!"
  },
  {
    id: "camp-3",
    name: "Solar & Green Energy Automation",
    status: "Scheduled",
    leadsCount: 85,
    sent: 0,
    opened: 0,
    replies: 0,
    created: "2026-08-15",
    subject: "Streamline solar consultations for {{business_name}}",
    templateBody: "Hi {{first_name}},\n\nAutomate your solar quote questionnaires with AI..."
  },
  {
    id: "camp-4",
    name: "B2B Logistics Follow-up",
    status: "Draft",
    leadsCount: 50,
    sent: 0,
    opened: 0,
    replies: 0,
    created: "2026-08-17",
    subject: "Freight inquiries automated for {{business_name}}",
    templateBody: "Dear {{first_name}},\n\n..."
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: "apt-1",
    customer: "Dr. Robert Chen",
    email: "info@vanguardhealth.example.com",
    phone: "+1 (214) 555-3410",
    service: "AI Receptionist Demo & Workflow Consultation",
    date: "2026-08-20",
    time: "10:30 AM",
    status: "Upcoming",
    notes: "Wants to verify HIPAA compliance and voice call escalation settings."
  },
  {
    id: "apt-2",
    customer: "Amanda Sterling",
    email: "sales@summitrealty.example.com",
    phone: "+1 (305) 555-9011",
    service: "Website Chat Widget Live Setup",
    date: "2026-08-21",
    time: "02:00 PM",
    status: "Upcoming",
    notes: "Needs custom widget primary color matching Miami realty branding."
  },
  {
    id: "apt-3",
    customer: "Jason Miller",
    email: "jason@nexussolar.example.com",
    phone: "+1 (415) 555-8921",
    service: "Enterprise Lead Generation Onboarding",
    date: "2026-08-14",
    time: "11:00 AM",
    status: "Past",
    notes: "Successfully completed onboarding. Account active."
  },
  {
    id: "apt-4",
    customer: "Karen Vance",
    email: "karen@vancemotors.example.com",
    phone: "+1 (404) 555-1122",
    service: "Initial Discovery Call",
    date: "2026-08-10",
    time: "04:00 PM",
    status: "Cancelled",
    notes: "Rescheduled by customer due to internal meeting overlap."
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: "conv-1",
    leadName: "Amanda Sterling (Summit Real Estate)",
    channel: "Chat",
    channelIcon: "MessageSquare",
    avatar: "AS",
    lastMsg: "Can the AI widget schedule home tours directly into Google Calendar?",
    timestamp: "10 mins ago",
    unread: true,
    history: [
      { sender: "user", text: "Hi, I'm checking out your Chat Widget for my real estate office.", time: "10:15 AM" },
      { sender: "ai", text: "Hello Amanda! Thanks for reaching out. Yes, AayStyle connects seamlessly with your calendar and CRM to capture lead details and book viewings 24/7.", time: "10:15 AM" },
      { sender: "user", text: "Can the AI widget schedule home tours directly into Google Calendar?", time: "10:20 AM" }
    ]
  },
  {
    id: "conv-2",
    leadName: "Dr. Robert Chen (Vanguard Health)",
    channel: "Voice",
    channelIcon: "PhoneCall",
    avatar: "RC",
    lastMsg: "Live Web Voice Call: Patient inquiry regarding weekend clinic hours.",
    timestamp: "1 hour ago",
    unread: false,
    history: [
      { sender: "ai", text: "[Web Voice Call] Thank you for connecting with Vanguard Health. How can I assist your appointment today?", time: "09:00 AM" },
      { sender: "user", text: "I need to confirm if Dr. Chen has openings this Thursday.", time: "09:01 AM" },
      { sender: "ai", text: "Dr. Chen has openings at 10:30 AM and 3:00 PM Thursday. Would you like me to reserve the 10:30 AM slot?", time: "09:01 AM" },
      { sender: "user", text: "Yes please, book 10:30 AM under Robert Chen.", time: "09:02 AM" }
    ]
  },
  {
    id: "conv-3",
    leadName: "Marcus Vance (Zenith Architecture)",
    channel: "Email",
    channelIcon: "Mail",
    avatar: "MV",
    lastMsg: "Re: Streamline architecture consultations with AayStyle",
    timestamp: "3 hours ago",
    unread: false,
    history: [
      { sender: "ai", text: "Sent email campaign: 'Streamline architecture consultations for Zenith Architecture'", time: "Yesterday" },
      { sender: "user", text: "Received your email. Send over pricing options for 5 team seats.", time: "08:14 AM" }
    ]
  },
  {
    id: "conv-4",
    leadName: "Elena Rostova (Starlight Hotels)",
    channel: "Instagram",
    channelIcon: "Instagram",
    avatar: "ER",
    lastMsg: "Instagram DM: Thanks! The Instagram bot auto-replied to our guests instantly.",
    timestamp: "1 day ago",
    unread: false,
    history: [
      { sender: "user", text: "Hi! Do you have suite packages available for wedding guests?", time: "Aug 16" },
      { sender: "ai", text: "Hello Elena! Yes, Starlight Hotels offers 15% off group suite bookings for wedding parties. Would you like me to email the brochure?", time: "Aug 16" },
      { sender: "user", text: "Thanks! The Instagram bot auto-replied to our guests instantly.", time: "Aug 16" }
    ]
  },
  {
    id: "conv-5",
    leadName: "Carlos Mendez (Horizon Contracting)",
    channel: "WhatsApp",
    channelIcon: "MessageCircle",
    avatar: "CM",
    lastMsg: "WhatsApp: Can I get an automated estimate for a commercial roofing repair?",
    timestamp: "2 hours ago",
    unread: true,
    history: [
      { sender: "user", text: "Hi, I saw your ad for AI commercial estimate follow-ups on WhatsApp.", time: "11:30 AM" },
      { sender: "ai", text: "Welcome Carlos! I can calculate a preliminary estimate or schedule an on-site inspection. What is the approximate square footage?", time: "11:31 AM" },
      { sender: "user", text: "Can I get an automated estimate for a commercial roofing repair?", time: "11:35 AM" }
    ]
  },
  {
    id: "conv-6",
    leadName: "Sarah Jenkins (Apex Legal Advisory)",
    channel: "Facebook",
    channelIcon: "Facebook",
    avatar: "SJ",
    lastMsg: "Facebook Messenger: What are your retainer consultation rates?",
    timestamp: "5 hours ago",
    unread: false,
    history: [
      { sender: "user", text: "Hello! Inquiry regarding legal advisory automation.", time: "07:45 AM" },
      { sender: "ai", text: "Hello Sarah! Apex Legal Advisory offers 30-minute initial consultations. Our AI assistant can capture intake details before your call.", time: "07:46 AM" },
      { sender: "user", text: "What are your retainer consultation rates?", time: "07:50 AM" }
    ]
  },
  {
    id: "conv-7",
    leadName: "David Miller (NextGen Tech Labs)",
    channel: "LinkedIn",
    channelIcon: "Linkedin",
    avatar: "DM",
    lastMsg: "LinkedIn DM: Interested in partnering for enterprise B2B lead scraping.",
    timestamp: "Yesterday",
    unread: false,
    history: [
      { sender: "user", text: "Saw your LinkedIn post about 50 daily verified lead credits.", time: "Aug 17" },
      { sender: "ai", text: "Hi David! Thanks for connecting. AayStyle provides instant B2B lead scraping with verified email & phone lookup.", time: "Aug 17" }
    ]
  }
];

export const INITIAL_ANALYTICS = {
  dateRanges: ["Today", "7 Days", "30 Days", "90 Days"],
  selectedRange: "30 Days",
  stats: {
    totalLeads: 1240,
    emailsSent: 4890,
    emailsOpened: 3420,
    emailsReplied: 612,
    replyRate: "12.5%",
    appointments: 148,
    conversionRate: "4.8%",
    chatConversations: 890,
    aiConversations: 760,
    callsHandled: 412
  },
  leadGrowthData: [
    { day: "Aug 1", leads: 12 },
    { day: "Aug 4", leads: 24 },
    { day: "Aug 8", leads: 48 },
    { day: "Aug 12", leads: 65 },
    { day: "Aug 15", leads: 92 },
    { day: "Aug 18", leads: 124 }
  ],
  campaignPerformance: [
    { name: "Healthcare Q3", sent: 1400, open: 980, click: 320, reply: 140 },
    { name: "Real Estate Boost", sent: 2100, open: 1550, click: 510, reply: 210 },
    { name: "Solar Consults", sent: 850, open: 590, click: 190, reply: 85 },
    { name: "Logistics B2B", sent: 540, open: 300, click: 95, reply: 42 }
  ]
};

export const INITIAL_ADMIN_DATA = {
  activeUsers: 342,
  totalBusinesses: 128,
  activeSubscriptions: 119,
  monthlyRecurringRevenue: "$48,900",
  systemStatus: "Operational (99.98% Uptime)",
  usersList: [
    { id: "usr-1", name: "Sarah Connor", business: "Apex Digital", plan: "Premium", status: "Active", joined: "2026-01-15" },
    { id: "usr-2", name: "Dr. Robert Chen", business: "Vanguard Health", plan: "Standard", status: "Active", joined: "2026-03-22" },
    { id: "usr-3", name: "Amanda Sterling", business: "Summit Realty", plan: "Premium", status: "Active", joined: "2026-05-10" },
    { id: "usr-4", name: "David Kim", business: "Nexus Solar", plan: "Basic", status: "Trial", joined: "2026-08-01" }
  ]
};
