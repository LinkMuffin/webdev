/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1451495754")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_jHSClmshle` ON `dashboards` (`user`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1451495754")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
