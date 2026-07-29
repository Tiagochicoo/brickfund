/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select4236555370",
    "maxSelect": 1,
    "name": "investmentType",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "seed",
      "growth",
      "loan",
      "equity",
      "revenue_share",
      "convertible_note",
      "trespasse"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3548013948")

  // update field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "select4236555370",
    "maxSelect": 1,
    "name": "investmentType",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "seed",
      "growth",
      "loan",
      "equity",
      "revenue_share",
      "convertible_note"
    ]
  }))

  return app.save(collection)
})
