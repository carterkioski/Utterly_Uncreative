insert into wine_final
select w.*, a.* 
from address_load a, wine_ca w
where w.winery_up = a.merge_name