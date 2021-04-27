select winery_up, operating_name 
from address_load a, wine_ca w
where (w.winery_up LIKE (a.operating_name || '%')
or a.operating_name LIKE ( w.winery_up || '%'))
and w.winery_up <> a.operating_name
order by winery_up desc;