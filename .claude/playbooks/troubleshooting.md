# Playbook: troubleshooting

| Symptom                              | Likely cause                              | Fix                                                        |
| ------------------------------------ | ----------------------------------------- | ---------------------------------------------------------- |
| Tiles are blank                      | geom not in 3857 at tile time             | `mvt_tile` must `ST_Transform(geom, 3857)` before AsMVTGeom|
| Tiles 500, "function mvt_tile"       | migrations not applied                    | re-run migrations, check `db/migrations` ran on init       |
| Layer draws in wrong place           | wrong SRID on ingest                      | reproject `-s_srs 32642 -t_srs 4326`, verify `ST_SRID`     |
| Map blank, console token error       | missing `VITE_MAPBOX_TOKEN`               | set it in `.env`, rebuild frontend                         |
| CORS error in browser                | `CORS_ORIGIN` mismatch                     | set to the frontend origin, restart backend                |
| Raster not showing                   | COG path or TiTiler url wrong             | validate COG, check `VITE_TITILER_URL` and `?url=`         |
| Ingest fails on DSAS field           | field name case or length                 | map via loader, see data-contract                          |
| Port already in use                  | another compose project on this machine   | check `docker ps`, keep our ports 5442/3046/3047/3048/5182 |

First steps: `docker compose ps`, then `docker compose logs -f <service>`. Reproduce the
exact failing request with `curl -i` before changing code.
