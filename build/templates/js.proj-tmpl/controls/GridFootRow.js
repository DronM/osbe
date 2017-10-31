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
function GridFootRow(id,options){
	options = options || {};
	options.attrs=options.attrs||{};
	options.attrs["class"]=options.attrs["class"]||"grid_foot";
	GridFootRow.superclass.constructor.call(this,
		id,options);
}
extend(GridFootRow,GridRow);

GridFootRow.prototype.calc = function(model){
	for (var cell_id in this.m_elements){
		if (this.m_elements[cell_id].calc){
			this.m_elements[cell_id].calc(model);
		}
	}
}
GridFootRow.prototype.calcBegin = function(){
	for (var cell_id in this.m_elements){
		if (this.m_elements[cell_id].calcBegin){
			this.m_elements[cell_id].calcBegin();
		}
		else if (this.m_elements[cell_id].calc){
			this.m_elements[cell_id].setValue("0");
		}
	}
}
GridFootRow.prototype.calcEnd = function(){
	for (var cell_id in this.m_elements){
		if (this.m_elements[cell_id].calcEnd){
			this.m_elements[cell_id].calcEnd();
		}
	}
}