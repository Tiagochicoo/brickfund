/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // ---- users (extend default auth collection) ----
    let users = app.findCollectionByNameOrId("users");
    users.listRule = "@request.auth.id != ''";
    users.viewRule = "";
    users.createRule = "";
    users.updateRule = "id = @request.auth.id";
    users.deleteRule = "id = @request.auth.id";
    users.fields.add(
        new TextField({ name: "name", required: true, min: 2, max: 80 }),
        new SelectField({ name: "role", required: true, presentable: true, maxSelect: 1, values: ["business", "investor"] }),
        new TextField({ name: "company", max: 120 }),
        new SelectField({ name: "investorType", maxSelect: 1, values: ["individual", "firm", "fund"] }),
        new BoolField({ name: "accredited" }),
        new NumberField({ name: "budgetMin", min: 0 }),
        new NumberField({ name: "budgetMax", min: 0 }),
        new TextField({ name: "phone", max: 40 }),
        new TextField({ name: "location", max: 120 }),
        new FileField({ name: "avatar", maxSelect: 1, maxSize: 5242880, mimeTypes: ["image/png", "image/jpeg", "image/webp"] })
    );
    app.save(users);

    // ---- businesses (base) ----
    // NB: field instances passed in the `new Collection({ fields: [...] })`
    // constructor are silently ignored — use fields.add() instead.
    let businesses = new Collection({
        type: "base",
        name: "businesses",
        listRule: "",
        viewRule: "",
        createRule: "",
        updateRule: "",
        deleteRule: "",
        fields: []
    });
    businesses.fields.add(
        new RelationField({ name: "owner", required: true, maxSelect: 1, collectionId: users.id, cascadeDelete: true }),
        new TextField({ name: "name", required: true, min: 2, max: 120 }),
        new SelectField({ name: "category", required: true, presentable: true, maxSelect: 1, values: ["restaurant", "barber", "gym", "cafe", "retail", "salon", "bakery", "bar", "other"] }),
        new SelectField({ name: "investmentType", required: true, presentable: true, maxSelect: 1, values: ["seed", "growth", "loan", "equity", "revenue_share", "convertible_note"] }),
        new TextField({ name: "location", required: true, max: 120 }),
        new TextField({ name: "pitch", required: true, max: 160 }),
        new TextField({ name: "description", max: 2000 }),
        new NumberField({ name: "fundingGoal", required: true, min: 1 }),
        new NumberField({ name: "fundingRaised", min: 0 }),
        new FileField({ name: "image", maxSelect: 1, maxSize: 10485760, mimeTypes: ["image/png", "image/jpeg", "image/webp"] }),
        new BoolField({ name: "published" }),
        new AutodateField({ name: "created", onCreate: true }),
        new AutodateField({ name: "updated", onCreate: true, onUpdate: true })
    );
    app.save(businesses);
}, (app) => {
    try { app.deleteCollection("businesses"); } catch (e) {}
    try {
        let users = app.findCollectionByNameOrId("users");
        ["name", "role", "company", "investorType", "accredited", "budgetMin", "budgetMax", "phone", "location", "avatar"].forEach((n) => {
            try { users.fields.remove(users.fields.getByName(n)); } catch (e) {}
        });
        app.save(users);
    } catch (e) {}
});
