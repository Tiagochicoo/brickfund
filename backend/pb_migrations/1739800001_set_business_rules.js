/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    let businesses = app.findCollectionByNameOrId("businesses");
    businesses.listRule = "published = true || @request.auth.role = 'investor' || owner = @request.auth.id";
    businesses.viewRule = "published = true || @request.auth.role = 'investor' || owner = @request.auth.id";
    businesses.createRule = "@request.auth.role = 'business'";
    businesses.updateRule = "owner = @request.auth.id";
    businesses.deleteRule = "owner = @request.auth.id";
    app.save(businesses);
}, (app) => {
    let businesses = app.findCollectionByNameOrId("businesses");
    businesses.listRule = "";
    businesses.viewRule = "";
    businesses.createRule = "";
    businesses.updateRule = "";
    businesses.deleteRule = "";
    app.save(businesses);
});
