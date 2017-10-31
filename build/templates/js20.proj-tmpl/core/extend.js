/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2010
 
 * function for extending classes
 
 * @param {Object} Child - Child Class
 * @param {Object} Parent - Parent Class
 */
function extend(Child, Parent) {
	var F = function() { };
	F.prototype = Parent.prototype;
	Child.prototype = new F();
	Child.prototype.constructor = Child;
	Child.superclass = Parent.prototype;
}
