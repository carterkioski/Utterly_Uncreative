select a.owner_name 
from address_load a, wine_load w
where a.operating_name=w.winery;