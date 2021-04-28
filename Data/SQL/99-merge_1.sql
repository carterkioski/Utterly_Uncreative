select winery, count(owner_name) as wine_count
from address_load a, wine_load w
where a.operating_name=w.winery_up
group by winery
order by wine_count desc;