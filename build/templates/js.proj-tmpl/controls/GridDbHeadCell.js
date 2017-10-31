/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
* @requires controls/GridHeadCell.js 
*/

/* constructor */
function GridDbHeadCell(id,options){
	options = options || {};
	options.tagName = options.tagName || this.DEF_TAG_NAME;
	if (options.readBind){
		if (options.readBind.valueFieldId){
			options.attrs=options.attrs||{};
			options.attrs["field_id"]=options.readBind.valueFieldId;
			options.colAttrs=options.colAttrs||{};
			options.colAttrs["field_id"]=options.readBind.valueFieldId;
		}
		this.setReadBind(options.readBind);
	}
	if (options.controls){
		this.setControls(options.controls);
	}
	GridDbHeadCell.superclass.constructor.call(this,
		id,options);	
}
extend(GridDbHeadCell,GridHeadCell);

GridDbHeadCell.prototype.m_readBind;

GridDbHeadCell.prototype.setReadBind = function(readBind){
	this.m_readBind = readBind;
}
GridDbHeadCell.prototype.getReadBind = function(){
	return this.m_readBind;
}
GridDbHeadCell.prototype.getCellClass = function(){
	return GridCell;
}
