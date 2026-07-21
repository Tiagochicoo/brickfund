/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // Keep users.view public so marketplace can expand owner.name (email still gated by emailVisibility).
    // Primary hardening: force owner = auth user on business create.
    let businesses = app.findCollectionByNameOrId("businesses");
    businesses.createRule = "@request.auth.role = 'business' && owner = @request.auth.id";
    app.save(businesses);

    // Users list remains authenticated-only (from base migration).
    let users = app.findCollectionByNameOrId("users");
    users.listRule = "@request.auth.id != ''";
    // View: authenticated users OR public read for display names on listings
    // (PB has no field-level ACLs; emails require emailVisibility=true to appear).
    users.viewRule = "";
    app.save(users);
}, (app) => {
    try {
        let businesses = app.findCollectionByNameOrId("businesses");
        businesses.createRule = "@request.auth.role = 'business'";
        app.save(businesses);
    } catch (e) {}
});
