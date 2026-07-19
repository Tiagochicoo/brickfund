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

export const fi: TranslationDict = {
  meta: {
    title: "Brickfund — Sijoita paikallisiin yrityksiin",
    description:
      "Brickfund yhdistää fyysiset yritykset sijoittajiin. Rahoita ravintolan laajennus, parturin muutto tai uuden kuntosalin avaaminen.",
  },
  nav: {
    explore: "Selaa",
    howItWorks: "Miten se toimii",
    forInvestors: "Sijoittajille",
    signIn: "Kirjaudu sisään",
    getStarted: "Aloita",
    dashboard: "Hallintapaneeli",
    signOut: "Kirjaudu ulos",
    toggleMenu: "Vaihda valikko",
  },
  footer: {
    tagline:
      "Markkinapaikka, jossa paikalliset fyysiset yritykset kohtaavat sijoittajia, jotka uskovat pääkatuun.",
    platform: "Alusta",
    exploreBusinesses: "Selaa yrityksiä",
    raiseCapital: "Hanki pääomaa",
    becomeInvestor: "Rydy sijoittajaksi",
    company: "Yritys",
    howItWorks: "Miten se toimii",
    signIn: "Kirjaudu sisään",
    contact: "Yhteystiedot",
    rights: "Kaikki oikeudet pidätetään.",
    crafted: "Tehty pääkatua varten.",
  },
  home: {
    badge: "Pääkatu kohtaa pääoman",
    heroTitle: "Sijoita yrityksiin, jotka rakentavat naapurustoasi",
    heroSubtitle:
      "Brickfund yhdistää kannattavat fyysiset yritykset sijoittajiin – ravintolasta, joka laajentaa terassiaan, kuntosalille, joka avaa ovensa.",
    exploreOpportunities: "Selaa mahdollisuuksia",
    raiseCapital: "Hanki pääomaa",
    statRaised: "Kerätty pääoma",
    statBusinesses: "Rahoitetut yritykset",
    statInvestors: "Aktiiviset sijoittajat",
    statFillRate: "Keskimääräinen täyttöaste",
    liveOpportunities: "Live-mahdollisuudet",
    featuredTitle: "Esitellyt yritykset",
    viewAll: "Näytä kaikki",
    typesTitle: "Jokainen kauppatyyppi selkeästi merkitty",
    typesSubtitle:
      "Jokaisella listauksella on sijoitustyypin pilli, joten tiedät aina, mitä rahoitat.",
    howTitle: "Pitchistä rahoitukseen kolmessa vaiheessa",
    howStep: "Miten se toimii",
    step1Title: "Yritykset listaavat",
    step1Body:
      "Yrittäjät luovat listauksen tarinallaan, luvuillaan ja pääomatyypillä, joita he etsivät.",
    step2Title: "Sijoittajat yhdistyvät",
    step2Body:
      "Selaa tarkistettuja mahdollisuuksia kategorian, sijainnin ja sijoitustyypin mukaan – ja ota sitten yhteyttä.",
    step3Title: "Pääoma sijoitettu",
    step3Body:
      "Sovikaa ehdoista ja rahoittakaa kasvu. Seuraa virstanpylväitä ja päivityksiä hallintapaneelista.",
    investorBadge: "Sijoittajille",
    investorTitle: "Rakenna todellisten paikallisten yritysten portfoliosijoitus",
    investorBody:
      "Tue yrityksiä, joita voit itse vierailla. Hajauta lainojen, pääoman ja tulonjakoon – läpinäkyvillä ehdoilla ja todellisilla varoilla jokaisen kaupan takana.",
    startInvesting: "Aloita sijoittaminen",
    perkVetted: "Tarkistetut listaukset",
    perkVettedBody: "Jokainen yritys tarkistetaan ennen julkaisua.",
    perkReturns: "Läpinäkyvät tuotot",
    perkReturnsBody: "Selkeät ehdot, virstanpylväät ja raportointi.",
    perkImpact: "Paikallinen vaikutus",
    perkImpactBody: "Rahoita pääkatua, jolla kävelet joka päivä.",
    perkFlexible: "Joustavat kaupat",
    perkFlexibleBody: "Siemenpääomasta lyhytaikaisiin lainoihin.",
    businessBadge: "Yrityksille",
    businessTitle: "Hanki pääomaa ehdoillasi",
    businessBody:
      "Yhdisty sijoittajiin, jotka ymmärtävät toimialasi. Listaa mahdollisuutesi ja saat rahoituksen, jota tarvitset kasvua varten – ilman pankkeja.",
    startRaising: "Luo yrityksesi",
    perkSimple: "Yksinkertainen prosessi",
    perkSimpleBody: "Luo listaus minuuteissa, ei viikkoina.",
    perkDirect: "Suora pääsy",
    perkDirectBody: "Yhdisty suoraan sijoittajiin – ilman välittäjiä.",
    perkControl: "Säilytä hallinta",
    perkControlBody: "Aseta omat ehtosi ja säilytä omistus yrityksestäsi.",
    ctaTitle: "Valmis kasvamaan pääkadulla?",
    ctaBody: "Oletpa sitten hankkimassa pääomaa tai sijoittamassa, seuraava siirto alkaa täältä.",
    ctaCreate: "Luo tili",
    ctaBrowse: "Selaa listauksia",
  },
  businesses: {
    title: "Selaa yrityksiä",
    subtitle:
      "Selaa live-rahoitusmahdollisuuksia fyysisistä yrityksistä. Suodata etsimäsi sijoitustyypin mukaan.",
    allCities: "Kaikki kaupungit",
    searchPlaceholder: "Hae nimellä…",
    emptyTitle: "Mahdollisuuksia ei löytynyt",
    emptyBody: "Kokeile toista sijoitustyyppiä tai hakusanaa.",
    clearFilters: "Tyhjennä suodattimet",
  },
  businessDetail: {
    backToOpportunities: "Takaisin mahdollisuuksiin",
    about: "Tietoja tästä mahdollisuudesta",
    whatInvestorsGet: "Mitä sijoittajat saavat",
    whatInvestorsgetBody1: "Suora suhde yrityksen omistajaan",
    whatInvestorsgetBody2: "Läpinäkyvät ehdot dokumentoitu etukäteen",
    whatInvestorsgetBody3: "Virstanpylväspäivitykset hallintapaneelista",
    raised: "Kerätty",
    funded: "% rahoitettu",
    goalOf: "tavoitteesta",
    remaining: "Jäljellä",
    dealType: "Kauppatyyppi",
    expressInterest: "Ilmoita kiinnostus",
    expressInterestHint: "Luo ilmainen sijoittajatili yhdistääksesi.",
    listedBy: "Listannut",
    fundedBadge: "Rahoitettu",
  },
  auth: {
    welcomeBack: "Tervetuloa takaisin",
    signInSubtitle: "Kirjaudu Brickfund-tilillesi jatkaaksesi.",
    email: "Sähköposti",
    password: "Salasana",
    forgotPassword: "Unohdit salasanan?",
    invalidCredentials: "Virheellinen sähköposti tai salasana. Yritä uudelleen.",
    signingIn: "Kirjaudutaan sisään…",
    signIn: "Kirjaudu sisään",
    demoAccounts: "Demotilit",
    demoBusiness: "Yritys",
    demoInvestor: "Sijoittaja",
    demoPassword: "Salasana",
    createAccount: "Luo tili",
    registerSubtitle:
      "Liity Brickfundiin yrityksenä tai sijoittajana – aloittaminen on ilmaista.",
    haveAccount: "Onko sinulla jo tili?",
    noAccount: "Uusi täällä?",
    createNow: "Luo tili",
    roleBusiness: "Olen yritys",
    roleBusinessSub: "Hanki pääomaa",
    roleInvestor: "Olen sijoittaja",
    roleInvestorSub: "Rahoita yrityksiä",
    yourName: "Nimesi",
    fullName: "Koko nimi",
    businessName: "Yrityksen nimi",
    phone: "Puhelin",
    country: "Maa",
    countryPlaceholder: "Valitse maa",
    city: "Kaupunki",
    cityPlaceholder: "Hae kaupunkia…",
    cityManualPlaceholder: "Syötä kaupunkisi",
    citySelectFirst: "Valitse maa ensin",
    loadingLocations: "Ladataan sijainteja…",
    investorType: "Sijoittajatyyppi",
    individualInvestor: "Yksityissijoittaja",
    investmentFirm: "Sijoitusyhtiö",
    fundFamilyOffice: "Rahasto / perheen toimisto",
    firmName: "Yrityksen / rahaston nimi",
    firmNameOptional: "valinnainen",
    minBudget: "Min budjetti",
    maxBudget: "Max budjetti",
    accredited: "Olen hyväksytty / ammattimainen sijoittaja",
    location: "Sijainti",
    passwordMin: "Väh. 10 merkkiä",
    passwordConfirm: "Vahvista",
    passwordRepeat: "Toista salasana",
    passwordMismatch: "Salasanat eivät täsmää.",
    passwordShort: "Salasanan on oltava vähintään 10 merkkiä pitkä.",
    createError: "Tiliäsi ei voitu luoda. Yritä uudelleen.",
    creatingBusiness: "Luodaan tiliä…",
    creatingInvestor: "Luodaan tiliä…",
    createBusinessBtn: "Luo yritystili",
    createInvestorBtn: "Luo sijoittajatili",
    termsNotice:
      "Jatkamalla hyväksyt Brickfundin ehdot ja tietosuojakäytännön.",
    quote:
      "Rahoitimme terassilaajennuksemme kolmessa viikossa. Brickfund yhdisti meidät sijoittajiin, jotka ymmärtävät vieraanvaraisuutta.",
    quoteAuthor: "Maria Silva",
    quoteRole: "Perustaja, Bella Vista Trattoria",
    resetTitle: "Nollaa salasanasi",
    resetSubtitle:
      "Syötä sähköpostiosoitteesi, niin lähetämme linkin salasanan nollaamiseen.",
    sendResetLink: "Lähetä nollauslinkki",
    sending: "Lähetetään…",
    resetSent: "Tarkista sähköpostisi",
    resetSentBody:
      "Jos tili on olemassa osoitteelle {email}, saat nollauslinkin pian.",
    remembered: "Muistitko sen?",
    backToSignIn: "Takaisin kirjautumiseen",
    signingOut: "Kirjaudutaan ulos…",
  },
  dashboard: {
    businessAccount: "Yritystili",
    investorAccount: "Sijoittajatili",
    welcome: "Tervetuloa takaisin, {name}",
    businessSubtitle: "Hallinnoi listauksiasi – vaihda näkyvyyttä tai poista ne milloin tahansa.",
    investorSubtitle: "Löydä mahdollisuuksia ja seuraa portfoliosi.",
    newListing: "Uusi listaus",
    newListingHint: "Listauksen luominen tulossa pian",
    accountType: "Tilityyppi",
    company: "Yritys",
    firm: "Yritys",
    location: "Sijainti",
    listings: "Listaukset",
    published: "Julkaistu",
    budget: "Budjetti",
    yourListings: "Listauksesi",
    recommended: "Suositeltu sinulle",
    exploreAll: "Selaa kaikkia",
    emptyBusinessTitle: "Ei vielä listauksia",
    emptyBusinessBody: "Luo ensimmäinen listauksesi aloittaaksesi pääoman hankkimisen.",
    emptyInvestorTitle: "Ei vielä suosituksia",
    emptyInvestorBody: "Selaa markkinapaikkaa löytääksesi ensimmäisen mahdollisuutesi.",
    exploreExamples: "Selaa esimerkkejä",
    browseOpportunities: "Selaa mahdollisuuksia",
    publishedLabel: "Julkaistu",
    hiddenLabel: "Piilotettu",
    visibleToInvestors: "Näkyvillä sijoittajille",
    hiddenFromMarketplace: "Piilotettu markkinapaikalta",
    saving: "Tallennetaan…",
    delete: "Poista",
    deleteTitle: "Poista listaus?",
    deleteWarning: "Tätä toimintoa ei voi kumota.",
    deleteConfirmBtn: "Poista",
    deleting: "Poistetaan…",
    cancel: "Peruuta",
  },
  notFound: {
    title: "Sivua ei löytynyt",
    body: "Sivua tai listaus, jota etsit, ei ole olemassa.",
    backHome: "Takaisin kotiin",
  },
  investmentTypes: {
    seed: "Siemen",
    growth: "Kasvu",
    loan: "Laina",
    equity: "Pääoma",
    revenue_share: "Tulonjako",
    convertible_note: "Muuttuva velkasitoumus",
    seedBlurb: "Varhaisvaiheen pääoma aloittamiseen.",
    growthBlurb: "Varat olemassa olevan yrityksen laajentamiseen.",
    loanBlurb: "Velkarahoitus, joka maksetaan takaisin ajan myötä.",
    equityBlurb: "Omistusosuus vastineeksi pääomasta.",
    revenue_shareBlurb: "Sijoittajat ansaitsevat % kuukansituloista.",
    convertible_noteBlurb: "Velka, joka muuttuu pääomaksi myöhemmin.",
  },
  categories: {
    restaurant: "Ravintola",
    barber: "Kampaamo",
    gym: "Kuntosali",
    cafe: "Kahvila",
    retail: "Vähittäiskauppa",
    salon: "Salonki",
    bakery: "Leipomo",
    bar: "Baari",
    other: "Muu",
  },
  misc: {
    of: "of",
    raised: "kerätty",
    all: "Kaikki",
  },
  deals: {
    startInvestmentDeal: "Aloita sijoituskauppa",
    startDeal: "Aloita kauppa",
    processDescription: "Käyt läpi LOI → APA → escrow → luovutus. Ehdotamme {amount}.",
    investmentAmountLabel: "Sijoitussumma (USD)",
    noteToBusinessLabel: "Viesti yritykselle (valinnainen)",
    noteToBusinessPlaceholder: "Lyhyt esittely, sijoitusteoria, ehdot…",
    cancel: "Peruuta",
    creating: "Luodaan…",
    createDeal: "Luo kauppa",
  },
};