/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc close command button

 * @extends ButtonCmd 

 * @requires core/extend.js
 * @requires controls/ButtonCmd.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 */
function ButtonClose(id,options){
	options = options || {};	
	
	ButtonClose.superclass.constructor.call(this, id, options);
}
extend(ButtonClose,ButtonCmd);

/* Constants */


/* private members */

/* protected*/


/* public methods */

