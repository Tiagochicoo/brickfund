/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    // ---- businesses: add city + country ----
    let businesses = app.findCollectionByNameOrId("businesses");
    businesses.fields.add(
        new TextField({ name: "city", max: 120 }),
        new TextField({ name: "country", max: 120 })
    );
    app.save(businesses);

    // ---- users: add city + country ----
    let users = app.findCollectionByNameOrId("users");
    users.fields.add(
        new TextField({ name: "city", max: 120 }),
        new TextField({ name: "country", max: 120 })
    );
    app.save(users);

    // ---- populate existing records from `location` ("City, Country") ----
    const COUNTRY_ALIASES = {
        "UK": "United Kingdom",
        "U.K.": "United Kingdom",
        "USA": "United States",
        "US": "United States",
        "U.S.": "United States",
    };

    function parseLocation(loc) {
        if (!loc) return { city: "", country: "" };
        let parts = loc.split(",").map(function (s) { return s.trim(); });
        let city = parts[0] || "";
        let country = parts[1] || "";
        country = COUNTRY_ALIASES[country] || country;
        return { city: city, country: country };
    }

    ["businesses", "users"].forEach(function (colName) {
        try {
            let records = app.findRecordsByFilter(colName, "1=1");
            records.forEach(function (r) {
                let loc = r.get("location") || "";
                if (!loc) return;
                let parsed = parseLocation(loc);
                if (parsed.city) r.set("city", parsed.city);
                if (parsed.country) r.set("country", parsed.country);
                app.save(r);
            });
        } catch (e) {}
    });
}, (app) => {
    ["businesses", "users"].forEach(function (colName) {
        try {
            let col = app.findCollectionByNameOrId(colName);
            ["city", "country"].forEach(function (n) {
                try { col.fields.remove(col.fields.getByName(n)); } catch (e) {}
            });
            app.save(col);
        } catch (e) {}
    });
});
