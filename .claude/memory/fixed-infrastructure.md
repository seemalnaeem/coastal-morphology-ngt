---
name: fixed-infrastructure
description: Names, ports, and SRIDs that are fixed by the user and must not change
metadata:
  type: project
---

Fixed by the user, do not change without being asked:

- Database name `coastal_morphology_NGT`, host port 5442 (internal 5432).
- Backend Express 3046, geoprocessing FastAPI 3047 (both in the 304x range).
- TiTiler host 3048 (container 80). Host 8000 is used by another project's tiles on this
  machine, so this project must never bind 8000.
- Frontend Vite 5182.
- Docker container namespace `coastal_morphology`.
- SRID flow: source 32642 (UTM 42N) to stored 4326 to tiled 3857.

The database was renamed from the earlier `global-wildfire` placeholder to
`coastal_morphology_NGT` at the user's request. See [[decisions]].
