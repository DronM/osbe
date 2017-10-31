<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:import href="constants.xsl"/> <!--CONSTANTS-->
<xsl:output method="html" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<xsl:decimal-format name="rur" NaN="0.00"
decimal-separator="." grouping-separator="'"/>
<xsl:decimal-format name="usd" NaN="0.00"
decimal-separator="." grouping-separator="'"/>
<xsl:decimal-format name="euro" NaN="0.00"
decimal-separator="." grouping-separator="'"/>

<xsl:variable name="LIST_MODE" select="/document/data[@id='ModelVars']/row/field[@id='listMode']"/>
<xsl:variable name="LIST_FROM" select="/document/data[@id='ModelVars']/row/field[@id='listFrom']"/>
<xsl:variable name="LIST_CNT" select="/document/data[@id='ModelVars']/row/field[@id='listCnt']"/>
<xsl:variable name="CONTROLLER" select="/document/data[@id='ModelVars']/row/field[@id='controller']"/>
<xsl:variable name="PAGE_TITLE" select="/document/data[@id='ModelVars']/row/field[@id='title']"/>
<xsl:variable name="BASE_PATH" select="/document/data[@id='ModelVars']/row/field[@id='basePath']"/>
<xsl:variable name="SCRIPT_ID" select="/document/data[@id='ModelVars']/row/field[@id='scriptId']"/>


<!-- Main template-->
<xsl:template match="/">
<xsl:variable name="pageAuthor" select="document/data[@id='ModelVars']/row/field[@id='author']"/>
<xsl:variable name="pageKeywords" select="document/data[@id='ModelVars']/row/field[@id='keywords']"/>
<xsl:variable name="pageDescr" select="document/data[@id='ModelVars']/row/field[@id='description']"/>

<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
		<xsl:if test="$pageAuthor">
			<meta name="Author" content="{$pageAuthor}"></meta>
		</xsl:if>
		<xsl:if test="$pageKeywords">
			<meta name="Keywords" content="{$pageKeywords}"></meta>
		</xsl:if>
		<xsl:if test="$pageDescr">
			<meta name="Description" content="{$pageDescr}"></meta>
		</xsl:if>
		
		<xsl:apply-templates select="document/data[@id='ModelStyleSheet']/row"/>
		<xsl:apply-templates select="document/data[@id='ModelJavaScript']/row"/>
		<title><xsl:value-of select="$PAGE_TITLE"/></title>
	</head>
	<body>
		<!-- errors if any-->
		<xsl:apply-templates select="data[@id='ModelServResponse']/row"/>
		
		<!-- all data-->
		<xsl:apply-templates select="document/controls"/>
	</body>
</html>	
</xsl:template>

<xsl:template match="controls">
	<div>
		<xsl:apply-templates/>
	</div>
</xsl:template>

<xsl:template name="fieldLabel">
	<xsl:param name="label"/>
	<xsl:param name="field"/>
	<xsl:param name="required"/>
	<xsl:variable name="label_text">
		<xsl:choose>
			<xsl:when test="string-length(normalize-space($label))">
				<xsl:value-of select="$label"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$field"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	
	<xsl:element name="label">
		<xsl:if test="$required='1'">
			<xsl:attribute name="class"><xsl:value-of select="'required'"/></xsl:attribute>
		</xsl:if>
		<xsl:attribute name="for"><xsl:value-of select="$field"/></xsl:attribute>
		<xsl:value-of select="$label_text"/>:
	</xsl:element>
	
</xsl:template>

<!-- INT, Float, String, Date, DateTime, Time,Password -->
<xsl:template match="edit">
	<xsl:variable name="wd">
		<xsl:choose>
			<xsl:when test="number(@displayWidth) &gt; 0">
				<xsl:value-of select="number(@displayWidth)"/>
			</xsl:when>
				<!--default widths for all data types -->
				<xsl:choose>
					<xsl:when test="@dataType='INT'">
						<xsl:value-of select="$DEF_WIDTH_INT"/>
					</xsl:when>
					<xsl:when test="@dataType='FLOAT'">
						<xsl:value-of select="$DEF_WIDTH_FLOAT"/>
					</xsl:when>
					<xsl:when test="@dataType='DATETIME'">
						<xsl:value-of select="$DEF_WIDTH_DATETIME"/>
					</xsl:when>
					<xsl:when test="@dataType='DATE'">
						<xsl:value-of select="$DEF_WIDTH_DATE"/>
					</xsl:when>
					<xsl:when test="@dataType='TIME'">
						<xsl:value-of select="$DEF_WIDTH_TIME"/>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="0"/>
					</xsl:otherwise>
				</xsl:choose>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="width" select="concat('width:',$wd,'px')"/>	

	<div class="field_set">
		<!-- label -->
		<xsl:call-template name="fieldLabel">
			<xsl:with-param name="label" select="@label"/>
			<xsl:with-param name="field" select="@id"/>
			<xsl:with-param name="required" select="@required"/>
		</xsl:call-template>				
		
		<xsl:element name="input">
			<!-- class attr-->
			<xsl:if test="string-length(normalize-space($className))">
				<xsl:attribute name="class"><xsl:value-of select="@className"/></xsl:attribute>
			</xsl:if>
			<xsl:attribute name="name"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="id"><xsl:value-of select="concat('_',@id)"/></xsl:attribute>	
			<xsl:attribute name="type">text</xsl:attribute>	
			<xsl:if test="$wd &gt; 0">
				<xsl:attribute name="style"><xsl:value-of select="$width"/></xsl:attribute>	
			</xsl:if>
			<xsl:attribute name="value"><xsl:value-of select="node()"/></xsl:attribute>
		</xsl:element>
	</div>		
</xsl:template>

<!-- blank methods -->
<xsl:template match="data[@id='ModelJavaScript']"/>
<xsl:template match="data[@id='ModelStyleSheet']"/>
<xsl:template match="data[@id='ModelVars']"/>
<xsl:template match="metaData[@id='ModelVars']"/>

<!-- specific tag output-->
<xsl:template match="data[@id='ModelStyleSheet']/row">
	<link rel="stylesheet" href="{field[@id='href']}" type="text/css"/>
</xsl:template>
<xsl:template match="data[@id='ModelServResponse']/row">
	<xsl:if test="not(field[@id='result']='0')">
		<div class="error">
			<xsl:value-of select="field[@id='descr']"/>
		</div>
	</xsl:if>
</xsl:template>
<xsl:template match="data[@id='ModelJavaScript']/row">
</xsl:template>


</xsl:stylesheet>