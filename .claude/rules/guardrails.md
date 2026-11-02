# Guardrails

Hard rules for every agent on this project. Violating these breaks the build or the deploy.

## Fixed values, never change
- Database name `coastal_morphology_NGT`, host port `5442`, internal `5432`.
- Backend `3046`, geoprocessing `3047`, TiTiler `3048`, frontend `5182`, db `5442`.
- Host port `8000` belongs to another project's tiles on this machine. Never bind it.
- These host ports were chosen to avoid the other compose projects already running here.
  Check `docker ps` before adding or moving a published port.
- Compose project namespace `coastal_morphology`. Never reuse another project's namespace
  or container names (for example `global-wildfire-portal` and its `gwf-*` containers).
- Vector SRID flow: source `32642` in, stored and served as `4326`, tiled as `3857`.

## Style
- No em-dashes anywhere. Use commas, parentheses, or two sentences.
- Tailwind for CSS, react-icons for icons. Lucide is banned.
- Keep skills, playbooks, and rules compact. Prefer a table or a short list over prose.

## Safety
- Never read, print, or commit `.env` or any secret. `.env.example` only.
- Raw data in `Coastal Morphology/data/` is read only. Ingest writes to PostGIS and `COG_DIR`.
- SQL is always parameterized. No string concatenation of user input into queries.
- No destructive shell (`rm -rf`, dropping volumes) without an explicit request.
- This project is self contained. Do not import config or code from other projects.

## Boundaries
- Stay in your agent's directory. Cross a seam only through the documented contract
  (REST in `backend/API.md`, SQL functions in `db/`, ingest tables, MVT schema).
- Change a shared contract in one place, then update every consumer in the same change.
- Reuse before you write. New shared helper goes in `shared/` or `app/common/`, not inline.
