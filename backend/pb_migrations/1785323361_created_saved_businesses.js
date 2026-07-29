/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "@request.auth.id != '' && investor = @request.auth.id",
    "deleteRule": "investor = @request.auth.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": true,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation2344283430",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "investor",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": true,
        "collectionId": "pbc_3548013948",
        "help": "",
        "hidden": false,
        "id": "relation148074040",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "business",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
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
    "id": "pbc_4036804225",
    "indexes": [],
    "listRule": "investor = @request.auth.id",
    "name": "saved_businesses",
    "system": false,
    "type": "base",
    "updateRule": "investor = @request.auth.id",
    "viewRule": "investor = @request.auth.id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4036804225");

  return app.delete(collection);
})
