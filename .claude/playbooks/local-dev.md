# Playbook: local dev

Bring the whole portal up and load data.

```bash
cp .env.example .env                 # set POSTGRES_PASSWORD and later VITE_MAPBOX_TOKEN
docker compose up -d --build         # db, backend, geoprocessing, titiler, frontend
docker compose ps                    # all healthy?
docker compose run --rm geoprocessing python -m app.ingest all
```

Check:
- DB: `docker compose exec db psql -U coastal -d coastal_morphology_NGT -c "\dt"`
- API: `curl http://localhost:3046/api/health` and `curl -I http://localhost:3046/tiles/transect/8/160/110.pbf`
- Tiles: `curl -I "http://localhost:3048/cog/info?url=file:///data/cog/slr_impact.tif"`
- UI: open http://localhost:5182

Common moves:
- Rebuild one service: `docker compose up -d --build backend`
- Tail logs: `docker compose logs -f backend`
- Reset db: `docker compose down -v` then up and re-ingest (destructive, ask first).
