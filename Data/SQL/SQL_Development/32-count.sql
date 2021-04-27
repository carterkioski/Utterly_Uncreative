select winery, operating_name, count(*) as wine_count
from wine
group by winery, operating_name
order by winery;