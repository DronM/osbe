-- Function: doc_log_insert(doc_types, integer, timestamp without time zone)

-- DROP FUNCTION doc_log_insert(doc_types, integer, timestamp without time zone);

CREATE OR REPLACE FUNCTION doc_log_insert(in_doc_type doc_types, in_doc_id integer, in_date_time timestamp without time zone)
  RETURNS void AS
$BODY$
DECLARE
	v_dt timestamp without time zone;
	/*
	v_t int;
	v_done bool;
	v_time numeric(8,6);
	*/
BEGIN
	/*
	v_t = 0;
	v_time = 0.000001;
	*/
	
	BEGIN
		INSERT INTO doc_log (doc_type,doc_id,date_time)
		VALUES (
			in_doc_type,
			in_doc_id,
			in_date_time
		);
	EXCEPTION WHEN unique_violation THEN
		SELECT max(date_time) INTO v_dt FROM doc_log WHERE date_trunc('second',date_time) = date_trunc('second',in_date_time);
		
		INSERT INTO doc_log (doc_type,doc_id,date_time)
		VALUES (
			in_doc_type,
			in_doc_id,
			v_dt+ '0.000001 second'::interval
		);
		
	END;
	
	/*
	LOOP
		v_done = TRUE;
		
		BEGIN
			INSERT INTO doc_log (doc_type,doc_id,date_time)
			VALUES (
				in_doc_type,
				in_doc_id,
				in_date_time+ ( (v_time*v_t) || ' second')::interval
			);
		EXCEPTION WHEN unique_violation THEN
			v_done = FALSE;
			v_t = v_t + 1;
		END;
		
		IF v_done THEN
			EXIT;
		END IF;
		
	END LOOP;
	*/
	
	PERFORM seq_viol_materials_set_on_doc(in_doc_type, in_doc_id);
	
END;	
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION doc_log_insert(doc_types, integer, timestamp without time zone)
  OWNER TO ;

