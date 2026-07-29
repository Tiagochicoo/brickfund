/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1564425120");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 200,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select1602912115",
        "maxSelect": 1,
        "name": "source",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "select",
        "values": [
          "stripe",
          "documenso"
        ]
      },
      {
        "help": "",
        "hidden": false,
        "id": "bool670768011",
        "name": "processed",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text1574812785",
        "max": 2000,
        "min": 0,
        "name": "error",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "json1110206997",
        "maxSize": 0,
        "name": "payload",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_1564425120",
    "indexes": [],
    "listRule": null,
    "name": "webhook_events",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
})
