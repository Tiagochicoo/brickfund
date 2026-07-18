export type TranslationDict = {
  meta: { title: string; description: string };
  nav: {
    explore: string; howItWorks: string; forInvestors: string; signIn: string;
    getStarted: string; dashboard: string; signOut: string; toggleMenu: string;
  };
  footer: {
    tagline: string; platform: string; exploreBusinesses: string; raiseCapital: string;
    becomeInvestor: string; company: string; howItWorks: string; signIn: string;
    contact: string; rights: string; crafted: string;
  };
  home: {
    badge: string; heroTitle: string; heroSubtitle: string; exploreOpportunities: string;
    raiseCapital: string; statRaised: string; statBusinesses: string; statInvestors: string;
    statFillRate: string; liveOpportunities: string; featuredTitle: string; viewAll: string;
    typesTitle: string; typesSubtitle: string; howTitle: string; howStep: string;
    step1Title: string; step1Body: string; step2Title: string; step2Body: string;
    step3Title: string; step3Body: string; investorBadge: string; investorTitle: string;
    investorBody: string; startInvesting: string; perkVetted: string; perkVettedBody: string;
    perkReturns: string; perkReturnsBody: string; perkImpact: string; perkImpactBody: string;
    perkFlexible: string; perkFlexibleBody: string; businessBadge: string; businessTitle: string;
    businessBody: string; startRaising: string; perkSimple: string; perkSimpleBody: string;
    perkDirect: string; perkDirectBody: string; perkControl: string; perkControlBody: string;
    ctaTitle: string; ctaBody: string; ctaCreate: string; ctaBrowse: string;
  };
  businesses: {
    title: string; subtitle: string; allCities: string; searchPlaceholder: string;
    emptyTitle: string; emptyBody: string; clearFilters: string;
  };
  businessDetail: {
    backToOpportunities: string; about: string; whatInvestorsGet: string;
    whatInvestorsgetBody1: string; whatInvestorsgetBody2: string; whatInvestorsgetBody3: string;
    raised: string; funded: string; goalOf: string; remaining: string; dealType: string;
    expressInterest: string; expressInterestHint: string; listedBy: string; fundedBadge: string;
  };
  auth: {
    welcomeBack: string; signInSubtitle: string; email: string; password: string;
    forgotPassword: string; invalidCredentials: string; signingIn: string; signIn: string;
    demoAccounts: string; demoBusiness: string; demoInvestor: string; demoPassword: string;
    createAccount: string; registerSubtitle: string; haveAccount: string; noAccount: string;
    createNow: string; roleBusiness: string; roleBusinessSub: string; roleInvestor: string;
    roleInvestorSub: string; yourName: string; fullName: string; businessName: string;
    phone: string; country: string; countryPlaceholder: string; city: string;
    cityPlaceholder: string; cityManualPlaceholder: string; citySelectFirst: string;
    loadingLocations: string; investorType: string; individualInvestor: string;
    investmentFirm: string; fundFamilyOffice: string; firmName: string; firmNameOptional: string;
    minBudget: string; maxBudget: string; accredited: string; location: string;
    passwordMin: string; passwordConfirm: string; passwordRepeat: string;
    passwordMismatch: string; passwordShort: string; createError: string;
    creatingBusiness: string; creatingInvestor: string; createBusinessBtn: string;
    createInvestorBtn: string; termsNotice: string; quote: string; quoteAuthor: string;
    quoteRole: string; resetTitle: string; resetSubtitle: string; sendResetLink: string;
    sending: string; resetSent: string; resetSentBody: string; remembered: string;
    backToSignIn: string; signingOut: string;
  };
  dashboard: {
    businessAccount: string; investorAccount: string; welcome: string;
    businessSubtitle: string; investorSubtitle: string; newListing: string; newListingHint: string;
    accountType: string; company: string; firm: string; location: string; listings: string;
    published: string; budget: string; yourListings: string; recommended: string;
    exploreAll: string; emptyBusinessTitle: string; emptyBusinessBody: string;
    emptyInvestorTitle: string; emptyInvestorBody: string; exploreExamples: string;
    browseOpportunities: string; publishedLabel: string; hiddenLabel: string;
    visibleToInvestors: string; hiddenFromMarketplace: string; saving: string;
    delete: string; deleteTitle: string; deleteWarning: string; deleteConfirmBtn: string;
    deleting: string; cancel: string;
  };
  notFound: { title: string; body: string; backHome: string };
  investmentTypes: {
    seed: string; growth: string; loan: string; equity: string; revenue_share: string;
    convertible_note: string; seedBlurb: string; growthBlurb: string; loanBlurb: string;
    equityBlurb: string; revenue_shareBlurb: string; convertible_noteBlurb: string;
  };
  categories: {
    restaurant: string; barber: string; gym: string; cafe: string; retail: string;
    salon: string; bakery: string; bar: string; other: string;
  };
  misc: { of: string; raised: string; all: string };
  deals: {
    startInvestmentDeal: string; startDeal: string;
    processDescription: string; investmentAmountLabel: string;
    noteToBusinessLabel: string; noteToBusinessPlaceholder: string;
    cancel: string; creating: string; createDeal: string;
  };
};

export const en: TranslationDict = {
  meta: {
    title: "Brickfund — Invest in local businesses",
    description:
      "Brickfund connects brick-and-mortar businesses with investors. Fund a restaurant expansion, a barbershop relocation, or a new gym.",
  },
  nav: {
    explore: "Explore",
    howItWorks: "How it works",
    forInvestors: "For investors",
    signIn: "Sign in",
    getStarted: "Get started",
    dashboard: "Dashboard",
    signOut: "Sign out",
    toggleMenu: "Toggle menu",
  },
  footer: {
    tagline:
      "The marketplace where local, brick-and-mortar businesses meet investors who believe in main street.",
    platform: "Platform",
    exploreBusinesses: "Explore businesses",
    raiseCapital: "Raise capital",
    becomeInvestor: "Become an investor",
    company: "Company",
    howItWorks: "How it works",
    signIn: "Sign in",
    contact: "Contact",
    rights: "All rights reserved.",
    crafted: "Crafted for main street.",
  },
  home: {
    badge: "Main street meets venture capital",
    heroTitle: "Invest in the businesses that build your neighborhood",
    heroSubtitle:
      "Brickfund connects profitable brick-and-mortar businesses with investors — from a restaurant expanding its terrace to a gym opening its doors.",
    exploreOpportunities: "Explore opportunities",
    raiseCapital: "Raise capital",
    statRaised: "Capital raised",
    statBusinesses: "Businesses funded",
    statInvestors: "Active investors",
    statFillRate: "Avg. fill rate",
    liveOpportunities: "Live opportunities",
    featuredTitle: "Featured businesses",
    viewAll: "View all",
    typesTitle: "Every kind of deal, clearly labeled",
    typesSubtitle:
      "Each listing carries an investment-type pill so you always know what you're funding.",
    howTitle: "From pitch to funding in three steps",
    howStep: "How it works",
    step1Title: "Businesses list",
    step1Body:
      "Owners create a listing with their story, numbers, and the type of capital they're raising.",
    step2Title: "Investors connect",
    step2Body:
      "Browse vetted opportunities by category, location, and investment type — then reach out.",
    step3Title: "Capital deployed",
    step3Body:
      "Agree terms and fund the growth. Track milestones and updates from your dashboard.",
    investorBadge: "For investors",
    investorTitle: "Build a portfolio of real, local businesses",
    investorBody:
      "Back businesses you can actually visit. Diversify across loans, equity, and revenue share — with transparent terms and real-world assets behind every deal.",
    startInvesting: "Start investing",
    perkVetted: "Vetted listings",
    perkVettedBody: "Every business is reviewed before going live.",
    perkReturns: "Transparent returns",
    perkReturnsBody: "Clear terms, milestones, and reporting.",
    perkImpact: "Local impact",
    perkImpactBody: "Fund the main street you walk every day.",
    perkFlexible: "Flexible deals",
    perkFlexibleBody: "From seed equity to short-term loans.",
    businessBadge: "For businesses",
    businessTitle: "Raise capital on your terms",
    businessBody:
      "Connect with investors who understand your industry. List your opportunity and get the funding you need to grow — without the banks.",
    startRaising: "Create Your Business",
    perkSimple: "Simple process",
    perkSimpleBody: "Create a listing in minutes, not weeks.",
    perkDirect: "Direct access",
    perkDirectBody: "Connect with investors directly — no middlemen.",
    perkControl: "Keep control",
    perkControlBody: "Set your own terms and keep ownership of your business.",
    ctaTitle: "Ready to grow on main street?",
    ctaBody: "Whether you're raising or investing, your next move starts here.",
    ctaCreate: "Create your account",
    ctaBrowse: "Browse listings",
  },
  businesses: {
    title: "Explore businesses",
    subtitle:
      "Browse live funding opportunities from brick-and-mortar businesses. Filter by the type of investment you're looking for.",
    allCities: "All cities",
    searchPlaceholder: "Search name…",
    emptyTitle: "No opportunities found",
    emptyBody: "Try a different investment type or search term.",
    clearFilters: "Clear filters",
  },
  businessDetail: {
    backToOpportunities: "Back to opportunities",
    about: "About this opportunity",
    whatInvestorsGet: "What investors get",
    whatInvestorsgetBody1: "Direct relationship with the business owner",
    whatInvestorsgetBody2: "Transparent terms documented up front",
    whatInvestorsgetBody3: "Milestone updates from your dashboard",
    raised: "Raised",
    funded: "% funded",
    goalOf: "goal of",
    remaining: "Remaining",
    dealType: "Deal type",
    expressInterest: "Express interest",
    expressInterestHint: "Create a free investor account to connect.",
    listedBy: "Listed by",
    fundedBadge: "Funded",
  },
  auth: {
    welcomeBack: "Welcome back",
    signInSubtitle: "Sign in to your Brickfund account to continue.",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    invalidCredentials: "Invalid email or password. Please try again.",
    signingIn: "Signing in…",
    signIn: "Sign in",
    demoAccounts: "Demo accounts",
    demoBusiness: "Business",
    demoInvestor: "Investor",
    demoPassword: "Password",
    createAccount: "Create your account",
    registerSubtitle:
      "Join Brickfund as a business or an investor — it's free to start.",
    haveAccount: "Already have an account?",
    noAccount: "New here?",
    createNow: "Create an account",
    roleBusiness: "I'm a business",
    roleBusinessSub: "Raise capital",
    roleInvestor: "I'm an investor",
    roleInvestorSub: "Fund businesses",
    yourName: "Your name",
    fullName: "Full name",
    businessName: "Business name",
    phone: "Phone",
    country: "Country",
    countryPlaceholder: "Select a country",
    city: "City",
    cityPlaceholder: "Search for a city…",
    cityManualPlaceholder: "Enter your city",
    citySelectFirst: "Select a country first",
    loadingLocations: "Loading locations…",
    investorType: "Investor type",
    individualInvestor: "Individual investor",
    investmentFirm: "Investment firm",
    fundFamilyOffice: "Fund / family office",
    firmName: "Firm / fund name",
    firmNameOptional: "optional",
    minBudget: "Min budget",
    maxBudget: "Max budget",
    accredited: "I am an accredited / professional investor",
    location: "Location",
    passwordMin: "Min. 10 characters",
    passwordConfirm: "Confirm",
    passwordRepeat: "Repeat password",
    passwordMismatch: "Passwords do not match.",
    passwordShort: "Password must be at least 10 characters.",
    createError: "Could not create your account. Please try again.",
    creatingBusiness: "Creating account…",
    creatingInvestor: "Creating account…",
    createBusinessBtn: "Create business account",
    createInvestorBtn: "Create investor account",
    termsNotice:
      "By continuing you agree to Brickfund's terms and privacy policy.",
    quote:
      "We funded our terrace expansion in three weeks. Brickfund connected us with investors who actually understand hospitality.",
    quoteAuthor: "Maria Silva",
    quoteRole: "Founder, Bella Vista Trattoria",
    resetTitle: "Reset your password",
    resetSubtitle:
      "Enter your email and we'll send you a link to reset your password.",
    sendResetLink: "Send reset link",
    sending: "Sending…",
    resetSent: "Check your inbox",
    resetSentBody:
      "If an account exists for {email}, you'll receive a reset link shortly.",
    remembered: "Remembered it?",
    backToSignIn: "Back to sign in",
    signingOut: "Signing you out…",
  },
  dashboard: {
    businessAccount: "Business account",
    investorAccount: "Investor account",
    welcome: "Welcome back, {name}",
    businessSubtitle: "Manage your listings — toggle visibility or remove them anytime.",
    investorSubtitle: "Discover opportunities and track your portfolio.",
    newListing: "New listing",
    newListingHint: "Listing creation coming soon",
    accountType: "Account type",
    company: "Company",
    firm: "Firm",
    location: "Location",
    listings: "Listings",
    published: "Published",
    budget: "Budget",
    yourListings: "Your listings",
    recommended: "Recommended for you",
    exploreAll: "Explore all",
    emptyBusinessTitle: "No listings yet",
    emptyBusinessBody: "Create your first listing to start raising capital.",
    emptyInvestorTitle: "No recommendations yet",
    emptyInvestorBody: "Browse the marketplace to find your first opportunity.",
    exploreExamples: "Explore examples",
    browseOpportunities: "Browse opportunities",
    publishedLabel: "Published",
    hiddenLabel: "Hidden",
    visibleToInvestors: "Visible to investors",
    hiddenFromMarketplace: "Hidden from marketplace",
    saving: "Saving…",
    delete: "Delete",
    deleteTitle: "Delete listing?",
    deleteWarning: "This action cannot be undone.",
    deleteConfirmBtn: "Delete",
    deleting: "Deleting…",
    cancel: "Cancel",
  },
  notFound: {
    title: "Page not found",
    body: "The page or listing you're looking for doesn't exist.",
    backHome: "Back home",
  },
  investmentTypes: {
    seed: "Seed",
    growth: "Growth",
    loan: "Loan",
    equity: "Equity",
    revenue_share: "Revenue Share",
    convertible_note: "Convertible Note",
    seedBlurb: "Early-stage capital to launch.",
    growthBlurb: "Funds to expand an existing business.",
    loanBlurb: "Debt financing repaid over time.",
    equityBlurb: "Ownership stake in exchange for capital.",
    revenue_shareBlurb: "Investors earn a % of monthly revenue.",
    convertible_noteBlurb: "Debt that converts to equity later.",
  },
  categories: {
    restaurant: "Restaurant",
    barber: "Barbershop",
    gym: "Gym & Fitness",
    cafe: "Café",
    retail: "Retail",
    salon: "Salon",
    bakery: "Bakery",
    bar: "Bar",
    other: "Other",
  },
  misc: {
    of: "of",
    raised: "raised",
    all: "All",
  },
  deals: {
    startInvestmentDeal: "Start an investment deal",
    startDeal: "Start a deal",
    processDescription: "You'll move through LOI → APA → escrow → handover. We'll suggest {amount}.",
    investmentAmountLabel: "Investment amount (USD)",
    noteToBusinessLabel: "Note to business (optional)",
    noteToBusinessPlaceholder: "A short intro, your investment thesis, conditions…",
    cancel: "Cancel",
    creating: "Creating…",
    createDeal: "Create deal",
  },
};
