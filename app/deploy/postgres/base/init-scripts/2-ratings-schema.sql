\connect products;
CREATE TABLE IF NOT EXISTS ratings (
  ID            UUID PRIMARY KEY    NOT NULL  DEFAULT uuid_generate_v4(), 
  rating        double precision    NOT NULL,  
  product_id    UUID                references products(ID),
  posting_date  DATE                NOT NULL  DEFAULT CURRENT_DATE
);
ALTER TABLE ratings OWNER TO demoz;