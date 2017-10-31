-- VIEW: banks_group_list

--DROP VIEW banks_group_list;

CREATE OR REPLACE VIEW banks_group_list AS
	SELECT
		b.*
	FROM banks AS b
	WHERE b.tgroup=TRUE
	ORDER BY b.name
	;
	
ALTER VIEW banks_group_list OWNER TO ;
