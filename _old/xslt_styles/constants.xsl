<?xml version="1.0" encoding="UTF-8"?>
<!--  Main menu handling out of a xml hierarchichal structure object   -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html"/> 

<!--CONSTANTS-->
<xsl:variable name="PIC_EDIT" select="'img/cat/cat_edit.png'"/>
<xsl:variable name="PIC_NEW" select="'img/cat/cat_new.png'"/>
<xsl:variable name="PIC_DEL" select="'img/cat/cat_erase.png'"/>
<xsl:variable name="PIC_REFRESH" select="'img/cat/refresh.png'"/>
<xsl:variable name="PIC_EXCEL" select="'img/cat/to_excel.png'"/>

<!-- default widths for data types in px-->
<xsl:variable name="DEF_WIDTH_DATE" select="100"/>
<xsl:variable name="DEF_WIDTH_TIME" select="100"/>
<xsl:variable name="DEF_WIDTH_DATETIME" select="125"/>
<xsl:variable name="DEF_WIDTH_INT" select="65"/>
<xsl:variable name="DEF_WIDTH_FLOAT" select="50"/>
<xsl:variable name="DEF_WIDTH_FILE" select="230"/>

</xsl:stylesheet>