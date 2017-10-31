function GeoZones(options){
	this.m_drawComplete = options.drawComplete;
	options.featureOptions = options.featureOptions||{};
	GeoZones.superclass.constructor.call(this,
		options.map,options.objDescr);	
	
	var self = this;
	if (options.points && options.points.length){
		this.drawZoneOnCoords(options.points);
	}

	//drawing
	if (options.doDraw){
		this.addDrawSupport(options);
	}
}
extend(GeoZones,ObjMapLayer);//base class

GeoZones.prototype.m_drawControl;
GeoZones.prototype.m_dragControl;
GeoZones.prototype.m_polygonFeature;
GeoZones.prototype.m_drawComplete;

GeoZones.prototype.addDrawSupport = function(options){
	var self = this;
	this.m_drawControl = new OpenLayers.Control.DrawFeature(
		this.layer,
		options.featureType,
		{handlerOptions:options.featureOptions}
	);
	this.map.addControl(this.m_drawControl);	
	
	//dragging
	this.m_dragControl = new OpenLayers.Control.DragFeature(this.layer,{
	"onComplete":function(feature,pixel){
		self.drawComplete(feature,"drag");
	}
	});
	this.map.addControl(this.m_dragControl);	
	
	this.layer.events.on({
		featuresadded: function(event){
			self.drawComplete(event.features[0],"draw");
		}
	});			
}

GeoZones.prototype.drawZoneOnCoords = function(points){
	if (points.length%2!=0){
		return;
	}
	var pointList = [];
	for (var i=0;i<points.length;i+=2){
		//alert("adding zone coord x="+points[i]+" y="+points[i+1]);
		pointList.push(this.getMapPoint(points[i],points[i+1]));		
	}
	
	var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
	this.m_polygonFeature = new OpenLayers.Feature.Vector(
		new OpenLayers.Geometry.Polygon([linearRing])
	);
	this.layer.addFeatures(this.m_polygonFeature);
}

GeoZones.prototype.activateDrawing = function(){
	this.deleteZone();
	this.enableDrawing(true);
	this.m_dragControl.deactivate();
}
GeoZones.prototype.activateNavigation = function(){
	this.enableDrawing(false);
	this.m_dragControl.deactivate();
}
GeoZones.prototype.activateDragging = function(){
	this.enableDrawing(false);
	this.m_dragControl.activate();
}

GeoZones.prototype.enableDrawing = function(en){
	if (en){
		this.m_drawControl.activate();
	}
	else{
		this.m_drawControl.deactivate();
	}
}

GeoZones.prototype.makeBigger = function(){
	alert("bigger");
}
GeoZones.prototype.makeSmaller = function(){
	alert("smaller");
}
GeoZones.prototype.deleteZone = function(){
	this.layer.removeAllFeatures();
	if (this.m_drawComplete){
		this.m_drawComplete("");
	}	
}
GeoZones.prototype.drawComplete = function(feature,evType){
	var vertices = feature.geometry.getVertices();
	var coords_str="";
	for (var i=0;i<vertices.length;i++){
		var point = new OpenLayers.Geometry.Point(vertices[i]["x"],vertices[i]["y"])
				  .transform(
					this.map.getProjectionObject(),
					new OpenLayers.Projection("EPSG:4326")
				  );
		coords_str+=(coords_str=="")? "":",";
		coords_str+=point["x"]+" "+point["y"];
	}
	if (this.m_drawComplete){
		this.m_drawComplete(coords_str);
	}
	/*
	if (evType=="draw"){
		this.activateNavigation();
	}
	*/
}