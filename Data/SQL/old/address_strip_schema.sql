
CREATE TABLE address_strip (
    permit_number text   NOT NULL,
    owner_name text,
    operating_name text,
    street text,
    city text  ,
    state text ,
    zip text   ,
    county text,
	operating_name_strip text,
	CONSTRAINT pk_address_strip PRIMARY KEY (
        permit_number
     )
);
