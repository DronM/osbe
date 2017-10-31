/**	
 * Basic functions
 
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2010
 
 * @namespace

 */
var DOMHelper = {

	/**
	 * creates new DOM node
	 * @public
	 * @returns {DOMNode}
	 * @param {string} tagName HTML tag name
	 * @param {Object} opts - new node attributes
	 */
	elem:function(tagName,opts){
		var e = document.createElement(tagName);
		opts = opts || {};
		for (var i in opts){
			e.setAttribute(i,opts[i]);
		}
		return (e);
	},	
	
	/**
	 * adds new attribute to a node
	 * @public
	 */
	setAttr:function(node, attrName, attrValue){
		if (node){
			//try{
			node.setAttribute(attrName,attrValue);
			/*
			}
			catch(e){
			console.log("attrName="+attrName+" attrValue="+attrValue)
			}
			*/
		}
	},
	
	/**
	 * returns attribute of a node
	 * @returns {string} - attribute value
	 * @public
	 */	
	getAttr:function(node, name){
		if (node && node.attributes){
			return node.getAttribute(name);
		}
	},
	
	/**	
	 * Deletes attribute of a node by attribute's name
	 * @public
	 * @param {DOMNode} node
	 * @param {string} name - attribute to delete
	 */		
	delAttr:function(node, name){
		if (node){
			return node.removeAttribute(name);
		}
	},
		
	addAttr:function(node,name,val){
		this.setAttr(node,name,val);
	},
	
	/**	
	 * Deletes DOM node
	 * @public
	 * @param {DOMNode} node
	 */			
	delNode:function(node){
		if (node && node.parentNode)
			node.parentNode.removeChild(node);
	},	
	
	/**	
	 * Deletes all nodes on class. In fact it runs delNodes("class",classVal)
	 * @public
	 * @param {string} classVal
	 */				
	delNodesOnClass:function(classVal){
		this.delNodes("class",classVal)
	},

	/**	
	 * Deletes all nodes on attribute name and value
	 * @public
	 * @param {string} attrName
	 * @param {string} attrVal
	 */					
	delNodesOnAttr:function(attrName,attrVal){
		var body = document.getElementsByTagName("body")[0];
		var list = this.getElementsByAttr(attrVal, body, attrName);
		for (var i=0;i<list.length;i++){
			this.delNode(list[i]);
			//body.removeChild();
		}
	},
	
	/**	
	 * Returns all DOM nodes on attribute value
	 * @public
	 * @returns {array} - array of DOMNodes
	 
	 * @param {string} classStr - list of attribute values separated by space
	 * @param {DOMNode} node - node for searching
	 * @param {string} attrName - atrib name for searching
	 * @param {bool} uniq - if true, only first value will be retrieved
	 * @param {string} tag - constrains search to a specific tag name
	 */						
	getElementsByAttr:function(classStr, node, attrName, uniq,tag) {
		tag = tag || "*";
		var node = node || document;
		var list = node.getElementsByTagName(tag);
		var length = list.length;
		var classArray = classStr.split(/\s+/);
		var classes = classArray.length;
		var result = new Array();
		for(var i = 0; i < length; i++) {
			if (uniq && result.length>0)break;
			for(var j = 0;j<classes;j++)  {
				if (
					((attrName=='class')&&(list[i].className!=undefined
					&& typeof list[i].className=='string')
						&&(list[i].className.search('\\b' + classArray[j] + '\\b') != -1))
					||
					((list[i].attributes!=undefined)
				&&(list[i].getAttribute(attrName)!=undefined)
				&&(list[i].getAttribute(attrName).search('\\b' + classArray[j] + '\\b') != -1)) 
				){
					result.push(list[i]);
					break;			
				}
			}
		}
		return result;
	},
	
	/**	
	 * swaps classes of a given node
	 * @public
	 * @param {DOMNode} node
	 * @param {string} new_class
	 * @param {string} old_class
	 */					
	swapClasses:function(node, new_class, old_class){
		node.className = node.className.replace(old_class,new_class);
	},
	
	/**	
	 * Adds class to a DOM node
	 * @public
	 * @param {DOMNode} node
	 * @param {string} classToAdd
	 */						
	addClass:function(node, classToAdd){
		var re = new RegExp("(^|\\s)" + classToAdd + "(\\s|$)", "g");
		if (!node || re.test(node.className)) return;
		node.className = (node.className + " " + classToAdd).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	},		  
	
	/**	
	 * Removes class from a DOM node
	 * @public
	 * @param {DOMNode} node
	 * @param {string} classToRemove
	 */							
	delClass:function(node, classToRemove){
		if (!node || !node.className)return;
		var re = new RegExp("(^|\\s)" + classToRemove + "(\\s|$)", "g");
		node.className = node.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
	},

	/**	
	 * Checkes if a DOM node has specific class
	 * @public
	 * @returns {bool}
	 
	 * @param {DOMNode} node
	 * @param {string} classToCheck
	 */								
	hasClass:function(node, classToCheck) {
		return (node)?
			(node.className && new RegExp("(^|\\s)" + classToCheck+ "(\\s|$)").test(node.className)):null;
	},

	/**	
	 * Finds DOMNode by its tag name, which is the parent of a given node
	 * @public
	 * @returns {DOMNode}
	 
	 * @param {DOMNode} node
	 * @param {string} tagName
	 */								
	getParentByTagName:function(node,tagName){
		var p = node.parentNode;
		if (p){
			var tn = tagName.toLowerCase();
			while(p && p.nodeName.toLowerCase()!=tn){
				p = p.parentNode;
			}
			return ((p&&p.nodeName.toLowerCase()==tn)? p:null);
		}
	},
	
	/**	
	 * Returns DOMNode index relative to its parent
	 * @public
	 * @returns {int}
	 
	 * @param {DOMNode} node
	 */										
	getElementIndex:function(node){
		var i=0;
		while(node = node.previousSibling){
			if (node.nodeType === 1){
				i++;
			}
		}
		return i;
	},
	
	/**	
	 * Makes XMLDocument from text 
	 * @public
	 * @returns {XMLDocument}
	 
	 * @param {string} txt
	 */											
	xmlDocFromString:function(txt){		
		return $.parseXML( txt );
		/*
		if (window.DOMParser && ){
			return (new DOMParser()).parseFromString(txt,"text/xml");
		}
		else{// Internet Explorer
			var xmlDoc;
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async=false;
			xmlDoc.loadXML(txt);
			return xmlDoc;
		} 
		*/				
	},
	
	/**	
	 * Makes HTMLDocument from text 
	 * @public
	 * @returns {HTMLDocument}
	 
	 * @param {string} txt
	 */												
	htmlDocFromString:function(txt){		
		return $.parseHTML( txt );
	},

	/**	
	 * Changes DOM node tag name
	 * @public
	 
	 * @param {DOMNode} node
	 * @param {string} tag
	 */													
	setTagName:function(node,tag) {
		var oHTML = node.outerHTML;
		var tempTag = document.createElement(tag);
		var tName = {original: node.tagName.toUpperCase(), change: tag.toUpperCase()};
		if (tName.original == tName.change) return;
		oHTML = oHTML.replace(RegExp("(^\<" + tName.original + ")|(" + tName.original + "\>$)","gi"), function(x){return (x.toUpperCase().replace(tName.original, tName.change));});
		tempTag.innerHTML = oHTML;
		if (tempTag.firstChild)node.parentElement.replaceChild(tempTag.firstChild,node);	
	},

	/**	
	 * Swaps DOM nodes
	 * @public
	 
	 * @param {DOMNode} a
	 * @param {DOMNode} b
	 */													
	swapNodes:function (a,b) {
		var aParent = a.parentNode;
		var bParent = b.parentNode;

		var aHolder = document.createElement("div");
		var bHolder = document.createElement("div");

		aParent.replaceChild(aHolder,a);
		bParent.replaceChild(bHolder,b);

		aParent.replaceChild(b,aHolder);
		bParent.replaceChild(a,bHolder);
	},
	setParent:function (el, newParent){
	    newParent.appendChild(el);
	},
	/**	
	 * Returns true if given DOM node is in view
	 * @public
	 * @returns {bool}
	 
	 * @param {DOMNode} el
	 * @param {bool} fullyInView
	 */														
	inViewport:function (el,fullyInView) {
		/*
		var r, html;
		if ( !el || 1 !== el.nodeType ) { return false; }
		html = document.documentElement;
		r = el.getBoundingClientRect();

		return ( !!r 
		&& r.bottom >= 0 
		&& r.right >= 0 
		&& r.top <= html.clientHeight 
		&& r.left <= html.clientWidth 
		);
		*/
		var pageTop = $(window).scrollTop();
			var pageBottom = pageTop + $(window).height();
			var elementTop = $(el).offset().top;
			var elementBottom = el + $(el).height();

		if (fullyInView === true) {
			return ((pageTop < elementTop) && (pageBottom > elementBottom));
		} else {
			return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
		}		
	},
	
	/* Code below taken from - http://www.evolt.org/article/document_body_doctype_switching_and_more/17/30655/
	 * Modified 4/22/04 to work with Opera/Moz (by webmaster at subimage dot com)
	 * Gets the full width/height because it's different for most browsers.
	*/
	getViewportHeight:function() {
		if (window.innerHeight!=window.undefined) return window.innerHeight;
		if (document.compatMode=='CSS1Compat') return document.documentElement.clientHeight;
		if (document.body) return document.body.clientHeight; 

		return window.undefined; 
	},
	getViewportWidth:function() {
		var offset = 17;
		var width = null;
		if (window.innerWidth!=window.undefined) return window.innerWidth; 
		if (document.compatMode=='CSS1Compat') return document.documentElement.clientWidth; 
		if (document.body) return document.body.clientWidth; 
	},
	
	getOffset:function (elem) {
	    if (elem.getBoundingClientRect) {
	    	return this.getOffsetRect(elem);
	    }
	    else{
		return this.getOffsetSum(elem);
	    }
	},
	getOffsetRect:function (elem) {
	    var box = elem.getBoundingClientRect();
	 
	    var body = document.body;
	    var docElem = document.documentElement;
	 
	    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
	    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
	    var clientTop = docElem.clientTop || body.clientTop || 0;
	    var clientLeft = docElem.clientLeft || body.clientLeft || 0;
	    var top  = box.top +  scrollTop - clientTop;
	    var left = box.left + scrollLeft - clientLeft;
	 
	    return { top: Math.round(top), left: Math.round(left) };
	},
	getOffsetSum:function (elem) {
	    var top=0, left=0;
	    while(elem) {
		top = top + parseInt(elem.offsetTop);
		left = left + parseInt(elem.offsetLeft);
		elem = elem.offsetParent;        
	    }
	 
	    return {top: top, left: left};
	},
	
	parseTemplate:function(t,nId){
		var res = t.replace(/{{id}}/g, nId);
		var matches = res.match( /{{.*}}/g );
		if (matches){
			for(var i=0;i<matches.length;i++){
				res = res.split(matches[i]).join(eval( matches[i].substring(2,matches[i].length-2) ));
			}		
		}
		return res;
	},
	
	firstChildElement:function(n,nodeType){
		if (n && n.childNodes){
			nodeType = (nodeType==undefined)? 1:nodeType;
			for(var i=0;i<n.childNodes.length;i++){
				if (n.childNodes[i].nodeType==nodeType){
					return n.childNodes[i]; 
				}
			}
		}
	},
	lastChildElement:function(n){
		if (n && n.childNodes){
			for(var i=n.childNodes.length-1;i>=0;i--){
				if (n.childNodes[i].nodeType==1){
					return n.childNodes[i]; 
				}
			}
		}
	},	
	insertAfter:function(elem, refElem) {
		var parent = refElem.parentNode;
		var next = refElem.nextSibling;
		if (next) {
			return parent.insertBefore(elem, next);
		} else {
			return parent.appendChild(elem);
		}
	},
	init:function(){
		Node = Node || {
			ELEMENT_NODE:1,
			ATTRIBUTE_NODE:2,
			TEXT_NODE:3,
			CDATA_SECTION_NODE:4,
			ENTITY_REFERENCE_NODE:5,
			ENTITY_NODE:6,
			PROCESSING_INSTRUCTION_NODE:7,
			COMMENT_NODE:8,
			DOCUMENT_NODE:9,
			DOCUMENT_TYPE_NODE:10,
			DOCUMENT_FRAGMENT_NODE:11,
			NOTATION_NODE:12
		};
	}
	
		
}	
