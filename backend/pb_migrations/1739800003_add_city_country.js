/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    function hasField(collection, name) {
        try {
            const f = collection.fields.getByName(name);
            return !!f;
        } catch (e) {
            return false;
        }
    }

    let users = app.findCollectionByNameOrId("users");
    if (!hasField(users, "city")) {
        users.fields.add(new TextField({ name: "city", max: 120 }));
    }
    if (!hasField(users, "country")) {
        users.fields.add(new TextField({ name: "country", max: 120 }));
    }
    app.save(users);

    let businesses = app.findCollectionByNameOrId("businesses");
    if (!hasField(businesses, "city")) {
        businesses.fields.add(new TextField({ name: "city", max: 120 }));
    }
    if (!hasField(businesses, "country")) {
        businesses.fields.add(new TextField({ name: "country", max: 120 }));
    }
    app.save(businesses);
}, (app) => {
    try {
        let users = app.findCollectionByNameOrId("users");
        ["city", "country"].forEach((n) => {
            try { users.fields.remove(users.fields.getByName(n)); } catch (e) {}
        });
        app.save(users);
    } catch (e) {}
    try {
        let businesses = app.findCollectionByNameOrId("businesses");
        ["city", "country"].forEach((n) => {
            try { businesses.fields.remove(businesses.fields.getByName(n)); } catch (e) {}
        });
        app.save(businesses);
    } catch (e) {}
});
