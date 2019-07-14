\connect products;
CREATE TABLE IF NOT EXISTS products (
   ID           UUID PRIMARY KEY    NOT NULL  DEFAULT   uuid_generate_v4(),
   name         varchar(30)          NOT NULL,
   title        varchar(60)         NOT NULL,
   descr        varchar(144)        NOT NULL,
   image_url    varchar(256)        NOT NULL  DEFAULT   'defualt.png'
);
ALTER TABLE products OWNER TO demoz;
