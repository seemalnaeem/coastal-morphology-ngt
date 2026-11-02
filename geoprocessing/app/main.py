"""FastAPI surface for the geoprocessing service.

Ingest can run as a CLI (python -m app.ingest) or on demand over HTTP here.
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from .common.logging import get_logger
from .ingest import run
from .loaders.registry import VECTOR_LAYERS

log = get_logger("api")

app = FastAPI(title="Coastal Morphology Geoprocessing", version="1.0.0")


class IngestRequest(BaseModel):
    target: str = "all"            # all | vectors | raster | <layer>
    region: str | None = None      # sindh | balochistan | None for both


@app.get("/health")
def health():
    return {"status": "ok", "layers": VECTOR_LAYERS}


@app.post("/ingest")
def ingest(req: IngestRequest):
    try:
        return {"ok": True, "result": run(req.target, req.region)}
    except SystemExit as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        log.exception("ingest failed")
        raise HTTPException(status_code=500, detail=str(e))
