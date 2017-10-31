<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<xsl:template match="appStruc">	
	<xsl:variable name="TITLE" select="@descr"/>
<html>
	<head>
		<title>Документация <xsl:value-of select="$TITLE"/></title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=PT+Sans:400,700&amp;subset=latin,cyrillic,latin-ext"/>
		<link href="style.css" type="text/css"  rel="stylesheet" />
	</head>
	
	<body>	
		<div class="header">
            		<div class="docname">Документация <xsl:value-of select="$TITLE"/></div>
        	</div>
		<div class="wrapper">
			<div class="left_sidebar">
				<xsl:for-each select="subsystem">
					<div class="section-title"><xsl:value-of select="@id"/> (<xsl:value-of select="@descr"/>)
						<ul>
							<xsl:for-each select="class">
								<li>
									<a href="#{@id}"><xsl:value-of select="@id"/>; file: <xsl:value-of select="@file"/></a>
								</li>							
							</xsl:for-each>
						</ul>
					</div>
				
				</xsl:for-each>
			</div>
			
			<div class="content">
				<xsl:apply-templates/>
			</div>
		</div>		
	</body>
</html>	
</xsl:template>

<xsl:template match="subsystem">
	<h1 ><xsl:value-of select="@id"/> (<xsl:value-of select="@descr"/>)
		<xsl:apply-templates/>
	</h1>
</xsl:template>

<xsl:template match="class">
	<div id="{@id}" class="content_box">
		<h3>Класс: <xsl:value-of select="@id"/></h3>
		<div class="content_item">
			<p class="big"><xsl:value-of select="descr"/></p>
			<div>Методы:</div>
			<xsl:apply-templates/>
		</div>
	</div>
</xsl:template>

<xsl:template match="class/*">
	<xsl:variable name="visib" select="name()"/>
	<xsl:for-each select="function">
		<div class="content_box">
			<p><xsl:value-of select="$visib"/>.<xsl:value-of select="@id"/>(<xsl:for-each select="params/param"><xsl:if test="position() &gt;1">,</xsl:if><xsl:value-of select="concat(@dataType,' ',@id)"/></xsl:for-each>)</p>
			<xsl:if test="toDo">
				<div>Надо сделать: <xsl:value-of select="toDo"/></div>
			</xsl:if>
			<xsl:apply-templates/>
		</div>
	</xsl:for-each>

</xsl:template>

<xsl:template match="params">
	<div>Параметры:
		<div style="margin-left:50px;">
		<xsl:apply-templates/>
		</div>
	</div>
</xsl:template>

<xsl:template match="param">
	<div style="margin-left:50px;margin-bottom:10px;">
		<div><xsl:value-of select="@id"/> (<xsl:value-of select="@dataType"/>)</div>
		<div><xsl:value-of select="@descr"/></div>
	</div>
</xsl:template>

</xsl:stylesheet>
