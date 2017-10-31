/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc button for printing

 * @extends ButtonOK 

 * @requires core/extend.js
 * @requires controls/ButtonOK.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 */
function ButtonSave(id,options){
	ButtonSave.superclass.constructor.call(this, id, options);
}
extend(ButtonSave,ButtonOK);

/* Constants */


/* private members */

/* protected*/


/* public methods */

