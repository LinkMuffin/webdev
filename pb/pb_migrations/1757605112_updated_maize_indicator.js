/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_264724548")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2791459747",
    "max": null,
    "min": null,
    "name": "water_balance_mm",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select3707631805",
    "maxSelect": 1,
    "name": "stress_level",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "ok",
      "warnung",
      "kritisch"
    ]
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select1346980723",
    "maxSelect": 1,
    "name": "plant_state",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "vital",
      "gestresst",
      "vertrocknet"
    ]
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "date1130519967",
    "max": "",
    "min": "",
    "name": "updated_at",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_264724548")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": null
  }, collection)

  // remove field
  collection.fields.removeById("number2791459747")

  // remove field
  collection.fields.removeById("select3707631805")

  // remove field
  collection.fields.removeById("select1346980723")

  // remove field
  collection.fields.removeById("date1130519967")

  return app.save(collection)
})
