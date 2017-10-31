/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
  * @requires common/functions.js
  * @requires core/ValidatorString.js  
  * @requires controls/Edit.js
*/

/* constructor */
function EditString(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorString();
	if (options.buttonClear==undefined &&
	(options.noClear==undefined||options.noClear===false)){
		options.buttonClear = 
			new ButtonClear(id+"_btn_clear",{
				"editControl":this
			});
	}
	EditString.superclass.constructor.call(this,id,options);
}
extend(EditString,Edit);

/* constants */

/* public methods */