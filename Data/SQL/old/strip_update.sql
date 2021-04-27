update address_strip
set operating_name_strip = LTRIM(RTRIM(operating_name)) 
where regexp_replace(operating_name, '^.* ', '') 
in (put list here)  