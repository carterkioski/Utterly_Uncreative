select winery, operating_name 
from address_load a, wine_load w
where w.winery_up SIMILAR TO a.operating_name
order by winery_up desc;