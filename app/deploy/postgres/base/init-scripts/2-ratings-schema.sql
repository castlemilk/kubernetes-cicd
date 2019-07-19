\connect products;
CREATE TABLE IF NOT EXISTS ratings (
  ID            UUID PRIMARY KEY    NOT NULL  DEFAULT uuid_generate_v4(), 
  product_id    UUID                references products(ID),
  rating        double precision    NOT NULL,  
  posting_date  TIMESTAMP           NOT NULL  DEFAULT CURRENT_TIMESTAMP(2)
);
ALTER TABLE ratings OWNER TO demoz;