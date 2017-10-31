<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<xsl:template match="metadata">	
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
				<div class="section-title">Controllers</div>
				<ul>				
				<xsl:for-each select="controllers/controller">
					<xsl:sort select="@id"/>
					<li>
						<a href="#{@id}_Controller"><xsl:value-of select="@id"/>_Controller</a>
					</li>
				</xsl:for-each>
				</ul>
				<div class="section-title">Models</div>
				<ul>
				<xsl:for-each select="models/model">
					<li>
						<a href="#{@id}_Model"><xsl:value-of select="@id"/>_Model</a>
					</li>
				</xsl:for-each>
				</ul>
			
				<div class="section-title">Enumerations</div>
				<ul>				
				<xsl:for-each select="enums/enum">
					<li>
						<a href="#{@id}"><xsl:value-of select="@id"/></a>
					</li>
				</xsl:for-each>				
				</ul>
			</div>
			
			<div class="content">
			<xsl:for-each select="controllers/controller">				
				<xsl:sort select="@id"/>
				<div id="{@id}_Controller" class="content_box">
					<h1><xsl:value-of select="@id"/>_Controller</h1>
					<div class="content_item">
					<p class="big"><xsl:value-of select="descr"/></p>
					<p>Методы:</p>
					<xsl:for-each select="publicMethod">
						<h2><xsl:value-of select="@id"/></h2>
						<xsl:if test="descr">
							<p class="big"><xsl:value-of select="descr"/></p>
						</xsl:if>
						<xsl:if test="retModels">
							<p>Return models:</p>
							<xsl:for-each select="retModels/retModel">
								<xsl:if test="position() &gt; 0">, </xsl:if>
								<a href="#{@id}_Model">Model: <xsl:value-of select="@id"/>_Model</a>								
							</xsl:for-each>
						</xsl:if>
						<xsl:choose>
						<xsl:when test="@modelId">
							<a href="#{@modelId}_Model">Model: <xsl:value-of select="@modelId"/>_Model</a>
						</xsl:when>
						<xsl:otherwise>
							<p>Arguments:</p>
							<div class="content_item content_item2">
							<xsl:for-each select="field">
								<h3><xsl:value-of select="@id"/></h3>
								<p><xsl:value-of select="@descr"/></p>
								<div class="content_item content_item3">
								<p>Type:<xsl:value-of select="@dataType"/></p>
								<p>Required:
								<xsl:choose><xsl:when test="@required='TRUE'">Да</xsl:when>
								<xsl:otherwise>Нет</xsl:otherwise>
								</xsl:choose>
								</p>
								<xsl:if test="@length">
									<p>Length:<xsl:value-of select="@length"/></p>
								</xsl:if>
								<xsl:if test="@precision">
									<p>Precision:<xsl:value-of select="@precision"/></p>
								</xsl:if>								
								</div>
							</xsl:for-each>
							<xsl:if test="@retModel">
								<p>Return model:{@retModel}</p>
							</xsl:if>								
							</div>
						</xsl:otherwise>
						</xsl:choose>
					</xsl:for-each>
					</div>
				</div>
			</xsl:for-each>			
			
			<!-- модели -->
			<xsl:for-each select="models/model">				
				<xsl:sort select="@id"/>
				<div id="{@id}_Model" class="content_box">
					<h1><xsl:value-of select="@id"/>_Model</h1>
					<div class="content_item">
					<xsl:if test="descr">
						<p class="big"><xsl:value-of select="descr"/></p>
					</xsl:if>
					<p>Поля:</p>
					<xsl:for-each select="field">
						<h2><xsl:value-of select="@id"/></h2>
						<xsl:if test="descr">
							<p class="big"><xsl:value-of select="descr"/></p>
						</xsl:if>
						<xsl:if test="@descr">
							<p class="big"><xsl:value-of select="@descr"/></p>
						</xsl:if>
						
						<div>Type:<xsl:value-of select="@dataType"/></div>
						<div>Primary key:<xsl:value-of select="@primaryKey"/></div>
						<div>Required:<xsl:value-of select="@required"/></div>
						<div>Length:<xsl:value-of select="@length"/></div>
						<div>Precision:<xsl:value-of select="@precision"/></div>
					</xsl:for-each>
					</div>
				</div>
			</xsl:for-each>			
			
			<!-- модели -->
			<xsl:for-each select="enums/enum">				
				<xsl:sort select="@id"/>
				<div id="{@id}" class="content_box">
					<h1><xsl:value-of select="@id"/></h1>
					<div class="content_item">
					<p class="big"><xsl:value-of select="descr"/></p>
					<p>Values:</p>
					<xsl:for-each select="value">
						<h2><xsl:value-of select="@id"/></h2>
						<div>Description:<xsl:value-of select="@descr"/></div>
					</xsl:for-each>
					</div>
				</div>
			</xsl:for-each>			
			
			</div>
		</div>
		
	</body>
</html>	
</xsl:template>

</xsl:stylesheet>
