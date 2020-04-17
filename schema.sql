DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude VARCHAR(10, 7),
  longitude VARCHAR(10, 7)
)
