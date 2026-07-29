/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(20, new Field({
    "help": "",
    "hidden": false,
    "id": "bool1694014235",
    "name": "termsAccepted",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3986216602",
    "max": 0,
    "min": 0,
    "name": "termsVersion",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2406996434",
    "max": 0,
    "min": 0,
    "name": "ticketMin",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(23, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3011176075",
    "max": 0,
    "min": 0,
    "name": "ticketMax",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(24, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3709889147",
    "max": 0,
    "min": 0,
    "name": "bio",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(25, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text93372675",
    "max": 0,
    "min": 0,
    "name": "experience",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("bool1694014235")

  // remove field
  collection.fields.removeById("text3986216602")

  // remove field
  collection.fields.removeById("text2406996434")

  // remove field
  collection.fields.removeById("text3011176075")

  // remove field
  collection.fields.removeById("text3709889147")

  // remove field
  collection.fields.removeById("text93372675")

  return app.save(collection)
})
