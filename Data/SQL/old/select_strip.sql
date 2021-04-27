select operating_name, SUBSTRING(operating_name, 1, LENGTH(operating_name) - POSITION(, REVERSE(operating_name)))
from address_strip  