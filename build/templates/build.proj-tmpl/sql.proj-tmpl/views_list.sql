-- VIEW: views_list

--DROP VIEW views_list;

CREATE OR REPLACE VIEW views_list AS
	SELECT
		v.*,
		v.section||' '||v.descr AS user_descr,
		
		CASE WHEN v.c IS NOT NULL THEN 'c="'||v.c||'"' ELSE '' END
		||CASE WHEN v.f IS NOT NULL THEN CASE WHEN v.c IS NULL THEN '' ELSE ' ' END||'f="'||v.f||'"' ELSE '' END
		||CASE WHEN v.t IS NOT NULL THEN CASE WHEN v.c IS NULL AND v.f IS NULL THEN '' ELSE ' ' END||'t="'||v.t||'"' ELSE '' END
		||CASE WHEN v.limited IS NOT NULL AND v.limited THEN CASE WHEN v.c IS NULL AND v.f IS NULL AND v.t IS NULL THEN '' ELSE ' ' END||'limit="TRUE"' ELSE ''
		END
		AS href
	FROM views AS v
	ORDER BY v.section,v.descr
	;
	
ALTER VIEW views_list OWNER TO ;

