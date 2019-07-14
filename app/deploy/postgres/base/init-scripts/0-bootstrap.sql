CREATE USER demoz WITH PASSWORD '1234';
CREATE DATABASE products OWNER demoz ;
\connect products ;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" ;