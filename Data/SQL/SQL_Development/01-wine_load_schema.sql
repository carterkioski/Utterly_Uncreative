
CREATE TABLE wine_load (
    id int   NOT NULL,
    country text, 
    description text,
    designation text,
    points int,
    price int,
    province text,
    region_1 text,
    region_2 text,
    taster_name text,
    taster_twit text,
    title text   ,
    variety text ,
    winery text  ,
    vintage int  ,
    winery_up text
);

create index w_1 on wine_load(winery_up);