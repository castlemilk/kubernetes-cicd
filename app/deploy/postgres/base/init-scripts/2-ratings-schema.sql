\connect products;
CREATE TABLE IF NOT EXISTS ratings (
  ID            UUID PRIMARY KEY    NOT NULL  DEFAULT uuid_generate_v4(), 
  product_id    UUID                references products(ID),
  rating        double precision    NOT NULL,  
  posting_date  DATE                NOT NULL  DEFAULT CURRENT_DATE
);
ALTER TABLE ratings OWNER TO demoz;