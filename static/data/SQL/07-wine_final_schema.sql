--drop table wine_final;
CREATE TABLE wine_final (
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
    winery_up text,
    owner_name text,
    permit_number text,
    operating_name text,
    street text, 
    city text,
    state text,
    zip text,
    county text,
    latitude text,
    longitude text,
	merge_name text
);
