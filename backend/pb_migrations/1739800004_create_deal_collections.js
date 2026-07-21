/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let users = app.findCollectionByNameOrId("users");

    // ---- deals ----
    // Mutations go through Next.js admin client; party read for direct SDK use.
    let deals = new Collection({
        type: "base",
        name: "deals",
        listRule: "buyer = @request.auth.id || seller = @request.auth.id",
        viewRule: "buyer = @request.auth.id || seller = @request.auth.id",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [],
    });
    deals.fields.add(
        new RelationField({ name: "business", required: true, maxSelect: 1, collectionId: app.findCollectionByNameOrId("businesses").id }),
        new RelationField({ name: "buyer", required: true, maxSelect: 1, collectionId: users.id }),
        new RelationField({ name: "seller", required: true, maxSelect: 1, collectionId: users.id }),
        new TextField({ name: "name", required: true, max: 200 }),
        new TextField({ name: "description", max: 2000 }),
        new NumberField({ name: "priceCents", required: true, min: 0 }),
        new NumberField({ name: "platformFeeCents", required: true, min: 0 }),
        new TextField({ name: "currency", required: true, max: 8 }),
        new SelectField({
            name: "state",
            required: true,
            maxSelect: 1,
            values: [
                "negotiating", "loi_sent", "loi_signed", "apa_sent", "apa_signed",
                "funds_held", "handover_confirmed", "completed", "declined", "refunded", "disputed",
            ],
        }),
        new TextField({ name: "paymentIntentId", max: 120 }),
        new TextField({ name: "chargeId", max: 120 }),
        new TextField({ name: "transferId", max: 120 }),
        new NumberField({ name: "loiDocumentId", min: 0 }),
        new NumberField({ name: "apaDocumentId", min: 0 }),
        new TextField({ name: "fundsHeldAt", max: 40 }),
        new TextField({ name: "buyerConfirmedAt", max: 40 }),
        new TextField({ name: "sellerConfirmedAt", max: 40 }),
        new AutodateField({ name: "created", onCreate: true }),
        new AutodateField({ name: "updated", onCreate: true, onUpdate: true })
    );
    app.save(deals);

    let dealEvents = new Collection({
        type: "base",
        name: "deal_events",
        listRule: "deal.buyer = @request.auth.id || deal.seller = @request.auth.id",
        viewRule: "deal.buyer = @request.auth.id || deal.seller = @request.auth.id",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [],
    });
    dealEvents.fields.add(
        new RelationField({ name: "deal", required: true, maxSelect: 1, collectionId: deals.id, cascadeDelete: true }),
        new TextField({ name: "type", required: true, max: 80 }),
        new TextField({ name: "message", required: true, max: 2000 }),
        new RelationField({ name: "actor", maxSelect: 1, collectionId: users.id }),
        new JSONField({ name: "metadata" }),
        new AutodateField({ name: "created", onCreate: true })
    );
    app.save(dealEvents);

    let webhookEvents = new Collection({
        type: "base",
        name: "webhook_events",
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [],
    });
    webhookEvents.fields.add(
        new TextField({ name: "id", primaryKey: true, required: true, max: 200 }),
        new SelectField({ name: "source", required: true, maxSelect: 1, values: ["stripe", "documenso"] }),
        new BoolField({ name: "processed" }),
        new TextField({ name: "error", max: 2000 }),
        new JSONField({ name: "payload" }),
        new AutodateField({ name: "created", onCreate: true })
    );
    app.save(webhookEvents);

    let stripeAccounts = new Collection({
        type: "base",
        name: "stripe_accounts",
        listRule: "owner = @request.auth.id",
        viewRule: "owner = @request.auth.id",
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [],
    });
    stripeAccounts.fields.add(
        new RelationField({ name: "owner", required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true }),
        new TextField({ name: "stripeAccountId", required: true, max: 120 }),
        new BoolField({ name: "payoutsEnabled" }),
        new BoolField({ name: "detailsSubmitted" }),
        new AutodateField({ name: "created", onCreate: true }),
        new AutodateField({ name: "updated", onCreate: true, onUpdate: true })
    );
    app.save(stripeAccounts);
}, (app) => {
    ["stripe_accounts", "webhook_events", "deal_events", "deals"].forEach((n) => {
        try { app.deleteCollection(n); } catch (e) {}
    });
});
