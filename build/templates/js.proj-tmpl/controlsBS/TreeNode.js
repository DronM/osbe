/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
*/

/* constructor */
function TreeNode(id,options){
	options = options || {};

	this.m_contentText = options.contentText;//
	this.m_last = options.last;//
	this.m_level = options.level;
	this.m_root = options.root;	
	this.m_opened= (options.opened==undefined)? this.DEF_OPEN:options.opened;	
	
	//class
	options.className = options.className || this.DEF_CLASS_NAME;
	options.className+=' ' + ((this.m_root)? this.CLASS_ROOT:this.CLASS_LEAF);
	if (this.m_last){
		options.className+=' '+this.CLASS_LAST;
	}
	options.className+=' '+((this.m_opened)? this.CLASS_OPENED:this.CLASS_NOT_OPENED);
	options.className+=' Level'+this.m_level;	
	
	var tagName = options.tagName || this.DEF_TAG;
	
	TreeNode.superclass.constructor.call(this,
		id,tagName,options);		
	
	var self = this;
	this.m_expand = new Control(id+"_expand","div",{className:this.CLASS_EXPAND});
	
	EventHandler.addEvent(this.m_div.m_node,"click",
	function(event){
		self.toggle.call(self,event);
	},false);
	
	this.m_content = new Control(id+"_content","div",{className:this.CLASS_CONTENT});
	this.m_content.setValue(this.m_contentText);
	
	this.m_tree = new Tree();
}
extend(TreeNode,Control);

TreeNode.prototype.m_root;
TreeNode.prototype.m_opened;
TreeNode.prototype.m_contentText;
TreeNode.prototype.m_last;
TreeNode.prototype.m_level;//
TreeNode.prototype.m_tree;
TreeNode.prototype.m_expand;
TreeNode.prototype.m_content;

TreeNode.prototype.CLASS_CONTENT = 'Content';
TreeNode.prototype.CLASS_EXPAND = 'Expand';
TreeNode.prototype.CLASS_OPENED = 'ExpandOpen';
TreeNode.prototype.CLASS_NOT_OPENED = 'ExpandClosed';
TreeNode.prototype.CLASS_LEAF = 'ExpandLeaf';
TreeNode.prototype.CLASS_ROOT = 'IsRoot';
TreeNode.prototype.CLASS_LAST = 'IsLast';	
TreeNode.prototype.DEF_CLASS_NAME = 'Node';
TreeNode.prototype.DEF_OPEN = false;
TreeNode.prototype.DEF_TAG = "li";

TreeNode.prototype.toggle = function(event){
	event = EventHandler.fixMouseEvent(event);
	var clickedElem = event.target;

	if (!DOMHandler.hasClass(clickedElem, 'Expand')) {
		return undefined;// клик не там
	}

	// Node, на который кликнули
	var node = clickedElem.parentNode;
	if (DOMHandler.hasClass(node, 'ExpandLeaf')) {
		return; // клик на листе
	}

	// определить новый класс для узла
	var newClass = DOMHandler.hasClass(node, 'ExpandOpen') ? 'ExpandClosed' : 'ExpandOpen';
	// заменить текущий класс на newClass
	// регексп находит отдельно стоящий open|close и меняет на newClass
	var re =  /(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/;
	node.className = node.className.replace(re, '$1'+newClass+'$3');
	
}

TreeNode.prototype.toDOM = function(parent){
	this.m_expand.toDOM(this.m_node);
	this.m_content.toDOM(this.m_node);
	this.m_tree.toDOM(this.m_node);
	TreeNode.superclass.toDOM.call(this,parent);
}
TreeNode.prototype.removeDOM = function(){
	this.m_expand.removeDOM();
	this.m_content.removeDOM();
	this.m_tree.removeDOM();
	TreeNode.superclass.removeDOM.call(removeDOM);
}
TreeNode.prototype.getTree = function(){
	return this.m_tree;
}