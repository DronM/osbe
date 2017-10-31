/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc submit button

 * @extends ButtonCmd
 
 * @requires core/extend.js
 * @requires controls/ButtonCmd.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 */
function ButtonOK(id,options){
	options = options || {};	
	
	ButtonOK.superclass.constructor.call(this, id, options);
}
extend(ButtonOK,ButtonCmd);

/* Constants */


/* private members */

/* protected*/


/* public methods */

