/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": "id = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = \"jz4u6saize7xupr\"",
    "deleteRule": "",
    "listRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id = \"jz4u6saize7xupr\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  return app.save(collection)
})
