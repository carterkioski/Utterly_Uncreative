select winery, operating_name 
from address_load a, wine_ca w
where w.winery_up LIKE (a.operating_name || '%')
order by winery_up desc;