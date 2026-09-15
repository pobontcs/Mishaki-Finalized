"""
Helper script to initialize PostgreSQL database 'mishaki_db' and seed tables.
Reads DATABASE_URL from .env.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

def init_postgres():
    db_url = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@localhost:5432/mishaki_db")
    
    # Strip sqlalchemy driver prefix for standard psycopg2
    clean_url = db_url.replace("postgresql+psycopg2://", "postgresql://")
    parsed = urlparse(clean_url)
    
    db_name = parsed.path.lstrip("/") or "mishaki_db"
    user = parsed.username or "postgres"
    password = parsed.password or ""
    host = parsed.hostname or "localhost"
    port = parsed.port or 5432

    print(f"Connecting to PostgreSQL at {host}:{port} as user '{user}'...")
    
    # Connect to default 'postgres' database to check/create target database
    try:
        conn = psycopg2.connect(
            dbname="postgres",
            user=user,
            password=password,
            host=host,
            port=port
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()

        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s;", (db_name,))
        exists = cursor.fetchone()

        if not exists:
            print(f"Creating database '{db_name}'...")
            cursor.execute(f'CREATE DATABASE "{db_name}";')
            print(f"✓ Database '{db_name}' created successfully.")
        else:
            print(f"✓ Database '{db_name}' already exists.")

        cursor.close()
        conn.close()

    except psycopg2.OperationalError as e:
        print("\n❌ Could not connect to PostgreSQL:")
        print(f"   {e}")
        print("\nPlease update your database password or username in `server/.env`:")
        print(f'   DATABASE_URL="postgresql+psycopg2://{user}:YOUR_PASSWORD@{host}:{port}/{db_name}"\n')
        return False

    # Now run seed script
    print(f"🌱 Seeding database '{db_name}'...")
    from seed import seed_database
    seed_database()
    return True

if __name__ == "__main__":
    success = init_postgres()
    sys.exit(0 if success else 1)
