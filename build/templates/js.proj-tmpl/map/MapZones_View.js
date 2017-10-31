/* Copyright (c) 2014 
	Andrey Mikhalevich, Katren ltd.
*/
/*	
	Description
*/
//ф
/** Requirements
 * @requires controls/ViewDialog.js
*/

/* constructor */
function MapZones_View(id,options){
	MapZones_View.superclass.constructor.call(this,
		id,options);
}
extend(MapZones_View,Map_View);

MapZones_View.prototype.addFeatureControl = function(){
	var self = this;
	this.m_zoneDrawing = new ZoneDrawingControl("map_drawing",
	{"onNavigate":function(){
		self.m_zones.activateNavigation();
		},
	"onDrag":function(){
		self.m_zones.activateDragging();
		},
	"onDraw":function(){
		self.m_zones.activateDrawing();
		},		
	"onDelete":function(){
		self.m_zones.deleteZone();
		}
	});
	this.addControl(this.m_zoneDrawing);	
}
MapZones_View.prototype.addFeatures = function(){
	//Geo zone	
	if (this.m_ctrlZoneStr){
		var zone_str = this.m_ctrlZoneStr.getAttr("old_zone");
		zone_str=(zone_str==undefined)?"":zone_str;
		zone_str = zone_str.split(" ").join(",");
		var zone_points = zone_str.split(",");	
		zone_points.splice(zone_points.length-2,2);//remove last point
		var self = this;
		this.m_zones = new GeoZones(
			{"map":this.m_map,
			"objDescr":this.getZoneDescr(),
			"points":zone_points,
			"doDraw":true,
			"drawComplete":function(coordsStr){
				self.m_ctrlZoneStr.setValue(coordsStr);
			},
			"featureType":OpenLayers.Handler.Polygon
			//"featureOptions":{"sides":4},
			//RegularPolygon
		}
		);	
		
		if (this.m_ctrlZoneCenterStr){
			var zone_center = this.m_ctrlZoneCenterStr.getValue().split(" ");
			var zoom;
			if (zone_center.length>=2){
				move_lon = zone_center[0];
				move_lat = zone_center[1];
				zoom = TRACK_CONSTANTS.FOUND_ZOOM;
			}
			else{
				move_lon = NMEAStrToDegree(CONSTANT_VALS.map_default_lon);
				move_lat = 	NMEAStrToDegree(CONSTANT_VALS.map_default_lat);
				zoom = TRACK_CONSTANTS.INI_ZOOM;
			}
			this.m_zones.moveMapToCoords(move_lon, move_lat,zoom);
		}
	}
}
MapZones_View.prototype.getZoneDescr = function(){
	return "Геозона";
}