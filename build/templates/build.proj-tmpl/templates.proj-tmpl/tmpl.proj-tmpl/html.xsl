<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="xml" indent="yes" omit-xml-declaration="yes"/>
			
<xsl:template match="serverTemplate">
<xsl:comment>
This file is generated from the template build/templates/tmpl/html.xsl
All direct modification will be lost with the next build.
Edit template instead.
</xsl:comment>
<div id="{{{{id}}}}">
	<div class="row">
		<h1 class="page-header">{{this.HEAD_TITLE}}</h1>
	</div>
</div>
</xsl:template>

</xsl:stylesheet>
