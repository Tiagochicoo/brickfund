/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // Remove old deal/payment collections from the previous architecture
    for (const name of ["deals", "deal_events", "webhook_events", "stripe_accounts"]) {
        try { app.deleteCollection(name); } catch (e) {}
    }

    let users = app.findCollectionByNameOrId("users");

    // Add terms acceptance + ticket size fields to users
    try { users.fields.remove(users.fields.getByName("accredited")); } catch (e) {}
    try { users.fields.remove(users.fields.getByName("budgetMin")); } catch (e) {}
    try { users.fields.remove(users.fields.getByName("budgetMax")); } catch (e) {}
    try { users.fields.remove(users.fields.getByName("investorType")); } catch (e) {}

    users.fields.add(
        new SelectField({ name: "investorType", maxSelect: 1, values: ["individual", "firm", "fund"] }),
        new BoolField({ name: "termsAccepted" }),
        new TextField({ name: "termsVersion", max: 20 }),
        new TextField({ name: "ticketMin", max: 20 }),
        new TextField({ name: "ticketMax", max: 20 }),
        new TextField({ name: "bio", max: 500 }),
        new TextField({ name: "experience", max: 1000 }),
    );
    app.save(users);

    // Update businesses collection
    let businesses = app.findCollectionByNameOrId("businesses");

    // Remove old money-related fields
    try { businesses.fields.remove(businesses.fields.getByName("fundingRaised")); } catch (e) {}
    try { businesses.fields.remove(businesses.fields.getByName("fundingGoal")); } catch (e) {}

    // Add listing status, progressive disclosure fields
    businesses.fields.add(
        // Status: open, paused, closed
        new SelectField({
            name: "status",
            required: true,
            presentable: true,
            maxSelect: 1,
            values: ["open", "paused", "closed"],
        }),
        // Capital sought (free text, e.g. "€50,000 - €100,000")
        new TextField({ name: "capitalSought", max: 120 }),
        // Use of funds summary
        new TextField({ name: "useOfFunds", max: 1000 }),
        // Revenue range (public)
        new TextField({ name: "revenueRange", max: 120 }),
        // Private description (only visible after interest)
        new TextField({ name: "privateDescription", max: 5000 }),
        // Private financials summary (only visible after interest)
        new TextField({ name: "privateFinancials", max: 5000 }),
        // Private pitch deck URL (only visible after interest)
        new TextField({ name: "privateDeckUrl", max: 500 }),
        // Vetted badge (manual, admin-controlled)
        new BoolField({ name: "vetted" }),
        // Featured on homepage
        new BoolField({ name: "featured" }),
    );

    // Update list/view rules: public sees only status=open
    businesses.listRule = "status = 'open'";
    businesses.viewRule = "";
    businesses.createRule = "@request.auth.role = 'business' && owner = @request.auth.id";
    businesses.updateRule = "owner = @request.auth.id";
    businesses.deleteRule = "owner = @request.auth.id";

    app.save(businesses);

    // ---- interests collection ----
    // An investor marks interest in a business.
    let interests = new Collection({
        type: "base",
        name: "interests",
        listRule: "investor = @request.auth.id || business.owner = @request.auth.id",
        viewRule: "investor = @request.auth.id || business.owner = @request.auth.id",
        createRule: "@request.auth.role = 'investor' && investor = @request.auth.id",
        updateRule: "investor = @request.auth.id",
        deleteRule: "investor = @request.auth.id",
        fields: []
    });
    interests.fields.add(
        new RelationField({ name: "investor", required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true }),
        new RelationField({ name: "business", required: true, maxSelect: 1, collectionId: businesses.id, cascadeDelete: true }),
        new SelectField({
            name: "status",
            required: true,
            presentable: true,
            maxSelect: 1,
            values: ["pending", "accepted", "declined", "withdrawn"],
        }),
        new TextField({ name: "message", max: 1000 }),
        new TextField({ name: "ticketSize", max: 120 }),
        new AutodateField({ name: "created", onCreate: true }),
        new AutodateField({ name: "updated", onCreate: true, onUpdate: true }),
    );
    app.save(interests);

    // ---- messages collection ----
    // Private messages between investor and business after interest.
    let messages = new Collection({
        type: "base",
        name: "messages",
        listRule: "sender = @request.auth.id || recipient = @request.auth.id",
        viewRule: "sender = @request.auth.id || recipient = @request.auth.id",
        createRule: "sender = @request.auth.id",
        updateRule: "sender = @request.auth.id",
        deleteRule: "sender = @request.auth.id",
        fields: []
    });
    messages.fields.add(
        new RelationField({ name: "interest", required: true, maxSelect: 1, collectionId: interests.id, cascadeDelete: true }),
        new RelationField({ name: "sender", required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true }),
        new RelationField({ name: "recipient", required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true }),
        new TextField({ name: "body", required: true, min: 1, max: 2000 }),
        // Attachment type: "text", "document", "financial", "deck"
        new SelectField({ name: "type", required: true, maxSelect: 1, values: ["text", "document", "financial", "deck"] }),
        // Optional file URL or note
        new TextField({ name: "attachmentUrl", max: 500 }),
        new TextField({ name: "attachmentLabel", max: 200 }),
        new BoolField({ name: "read" }),
        new AutodateField({ name: "created", onCreate: true }),
    );
    app.save(messages);

    // ---- saved_businesses collection ----
    // Investors can bookmark businesses without expressing interest.
    let saved = new Collection({
        type: "base",
        name: "saved_businesses",
        listRule: "investor = @request.auth.id",
        viewRule: "investor = @request.auth.id",
        createRule: "@request.auth.role = 'investor' && investor = @request.auth.id",
        updateRule: "investor = @request.auth.id",
        deleteRule: "investor = @request.auth.id",
        fields: []
    });
    saved.fields.add(
        new RelationField({ name: "investor", required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true }),
        new RelationField({ name: "business", required: true, maxSelect: 1, collectionId: businesses.id, cascadeDelete: true }),
        new AutodateField({ name: "created", onCreate: true }),
    );
    app.save(saved);

}, (app) => {
    for (const name of ["saved_businesses", "messages", "interests"]) {
        try { app.deleteCollection(name); } catch (e) {}
    }
    // Restore businesses fields
    try {
        let businesses = app.findCollectionByNameOrId("businesses");
        ["status", "capitalSought", "useOfFunds", "revenueRange", "privateDescription", "privateFinancials", "privateDeckUrl", "vetted", "featured"].forEach((n) => {
            try { businesses.fields.remove(businesses.fields.getByName(n)); } catch (e) {}
        });
        businesses.fields.add(
            new NumberField({ name: "fundingGoal", required: true, min: 1 }),
            new NumberField({ name: "fundingRaised", min: 0 }),
        );
        businesses.listRule = "";
        businesses.viewRule = "";
        app.save(businesses);
    } catch (e) {}
});
