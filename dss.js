var activeLayer;
var map;
var mapMoves = [];
var referenceLayers = [];
var layersControl;

$(window).on('load', function() {
	
	$(function() {
		
		//Elements
		
		$( ".tab-button" ).button();
		
		$( "#tabs-details" ).tabs({
			activate: function( event, ui ) {
				$( "#dialog-details" ).dialog({
					position:{ my: "right top+2", at: "right bottom", of: $('#banner-top') }
				});
			}
		});
		var li = $( "#tabs-details" ).children('ul').children('li');
		$(li[1]).hide();
		
		$( "#layer-details" ).accordion({
			collapsible: true,
			heightStyle: 'content',
			active: false
		});
		
		
		//Dialogs

		$( "#dialog-details" ).dialog({ 
			width: 'auto',
			maxHeight: $(window).height() - 95,
			dialogClass: 'noTitleStuff', 
			position: { my: "right top+2", at: "right bottom", of: $('#banner-top') },
			autoOpen: false,
			open: function(){
				$( "#dialog-details" ).css( "maxWidth", $(window).width() - 35 );
			}
		});
		
		$( "#dialog-layers" ).dialog({ 
			width: 'auto',
			maxHeight: $(window).height() - 95,
			dialogClass: 'noTitleStuff', 
			position: { my: "left top+2", at: "left bottom", of: $('#banner-top') },
			autoOpen: false,
			open: function(){
				$( "#dialog-layers" ).css( "maxWidth", $(window).width() - 35 );
			}
		});
		
		
		//Events
		
		$('#dialog-details').on('click', function(){
			$('.dialog-menu').dialog('close');
		})
		
		$('#dialog-details-close').on('click', function(){
			$( "#dialog-details" ).dialog('close');
			$( "#dialog-details-open" ).show();
		})
		
		$('#dialog-details-open').on('click', function(){
			$( "#dialog-details" ).dialog('open');
			$(this).hide();
		})
		
	});
	
	//Load data
	
	$.ajax({url:'http://maps.vnforest.gov.vn:802/geoserver/FRMS/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=dss_provinces&outputFormat=application%2Fjson', //Load proinces
		success: function(data){
			var arr =[];
			$.each(data.features, function(){
				arr.push(this.properties);
			})
			var select_provinces = document.getElementsByClassName('province-data');
			$.each(select_provinces, function(){
				populateSelect(this,arr,'id', 'name');
			})
		}
	});
	
	
	//Map
	
	map = L.map('map',{zoomControl: false, minZoom:5, maxZoom: 8}).setView([16.4, 106.8], 6);
	L.control.scale().addTo(map);
	L.control.zoom({ position: 'bottomright' }).addTo(map);
	
	var base = new L.tileLayer.wms('http://maps.vnforest.gov.vn:802/geoserver/wms', {
		layers: 'vfs:province',
		format: 'image/png',
		transparent: true,
		version: '1.1.0'
	}).addTo(map);
	
	//Base layer

	layersControl = L.control.layers({}, {}).addTo(map);
	$('#dialog-layers').append($(layersControl._container).children('.leaflet-control-layers-list')); //Move leaflet control to div 
	$("#dialog-layers>form").children().each(function(i,li){$("#dialog-layers>form").prepend(li)});
	var divlayersControl = layersControl.getContainer();
	divlayersControl.parentNode.removeChild(divlayersControl); //Delete control button
	
	
	//Thematic and reference layers
	
	function getLegendUrl(lr) {
		if(typeof(lr.legend) == 'undefined' || typeof(lr.legend[lang]) == 'undefined' || !lr.legend[lang]){
			var legendUrl = lr.url.replace('gwc/service/','')+'?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&layer='+lr.layers+'&SCALE= 10000&legend_options=fontSize:11;bgColor:0xF5F5EF;';	// default url
		} else {
			var legendUrl = lr.legend[lang]+'&legend_options=fontSize:11;bgColor:0xF5F5EF;'
		}
		return legendUrl;
	}
	
	function addMenuLayer(lrs, color, j){
		$.each(lrs, function(i){
			var lr = {
				wms: new L.tileLayer.wms(this.url, {
					layers: this.layers,
					format: 'image/png',
					transparent: true,
					version: (typeof(this.version)=='undefined')?'1.1.0':this.version,
					crs: (typeof(this.crs)=='undefined')?null:this.crs,
					attribution: this.name,
					minZoom: this.minZoom,
					legend: getLegendUrl(this),
					info: this.info,
					title: this.name
				}),
			}
			if(this.addLayer){
				activeLayer = lr.wms;
				map.addLayer(activeLayer);
				$('#legend').attr('src',activeLayer.options.legend);
			}
			if(color && typeof(color) != 'undefined'){
				var styleColor = "style='color:"+color+"'";
			} else {
				var styleColor = "";
			}
			layersControl.addBaseLayer(lr.wms, "<span "+styleColor+">"+this.name+"</span>");
		})
	}
	
	$.each(layersList, function(j){ //create menu based on array layersList
		addMenuLayer(this.layers, this.color, j);
	})
	$.each(layersList, function(j){
		var ll = this.layers.length;
		$('#dialog-layers>form>.leaflet-control-layers-base').append('<h3>'+this.name+'</h3>');
		$('#dialog-layers>form>.leaflet-control-layers-base').append('<div id="menu-'+j+'"></div>');
		
		i=0;
		for(i=0;i<ll;i++){
			$('#menu-'+j).append($($('#dialog-layers .leaflet-control-layers-base').children('label')[0]));
		}
	})
	var menu = $('#dialog-layers>form>.leaflet-control-layers-base');
	menu.accordion({
		collapsible: true,
		heightStyle: "content",
		active: false
    });
	$( "#dialog-details" ).dialog('open');
	$( "#dialog-layers" ).dialog('open');
	
	map.on("layeradd", function(e){
		$('#legend').attr('src',null);
		$('#legend').load(function(){
			$( "#dialog-details" ).dialog({
				position:{ my: "right top+2", at: "right bottom", of: $('#banner-top') }
			});
		}).attr('src', e.layer.options.legend);
		$( "#tabs-details" ).tabs( "option", "active", 0);
		activeLayer = e.layer;
		$('.forest-title h3').text(e.layer.options.title);
	});
	
	//Get info
	
	function getLayerInfo(url,e){
		var bboxArr = map.getBounds();
		var bboxSW = bboxArr.getSouthWest();
		var bboxNE = bboxArr.getNorthEast();
		var bbox = bboxArr.toBBoxString();
		var point = e.containerPoint;
		var size = map.getSize();
		var url = url + '&FEATURE_COUNT=1&x='+Math.round(point.x)+'&y='+Math.round(point.y)+'&WIDTH='+size.x+'&HEIGHT='+size.y+'&CRS=EPSG:4326&BBOX='+bbox;
		$('#info-container').append("<img src='images/load2.gif'>");
		$.ajax({
			url: url,
			dataType: 'html',
			type: "GET",
			success: function(response) {
				$($('#info-container').find('img')[0]).remove();
				var table  = $(response).find('table').andSelf().filter('table');
				if (table.length) { 
					$('#info-no-data').hide();
					$.each(table.find('tr>td:first-child'), function(){
						if(dictionary_attr[$(this).text()]){ 
							$(this).text(dictionary_attr[$(this).text()][lang]) 
						}
					})
					$('#info-container').append(table);
					$.each($('#info-container').find('h2'), function(){
						var title = dictionary[$(this).text()]; 
						if(typeof(title)!='undefined'){
							$(this).text(title[lang]);
						}
					})
				} else {
					if(!$('#info-container').find('table').length){
						$('#info-no-data').show();
					}
				}
				$( "#dialog-details" ).dialog({
					position:{ my: "right top+2", at: "right bottom", of: $('#banner-top') }
				});
			}, 
			error: function(){
				if(!$('#info-container').find('table').length){
					$('#info-no-data').show();
				}
			}
		});
	}
	
	function defaultGetFeatureInfoUrl(lr){
		var source = lr._url;
		var name = lr.options.layers;
		var url = ''+source.replace('gwc/service/','')+'?SERVICE=WMS&VERSION=1.0.0&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&QUERY_LAYERS='+name+'&LAYERS='+name+'&INFO_FORMAT=text/html';
		return url;
	}
	
	function showFeatureInfo(e) {
		$($( "#tabs-details" ).children('ul').children('li')[1]).show();
		$('#info-no-data').hide();
		$('#info-container').text('');
		$( "#tabs-details" ).tabs( "option", "active", 1);
		if(activeLayer){
			var infoUrl = typeof(activeLayer.info) == 'object' ? activeLayer.info[lang] : activeLayer.info;
			if(typeof(infoUrl) == 'undefined' || !infoUrl){
				infoUrl = defaultGetFeatureInfoUrl(activeLayer);
			}
			getLayerInfo(infoUrl,e);
		}
	}
	
	$('#info-btn').on('click', function(){
		if($(this).hasClass('selected')){
			closeGetInfo();
		} else {
			map._container.style.cursor = 'help';
			$(this).addClass('selected');
			map.on('contextmenu',function(e){
				closeGetInfo();
			});
			map.on('click', function(e){
				showFeatureInfo(e);
			})
		}
	})
	
	function closeGetInfo(){
		map.off('click');
		map.off('contextmenu');
		map._container.style.cursor = null;
		$('#info-btn').removeClass('selected');
	}

	
	//Language
	
	$('.lng-change').on('click', function(){
		if(this.id === 'lng-change-vi'){
			$('#lng-change-vi').hide();
			$('#lng-change-en').show();
		} else {
			$('#lng-change-en').hide();
			$('#lng-change-vi').show();
		}
	})

});