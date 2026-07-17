/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let usersCol = app.findCollectionByNameOrId("users");
    let bizCol = app.findCollectionByNameOrId("businesses");

    function createUser(data) {
        let r = new Record(usersCol);
        r.set("email", data.email);
        r.set("password", data.password);
        r.set("name", data.name);
        r.set("role", data.role);
        r.set("verified", true);
        if (data.company) r.set("company", data.company);
        if (data.location) r.set("location", data.location);
        if (data.investorType) r.set("investorType", data.investorType);
        if (data.accredited !== undefined) r.set("accredited", data.accredited);
        if (data.budgetMin !== undefined) r.set("budgetMin", data.budgetMin);
        if (data.budgetMax !== undefined) r.set("budgetMax", data.budgetMax);
        app.save(r);
        return r.get("id");
    }

    function createBusiness(ownerId, data) {
        let r = new Record(bizCol);
        r.set("owner", ownerId);
        r.set("name", data.name);
        r.set("category", data.category);
        r.set("investmentType", data.investmentType);
        r.set("location", data.location);
        r.set("pitch", data.pitch);
        r.set("description", data.description);
        r.set("fundingGoal", data.fundingGoal);
        r.set("fundingRaised", data.fundingRaised);
        r.set("published", true);
        app.save(r);
        return r.get("id");
    }

    // --- demo users ---
    let ownerId = createUser({
        email: "business@brickfund.local",
        password: "brickfund1234",
        name: "Maria Silva",
        role: "business",
        company: "Bella Vista Group",
        location: "Lisbon, Portugal"
    });
    createUser({
        email: "investor@brickfund.local",
        password: "brickfund1234",
        name: "James Whitfield",
        role: "investor",
        company: "Whitfield Capital",
        location: "London, UK",
        investorType: "firm",
        accredited: true,
        budgetMin: 25000,
        budgetMax: 250000
    });

    // --- demo businesses ---
    let listings = [
        { name: "Bella Vista Trattoria", category: "restaurant", investmentType: "growth", location: "Lisbon, Portugal",
          pitch: "Expanding our riverfront terrace to seat 80 more guests per night.",
          description: "Family-run Italian trattoria on the Tagus waterfront, profitable for 6 years. Funds build a covered terrace and hire 4 staff to double evening covers.",
          fundingGoal: 80000, fundingRaised: 52000 },
        { name: "Sharp & Co. Barbershop", category: "barber", investmentType: "loan", location: "Porto, Portugal",
          pitch: "Relocating to a larger high-street unit after lease loss.",
          description: "Award-winning barbershop forced to relocate. Loan funds the new fit-out, chairs and first 6 months rent on a prime Porto street.",
          fundingGoal: 35000, fundingRaised: 12000 },
        { name: "Iron Temple Gym", category: "gym", investmentType: "seed", location: "Madrid, Spain",
          pitch: "Launching a 24/7 strength & conditioning gym in central Madrid.",
          description: "Founders (ex-pro athletes) opening a flagship 600sqm facility. Seed capital covers equipment deposit, branding and pre-sale marketing.",
          fundingGoal: 150000, fundingRaised: 40000 },
        { name: "Morning Glory Café", category: "cafe", investmentType: "revenue_share", location: "Lisbon, Portugal",
          pitch: "Opening a second location in Lisbon's design district.",
          description: "Specialty coffee roaster with one thriving shop. Revenue-share offer to fund a second venue; backers get a % of monthly revenue for 36 months.",
          fundingGoal: 60000, fundingRaised: 60000 },
        { name: "Bloom & Co.", category: "retail", investmentType: "equity", location: "Barcelona, Spain",
          pitch: "Scaling our florist & plant studio to 3 neighborhoods.",
          description: "Design-led florist with strong online sales. Equity round to open two new studios and grow the corporate events vertical.",
          fundingGoal: 90000, fundingRaised: 18000 },
        { name: "Crust Artisan Bakery", category: "bakery", investmentType: "convertible_note", location: "Lisbon, Portugal",
          pitch: "New stone-hearth ovens to triple sourdough output.",
          description: "Beloved neighborhood bakery at capacity. Convertible note funds commercial ovens and a wholesale delivery van; converts at next priced round.",
          fundingGoal: 45000, fundingRaised: 27000 }
    ];
    listings.forEach((b) => createBusiness(ownerId, b));
}, (app) => {
    try {
        let biz = app.findRecordsByFilter("businesses", "1=1");
        biz.forEach((r) => { try { app.delete(r); } catch (e) {} });
    } catch (e) {}
    ["business@brickfund.local", "investor@brickfund.local"].forEach((email) => {
        try {
            let u = app.findAuthRecordByEmail("users", email);
            if (u) app.delete(u);
        } catch (e) {}
    });
});
