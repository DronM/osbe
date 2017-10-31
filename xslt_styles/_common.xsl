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
		<xsl:apply-templates select="document/metaData"/>
	</body>
</html>	
</xsl:template>

<!-- list output -->
<xsl:template name="list">
	<!-- variables -->
	<xsl:variable name="cmd_insert"
	select="concat($BASE_PATH,'index.php?c=',$CONTROLLER,'&amp;v=ViewHTML&amp;f=get_obj&amp;m=insert')"/>
	<xsl:variable name="cmd_print"
	select="concat($BASE_PATH,'index.php?c=ExcelConv&amp;v=ViewHTML&amp;f=get_list&amp;model=',$CONTROLLER)"/>
	<xsl:variable name="cmd_refresh"
	select="concat($BASE_PATH,'index.php?c=',$CONTROLLER,'&amp;v=ViewHTML&amp;f=get_list&amp;m=view&amp;from=',$LIST_FROM,'&amp;cnt=',$LIST_CNT)"/>
	
	<!-- title -->
	<div class="obj_grid_title"><xsl:value-of select="$PAGE_TITLE"/></div>
	
	<!-- system (insert/update etc) -->
	<xsl:if test="not(@readOnly='1')">
		<div class="model_controls">
			<!-- insert -->
			<a class="model_controls" href="{$cmd_insert}">
				<img class="model_controls" src="{$PIC_NEW}" alt="нов.строка" title="нов.строка"/>
			</a>
			<!-- print -->
			<a class="model_controls" href="{$cmd_print}">
				<img class="model_controls" src="{$PIC_EXCEL}" alt="excel" title="экспорт в Excel"/>
			</a>			
			<!-- refresh -->
			<a class="model_controls" href="{$cmd_refresh}">
				<img class="model_controls" src="{$PIC_REFRESH}" alt="обновить" title="обновить"/>
			</a>						
		</div>
	</xsl:if>
	
	<!-- table -->
	<table id="{@id}" class="model" cellspacing="0" cellpadding="0">	
		<!-- header -->
		<thead>
			<tr>
				<xsl:apply-templates select="field"/>
				<!-- system column -->
				<xsl:if test="not(@readOnly='1')">
					<th>...</th>
				</xsl:if>
			</tr>
		</thead>
		<!-- data rows -->
		<tbody>
			<xsl:apply-templates select="/document/data[@id=@id]"/>
		</tbody>
	</table>
	
	<!-- pagination -->
	
</xsl:template>

<!-- list header -->
<xsl:template match="metaData/field">
	<th><xsl:value-of select="@alias"/></th>
</xsl:template>

<!-- list rows -->
<xsl:template match="data/row">
	<!-- ToDo get rid of this limitation!!! -->
	<xsl:variable name="row_id" select="@id"/>

	<xsl:element name="tr">
		<xsl:choose>
			<xsl:when test="position() mod 2 = 0">
				<xsl:attribute name="even">even</xsl:attribute>
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="odd">odd</xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
		
		<!-- all fields -->
		<xsl:apply-templates select="field"/>
		
		<!-- system column -->
		<xsl:if test="not(@readOnly='1')">		
			<xsl:variable name="cmd_edit"
			select="concat($BASE_PATH,'index.php?c=',$CONTROLLER,'&amp;v=ViewHTML&amp;f=get_obj&amp;m=edit','&amp;id=',$row_id)"/>
			<xsl:variable name="cmd_del"
			select="concat($BASE_PATH,'index.php?c=',$CONTROLLER,'&amp;v=ViewHTML&amp;f=delete&amp;from=',$LIST_FROM,'&amp;cnt=',$LIST_CNT,'&amp;id=',$row_id)"/>
		
			<td>
				<a class="model_controls" href="{$cmd_edit}">
					<img class="model_controls" title="Изменить" alt="ред." src="{$PIC_EDIT}"/>
				</a>
				<a class="model_controls" href="{$cmd_del}">			
					<img class="model_controls" title="Удалить" alt="уд." src="{$PIC_DEL}"/>
				</a>
			</td>
		</xsl:if>
		
	</xsl:element>
</xsl:template>
<!-- list field -->
<xsl:template match="data/row/field">
	<td valign="center">
		<xsl:value-of select="node()" disable-output-escaping="yes"/>
	</td>
</xsl:template>


<!-- dialog output -->
<xsl:template name="dialog">
</xsl:template>

<!-- model output -->
<xsl:template match="metaData">
	<xsl:choose>
		<!-- List mode -->
		<xsl:when test="$LIST_MODE='1'">
			<xsl:call-template name="list"/>
		</xsl:when>
		
		<!-- Dialog mode -->
		<xsl:otherwise>
			<xsl:call-template name="dialog"/>
		</xsl:otherwise>		
	</xsl:choose>
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