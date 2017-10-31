-- Function: doc_log_update(doc_types, integer, timestamp without time zone)

-- DROP FUNCTION doc_log_update(doc_types, integer, timestamp without time zone);

CREATE OR REPLACE FUNCTION doc_log_update(in_doc_type doc_types, in_doc_id integer, in_date_time timestamp without time zone)
  RETURNS void AS
$BODY$
DECLARE
	v_dt timestamp without time zone;
BEGIN

	BEGIN
		UPDATE doc_log SET date_time=in_date_time WHERE doc_type=in_doc_type AND doc_id=in_doc_id AND date_time<>in_date_time;
	EXCEPTION WHEN unique_violation THEN
		SELECT max(date_time) INTO v_dt FROM doc_log WHERE date_trunc('second',date_time) = date_trunc('second',in_date_time);
		
		UPDATE doc_log SET date_time=v_dt+'0.000001 second'::interval
		WHERE doc_type=in_doc_type AND doc_id=in_doc_id AND date_time<>in_date_time;
	END;
	
END;	
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_log_update(doc_types, integer, timestamp without time zone)
  OWNER TO ;

