/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4208189215")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number2007079632",
    "max": null,
    "min": null,
    "name": "wind_ms",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "number3295573906",
    "max": null,
    "min": null,
    "name": "gust_kmh",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4208189215")

  // remove field
  collection.fields.removeById("number2007079632")

  // remove field
  collection.fields.removeById("number3295573906")

  return app.save(collection)
})
