# GDAL + Python base so osgeo, ogr2ogr, gdal_translate are all present.
FROM ghcr.io/osgeo/gdal:ubuntu-small-3.8.5

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt ./
# The GDAL base is Ubuntu 22.04 (pip 22.x), which has no PEP 668 lock, so a plain
# install is correct here. Do not add --break-system-packages, that flag is newer pip only.
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 3047
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3047", "--reload"]
