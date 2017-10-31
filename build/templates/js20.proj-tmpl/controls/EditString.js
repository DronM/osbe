/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc Visual Edit string control
 
 * @extends Edit
 
 * @requires core/ValidatorString.js
 * @requires controls/Edit.js

 * @param {string} id
 * @param {Object} options
 * @param {boolean} [options.cmdClear=true]
 * @param {Button} [options.buttonClear=ButtonClear]

 */
function EditString(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorString(options);
	
	if (options.cmdClear==undefined || (options.cmdClear!=undefined && options.cmdClear)){
		options.buttonClear = options.buttonClear || new ButtonClear(id+":btn_clear",{
				"editControl":this
		});
	}
	EditString.superclass.constructor.call(this,id,options);
}
extend(EditString,Edit);

/* constants */

/* public methods */
