/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2014
 
 * @class
 * @classdesc Basic visual editable control
 
 * @extends Control
 
 * @requires controls/EditInt.js  
 
 * @param {string} id 
 * @param {object} options
 * @param {Validator} [options.validator=ValidatorFloat]
 * @param {int} [options.precision=DEF_PRECISION] 
 */
function EditFloat(id,options){
	options = options || {};
	options.validator = options.validator || new ValidatorFloat(options);
	
	options.cmdSelect = false;
	
	this.m_precision = options.precision || this.DEF_PRECISION;
	
	EditFloat.superclass.constructor.call(this,id,options);
	
	this.m_allowedChars.push(44);//,
	this.m_allowedChars.push(46);//.
}
extend(EditFloat,EditInt);

/* constants */
EditFloat.prototype.DEF_PRECISION = 2;
/*
function setCaretPosition(elem, caretPos) {
    if (elem != null) {
        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        } else {
            if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            } else
                elem.focus();
        }
    }
}
*/
EditFloat.prototype.handleKeyPress = function(e){
	var res = EditFloat.superclass.handleKeyPress.call(this,e);
	
	if (res!==false && e.which==46){
		//console.log("val="+this.m_node.value)
		/*
		var caretPos = this.m_node.selectionStart;
        	var startString = this.m_node.value.slice(0, this.m_node.selectionStart);
	        var endString = this.m_node.value.slice(this.m_node.selectionEnd, this.m_node.value.length);
	        this.m_node.value = startString + "," + endString;
	        setCaretPosition(this.m_node, caretPos+1); // '+1' puts the caret after the input
	        e.preventDefault(true);
	        e.stopPropagation(true);
	        return false;
	        */
		//this.m_node.value = this.m_node.value + ",";
		//insertTextAtCursor(",");
		/*
		var inp = this.m_node;
		setTimeout(function() {
			console.log("new val="+inp.value+",")
		    inp.value = inp.value+",";
		  }, 0);		
		 */
		//res = false;
	}
	
	return res;
}

/* public methods */

EditFloat.prototype.setValue = function(val){
	if (val==undefined){
		this.getNode().value = "";
	}
	else{
		if (this.m_validator){
			val = this.m_validator.correctValue(val);
		}
		//console.log( CommonHelper.numberFormat(val, this.m_precision, CommonHelper.getDecimalSeparator(), "") );
		this.getNode().value = CommonHelper.numberFormat(val, this.m_precision, ".", "");
	}
}

