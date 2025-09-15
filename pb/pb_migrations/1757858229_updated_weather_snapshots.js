/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4208189215")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_K82sHpfWH5` ON `weather_snapshots` (\n  `station_id`,\n  `ts`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4208189215")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
