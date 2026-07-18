/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const users = app.findCollectionByNameOrId("users");

    // ---- stripe_accounts: links a user (business) to a Stripe Express account ----
    const stripeAccounts = new Collection({
        type: "base",
        name: "stripe_accounts",
        listRule: "owner = @request.auth.id",
        viewRule: "owner = @request.auth.id",
        createRule: "owner = @request.auth.id",
        updateRule: "owner = @request.auth.id",
        deleteRule: "owner = @request.auth.id",
        fields: []
    });
    stripeAccounts.fields.add(
        new RelationField({ name: "owner", required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true }),
        new TextField({ name: "stripeAccountId", required: true, min: 1, max: 80 }),
        new BoolField({ name: "payoutsEnabled", required: false }),
        new BoolField({ name: "detailsSubmitted", required: false }),
        new AutodateField({ name: "created", onCreate: true }),
        new AutodateField({ name: "updated", onCreate: true, onUpdate: true })
    );
    app.save(stripeAccounts);

    // ---- deals: the acquisition / investment transaction ----
    const deals = new Collection({
        type: "base",
        name: "deals",
        listRule: "buyer = @request.auth.id || seller = @request.auth.id || @request.auth.role = 'admin'",
        viewRule: "buyer = @request.auth.id || seller = @request.auth.id || @request.auth.role = 'admin'",
        createRule: "buyer = @request.auth.id",
        updateRule: "buyer = @request.auth.id || seller = @request.auth.id || @request.auth.role = 'admin'",
        deleteRule: "@request.auth.role = 'admin'",
        fields: []
    });
    deals.fields.add(
        new RelationField({ name: "business", required: true, maxSelect: 1, collectionId: app.findCollectionByNameOrId("businesses").id }),
        new RelationField({ name: "buyer", required: true, maxSelect: 1, collectionId: users.id }),
        new RelationField({ name: "seller", required: true, maxSelect: 1, collectionId: users.id }),
        new TextField({ name: "name", required: true, min: 2, max: 200 }),
        new TextField({ name: "description", max: 5000 }),
        new NumberField({ name: "priceCents", required: true, min: 1000 }),
        new NumberField({ name: "platformFeeCents", required: true, min: 0 }),
        new TextField({ name: "currency", required: true, max: 8 }),
        new SelectField({
            name: "state", required: true, presentable: true, maxSelect: 1,
            values: ["negotiating", "loi_sent", "loi_signed", "apa_sent", "apa_signed", "funds_held", "handover_confirmed", "completed", "declined", "refunded", "disputed"]
        }),
        new TextField({ name: "paymentIntentId", max: 120 }),
        new TextField({ name: "chargeId", max: 120 }),
        new TextField({ name: "transferId", max: 120 }),
        new NumberField({ name: "loiDocumentId" }),
        new NumberField({ name: "apaDocumentId" }),
        new DateField({ name: "fundsHeldAt" }),
        new DateField({ name: "buyerConfirmedAt" }),
        new DateField({ name: "sellerConfirmedAt" }),
        new AutodateField({ name: "created", onCreate: true }),
        new AutodateField({ name: "updated", onCreate: true, onUpdate: true })
    );
    app.save(deals);

    // ---- deal_events: immutable audit log ----
    const dealEvents = new Collection({
        type: "base",
        name: "deal_events",
        listRule: "@request.auth.id != '' && (deal.buyer = @request.auth.id || deal.seller = @request.auth.id || @request.auth.role = 'admin')",
        viewRule: "@request.auth.id != '' && (deal.buyer = @request.auth.id || deal.seller = @request.auth.id || @request.auth.role = 'admin')",
        createRule: "@request.auth.role = 'admin'",
        updateRule: "@request.auth.role = 'admin'",
        deleteRule: "@request.auth.role = 'admin'",
        fields: []
    });
    dealEvents.fields.add(
        new RelationField({ name: "deal", required: true, maxSelect: 1, collectionId: deals.id, cascadeDelete: true }),
        new TextField({ name: "type", required: true, max: 60 }),
        new TextField({ name: "message", required: true, max: 500 }),
        new RelationField({ name: "actor", maxSelect: 1, collectionId: users.id }),
        new JsonField({ name: "metadata" }),
        new AutodateField({ name: "created", onCreate: true })
    );
    app.save(dealEvents);

    // ---- webhook_events: idempotency for Stripe + Documenso ----
    // The record id IS the dedup key (external id). create fails on duplicate id.
    const webhookEvents = new Collection({
        type: "base",
        name: "webhook_events",
        listRule: "@request.auth.role = 'admin'",
        viewRule: "@request.auth.role = 'admin'",
        createRule: "@request.auth.role = 'admin'",
        updateRule: "@request.auth.role = 'admin'",
        deleteRule: "@request.auth.role = 'admin'",
        fields: []
    });
    webhookEvents.fields.add(
        new TextField({ name: "source", required: true, max: 20 }),
        new BoolField({ name: "processed", required: false }),
        new TextField({ name: "error", max: 2000 }),
        new JsonField({ name: "payload" }),
        new AutodateField({ name: "created", onCreate: true })
    );
    app.save(webhookEvents);
}, (app) => {
    ["deals", "deal_events", "webhook_events", "stripe_accounts"].forEach((name) => {
        try { app.deleteCollection(name); } catch (e) {}
    });
});
