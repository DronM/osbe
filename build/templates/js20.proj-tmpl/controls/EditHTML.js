/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2012
 
 * @class
 * @classdesc HTMl Edit control
 
 * @extends Control
  
 * @requires core/extend.js
 * @requires controls/Control.js
 * @requires ext/CKEditor/ckeditor.js  

 * @param {string} id Object identifier
 * @param {object} options  
*/

function EditHTML(id,options){
	EditHTML.superclass.constructor.call(this,id,options);
}
extend(EditHTML,EditText);

/* constants */

EditHTML.prototype.m_editor;

EditHTML.prototype.toDOM = function(parent){
	EditHTML.superclass.toDOM.call(this,parent);
	
	var self = this;
	ClassicEditor.create( this.getNode() )
	.then( editor => {
		self.m_editor = editor;
	    } )
	    .catch( error => {
		console.error( error );
	} );
}

EditHTML.prototype.setValue = function(val){
	if (this.m_validator){
		val = this.m_validator.correctValue(val);
	}

	if (this.m_editor){	
		this.m_editor.setData(val);
	}
	else{
		this.getNode().value = val;
	}
}

EditHTML.prototype.getValue = function(){
	return (this.m_editor)? this.m_editor.getData():this.getNode().value;
}

EditHTML.prototype.delDOM = function(){
	if (this.m_editor)this.m_editor.destroy();
	
	EditHTML.superclass.delDOM.call(this);
}
