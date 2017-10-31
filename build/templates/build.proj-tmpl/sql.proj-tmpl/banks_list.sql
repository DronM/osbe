-- VIEW: banks_list

--DROP VIEW banks_list;

CREATE OR REPLACE VIEW banks_list AS
	SELECT
		b.*,
		bgr.name AS gr_descr
	FROM banks AS b
	LEFT JOIN banks AS bgr ON b.codegr=bgr.bik
	WHERE b.tgroup=FALSE
	ORDER BY b.bik
	;
	
ALTER VIEW banks_list OWNER TO ;
