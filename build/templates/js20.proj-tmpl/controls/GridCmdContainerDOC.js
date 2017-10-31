/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>,2016

 * @class
 * @classdesc DOC list based grid commands
 
 * @requires core/extend.js  
 * @requires controls/GridCmdContainerAjx.js

 * @param {string} id Object identifier
 * @param {namespace} options
 * @param {bool|GridCmd} [options.cmdDOCUnprocess=true] Unprocess doc
*/
function GridCmdContainerDOC(id,options){
	options = options || {};
	
	options.cmdDOCUnprocess = (options.cmdDOCUnprocess!=undefined)? options.cmdDOCUnprocess:true;
	options.cmdDOCShowActs = (options.cmdDOCShowActs!=undefined)? options.cmdDOCShowActs:options.cmdDOCUnprocess;

	//Unprocess
	if (options.cmdDOCUnprocess){
		this.setCmdDOCUnprocess( (typeof(options.cmdDOCUnprocess)=="object")?
			options.cmdDOCUnprocess : new GridCmdDOCUnprocess(id+":unprocess",{"app":options.app})
		);	
	}

	//Unprocess
	if (options.cmdDOCShowActs){
		this.setCmdDOCShowActs( (typeof(options.cmdDOCShowActs)=="object")?
			options.cmdDOCShowActs : new GridCmdDOCShowActs(id+":showActs")
		);	
	}
	
	GridCmdContainerDOC.superclass.constructor.call(this,id,options);
}
extend(GridCmdContainerDOC,GridCmdContainerAjx);

/* private */
GridCmdContainerDOC.prototype.m_cmdDOCUnprocess;
GridCmdContainerDOC.prototype.m_cmdDOCShowActs;

GridCmdContainerDOC.prototype.addCommands = function(){
	
	GridCmdContainerDOC.superclass.addCommands.call(this);

	if (this.m_cmdDOCUnprocess){
		this.m_commands.push(this.m_cmdDOCUnprocess);
	}
	
	if (this.m_cmdDOCShowActs){
		this.m_commands.push(this.m_cmdDOCShowActs);
	}

}

/* public */
GridCmdContainerDOC.prototype.getCmdDOCUnprocess = function(){
	return this.m_cmdDOCUnprocess;
}
GridCmdContainerDOC.prototype.setCmdDOCUnprocess = function(v){
	this.m_cmdDOCUnprocess = v;
}

GridCmdContainerDOC.prototype.getCmdDOCShowActs = function(){
	return this.m_cmdDOCShowActs;
}
GridCmdContainerDOC.prototype.setCmdDOCShowActs = function(v){
	this.m_cmdDOCShowActs = v;
}
