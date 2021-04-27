insert into wine_ca
select * from wine_load where province = 'California'
-- limit 5000