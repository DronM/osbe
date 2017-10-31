<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="text" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

<xsl:variable name="ALL" select="'all'"/>
<xsl:variable name="ENUM_ROLE" select="'role_types'"/>

<xsl:template match="/"><![CDATA[<?php]]>
function method_allowed_for_role($contrId,$methId,$roleId){
$permissions = array();
<xsl:apply-templates select="metadata/permissions/permission"/>
return array_key_exists($contrId.'_'.$methId.'_'.$roleId,$permissions);
}
<![CDATA[?>]]>
</xsl:template>

<xsl:template match="permission">
<xsl:variable name="opt_val">
	<xsl:choose>
	<xsl:when test="@type='allow'">TRUE</xsl:when>
	<xsl:otherwise>FALSE</xsl:otherwise>
	</xsl:choose>
</xsl:variable>

<xsl:variable name="perm_meth_id" select="@methodId"/>
<xsl:variable name="perm_role_id" select="@roleId"/>
<xsl:variable name="perm_contr_id" select="@controllerId"/>

<xsl:choose>
<xsl:when test="@controllerId=$ALL">
	<!-- ALL CONTROLLERS -->	
	<xsl:for-each select="/metadata/controllers/controller">
		<xsl:variable name="contr_id" select="@id"/>
		<xsl:choose>
		<xsl:when test="$perm_meth_id=$ALL">
			<!-- ALL METHODS -->
			<xsl:for-each select="/metadata/controllers/controller[@id=$contr_id]/publicMethod">
				<xsl:variable name="meth_id" select="@id"/>
				<xsl:choose>			
				<xsl:when test="$perm_role_id=$ALL">
					<!-- ALL Roles -->
					<xsl:for-each select="/metadata/enums/enum[@id='role_types']/value">
					$permissions['<xsl:value-of select="$contr_id"/>_Controller_<xsl:value-of select="$meth_id"/>_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
					</xsl:for-each>		
				</xsl:when>
				<xsl:otherwise>
					<!-- Specific role -->
					$permissions['<xsl:value-of select="$contr_id"/>_Controller_<xsl:value-of select="$meth_id"/>_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
				</xsl:otherwise>
				</xsl:choose>			
			</xsl:for-each>
		</xsl:when>
		<xsl:otherwise>
			<!-- Specific method -->
			<xsl:choose>
			<xsl:when test="$perm_role_id=$ALL">
				<!-- ALL Roles -->
				<xsl:for-each select="/metadata/enums/enum[@id='role_types']/value">
				$permissions['<xsl:value-of select="$contr_id"/>_Controller_<xsl:value-of select="$perm_meth_id"/>_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
				</xsl:for-each>		
			</xsl:when>
			<xsl:otherwise>
				<!-- Specific role -->
				$permissions['<xsl:value-of select="$contr_id"/>_Controller_<xsl:value-of select="$perm_meth_id"/>_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
			</xsl:otherwise>
			</xsl:choose>			
		</xsl:otherwise>
		</xsl:choose>
		
		<!-- EXTRA SPECIFIC METHODS -->
		<xsl:if test="@processable='TRUE'">
		<xsl:choose>
		<xsl:when test="$perm_role_id=$ALL">
			<!-- ALL Roles -->
			<xsl:for-each select="/metadata/enums/enum[@id='role_types']/value">
			$permissions['<xsl:value-of select="$contr_id"/>_Controller_get_actions_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
			$permissions['<xsl:value-of select="$contr_id"/>_Controller_set_unprocessed_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
			</xsl:for-each>		
		</xsl:when>
		<xsl:otherwise>
			<!-- Specific role -->
			$permissions['<xsl:value-of select="$contr_id"/>_Controller_get_actions_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
			$permissions['<xsl:value-of select="$contr_id"/>_Controller_set_unprocessed_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
		</xsl:otherwise>
		</xsl:choose>			
		</xsl:if>

		<xsl:if test="@details='TRUE'">
		<xsl:choose>
		<xsl:when test="$perm_role_id=$ALL">
			<!-- ALL Roles -->
			<xsl:for-each select="/metadata/enums/enum[@id='role_types']/value">
			$permissions['<xsl:value-of select="$contr_id"/>_Controller_get_details_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
			$permissions['<xsl:value-of select="$contr_id"/>_Controller_before_open_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
			</xsl:for-each>		
		</xsl:when>
		<xsl:otherwise>
			<!-- Specific role -->
			$permissions['<xsl:value-of select="$contr_id"/>_Controller_get_details_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
			$permissions['<xsl:value-of select="$contr_id"/>_Controller_before_open_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
		</xsl:otherwise>
		</xsl:choose>			
		</xsl:if>
		
	</xsl:for-each>
</xsl:when>
<xsl:otherwise>
	<!-- Specific controller -->
	<xsl:choose>
	<xsl:when test="$perm_meth_id=$ALL">
		<!-- ALL METHODS -->
		<xsl:variable name="role_id" select="@roleId"/>
		<xsl:for-each select="/metadata/controllers/controller[@id=$perm_contr_id]/publicMethod">
			<xsl:variable name="meth_id" select="@id"/>
			<xsl:choose>
			<xsl:when test="$perm_role_id=$ALL">
				<!-- ALL Roles -->
				<xsl:for-each select="/metadata/enums/enum[@id='role_types']/value">
				$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_<xsl:value-of select="$meth_id"/>_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
				</xsl:for-each>
			</xsl:when>
			<xsl:otherwise>
				<!-- Specific role -->
				$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_<xsl:value-of select="$meth_id"/>_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
			</xsl:otherwise>
			</xsl:choose>		
		</xsl:for-each>		
	</xsl:when>
	<xsl:otherwise>
		<!-- Specific method -->
		<xsl:choose>
		<xsl:when test="$perm_role_id=$ALL">
			<!-- ALL Roles -->
			<xsl:for-each select="/metadata/enums/enum[@id='role_types']/value">
			$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_<xsl:value-of select="$perm_meth_id"/>_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
			</xsl:for-each>		
		</xsl:when>
		<xsl:otherwise>
			<!-- Specific role -->
			$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_<xsl:value-of select="$perm_meth_id"/>_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
		</xsl:otherwise>
		</xsl:choose>
		
	</xsl:otherwise>
	</xsl:choose>
	
	<!-- EXTRA SPECIFIC METHODS -->
	<xsl:if test="@processable='TRUE'">
	<xsl:choose>
	<xsl:when test="$perm_role_id=$ALL">
		<!-- ALL Roles -->
		<xsl:for-each select="/metadata/enums/enum[@id='role_types']/value">
		$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_get_actions_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
		$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_set_unprocessed_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
		</xsl:for-each>		
	</xsl:when>
	<xsl:otherwise>
		<!-- Specific role -->
		$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_get_actions_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
		$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_set_unprocessed_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
	</xsl:otherwise>
	</xsl:choose>			
	</xsl:if>

	<xsl:if test="@details='TRUE'">
	<xsl:choose>
	<xsl:when test="$perm_role_id=$ALL">
		<!-- ALL Roles -->
		<xsl:for-each select="/metadata/enums/enum[@id='role_types']/value">
		$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_get_details_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
		$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_before_open_<xsl:value-of select="@id"/>']=<xsl:value-of select="$opt_val"/>;
		</xsl:for-each>		
	</xsl:when>
	<xsl:otherwise>
		<!-- Specific role -->
		$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_get_details_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
		$permissions['<xsl:value-of select="$perm_contr_id"/>_Controller_before_open_<xsl:value-of select="$perm_role_id"/>']=<xsl:value-of select="$opt_val"/>;
	</xsl:otherwise>
	</xsl:choose>			
	</xsl:if>
	
</xsl:otherwise>
</xsl:choose>

</xsl:template>

</xsl:stylesheet>
