/* Copyright (c) 2012 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
*/

/* constructor */
function ListGroupper(){
	this.m_params = [];
}
ListGroupper.prototype.m_params;
ListGroupper.prototype.FIELD_SEPAR = ",";

ListGroupper.prototype.addGroup = function(id,group){		
	group.ind = this.m_params.length;
	this.m_params.push(group);
}
ListGroupper.prototype.moveUp = function(ind){		
	if (ind>0 && this.m_params.length>=2){
		var tmp = this.m_params[ind-1];
		this.m_params[ind-1] = this.m_params[ind];
		this.m_params[ind] = tmp;
		return true;
	}
}
ListGroupper.prototype.moveDown = function(ind){		
	if (ind<this.m_params.length && this.m_params.length>=2){
		var tmp = this.m_params[ind+1];
		this.m_params[ind+1] = this.m_params[ind];
		this.m_params[ind] = tmp;
		return true;
	}
}

ListGroupper.prototype.getParams = function(){		
	str = '';
	for (var i=0;i<this.m_params.length;i++){
		if (this.m_params[i].isset){
			str+=(str=='')? '':this.FIELD_SEPAR;
			str+=this.m_params[i].field;
		}
	}
	return str;
}
ListGroupper.prototype.setClickContext = function(){
}
ListGroupper.prototype.setOnRefresh = function(){
}
ListGroupper.prototype.toDOM = function(){
}
ListGroupper.prototype.removeDOM = function(){
}