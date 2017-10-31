/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires common/functions.js
 * @requires core/Field.js
 * @requires core/Validator.js
*/

/* constructor */
function FieldGeomPoint(id,options){
	options = options || {};
	options.dataType=this.DT_GEOM_POINT;
	options.validator = new Validator();
	FieldGeomPoint.superclass.constructor.call(this,id,options);
}
extend(FieldGeomPoint,Field);