insert into wine_count
select variety, count(*), count(distinct(winery)), min(vintage), max(vintage)
from wine_final
group by variety
having count(*) > 37
order by variety;
