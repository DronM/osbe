/*Function: banks_upsert(
	in_bik varchar(9),
	in_codegr varchar(9),
	in_name varchar(50),
	in_korshet varchar(20),
	in_adres varchar(70),
	in_gor varchar(31),
	in_tgroup bool
)
*/
/*
 DROP FUNCTION banks_upsert(
	in_bik varchar(9),
	in_codegr varchar(9),
	in_name varchar(50),
	in_korshet varchar(20),
	in_adres varchar(70),
	in_gor varchar(31),
	in_tgroup bool
);
*/

CREATE OR REPLACE FUNCTION banks_upsert(
	in_bik varchar(9),
	in_codegr varchar(9),
	in_name varchar(50),
	in_korshet varchar(20),
	in_adres varchar(70),
	in_gor varchar(31),
	in_tgroup bool
)
  RETURNS void AS
$$
BEGIN
	UPDATE banks SET
		codegr = in_codegr,
		name = in_name,
		korshet = in_korshet,
		adres = in_adres,
		gor = in_gor,
		tgroup = in_tgroup
	WHERE bik = in_bik
	;
	IF FOUND THEN
		RETURN;
	END IF;

	INSERT INTO banks
	(bik,codegr,name,korshet,adres,gor,tgroup)
	VALUES (in_bik,in_codegr,in_name,in_korshet,in_adres,in_gor,in_tgroup);
    
END;
$$
  LANGUAGE plpgsql VOLATILE
  CALLED ON NULL INPUT
  COST 100;
ALTER FUNCTION banks_upsert(
	in_bik varchar(9),
	in_codegr varchar(9),
	in_name varchar(50),
	in_korshet varchar(20),
	in_adres varchar(70),
	in_gor varchar(31),
	in_tgroup bool
) OWNER TO ;
