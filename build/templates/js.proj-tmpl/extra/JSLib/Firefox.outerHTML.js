/************************************************************
 * Javascript Lib V1.2
 * CONTACT: jerry.wang@clochase.com
 *
 * Add  outerHTML for Firefox
 ************************************************************/
var emptyElements = 
{
	HR: true, BR: true, IMG: true, INPUT: true
};
var specialElements = 
{
	TEXTAREA: true
};
	
	
function __getOuterHTML (node) 
{
	var html = '';
	switch (node.nodeType) 
	{
		case Node.ELEMENT_NODE:
			html += '<';
			html += node.nodeName;
			if (!specialElements[node.nodeName]) 
			{
				for (var a = 0; a < node.attributes.length; a++)
				html += ' ' + node.attributes[a].nodeName.toUpperCase() +
				'="' + node.attributes[a].nodeValue + '"';
				html += '>'; 
				if (!emptyElements[node.nodeName]) 
				{
					html += node.innerHTML;
					html += '<\/' + node.nodeName + '>';
				}
			}
			else 
				switch (node.nodeName) 
				{
					case 'TEXTAREA':
						for (var a = 0; a < node.attributes.length; a++)
						if (node.attributes[a].nodeName.toLowerCase() != 'value')
						html += ' ' + node.attributes[a].nodeName.toUpperCase() +
						'="' + node.attributes[a].nodeValue + '"';
						else 
						var content = node.attributes[a].nodeValue;
						html += '>'; 
						html += content;
						html += '<\/' + node.nodeName + '>';
						break; 
				}
			break;

		case Node.TEXT_NODE:
			html += node.nodeValue;
			break;

		case Node.COMMENT_NODE:
			html += '<!' + '--' + node.nodeValue + '--' + '>';
			break;
	}
	return html;
}

function __setOuterHTML(s)
{
	var range = s.ownerDocument.createRange();
	range.setStartBefore(this);
	var fragment = range.createContextualFragment(s);
	this.parentNode.replaceChild(fragment, this);
}


if(window.HTMLElement) 
{
	HTMLElement.prototype.__defineGetter__( "outerHTML", function () {  return __getOuterHTML(this); } );
	HTMLElement.prototype.__defineSetter__( "outerHTML", function(sHTML)
	{
        var r=this.ownerDocument.createRange();
        r.setStartBefore(this);
        var df=r.createContextualFragment(sHTML);
        this.parentNode.replaceChild(df,this);
        return sHTML;
     }
     );
}

