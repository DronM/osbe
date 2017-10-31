<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:import href="Controller_php.xsl"/>

<!-- -->
<xsl:variable name="CONTROLLER_ID" select="'VariantStorage'"/>
<!-- -->

<xsl:output method="text" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
			
<xsl:template match="/">
	<xsl:apply-templates select="metadata/controllers/controller[@id=$CONTROLLER_ID]"/>
</xsl:template>

<xsl:template match="controller"><![CDATA[<?php]]>
<xsl:call-template name="add_requirements"/>

require_once(FRAME_WORK_PATH.'basic_classes/ParamsSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/VariantStorage.php');

class <xsl:value-of select="@id"/>_Controller extends <xsl:value-of select="@parentId"/>{
	public function __construct($dbLinkMaster=NULL){
		parent::__construct($dbLinkMaster);<xsl:apply-templates/>
	}	
	<xsl:call-template name="extra_methods"/>
}
<![CDATA[?>]]>
</xsl:template>

<xsl:template name="extra_methods">
	public function insert($pm){
		$pm->setParamValue("user_id",$_SESSION['user_id']);
		parent::insert($pm);
	}

	public function delete($pm){
		$params = new ParamsSQL($pm,$this->getDbLink());
		$params->addAll();
	
		$pm->setParamValue("user_id",$_SESSION['user_id']);
		parent::delete($pm);
		
		VariantStorage::clear($params->getVal("storage_name"));
	}

	public function upsert($pm,$dataCol){
		$params = new ParamsSQL($pm,$this->getDbLink());
		$params->addAll();
	
		$this->getDbLinkMaster()->query(sprintf(
		"SELECT variant_storages_upsert_%s(%d,%s,%s,%s,%s)",
		$dataCol,
		$_SESSION['user_id'],
		$params->getDbVal("storage_name"),
		$params->getDbVal("variant_name"),
		$params->getDbVal($dataCol),
		$params->getDbVal("default_variant")
		));
		
		VariantStorage::clear($params->getVal("storage_name"));
	}
	
	public function upsert_filter_data($pm){
		$this->upsert($pm,'filter_data');
	}

	public function upsert_col_visib_data($pm){
		$this->upsert($pm,'col_visib_data');
	}

	public function upsert_col_order_data($pm){
		$this->upsert($pm,'col_visib_order');
	}
	
	public function get_list($pm){
		$params = new ParamsSQL($pm,$this->getDbLink());
		$params->addAll();
		$this->AddNewModel(sprintf(
			"SELECT
				user_id,
				storage_name,
				variant_name,
				default_variant
			FROM variant_storages
			WHERE user_id=%d AND storage_name=%s",
			$_SESSION['user_id'],
			$params->getParamById('storage_name')
			),
		"VariantStorageList_Model"
		);
	}	
	
	public function get_obj_col($pm,$dataCol){
		$params = new ParamsSQL($pm,$this->getDbLink());
		$params->addAll();
		$this->AddNewModel(sprintf(
			"SELECT
				user_id,
				storage_name,
				variant_name,
				%s,
				default_variant
			FROM variant_storages
			WHERE user_id=%d AND storage_name=%s AND variant_name=%s",
			$dataCol,
			$_SESSION['user_id'],
			$params->getParamById('storage_name'),
			$params->getParamById('variant_name')
			),
		"VariantStorage_Model"
		);
	}
	
	public function get_filter_data($pm){
		$this->get_obj_col($pm,'filter_data');
	}	
	public function get_col_visib_data($pm){
		$this->get_obj_col($pm,'col_visib_data');
	}	
	public function get_col_order_data($pm){
		$this->get_obj_col($pm,'col_order_data');
	}	
	
</xsl:template>

</xsl:stylesheet>
