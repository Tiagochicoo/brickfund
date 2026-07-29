/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

  // update collection data
  unmarshal({
    "listRule": "published = true && status = 'open'",
    "viewRule": ""
  }, collection)

  // remove field
  collection.fields.removeById("number2045640817")

  // remove field
  collection.fields.removeById("number458094830")

  // add field
  collection.fields.addAt(14, new Field({
    "help": "",
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "open",
      "paused",
      "closed"
    ]
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1530919445",
    "max": 120,
    "min": 0,
    "name": "capitalSought",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3483831290",
    "max": 1000,
    "min": 0,
    "name": "useOfFunds",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3370681334",
    "max": 120,
    "min": 0,
    "name": "revenueRange",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2247529982",
    "max": 5000,
    "min": 0,
    "name": "privateDescription",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1845578533",
    "max": 5000,
    "min": 0,
    "name": "privateFinancials",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2697197164",
    "max": 500,
    "min": 0,
    "name": "privateDeckUrl",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "help": "",
    "hidden": false,
    "id": "bool3634068134",
    "name": "vetted",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "help": "",
    "hidden": false,
    "id": "bool1007901140",
    "name": "featured",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

  // update collection data
  unmarshal({
    "listRule": "published = true || @request.auth.role = 'investor' || owner = @request.auth.id",
    "viewRule": "published = true || @request.auth.role = 'investor' || owner = @request.auth.id"
  }, collection)

  // add field
  collection.fields.addAt(8, new Field({
    "help": "",
    "hidden": false,
    "id": "number2045640817",
    "max": null,
    "min": 1,
    "name": "fundingGoal",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "number458094830",
    "max": null,
    "min": 0,
    "name": "fundingRaised",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("select2063623452")

  // remove field
  collection.fields.removeById("text1530919445")

  // remove field
  collection.fields.removeById("text3483831290")

  // remove field
  collection.fields.removeById("text3370681334")

  // remove field
  collection.fields.removeById("text2247529982")

  // remove field
  collection.fields.removeById("text1845578533")

  // remove field
  collection.fields.removeById("text2697197164")

  // remove field
  collection.fields.removeById("bool3634068134")

  // remove field
  collection.fields.removeById("bool1007901140")

  return app.save(collection)
})
