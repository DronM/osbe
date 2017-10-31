<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="text" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<xsl:template match="enums/enum"><![CDATA[]]>/* Copyright (c) 2016
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
/** Requirements
 * @requires core/extend.js
*/

/* constructor
@param string id
@param object options{
}
*/
<xsl:variable name="enum_id" select="concat('EnumGridColumn_',@id)"/>
function <xsl:value-of select="$enum_id"/>(id,options){
	options = options || {};
	
	options.multyLangValues = {};
	<xsl:apply-templates select="value"/>
	
	<xsl:value-of select="$enum_id"/>.superclass.constructor.call(this,id,options);
	
}
extend(<xsl:value-of select="$enum_id"/>,GridColumnEnum);
<![CDATA[]]>
</xsl:template>


<xsl:template match="value">
<xsl:if test="position() = 1">
<xsl:for-each select="./*">
	options.multyLangValues.<xsl:value-of select="local-name()"/> = {};
</xsl:for-each>
</xsl:if>

<xsl:for-each select="./*">
	options.multyLangValues.<xsl:value-of select="local-name()"/>.<xsl:value-of select="../@id"/> = "<xsl:value-of select="@descr"/>";
</xsl:for-each>

</xsl:template>


</xsl:stylesheet>
