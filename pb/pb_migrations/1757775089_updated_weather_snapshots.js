/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4208189215")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = \"jz4u6saize7xupr\"",
    "updateRule": "@request.auth.id = \"jz4u6saize7xupr\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4208189215")

  // update collection data
  unmarshal({
    "createRule": null,
    "updateRule": null
  }, collection)

  return app.save(collection)
})
