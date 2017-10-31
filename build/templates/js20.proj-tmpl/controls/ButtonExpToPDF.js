/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc Export to PDF command button

 * @extends ButtonCmd 

 * @requires core/extend.js
 * @requires controls/ButtonCmd.js     
  
 * @param {string} id - html tag id
 * @param {namespase} options
 */
function ButtonExpToPDF(id,options){
	options = options || {};
	
	ButtonExpToPDF.superclass.constructor.call(this,id,options);
}
extend(ButtonExpToPDF,ButtonCmd);
