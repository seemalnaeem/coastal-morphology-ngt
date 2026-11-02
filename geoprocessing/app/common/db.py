"""Thin database helpers. One connection factory, used everywhere."""
from contextlib import contextmanager

import psycopg

from .config import DATABASE_URL


@contextmanager
def connect():
    """Yield a connection that commits on success and rolls back on error."""
    conn = psycopg.connect(DATABASE_URL)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def execute(sql: str, params: tuple | None = None):
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute(sql, params)


def count(table: str, region: str | None = None) -> int:
    where = "WHERE region = %s" if region else ""
    params = (region,) if region else None
    with connect() as conn:
        with conn.cursor() as cur:
            cur.execute(f"SELECT count(*) FROM {table} {where}", params)
            return cur.fetchone()[0]
