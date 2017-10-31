<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:import href="Model_js.xsl"/>

<!-- -->
<xsl:variable name="MODEL_ID" select="'MainMenuContent'"/>
<!-- -->

<xsl:output method="text" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
			
<xsl:template match="/">
	<xsl:apply-templates select="metadata/models/model[@id=$MODEL_ID]"/>
</xsl:template>
			
<xsl:template match="model"><![CDATA[]]>/**	
 * @author Andrey Mikhalevich &lt;katrenplus@mail.ru>, 2017
 * @class
 * @classdesc Model class. Created from template build/templates/models/Model_js.xsl. !!!DO NOT MODEFY!!!
 
 * @extends ModelXML
 
 * @requires core/extend.js
 * @requires controls/ModelXML.js
 
 * @param string id 
 * @param {namespace} options
 */
<xsl:variable name="model_id" select="concat(@id,'_Model')"/>
function <xsl:value-of select="$model_id"/>(options){
	var id = '<xsl:value-of select="$model_id"/>';
	options = options || {};
	
	options.fields = {};
	<!--
	<xsl:apply-templates/>
	-->
	var filed_options = {};
	filed_options.primaryKey = true;
	filed_options.autoInc = true;		
	options.fields.id = new FieldInt("id",filed_options);
				
	var filed_options = {};
	filed_options.primaryKey = false;	
	options.fields.descr = new FieldString("descr",filed_options);
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	options.fields.viewid = new FieldString("viewid",filed_options);
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	options.fields.viewdescr = new FieldString("viewdescr",filed_options);
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	options.fields["default"] = new FieldBool("default",filed_options);
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	options.fields.glyphclass = new FieldString("glyphclass",filed_options);
		
	options.tagModel = "menu";
	options.tagRow = "menuitem";
	
	options.primaryKeyIndex = true;
	options.markOnDelete = false;
	options.sequences = {"id":0};
	options.namespace = "http://www.katren.org/crm/doc/mainmenu"
	
	<xsl:value-of select="$model_id"/>.superclass.constructor.call(this,id,options);
}
extend(<xsl:value-of select="$model_id"/>,ModelXMLTree);

MainMenuContent_Model.prototype.getParentId = function(){	
	var par_id;
	if (this.m_currentRow &amp;&amp; this.m_currentRow.parentNode &amp;&amp; this.m_currentRow.parentNode!=this.m_node){
		par_id = this.m_currentRow.parentNode.getAttribute("id");
	}
	return par_id;
}

MainMenuContent_Model.prototype.setRowValues = function(row){
	for (var id in this.m_fields){
		if (this.m_fields[id].isSet()){
			row.setAttribute(id,this.m_fields[id].getValue());
		}
	}
}

MainMenuContent_Model.prototype.makeRow = function(){
	var row = document.createElement(this.getTagRow());
	for (var fid in this.m_fields){
		var cell = document.createElement(fid);
		var v = "";
		if (this.m_fields[fid].isSet()){
			v = this.m_fields[fid].getValue();
		}
		row.setAttribute(fid,v);
	}
	return row;
}

MainMenuContent_Model.prototype.fetchRow = function(row){
	var attrs = row.attributes;
	if (attrs){		
		if (attrs.descr) this.m_fields.descr.setValue(attrs.descr.nodeValue);
		if (attrs.viewid) this.m_fields.viewid.setValue(attrs.viewid.nodeValue);
		this.m_fields.glyphclass.setValue((attrs.glyphclass)? attrs.glyphclass.nodeValue:undefined);
		if (attrs["default"]) this.m_fields["default"].setValue(attrs["default"].nodeValue);		
		
		this.m_fields.viewdescr.setValue(( (attrs.viewdescr)? attrs.viewdescr.nodeValue:"") );		
		this.m_fields.id.setValue(attrs.id.nodeValue);
	}

	return true;
}

ModelXML.prototype.initSequences = function(){
	for (sid in this.m_sequences){
		this.m_sequences[sid] = (this.m_sequences[sid]==undefined)? 0:this.m_sequences[sid];
		var rows = this.getRows();
		for (var r=0;r &lt; rows.length;r++){
			if (rows[r].attributes &amp;&amp; rows[r].attributes.id){
				var dv = parseInt(rows[r].attributes.id.nodeValue,10);
				if (this.m_sequences[sid] &lt; dv){
					this.m_sequences[sid] = dv;
				}
			}
		}
	}
}

<![CDATA[]]>
</xsl:template>
			
</xsl:stylesheet>
