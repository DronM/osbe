function MarkerLayer(options){
	this.m_onMarkerSet = options.onMarkerSet;
	if (options.marker){
		this.setMarker(options.marker);
	}
	MarkerLayer.superclass.constructor.call(this,
		options.map,options.objDescr);	
	
	var self = this;
	if (options.point && options.point.length){
		this.setMarkerOnCoords(options.point);
	}
	
	//setting
	this.m_setControl = new OpenLayers.Control.Click({
                        handlerOptions: {"single": true},
						handler:{"click":function(evt){
								alert(evt.xy);
							}
						}
                    });	
	
	//dragging
	this.m_dragControl = new OpenLayers.Control.DragFeature(this.layer,{
	"onComplete":function(feature,pixel){
		self.onMarkerSet(feature,"drag");
	}
	});
	
	this.map.addControl(this.m_setControl);
	this.map.addControl(this.m_dragControl);
}
extend(MarkerLayer,ObjMapLayer);//base class

MarkerLayer.prototype.m_setControl;
MarkerLayer.prototype.m_dragControl;
MarkerLayer.prototype.m_onMarkerSet;

MarkerLayer.prototype.setMarkerOnCoords = function(point){
	var features = [];
	var style = this.getStyle(this.m_marker);
	this.m_marker.feature = new OpenLayers.Feature.Vector(
			this.getMapPoint(point[0],point[1]),
			null,style);
	features.push(this.m_marker.feature);
	this.addFeatures(features);
	
	this.events.on({
		featuresadded: function(event){
			self.onMarkerSet(event.features[0],"set");
		}
	});		

}

MarkerLayer.prototype.activateSet = function(){
	this.deleteZone();
	this.m_setControl.activate();
	this.m_dragControl.deactivate();
}
MarkerLayer.prototype.activateNavigation = function(){
	this.m_setControl.deactivate();
	this.m_dragControl.deactivate();
}
MarkerLayer.prototype.activateDragging = function(){
	this.m_setControl.deactivate();
	this.m_dragControl.activate();
}

MarkerLayer.prototype.deleteAllMarkers = function(){
	this.layer.removeAllFeatures();
	if (this.m_onMarkerSet){
		this.m_onMarkerSet("");
	}	
}
MarkerLayer.prototype.onMarkerSet = function(feature,evType){
	var vertices = feature.geometry.getVertices();
	var coords_str="";
	if (vertices&&vertices.length){
		var point = this.m_markerLayer.getMapPoint(
			vertices[i]["x"],
			vertices[i]["y"]
		);	
	}
	if (this.m_onMarkerSet){
		this.m_onMarkerSet(coords_str);
	}
}
MarkerLayer.prototype.setMarker = function(marker){
	this.m_marker = marker;
}
MarkerLayer.prototype.getMarker = function(){
	return this.m_marker;
}