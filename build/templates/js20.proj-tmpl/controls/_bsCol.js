/*Bootstrap column name based on HTML*/
var bsCol {
	init:function(){
		this.m_col = ("col-"+$('#users-device-size').find('div:visible').first().attr('id')+"-");
	},
	get:function(){
		return this.m_col;
	}
}
