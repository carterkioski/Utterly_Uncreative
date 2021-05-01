drop table address_load;
CREATE TABLE address_load (
    permit_number text   NOT NULL,
    owner_name text,
    operating_name text,
    street text,
    city text  ,
    state text ,
    zip text   ,
    county text,
    latitude text,
    longitude text,
    merge_name text,	
		
    CONSTRAINT pk_address_load PRIMARY KEY (
        permit_number
     )
);

create index w_2 on address_load (merge_name);