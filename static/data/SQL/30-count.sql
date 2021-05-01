select winery, count(*) as wine_count
from wine
group by winery
order by wine_count desc;