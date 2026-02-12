DO
$$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'passion') THEN
    CREATE ROLE passion LOGIN PASSWORD 'passion';
  END IF;
END
$$;

GRANT ALL PRIVILEGES ON DATABASE passion_load TO passion;
