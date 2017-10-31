/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Export to Excel command button

 * @extends ButtonCmd 

 * @requires core/extend.js
 * @requires controls/ButtonCmd.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 */
function ButtonExpToExcel(id,options){
	options = options || {};
	
	ButtonExpToExcel.superclass.constructor.call(this,id,options);
}
extend(ButtonExpToExcel,ButtonCmd);
