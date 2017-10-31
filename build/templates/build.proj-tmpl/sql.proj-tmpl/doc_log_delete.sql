-- Function: doc_log_delete(doc_types, integer)

-- DROP FUNCTION doc_log_delete(doc_types, integer);

CREATE OR REPLACE FUNCTION doc_log_delete(in_doc_type doc_types, in_doc_id integer)
  RETURNS void AS
$BODY$
DECLARE
	v_doc_id integer;
	v_date_time timestamp without time zone;
BEGIN
	/*
	IF NOT doc_operative_processing(in_doc_type,in_doc_id) THEN
	ELSIF coalesce(
		(SELECT t.doc_log_date_time=(SELECT t2.date_time FROM doc_log t2 WHERE t2.doc_type=in_doc_type AND t2.doc_id=in_doc_id)
			FROM seq_violations AS t
			LIMIT 1
		),
		FALSE) THEN
	END IF;
	*/
	DELETE FROM doc_log WHERE doc_type=in_doc_type AND doc_id=in_doc_id;
	
END;	
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_log_delete(doc_types, integer)
  OWNER TO ;

