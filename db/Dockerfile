FROM postgis/postgis:16-3.4

# Migrations are the single source of truth. On first boot (empty data dir) the
# entrypoint runs this shell script, which applies every migration in order.
COPY migrations/ /migrations/
COPY init/00_run_migrations.sh /docker-entrypoint-initdb.d/00_run_migrations.sh
RUN chmod +x /docker-entrypoint-initdb.d/00_run_migrations.sh
