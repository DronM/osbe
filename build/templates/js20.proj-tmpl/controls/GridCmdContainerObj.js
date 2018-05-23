/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2016

 * @class
 * @classdesc Object multiline edit grid commands
 
 * @requires core/extend.js  
 * @requires controls/GridCmdContainerAjx.js

 * @param {string} id Object identifier
 * @param {object} options
 * @param {bool} [options.cmdLineMove=true]
 * @param {Control} [options.cmdLineUp=GridCmdRowUp]
 * @param {Control} [options.cmdLineDown=GridCmdRowDown]   
*/
function GridCmdContainerObj(id,options){
	options = options || {};
	
	options.cmdLineMove = (options.cmdLineMove!=undefined)? options.cmdLineMove:true;

	if (options.cmdLineMove||options.cmdLineUp||options.cmdLineDown){
		this.setCmdLineUp( (typeof options.cmdLineUp=="object")?
			options.cmdLineUp : new GridCmdRowUp(id+":lineup")
		);	
		this.setCmdLineDown( (typeof options.cmdLineDown=="object")?
			options.cmdLineDown : new GridCmdRowDown(id+":linedown")
		);	
		
	}
	
	GridCmdContainerObj.superclass.constructor.call(this,id,options);
}
extend(GridCmdContainerObj,GridCmdContainerAjx);

/* private */
GridCmdContainerObj.prototype.m_cmdLineUp;
GridCmdContainerObj.prototype.m_cmdLineDown;

GridCmdContainerObj.prototype.addCommands = function(){
	
	GridCmdContainerObj.superclass.addCommands.call(this);

	if (this.m_cmdLineUp){
		this.m_commands.push(this.m_cmdLineUp);
	}
	
	if (this.m_cmdLineDown){
		this.m_commands.push(this.m_cmdLineDown);
	}

}

/* public */
GridCmdContainerObj.prototype.getCmdLineUp = function(){
	return this.m_cmdLineUp;
}
GridCmdContainerObj.prototype.setCmdLineUp = function(v){
	this.m_cmdLineUp = v;
}

GridCmdContainerObj.prototype.getCmdLineDown = function(){
	return this.m_cmdLineDown;
}
GridCmdContainerObj.prototype.setCmdLineDown = function(v){
	this.m_cmdLineDown = v;
}
