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

export const sv: TranslationDict = {
  meta: {
    title: "Brickfund — Investera i lokala företag",
    description:
      "Brickfund kopplar ihop fysiska företag med investerare. Finansiera en restaurangexpansion, en frisörflytt eller ett nytt gym.",
  },
  nav: {
    explore: "Utforska",
    howItWorks: "Hur det fungerar",
    forInvestors: "För investerare",
    signIn: "Logga in",
    getStarted: "Kom igång",
    dashboard: "Översikt",
    signOut: "Logga ut",
    toggleMenu: "Växla meny",
  },
  footer: {
    tagline:
      "Marknadsplatsen där lokala fysiska företag möter investerare som tror på huvudgatan.",
    platform: "Plattform",
    exploreBusinesses: "Utforska företag",
    raiseCapital: "Skaffa kapital",
    becomeInvestor: "Bli investerare",
    company: "Företag",
    howItWorks: "Hur det fungerar",
    signIn: "Logga in",
    contact: "Kontakt",
    rights: "Alla rättigheter förbehållna.",
    crafted: "Skapad för huvudgatan.",
  },
  home: {
    badge: "Huvudgatan möter riskkapital",
    heroTitle: "Investera i företagen som bygger ditt grannskap",
    heroSubtitle:
      "Brickfund kopplar ihop lönsamma fysiska företag med investerare – från en restaurang som utökar sin uteservering till ett gym som öppnar sina dörrar.",
    exploreOpportunities: "Utforska möjligheter",
    raiseCapital: "Skaffa kapital",
    statRaised: "Samlat kapital",
    statBusinesses: "Finansierade företag",
    statInvestors: "Aktiva investerare",
    statFillRate: "Genomsnittlig fyllnadsgrad",
    liveOpportunities: "Live-möjligheter",
    featuredTitle: "Utvalda företag",
    viewAll: "Visa alla",
    typesTitle: "Varje typ av affär tydligt märkt",
    typesSubtitle:
      "Varje notering har en investeringstyp-piller så du alltid vet vad du finansierar.",
    howTitle: "Från pitch till finansiering i tre steg",
    howStep: "Hur det fungerar",
    step1Title: "Företag listar",
    step1Body:
      "Ägare skapar en notering med sin historia, siffror och typen av kapital de söker.",
    step2Title: "Investerare kopplar ihop",
    step2Body:
      "Bläddra bland granskade möjligheter efter kategori, plats och investeringstyp – och kontakta sedan.",
    step3Title: "Kapital utplacerat",
    step3Body:
      "Kom överens om villkor och finansiera tillväxten. Följ milstolpar och uppdateringar från din översikt.",
    investorBadge: "För investerare",
    investorTitle: "Bygg en portfölj av riktiga lokala företag",
    investorBody:
      "Backa företag du faktiskt kan besöka. Diversifiera över lån, eget kapital och intäktsdelning – med transparenta villkor och verkliga tillgångar bakom varje affär.",
    startInvesting: "Börja investera",
    perkVetted: "Granskade noteringar",
    perkVettedBody: "Varje företag granskas innan de går live.",
    perkReturns: "Transparenta avkastningar",
    perkReturnsBody: "Tydliga villkor, milstolpar och rapportering.",
    perkImpact: "Lokal påverkan",
    perkImpactBody: "Finansiera huvudgatan du går varje dag.",
    perkFlexible: "Flexibla affärer",
    perkFlexibleBody: "Från startkapital till kortfristiga lån.",
    businessBadge: "För företag",
    businessTitle: "Skaffa kapital på dina villkor",
    businessBody:
      "Koppla ihop med investerare som förstår din bransch. Lista din möjlighet och få finansieringen du behöver för att växa – utan bankerna.",
    startRaising: "Skapa ditt företag",
    perkSimple: "Enkel process",
    perkSimpleBody: "Skapa en notering på minuter, inte veckor.",
    perkDirect: "Direkt åtkomst",
    perkDirectBody: "Koppla ihop direkt med investerare – inga mellanhänder.",
    perkControl: "Behåll kontrollen",
    perkControlBody: "Sätt dina egna villkor och behåll ägandeskapet av ditt företag.",
    ctaTitle: "Redo att växa på huvudgatan?",
    ctaBody: "Oavsett om du skaffar kapital eller investerar börjar ditt nästa drag här.",
    ctaCreate: "Skapa ditt konto",
    ctaBrowse: "Bläddra bland noteringar",
  },
  businesses: {
    title: "Utforska företag",
    subtitle:
      "Bläddra bland live-finansieringsmöjligheter från fysiska företag. Filtrera efter typen av investering du söker.",
    allCities: "Alla städer",
    searchPlaceholder: "Sök namn…",
    emptyTitle: "Inga möjligheter hittades",
    emptyBody: "Försök med en annan investeringstyp eller sökterm.",
    clearFilters: "Rensa filter",
  },
  businessDetail: {
    backToOpportunities: "Tillbaka till möjligheter",
    about: "Om denna möjlighet",
    whatInvestorsGet: "Vad investerare får",
    whatInvestorsgetBody1: "Direkt relation med företagsägaren",
    whatInvestorsgetBody2: "Transparenta villkor dokumenterade i förväg",
    whatInvestorsgetBody3: "Milstolpuppdateringar från din översikt",
    raised: "Samlat",
    funded: "% finansierat",
    goalOf: "mål av",
    remaining: "Återstående",
    dealType: "Affärstyp",
    expressInterest: "Uttryck intresse",
    expressInterestHint: "Skapa ett gratis investerarkonto för att koppla ihop.",
    listedBy: "Listad av",
    fundedBadge: "Finansierad",
  },
  auth: {
    welcomeBack: "Välkommen tillbaka",
    signInSubtitle: "Logga in på ditt Brickfund-konto för att fortsätta.",
    email: "E-post",
    password: "Lösenord",
    forgotPassword: "Glömt lösenord?",
    invalidCredentials: "Ogiltig e-post eller lösenord. Försök igen.",
    signingIn: "Loggar in…",
    signIn: "Logga in",
    demoAccounts: "Demo-konton",
    demoBusiness: "Företag",
    demoInvestor: "Investerare",
    demoPassword: "Lösenord",
    createAccount: "Skapa konto",
    registerSubtitle:
      "Gå med i Brickfund som företag eller investerare – det är gratis att börja.",
    haveAccount: "Har du redan ett konto?",
    noAccount: "Ny här?",
    createNow: "Skapa ett konto",
    roleBusiness: "Jag är ett företag",
    roleBusinessSub: "Skaffa kapital",
    roleInvestor: "Jag är en investerare",
    roleInvestorSub: "Finansiera företag",
    yourName: "Ditt namn",
    fullName: "Fullständigt namn",
    businessName: "Företagsnamn",
    phone: "Telefon",
    country: "Land",
    countryPlaceholder: "Välj ett land",
    city: "Stad",
    cityPlaceholder: "Sök efter en stad…",
    cityManualPlaceholder: "Ange din stad",
    citySelectFirst: "Välj ett land först",
    loadingLocations: "Laddar platser…",
    investorType: "Investeringstyp",
    individualInvestor: "Individuell investerare",
    investmentFirm: "Investeringsföretag",
    fundFamilyOffice: "Fond / family office",
    firmName: "Företags-/fondnamn",
    firmNameOptional: "valfritt",
    minBudget: "Min budget",
    maxBudget: "Max budget",
    accredited: "Jag är en ackrediterad / professionell investerare",
    location: "Plats",
    passwordMin: "Min. 10 tecken",
    passwordConfirm: "Bekräfta",
    passwordRepeat: "Upprepa lösenord",
    passwordMismatch: "Lösenorden matchar inte.",
    passwordShort: "Lösenordet måste vara minst 10 tecken långt.",
    createError: "Kunde inte skapa ditt konto. Försök igen.",
    creatingBusiness: "Skapar konto…",
    creatingInvestor: "Skapar konto…",
    createBusinessBtn: "Skapa företagskonto",
    createInvestorBtn: "Skapa investerarkonto",
    termsNotice:
      "Genom att fortsätta godkänner du Brickfunds villkor och integritetspolicy.",
    quote:
      "Vi finansierade vår uteserveringsexpansion på tre veckor. Brickfund kopplade ihop oss med investerare som faktiskt förstår gästvänlighet.",
    quoteAuthor: "Maria Silva",
    quoteRole: "Grundare, Bella Vista Trattoria",
    resetTitle: "Återställ ditt lösenord",
    resetSubtitle:
      "Ange din e-post så skickar vi en länk för att återställa ditt lösenord.",
    sendResetLink: "Skicka återställningslänk",
    sending: "Skickar…",
    resetSent: "Kolla din inkorg",
    resetSentBody:
      "Om ett konto finns för {email} får du en återställningslänk inom kort.",
    remembered: "Kom du ihåg det?",
    backToSignIn: "Tillbaka till inloggning",
    signingOut: "Loggar ut dig…",
  },
  dashboard: {
    businessAccount: "Företagskonto",
    investorAccount: "Investerarkonto",
    welcome: "Välkommen tillbaka, {name}",
    businessSubtitle: "Hantera dina noteringar – växla synlighet eller ta bort dem när som helst.",
    investorSubtitle: "Upptäck möjligheter och spåra din portfölj.",
    newListing: "Ny notering",
    newListingHint: "Skapande av noteringar kommer snart",
    accountType: "Kontotyp",
    company: "Företag",
    firm: "Företag",
    location: "Plats",
    listings: "Noteringar",
    published: "Publicerad",
    budget: "Budget",
    yourListings: "Dina noteringar",
    recommended: "Rekommenderat för dig",
    exploreAll: "Utforska alla",
    emptyBusinessTitle: "Inga noteringar än",
    emptyBusinessBody: "Skapa din första notering för att börja skaffa kapital.",
    emptyInvestorTitle: "Inga rekommendationer än",
    emptyInvestorBody: "Bläddra på marknadsplatsen för att hitta din första möjlighet.",
    exploreExamples: "Utforska exempel",
    browseOpportunities: "Bläddra bland möjligheter",
    publishedLabel: "Publicerad",
    hiddenLabel: "Dold",
    visibleToInvestors: "Synlig för investerare",
    hiddenFromMarketplace: "Dold från marknadsplatsen",
    saving: "Sparar…",
    delete: "Ta bort",
    deleteTitle: "Ta bort notering?",
    deleteWarning: "Denna åtgärd kan inte ångras.",
    deleteConfirmBtn: "Ta bort",
    deleting: "Tar bort…",
    cancel: "Avbryt",
  },
  notFound: {
    title: "Sidan hittades inte",
    body: "Sidan eller noteringen du letar efter finns inte.",
    backHome: "Tillbaka hem",
  },
  investmentTypes: {
    seed: "Seed",
    growth: "Tillväxt",
    loan: "Lån",
    equity: "Eget kapital",
    revenue_share: "Intäktsdelning",
    convertible_note: "Konverterbar skuld",
    seedBlurb: "Kapital i ett tidigt skede för att starta.",
    growthBlurb: "Medel för att expandera ett befintligt företag.",
    loanBlurb: "Skuldfinansiering som återbetalas över tid.",
    equityBlurb: "Ägarandel i utbyte mot kapital.",
    revenue_shareBlurb: "Investerare tjänar en % av månadsintäkter.",
    convertible_noteBlurb: "Skuld som konverteras till eget kapital senare.",
  },
  categories: {
    restaurant: "Restaurang",
    barber: "Barbershop",
    gym: "Gym & Fitness",
    cafe: "Café",
    retail: "Detaljhandel",
    salon: "Salong",
    bakery: "Bageri",
    bar: "Bar",
    other: "Annat",
  },
  misc: {
    of: "av",
    raised: "samlat",
    all: "Alla",
  },
  deals: {
    startInvestmentDeal: "Starta en investeringsaffär",
    startDeal: "Starta en affär",
    processDescription: "Du kommer att gå igenom LOI → APA → deposition → överlämning. Vi föreslår {amount}.",
    investmentAmountLabel: "Investeringsbelopp (USD)",
    noteToBusinessLabel: "Notis till företaget (valfritt)",
    noteToBusinessPlaceholder: "En kort introduktion, din investeringsteori, villkor…",
    cancel: "Avbryt",
    creating: "Skapar…",
    createDeal: "Skapa affär",
  },
};