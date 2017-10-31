-- VIEW: views_section_list

--DROP VIEW views_section_list;

CREATE OR REPLACE VIEW views_section_list AS
	SELECT
		DISTINCT section
	FROM views
	ORDER BY section
	;
	
ALTER VIEW views_section_list OWNER TO ;
