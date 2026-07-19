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

export const de: TranslationDict = {
  meta: {
    title: "Brickfund — In lokale Unternehmen investieren",
    description:
      "Brickfund verbindet stationäre Unternehmen mit Investoren. Finanzieren Sie die Erweiterung eines Restaurants, den Umzug eines Barbiers oder die Eröffnung eines neuen Fitnessstudios.",
  },
  nav: {
    explore: "Entdecken",
    howItWorks: "Wie es funktioniert",
    forInvestors: "Für Investoren",
    signIn: "Anmelden",
    getStarted: "Loslegen",
    dashboard: "Dashboard",
    signOut: "Abmelden",
    toggleMenu: "Menü umschalten",
  },
  footer: {
    tagline:
      "Der Marktplatz, an dem lokale stationäre Unternehmen auf Investoren treffen, die an die Hauptstraße glauben.",
    platform: "Plattform",
    exploreBusinesses: "Unternehmen erkunden",
    raiseCapital: "Kapital beschaffen",
    becomeInvestor: "Investor werden",
    company: "Unternehmen",
    howItWorks: "Wie es funktioniert",
    signIn: "Anmelden",
    contact: "Kontakt",
    rights: "Alle Rechte vorbehalten.",
    crafted: "Gefertigt für die Hauptstraße.",
  },
  home: {
    badge: "Hauptstraße trifft Risikokapital",
    heroTitle: "Investieren Sie in Unternehmen, die Ihr Viertel aufbauen",
    heroSubtitle:
      "Brickfund verbindet profitable stationäre Unternehmen mit Investoren – von einem Restaurant, das seine Terrasse erweitert, bis hin zu einem Fitnessstudio, das seine Türen öffnet.",
    exploreOpportunities: "Möglichkeiten erkunden",
    raiseCapital: "Kapital beschaffen",
    statRaised: "Beschafftes Kapital",
    statBusinesses: "Finanzierte Unternehmen",
    statInvestors: "Aktive Investoren",
    statFillRate: "Durchschnittliche Auslastung",
    liveOpportunities: "Live-Möglichkeiten",
    featuredTitle: "Vorgestellte Unternehmen",
    viewAll: "Alle anzeigen",
    typesTitle: "Jede Art von Deal, klar gekennzeichnet",
    typesSubtitle:
      "Jedes Angebot trägt einen Pillentyp, damit Sie immer wissen, was Sie finanzieren.",
    howTitle: "Vom Pitch zur Finanzierung in drei Schritten",
    howStep: "Wie es funktioniert",
    step1Title: "Unternehmen listen",
    step1Body:
      "Inhaber erstellen ein Angebot mit ihrer Geschichte, Zahlen und der Art des Kapitals, das sie beschaffen.",
    step2Title: "Investoren verbinden",
    step2Body:
      "Durchsuchen Sie geprüfte Möglichkeiten nach Kategorie, Standort und Investmenttyp – und wenden Sie sich dann.",
    step3Title: "Kapital eingesetzt",
    step3Body:
      "Einigen Sie sich auf Konditionen und finanzieren Sie das Wachstum. Verfolgen Sie Meilensteine und Updates aus Ihrem Dashboard.",
    investorBadge: "Für Investoren",
    investorTitle: "Bauen Sie ein Portfolio echter lokaler Unternehmen auf",
    investorBody:
      "Unterstützen Sie Unternehmen, die Sie tatsächlich besuchen können. Diversifizieren Sie sich über Kredite, Eigenkapital und Umsatzbeteiligung – mit transparenten Konditionen und realen Vermögenswerten hinter jedem Deal.",
    startInvesting: "Mit dem Investieren beginnen",
    perkVetted: "Geprüfte Angebote",
    perkVettedBody: "Jedes Unternehmen wird vor dem Live-Start überprüft.",
    perkReturns: "Transparente Renditen",
    perkReturnsBody: "Klare Bedingungen, Meilensteine und Berichterstattung.",
    perkImpact: "Lokale Wirkung",
    perkImpactBody: "Finanzieren Sie die Hauptstraße, auf der Sie jeden Tag laufen.",
    perkFlexible: "Flexible Deals",
    perkFlexibleBody: "Von Startkapital bis hin zu kurzfristigen Krediten.",
    businessBadge: "Für Unternehmen",
    businessTitle: "Beschaffen Sie Kapital zu Ihren Bedingungen",
    businessBody:
      "Verbinden Sie sich mit Investoren, die Ihre Branche verstehen. Listen Sie Ihre Möglichkeit und erhalten Sie die Finanzierung, die Sie zum Wachstum benötigen – ohne die Banken.",
    startRaising: "Erstellen Sie Ihr Unternehmen",
    perkSimple: "Einfacher Prozess",
    perkSimpleBody: "Erstellen Sie ein Angebot in Minuten, nicht in Wochen.",
    perkDirect: "Direkter Zugang",
    perkDirectBody: "Verbinden Sie sich direkt mit Investoren – ohne Mittelsmänner.",
    perkControl: "Kontrolle behalten",
    perkControlBody: "Setzen Sie Ihre eigenen Konditionen fest und behalten Sie die Kontrolle über Ihr Unternehmen.",
    ctaTitle: "Bereit, auf der Hauptstraße zu wachsen?",
    ctaBody: "Ob Sie Kapital beschaffen oder investieren – Ihr nächster Schritt beginnt hier.",
    ctaCreate: "Konto erstellen",
    ctaBrowse: "Angebote durchsuchen",
  },
  businesses: {
    title: "Unternehmen erkunden",
    subtitle:
      "Durchsuchen Sie Live-Finanzierungsmöglichkeiten von stationären Unternehmen. Filtern Sie nach der Art des Investments, das Sie suchen.",
    allCities: "Alle Städte",
    searchPlaceholder: "Name suchen…",
    emptyTitle: "Keine Möglichkeiten gefunden",
    emptyBody: "Versuchen Sie einen anderen Investmenttyp oder Suchbegriff.",
    clearFilters: "Filter löschen",
  },
  businessDetail: {
    backToOpportunities: "Zurück zu den Möglichkeiten",
    about: "Über diese Möglichkeit",
    whatInvestorsGet: "Was Investoren erhalten",
    whatInvestorsgetBody1: "Direkte Beziehung zum Geschäftsinhaber",
    whatInvestorsgetBody2: "Transparente Bedingungen, die vorab dokumentiert werden",
    whatInvestorsgetBody3: "Meilenstein-Updates aus Ihrem Dashboard",
    raised: "Beschafft",
    funded: "% finanziert",
    goalOf: "Ziel von",
    remaining: "Verbleibend",
    dealType: "Deal-Typ",
    expressInterest: "Interesse bekunden",
    expressInterestHint: "Erstellen Sie ein kostenloses Investorenkonto, um sich zu verbinden.",
    listedBy: "Gelistet von",
    fundedBadge: "Finanziert",
  },
  auth: {
    welcomeBack: "Willkommen zurück",
    signInSubtitle: "Melden Sie sich bei Ihrem Brickfund-Konto an, um fortzufahren.",
    email: "E-Mail",
    password: "Passwort",
    forgotPassword: "Passwort vergessen?",
    invalidCredentials: "Ungültige E-Mail oder Passwort. Bitte versuchen Sie es erneut.",
    signingIn: "Anmelden…",
    signIn: "Anmelden",
    demoAccounts: "Demo-Konten",
    demoBusiness: "Unternehmen",
    demoInvestor: "Investor",
    demoPassword: "Passwort",
    createAccount: "Konto erstellen",
    registerSubtitle:
      "Treten Sie Brickfund als Unternehmen oder Investor bei – der Start ist kostenlos.",
    haveAccount: "Haben Sie bereits ein Konto?",
    noAccount: "Neu hier?",
    createNow: "Konto erstellen",
    roleBusiness: "Ich bin ein Unternehmen",
    roleBusinessSub: "Kapital beschaffen",
    roleInvestor: "Ich bin ein Investor",
    roleInvestorSub: "Unternehmen finanzieren",
    yourName: "Ihr Name",
    fullName: "Vollständiger Name",
    businessName: "Unternehmensname",
    phone: "Telefon",
    country: "Land",
    countryPlaceholder: "Wählen Sie ein Land",
    city: "Stadt",
    cityPlaceholder: "Stadt suchen…",
    cityManualPlaceholder: "Geben Sie Ihre Stadt ein",
    citySelectFirst: "Wählen Sie zuerst ein Land",
    loadingLocations: "Standorte werden geladen…",
    investorType: "Investortyp",
    individualInvestor: "Einzelner Investor",
    investmentFirm: "Investitionsfirma",
    fundFamilyOffice: "Fonds / Family Office",
    firmName: "Firmen- / Fondsname",
    firmNameOptional: "optional",
    minBudget: "Mindestbudget",
    maxBudget: "Höchstbudget",
    accredited: "Ich bin ein akkreditierter / professioneller Investor",
    location: "Standort",
    passwordMin: "Min. 10 Zeichen",
    passwordConfirm: "Bestätigen",
    passwordRepeat: "Passwort wiederholen",
    passwordMismatch: "Passwörter stimmen nicht überein.",
    passwordShort: "Das Passwort muss mindestens 10 Zeichen lang sein.",
    createError: "Ihr Konto konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
    creatingBusiness: "Konto wird erstellt…",
    creatingInvestor: "Konto wird erstellt…",
    createBusinessBtn: "Unternehmenskonto erstellen",
    createInvestorBtn: "Investorenkonto erstellen",
    termsNotice:
      "Durch Fortfahren stimmen Sie den Geschäftsbedingungen und der Datenschutzrichtlinie von Brickfund zu.",
    quote:
      "Wir haben unsere Terrassenerweiterung in drei Wochen finanziert. Brickfund hat uns mit Investoren verbunden, die die Gastfreundschaft wirklich verstehen.",
    quoteAuthor: "Maria Silva",
    quoteRole: "Gründerin, Bella Vista Trattoria",
    resetTitle: "Passwort zurücksetzen",
    resetSubtitle:
      "Geben Sie Ihre E-Mail ein, und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.",
    sendResetLink: "Reset-Link senden",
    sending: "Wird gesendet…",
    resetSent: "Überprüfen Sie Ihren Posteingang",
    resetSentBody:
      "Wenn ein Konto für {email} existiert, erhalten Sie in Kürze einen Reset-Link.",
    remembered: "Haben Sie es sich gemerkt?",
    backToSignIn: "Zurück zur Anmeldung",
    signingOut: "Sie werden abgemeldet…",
  },
  dashboard: {
    businessAccount: "Unternehmenskonto",
    investorAccount: "Investorenkonto",
    welcome: "Willkommen zurück, {name}",
    businessSubtitle: "Verwalten Sie Ihre Angebote – schalten Sie die Sichtbarkeit um oder entfernen Sie sie jederzeit.",
    investorSubtitle: "Entdecken Sie Möglichkeiten und verfolgen Sie Ihr Portfolio.",
    newListing: "Neues Angebot",
    newListingHint: "Erstellung von Angeboten kommt bald",
    accountType: "Kontoart",
    company: "Unternehmen",
    firm: "Firma",
    location: "Standort",
    listings: "Angebote",
    published: "Veröffentlicht",
    budget: "Budget",
    yourListings: "Ihre Angebote",
    recommended: "Empfohlen für Sie",
    exploreAll: "Alle erkunden",
    emptyBusinessTitle: "Noch keine Angebote",
    emptyBusinessBody: "Erstellen Sie Ihr erstes Angebot, um mit der Kapitalbeschaffung zu beginnen.",
    emptyInvestorTitle: "Noch keine Empfehlungen",
    emptyInvestorBody: "Durchsuchen Sie den Marktplatz, um Ihre erste Möglichkeit zu finden.",
    exploreExamples: "Beispiele erkunden",
    browseOpportunities: "Möglichkeiten durchsuchen",
    publishedLabel: "Veröffentlicht",
    hiddenLabel: "Ausgeblendet",
    visibleToInvestors: "Sichtbar für Investoren",
    hiddenFromMarketplace: "Vom Marktplatz ausgeblendet",
    saving: "Wird gespeichert…",
    delete: "Löschen",
    deleteTitle: "Angebot löschen?",
    deleteWarning: "Diese Aktion kann nicht rückgängig gemacht werden.",
    deleteConfirmBtn: "Löschen",
    deleting: "Wird gelöscht…",
    cancel: "Abbrechen",
  },
  notFound: {
    title: "Seite nicht gefunden",
    body: "Die Seite oder das Angebot, das Sie suchen, existiert nicht.",
    backHome: "Zurück zur Startseite",
  },
  investmentTypes: {
    seed: "Seed",
    growth: "Wachstum",
    loan: "Kredit",
    equity: "Eigenkapital",
    revenue_share: "Umsatzbeteiligung",
    convertible_note: "Wandelanleihe",
    seedBlurb: "Frühphasenkapital für den Start.",
    growthBlurb: "Mittel zur Erweiterung eines bestehenden Unternehmens.",
    loanBlurb: "Schuldenfinanzierung, die im Laufe der Zeit zurückgezahlt wird.",
    equityBlurb: "Eigentumsbeteiligung im Austausch für Kapital.",
    revenue_shareBlurb: "Investoren erhalten einen % des monatlichen Umsatzes.",
    convertible_noteBlurb: "Schulden, die später in Eigenkapital umgewandelt werden.",
  },
  categories: {
    restaurant: "Restaurant",
    barber: "Barbier",
    gym: "Fitnessstudio",
    cafe: "Café",
    retail: "Einzelhandel",
    salon: "Salon",
    bakery: "Bäckerei",
    bar: "Bar",
    other: "Sonstiges",
  },
  misc: {
    of: "von",
    raised: "beschafft",
    all: "Alle",
  },
  deals: {
    startInvestmentDeal: "Investitionsdeal starten",
    startDeal: "Deal starten",
    processDescription: "Sie durchlaufen LOI → APA → Treuhand → Übergabe. Wir schlagen {amount} vor.",
    investmentAmountLabel: "Investitionsbetrag (USD)",
    noteToBusinessLabel: "Notiz an das Unternehmen (optional)",
    noteToBusinessPlaceholder: "Eine kurze Vorstellung, Ihre Investitionsthese, Bedingungen…",
    cancel: "Abbrechen",
    creating: "Wird erstellt…",
    createDeal: "Deal erstellen",
  },
};