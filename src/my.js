var lang = 'en';
var language = 'en_US';
var map;
var drawnItems;
var drawControl;
var selectedFeature = new L.geoJson([],{});
var forestLayerActive;

$(window).on('load', function() {
	
	
	//Load data
	
	function populateSelect(select,array){
		var option,
			i = 0,
			il = array.length;
		for (; i < il; i += 1) {
			option = document.createElement('option');
			option.setAttribute('value', array[i][0]);
			option.appendChild(document.createTextNode(array[i][1]));
			select.appendChild(option);
		}
	}
	
	$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
		type: 'GET', 
		async: false,
		crossDomain: true, 
		data:{
			serviceid:"common_service", 
			typeResult:'json',
			tableName:'province',
			idColumn:'province_code',
			nameColumn:"name"
		},
		dataType: 'json',
		contentType: 'application/json',
		success: function(data){
			var select_provinces = document.getElementsByClassName('province-data');
			$.each(select_provinces, function(){
				populateSelect(this,data[0]);
			})
		}
	});
	
	
	//Map
	
	map = L.map('map',{zoomControl: false}).setView([16.4, 106.8], 6);
	L.control.zoom({ position: 'topright' }).addTo(map);
	L.control.scale().addTo(map);
	drawnItems = new L.FeatureGroup();
	drawControl = new L.Control.Draw({
		position: 'topright',
		draw: {
			polyline: false,
			polygon: true,
			circle: true,
			marker: false
		}
	});
	map.addLayer(drawnItems);
	map.addControl(drawControl);
	$('#select-widget').append(drawControl._container);
	$(drawControl._container).hide();
	var wkt = new Wkt.Wkt();
	
	
	//Base layer
	
	var baseHillShade = L.tileLayer.wms("http://46.137.159.194/geoserver/gwc/service/wms", {
		layers: 'formis:hillshade',
		format: 'image/png',
		transparent: true,
		version: '1.1.0',
		attribution: "",
		src:'EPSG:900913'
	});
 
	var baseEsriStreet = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
	});
	
	var baseEsriImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});
	
	var baseVietnam = L.tileLayer.wms("http://46.137.159.194/geoserver/gwc/service/wms", {
		layers: 'venues:vn_base_m',
		format: 'image/png',
		transparent: true,
		version: '1.1.1',
		attribution: "",
		src:'EPSG:900913'
	}).addTo(map);
	
	$('.base-lr').on('click', function(){
		$('.base-lr.checked').removeClass('checked');
		$(this).addClass('checked');
		if(this.id=='base-lr-5'){
			map.removeLayer(baseEsriStreet);
			map.removeLayer(baseVietnam);
			map.removeLayer(baseHillShade);
			map.removeLayer(baseEsriImagery);
		} else if(this.id=='base-lr-1' || this.id=='base-lr-3'){
			map.removeLayer(baseEsriStreet);
			map.removeLayer(baseVietnam);
			map.removeLayer(baseHillShade);
			map.addLayer(baseEsriImagery);
			baseEsriImagery.bringToBack();
		} else if(this.id=='base-lr-4'){
			map.removeLayer(baseEsriStreet);
			map.removeLayer(baseVietnam);
			map.removeLayer(baseEsriImagery);
			map.addLayer(baseHillShade);
			baseHillShade.bringToBack();
		} else {
			map.removeLayer(baseEsriImagery);
			map.removeLayer(baseHillShade);
			if(map.getZoom()>9){
				map.addLayer(baseEsriStreet);
				baseEsriStreet.bringToBack();
				map.removeLayer(baseVietnam);
			} else {
				map.addLayer(baseVietnam);
				baseVietnam.bringToBack();
				map.removeLayer(baseEsriStreet);
			}
		}
	})
	  
	map.on('zoomend', function(e){
		if($('#base-lr-2').hasClass('checked')){
			if(map.getZoom()>9){
				map.addLayer(baseEsriStreet);
				baseEsriStreet.bringToBack();
				map.removeLayer(baseVietnam);
			} else {
				map.addLayer(baseVietnam);
				baseVietnam.bringToBack();
				map.removeLayer(baseEsriStreet);
			}
		}
		if(e.target._zoom>9){
			$("#unit").val($("#unit option:last").val());
		} else {
			$("#unit").val($("#unit option:first").val());
		};
		$("#unit").change();
	})
	
	
	//Thematic layers
	
	var data = [];
	$.each(forestLayersList, function(i){
		var lr = L.tileLayer.wms(this.url, {
			layers: this.layers,
			format: 'image/png',
			transparent: true,
			version: '1.1.0',
			attribution: this.name[lang],
			src:'EPSG:900913'
		});
		this.wms = lr;
		var $li = $("<li class='forest-lr'>"+this.name[lang]+"</li>");
		$li.appendTo('#forest-layers-part-'+this.menu_part);
		this.li = $li;
		this.li.on('click', function(){
			if(!$(this).hasClass('display')){
				$('.forest-lr').removeClass('display');
				$(this).addClass('display')
				$('.forest-title h3').text($(this).text());
				$('#forestry-layer-checbox').text($(this).text());
				$( "#dialog-details" ).dialog('open');
				$('#dialog-forest-layers').dialog('close');
				$( "#tabs-details" ).tabs( "option", "active", 1);
				$('#layer-details').show();
				$( "#layer-details" ).accordion("option", "active", 0);
			} else {
				$(this).removeClass('display');
				$('#layer-details').hide();
				$('.forest-title h3').text('');
			}
			if(map.hasLayer(lr)){
				map.removeLayer(lr);
				$('#tabs-details-1').children('label[data-id="f"]').hide();
				$('#legend').attr('src','http://46.137.159.194/geoserver/venues/wms?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=venues:test_vn&legend_options=bgColor:0xF5F5EF;');
			} else {
				if(map.hasLayer(forestLayerActive)){
					map.removeLayer(forestLayerActive);
				}
				$('#tabs-details-1').children('label[data-id="f"]').show();
				map.addLayer(lr);
				forestLayerActive = lr;
				forestLayerActive.setOpacity($("#slider").slider('value')/100);
				var legend_url = forestLayerActive._url.replace('gwc/service/','')+'?SERVICE=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=20&STRICT=false&style='+forestLayerActive.options.layers.replace('formis:','')+'&legend_options=fontSize:11;bgColor:0xF5F5EF;';
				$('#legend').attr('src',legend_url);
			}
		})
		if(this.menu_part=='a'){
			data.push([this.layers,this.name[lang]]);
		}
	})
	var s = document.getElementById('quick-stat-type');
	populateSelect(s,data);
	
	$.each(admLayersList, function(i,e){
		var lr = L.tileLayer.wms(this.url, {
			layers: this.layers,
			format: 'image/png',
			transparent: true,
			version: '1.1.0',
			attribution: this.name[lang],
			src:'EPSG:900913'
		});
		this.wms = lr;
		var $li = $("<li class='checkable'>"+this.name[lang]+"</li>");
		$li.appendTo('#base-layers-part-'+this.menu_part);
		this.li = $li;
		var part = this.menu_part;
		this.active = false;
		this.li.on('click', function(){
			if($(this).hasClass('checked')){
				$(this).removeClass('checked');
				$('#tabs-details-1').children('label[data-id="'+part+i+'"]').children('input').prop('checked', false);
			} else {
				$(this).addClass('checked');
				$('#tabs-details-1').children('label[data-id="'+part+i+'"]').children('input').prop('checked', true);
			}
			if(map.hasLayer(lr)){
				map.removeLayer(lr);
				e.active = false;
			} else {
				map.addLayer(lr);
				e.active = true;
			}
		})
	})
	
	
	//Search dialog
	
	function selectFeature() {
		var province = $('#search-province').val();
		var district = $('#search-district').val();
		var commune = $('#search-commune').val();
		var compt = $('#search-compartment').val();
		var subcompt = $('#search-subcompartment').val();
		var plot = $('#search-plot').val();
		var q1 = "commune_code="+commune;
		var q2 = " AND compt_code='"+compt+"'";
		var q3 = " AND sub_compt_code='"+subcompt+"'";
		var q4 = " AND plot_code= '"+plot+"'";
		if(plot!='0') {
			var filter = q1+q2+q3+q4;
			var type = 'plot';
		} else if(subcompt!='0') {
			var filter = q1+q2+q3;
			var type = 'sub_compartment';
		}  else if(compt!='0') {
			var filter = q1+q2;
			var type = 'compartment';
		} else if(commune!='0') {
			var filter = q1;
			var type = 'commune';
		} else if(district!='0') {
			var filter = 'district_code='+district;
			var type = 'district';
		} else if(province!='0') {
			var filter = 'province_code='+province;
			var type = 'province';
		}
		var url = 'http://maps.vnforest.gov.vn/OL4JSFProxy/wfs';
		$.ajax({url:url,
			type: 'GET', 
			async: false,
			crossDomain: true, 
			data:{
				service:"WFS", 
				version:'1.0.0',
				request:'GetFeature',
				typeName:type,
				outputFormat:'json',
				srsName:'EPSG:4326',
				CQL_FILTER:filter
			},
			dataType: 'json',
			contentType: 'application/json',
			success: function(data){
				selectedFeature.clearLayers();
				selectedFeature.addData(data);
				map.fitBounds(selectedFeature.getBounds());
				selectedFeature.addTo(map);
			}
		});
	}
	
	$("#search-btn").on('click', function(){
		selectFeature();
	})
	
	$('#search-province').on('change', function(){
		document.getElementById("search-district").options.length=1;
		document.getElementById("search-commune").options.length=1;
		document.getElementById("search-compartment").options.length=1;
		document.getElementById("search-subcompartment").options.length=1;
		document.getElementById("search-plot").options.length=1;
		if($(this).val()!='0'){
			$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				type: 'GET', 
				async: false,
				crossDomain: true, 
				data:{
					serviceid:"common_service", 
					typeResult:'json',
					tableName:'district',
					idColumn:'district_code',
					nameColumn:"name",
					province_code:$(this).val()
				},
				dataType: 'json',
				contentType: 'application/json',
				success: function(data){
					$('.province-data').val($('#search-province').val());
					var select_districts = document.getElementsByClassName('district-data');
					$.each(select_districts, function(i){
						this.options.length=1;
						populateSelect(this,data[0]);
					})
					$('.commune-data').html($('#search-commune').html());
					$('.commune-data').val($('#search-commune').val());
				}
			});
		}
	})
	
	$('#search-district').on('change', function(){
		document.getElementById("search-commune").options.length=1;
		document.getElementById("search-compartment").options.length=1;
		document.getElementById("search-subcompartment").options.length=1;
		document.getElementById("search-plot").options.length=1;
		if($(this).val()!='0'){
			$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				type: 'GET', 
				async: false,
				crossDomain: true, 
				data:{
					serviceid:"common_service", 
					typeResult:'json',
					tableName:'commune',
					idColumn:'commune_code',
					nameColumn:"name",
					district_code:$(this).val()
				},
				dataType: 'json',
				contentType: 'application/json',
				success: function(data){
					$('.province-data').val($('#search-province').val());
					var d_val = $('#search-district').val();				
					$('.district-data').html($('#search-district').html());
					$('.district-data').val(d_val);
					var select_communes = document.getElementsByClassName('commune-data');
					$.each(select_communes, function(){
						this.length=1;
						populateSelect(this,data[0]);
					})
				}
			});
		}
	})
	
	$('#search-commune').on('change', function(){
		document.getElementById("search-compartment").options.length=1;
		document.getElementById("search-subcompartment").options.length=1;
		document.getElementById("search-plot").options.length=1;
		if($(this).val()!='0'){
			$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				type: 'GET', 
				async: false,
				crossDomain: true, 
				data:{
					serviceid:"common_service", 
					typeResult:'json',
					tableName:'compartment',
					idColumn:'compt_code',
					nameColumn:"compt_code",
					commune_code:$(this).val()
				},
				dataType: 'json',
				contentType: 'application/json',
				success: function(data){
					$('.province-data').val($('#search-province').val());
					var d_val = $('#search-district').val();
					$('.district-data').html($('#search-district').html());
					$('.district-data').val(d_val);
					var c_val = $('#search-commune').val();
					$('.commune-data').html($('#search-commune').html());
					$('.commune-data').val(c_val);
					var s = document.getElementById('search-compartment');
					populateSelect(s,data[0]);
				}
			});
		}
	})
	
	$('#search-compartment').on('change', function(){
		document.getElementById("search-subcompartment").options.length=1;
		document.getElementById("search-plot").options.length=1;
		if($(this).val()!='0'){
			$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				type: 'GET', 
				async: false,
				crossDomain: true, 
				data:{
					serviceid:"common_service", 
					typeResult:'json',
					tableName:'sub_compartment',
					idColumn:'sub_compt_code',
					nameColumn:"sub_compt_code",
					commune_code:$('#search-commune').val(),
					compt_code:$(this).val()
				},
				dataType: 'json',
				contentType: 'application/json',
				success: function(data){
					var s = document.getElementById('search-subcompartment');
					populateSelect(s,data[0]);
				}
			});
		}
	})
	
	$('#search-subcompartment').on('change', function(){
		document.getElementById("search-plot").options.length=1;
		if($(this).val()!='0'){
			$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				type: 'GET', 
				async: false,
				crossDomain: true, 
				data:{
					serviceid:"common_service", 
					typeResult:'json',
					tableName:'plot',
					idColumn:'plot_code',
					nameColumn:"plot_code",
					commune_code:$('#search-commune').val(),
					compt_code:$('#search-compartment').val(),
					sub_compt_code:$(this).val()
				},
				dataType: 'json',
				contentType: 'application/json',
				success: function(data){
					var s = document.getElementById('search-plot');
					populateSelect(s,data[0]);
				}
			});
		}
	})
	
	
	//Report
	
	$('#tabs-report-province').on('change', function(){
		document.getElementById('tabs-report-district').options.length = 1;
		document.getElementById('tabs-report-commune').options.length = 1;
		if($(this).val()!=0){
			$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				type: 'GET', 
				async: false,
				crossDomain: true, 
				data:{
					serviceid:"common_service", 
					typeResult:'json',
					tableName:'district',
					idColumn:'district_code',
					nameColumn:"name",
					province_code:$(this).val()
				},
				dataType: 'json',
				contentType: 'application/json',
				success: function(data){
					var s = document.getElementById('tabs-report-district');
					populateSelect(s,data[0]);
				}
			});
		}
	})
	
	$('#tabs-report-district').on('change', function(){
		document.getElementById('tabs-report-commune').options.length = 1;
		if($(this).val()!=0){
			$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				type: 'GET', 
				async: false,
				crossDomain: true, 
				data:{
					serviceid:"common_service", 
					typeResult:'json',
					tableName:'commune',
					idColumn:'commune_code',
					nameColumn:"name",
					district_code:$(this).val()
				},
				dataType: 'json',
				contentType: 'application/json',
				success: function(data){
					var s = document.getElementById('tabs-report-commune');
					populateSelect(s,data[0]);
				}
			});
		}
	})
	
	i=0
	$('#view-report').on('click', function(){
		if(Number($('#report-source').val())==1){
			var url = exportNfisReport();;
			var win = window.open(url, '_blank');
			win.focus();
		} else {
			var url = 'http://46.137.159.194/vietnam6/report.html';
			var win = window.open(url, '_blank');
			win.focus();
		}
	})
	
	$('#view-quick-report').on('click', function(){
		//var thisBbox = toBBoxStr(map.getBounds(),0);
		//var count = 6 * map.getZoom();
		var pGid = '', pGeom = '', pLat = '', pLng = '', pRadius = '';
		
		var owsrootUrl = "http://46.137.159.194/geoserver/formis/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=formis:quick_statistics&outputFormat=text/javascript";
		
		var pGid = 'gid:0;';
		
		if(drawnItems.getLayers().length){
			var geom = drawnItems.getLayers()[0];
			if(geom instanceof L.Circle){
				var coords = geom.getLatLng()
				pLat = 'lat:' + coords.lat + ';';
				pLng = 'lng:' + coords.lng + ';';
				pRadius = 'radius:' + geom.getRadius() + ';';
			} else {
				wkt.fromObject(geom);
				var pGeom = 'geom:'+wkt.toLocaleString().replace(/,/g,'\\,')+',';
			}
		}
		
		var defaultParameters2 = {
			format_options : 'callback:getJsonR',
			viewparams: (pGid + pGeom + pLat + pLng + pRadius).slice(0, -1)
		};
		var parameters = L.Util.extend(defaultParameters2); 
		var param = L.Util.getParamString(parameters); 
		param = param.substring(1);
		param = '&' + param; 
		var URL = owsrootUrl + param;
		var ajax = $.ajax({
			url : URL,
			dataType : 'jsonp',
			format_options : 'callback:getJsonR',
			jsonpCallback : 'getJsonR', 
			success : function (response) {
				
				
				$('#canvas-holder').html('<canvas id="chart" />');
				$('#dialog-quick-statistics').dialog('open');
				
				var dataPoints = [];
				var dataColors = [];
				var dataLabels = [];
				var dataArea = 0, dataPlots = 0, dataTimber = 0;
				
				var randomScalingFactor = function(v) {
					return Math.round(v / 10000);
				};
				
				function getRandomColor() {
					var letters = '0123456789ABCDEF';
					var color = '#';
					for (var i = 0; i < 6; i++ ) {
						color += letters[Math.floor(Math.random() * 16)];
					}
					return color;
				}
				
				var table = $('#dialog-quick-statistics-table');
				table.html('')
				table.append( '<tr><th>Name</th><th>Plots</th><th>Area[ha]</th><th>Area [%]</th><th>T.volume[m3]</th></tr>' );
				$.each(response.features, function(){
					var piece = randomScalingFactor(this.properties.area);
					dataPoints.push(piece);
					dataColors.push(getRandomColor());					
					dataLabels.push(this.properties.maldlr);	
					dataArea = dataArea + piece;
					dataPlots = dataPlots + this.properties.count;
					dataTimber = dataTimber + this.properties.volume;
				})
				$.each(response.features, function(i){
					table.append( '<tr><td>' + this.properties.maldlr + '</td><td>' + this.properties.count + '</td><td>' + dataPoints[i] + '</td><td>' + Math.round(dataPoints[i]/dataArea*10000)/100 + '</td><td>' + this.properties.volume + '</td></tr>' );
				})	
				
				$('#dialog-quick-statistics-summary-area span').text(dataArea + ' ha');
				$('#dialog-quick-statistics-summary-plots span').text(dataPlots);
				$('#dialog-quick-statistics-summary-timber span').text(dataTimber+' m3/ha');
				
				var config = {
					type: 'pie',
					data: {
						labels: dataLabels,
						datasets: [{
							data: dataPoints,
							backgroundColor: dataColors,
							label: $('#quick-stat-type option:selected').text()
						}]
					},
					options: {
						responsive: true,
						tooltips: {
							mode: 'label',
							callbacks: {
								label: function(tooltipItem, data) { 
									var indice = tooltipItem.index;                 
									return  data.labels[indice] + ' - ' + data.datasets[0].data[indice] + ' ha';
								}
							}
						}
					}
				};

				var ctx = document.getElementById("chart").getContext("2d");
				window.myPie = new Chart(ctx, config);

			}, error: function(e){
				console.log(e);
			}
		});
	})
	
	$('#report-source').change(function() {
		if (this.value == 1) {
			$('#tab-monitoring-dates').hide();
			$("#tabs-report-type option[value='6']").hide();
			$("#tabs-report-type option[value='7']").hide();
		} else if (this.value == 2) {
			$('#tab-monitoring-dates').show();
			$("#tabs-report-type option[value='6']").show();
			$("#tabs-report-type option[value='7']").show();
		}
	});
	
	$('#quick-stat-source').change(function() {
		if ($(this).val() == 'pl') {
			$('#quick-stat-adm-uni').hide();
			if(!drawnItems.getLayers().length){
				$('#quick-stat-select').show();
			} else {
				map.fitBounds(drawnItems.getLayers()[0]);
				$('#quick-stat-select').hide();
			}
		} else if ($(this).val() == 'un') {
			$("#quick-stat-adm-uni").show();
			$('#quick-stat-select').hide();
		}
	});
	
	$('.quick-stat-date').on('change', function(){
		if($('#quick-stat-date1').val() > $('#quick-stat-date2').val()){
			$('#quick-stat-date2').val($('#quick-stat-date1').val());
		}
	})
	
	$('.tab-input-date').on('change', function(){
		if($('#tabs-report-date1').val() > $('#tabs-report-date2').val()){
			$('#tabs-report-date2').val($('#tabs-report-date1').val());
		}
	})
	
	$('#report-adm-uni').on('change', function(){
		if ($(this).val() == 'vn') {
			$('.tab-select-region').hide();
		} else if ($(this).val() == 'pr') {
			$('.tab-select-region').hide();
			 $('#tab-select-region-province').show();
		} else if ($(this).val() == 'di') {
			$('.tab-select-region').hide();
			$('#tab-select-region-province').show();
			$('#tab-select-region-district').show();
		} else if ($(this).val() == 'co') {
			$('.tab-select-region').show();
		}
	})
	
	$('#quick-stat-select-adm-uni').on('change', function(){
		if ($(this).val() == 'vn' || $(this).val() == '0') {
			$('.quick-stat-region').hide();
		} else if ($(this).val() == 'pr') {
			$('.quick-stat-region').hide();
			 $('#quick-stat-region-province').show();
		} else if ($(this).val() == 'di') {
			$('.quick-stat-region').hide();
			$('#quick-stat-region-province').show();
			$('#quick-stat-region-district').show();
		} else if ($(this).val() == 'co') {
			$('.quick-stat-region').show();
		}
	})
	
	$('#quick-stat-province').on('change', function(){
		document.getElementById('quick-stat-district').options.length = 1;
		document.getElementById('quick-stat-commune').options.length = 1;
		if($(this).val()!=0){
			$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				type: 'GET', 
				async: false,
				crossDomain: true, 
				data:{
					serviceid:"common_service", 
					typeResult:'json',
					tableName:'district',
					idColumn:'district_code',
					nameColumn:"name",
					province_code:$(this).val()
				},
				dataType: 'json',
				contentType: 'application/json',
				success: function(data){
					var s = document.getElementById('quick-stat-district');
					populateSelect(s,data[0]);
				}
			});
		}
	})
	
	$('#quick-stat-district').on('change', function(){
		document.getElementById('quick-stat-commune').options.length = 1;
		if($(this).val()!=0){
			$.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				type: 'GET', 
				async: false,
				crossDomain: true, 
				data:{
					serviceid:"common_service", 
					typeResult:'json',
					tableName:'commune',
					idColumn:'commune_code',
					nameColumn:"name",
					district_code:$(this).val()
				},
				dataType: 'json',
				contentType: 'application/json',
				success: function(data){
					var s = document.getElementById('quick-stat-commune');
					populateSelect(s,data[0]);
				}
			});
		}
	})
	
	function exportNfisReport() {
		var report = $('#tabs-report-type').val();
		var province_code = $('#tabs-report-province').val();
		var district_code = $('#tabs-report-district').val();
		var commune_code = $('#tabs-report-commune').val();

		var urlReport;
		var nameTab;
		var idTab;
		if (typeof report === 'undefined' || report === 'undefined' || report < 0) {
			alert('B?n chua ch?n báo cáo');
		} else {
			if (province_code < 0 && district_code < 0 && commune_code < 0) {
				alert('B?n chua ch?n đon v?');
				return;
			} else if (commune_code > 0) {
				idTab = "tabs_commune_" + report + "_" + commune_code;
				nameTab = $('#report_commune option:selected').text();
				urlReport = 'proxy?locale=' + language + '&serviceid=nfis_report&reportCode=' + report + '.rptdesign' + '&level=3&id=' + commune_code;
				/* urlReport = {
					locale: language,
					serviceid: 'nfis_report',
					reportCode: report + '.rptdesign',
					level: 3,
					id: commune_code
				}; */
			} else if (district_code > 0) {
				idTab = "tabs_district_" + report + "_" + district_code;
				nameTab = $('#report_district option:selected').text();
				urlReport = 'proxy?locale=' + language + '&serviceid=nfis_report&reportCode=' + report + '.rptdesign' + '&level=2&id=' + district_code;
				/* urlReport = {
					locale: language,
					serviceid: 'nfis_report',
					reportCode: report + '.rptdesign',
					level: 2,
					id: district_code
				}; */
			} else if (province_code > 0) {
				idTab = "tabs_province_" + report + "_" + province_code;
				nameTab = $('#report_province option:selected').text();
				urlReport = 'proxy?locale=' + language + '&serviceid=nfis_report&reportCode=' + report + '.rptdesign' + '&level=1&id=' + province_code;
				/* urlReport = {
					locale: language,
					serviceid: 'nfis_report',
					reportCode: report + '.rptdesign',
					level: 1,
					id: province_code
				}; */
			}
			// $.ajax({url:'http://maps.vnforest.gov.vn/proxy?',
				// type: 'GET', 
				// async: false,
				// crossDomain: true, 
				// data: urlReport,
				// dataType: 'json',
				// contentType: 'application/json',
				// success: function(data){
					// console.log(data);
				// }, 
				// error:function(data){
					// console.log(data);
				// }
			// });
			return 'http://maps.vnforest.gov.vn/proxy?'+urlReport;
		}
	}
	
	
	//Data sharing
	
	$('#data-sets-search-btn').on('click', function(){
		$('#data-sets-search').hide();
		$('#data-sets-result').show();
	})
	
	$('#data-sets-result-back').on('click', function(){
		$('#data-sets-search').show();
		$('#data-sets-result').hide();
	})
	
	$('#data-services-search-btn').on('click', function(){
		$('#data-services-search').hide();
		$('#data-services-result').show();
	})
	
	$('#data-services-result-back').on('click', function(){
		$('#data-services-search').show();
		$('#data-services-result').hide();
	})
	
	$('#data-sets-province-vn').on('focus',function(){
		$('#data-sets-province-region').hide();
	})
	
	$('#data-services-province-vn').on('focus',function(){
		$('#data-services-province-region').hide();
	})
	
	$('#data-sets-province-pr').on('focus',function(){
		$('#data-sets-province-region').show();
	})
	
	$('#data-services-province-pr').on('focus',function(){
		$('#data-services-province-region').show();
	})
	
	$('.share-date').on('change', function(){
		if($('#share-date1').val() > $('#share-date2').val()){
			$('#share-date2').val($('#share-date1').val());
		}
	})
	
	
	//Get info
	function getLayerInfo(lr,e){
		var source = lr._url;
		var name = lr.options.layers;
		var bboxArr = map.getBounds();
		var bboxSW = bboxArr.getSouthWest();
		var bboxNE = bboxArr.getNorthEast();
		var bbox = bboxArr.toBBoxString();
		var point = e.containerPoint;
		var size = map.getSize();
		var urlTmp = source.replace('gwc/service/','')+'?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&QUERY_LAYERS='+name+'&LAYERS='+name+'&INFO_FORMAT=application/json&FEATURE_COUNT=3&x='+point.x+'&y='+point.y+'&WIDTH='+size.x+'&HEIGHT='+size.y+'&CRS=EPSG:4326&STYLES=&BBOX='+bbox;
		/* $.ajax({
			url: urlTmp,
			dataType: 'json',
			type: "GET",
			success: function(response) {
				console.log(response);
			}
		}); */
		
		
		var urlGetInfo = 'http://maps.vnforest.gov.vn/proxy?locale=' + language + '&serviceid=get_info&method_id=feature_info&zoom=' + map.getZoom();
		var coordinate = e.latlng;
		var dataUrl = {};
		dataUrl.coordinate = coordinate.lng+','+coordinate.lat;
		dataUrl.activeLayers = name;
		dataUrl.urls = [urlTmp];
		//dataUrl.user_id= getUserName();
		$.ajax({
			url: urlGetInfo,
			data: dataUrl,
			dataType: 'html',
			type: "POST",
			success: function(response) {
				console.log(response);
				if (response !== "") {
					cosole.log(response);             
				}

			}
		});
	}
	
	function showFeatureInfo(e) {
		//var viewProjection = (map.getView().getProjection());
		//var viewResolution = (map.getView().getResolution());
		var zoom = map.getZoom();
		var urls = [];
		var activeLayers = [];
		for (var i = 0, ii = admLayersList.length; i < ii; ++i) {
            var layer = admLayersList[i];
			if (layer.active && layer.wms.options.minZoom <= zoom && layer.wms.options.maxZoom >= zoom) {
				getLayerInfo(layer.wms,e);
			}
		}
		getLayerInfo(forestLayerActive,e);
		
		
		/*  */
	}
	
	$('#info-btn').on('click', function(){
		map._container.style.cursor = 'help';
		$(this).addClass('selected');
		map.on('contextmenu',function(e){
			closeGetInfo();
		});
		map.on('click', function(e){
			showFeatureInfo(e);
		})
	})
	
	function closeGetInfo(){
		map.off('click');
		map.off('contextmenu');
		map._container.style.cursor = null;
		$('#info-btn').removeClass('selected');
	}

	
	//Select 
		
	$("#select-by-polygon, #quick-stat-select-by-polygon").on('click', function(){
		$('.leaflet-draw-toolbar').children()[0].click()
	})
	
	$("#select-by-point, #quick-stat-select-by-point").on('click', function(){
		$('.leaflet-draw-toolbar').children()[2].click()
	})
	
	$("#select-btn").on('click', function(){
		if(!$('#select-widget').is(':visible')){
			$('.select-btn').removeClass('selected');
			$('.widget').hide();
			$('#select-widget').show();
		} else {
			$('#select-widget').hide();
			drawnItems.clearLayers();
		}
	})
	
	map.on(L.Draw.Event.DRAWSTART, function (e) {
		drawnItems.clearLayers();
	});
	
	map.on(L.Draw.Event.CREATED, function (e) {
		drawnItems.clearLayers();
		var layer = e.layer;
		drawnItems.addLayer(layer);
		map.fitBounds(layer);
		$('.select-btn').removeClass('selected');
		$('#quick-stat-source').change();
		layer.on('click',function(){
			drawnItems.clearLayers();
			$('#quick-stat-source').change();
		})
		$("#select-widget").hide();
	});
	
	
	//Measure
	
	$("#measure-btn").on('click', function(){
		$('.widget').hide();
		$('#measure-widget').show();
	})
		
	var tooltip = document.getElementById('measure-tooltip');
	
	var measureControl = new L.Control.Measure({}).addTo(map);
	$('.leaflet-control-measure').hide();
	map.on('measurefinish',function(e){
		closeMeasureArea();
		closeMeasureDistance();
	})
	
	$('.measure-btn').on('click', function(){
		closeMeasure();
		$('#unit').show();
		$(this).addClass('selected');
	})
	
	$('#measure-angle').on('click', function(){
		addUnits([['VN2000 (m)','m']]);
		$(tooltip).show();
		map._container.style.cursor = 'crosshair';
		map.on('mousemove', function(e){
			tooltip.style.left = e.containerPoint.x + 'px';
			tooltip.style.top = e.containerPoint.y + 'px';
			var bngproj = '+proj=utm +zone=48 +ellps=WGS84 +units=m +no_defs ';
			var bngcoords = proj4(bngproj, [e.latlng.lng, e.latlng.lat]);
			var x_arr = bngcoords[0].toString().split('.');
			var y_arr = bngcoords[1].toString().split('.');
			var coords = x_arr[0] + '.' + x_arr[1].substring(0,2) + ', '+ y_arr[0] + '.' + y_arr[1].substring(0,2);
			$(tooltip).text(coords);
		})
	})
	
	function closeMeasureAngle(){
		map._container.style.cursor = null;
		$(tooltip).hide();
		map.off('mousemove');
	}
	
	$('#measure-distance').on('click', function(){
		addUnits([['m','meters'],['km','kilometers']]);
		measureControl.options.primaryLengthUnit = $('#unit').val();
		measureControl.options.secondaryLengthUnit = null;
		measureControl._startMeasure('line');
	})
	
	function closeMeasureDistance(){
		if(measureControl._locked){
			measureControl._finishMeasure();
		}
		$('.measure-btn').removeClass('selected');
		$('#unit').hide();
		map.off('mousemove');
	}
	
	$('#measure-area').on('click', function(){
		addUnits([['hectares','hectares'],['km2','sqkilometers']]);
		measureControl.options.primaryAreaUnit = $('#unit').val();
		measureControl.options.secondaryAreaUnit = null;
		measureControl._startMeasure(null);
	})
	
	function closeMeasureArea(){
		if(measureControl._locked){
			measureControl._finishMeasure();
		}
		$('.measure-btn').removeClass('selected');
		$('#unit').hide();
		map.off('mousemove');
	}
	
	function closeMeasure(){
		measureControl._layer.clearLayers();
		$('#unit').hide();
		$('.measure-btn').removeClass('selected');
		closeMeasureAngle();
		closeMeasureDistance();
		closeMeasureArea();
	}
	
	$('#unit').on('change', function(){
		measureControl.options.primaryAreaUnit = $('#unit').val();
		measureControl.options.primaryLengthUnit = $('#unit').val();
	})
	
	$('.select-btn').on('click', function(){
		$('.select-btn').removeClass('selected');
		$(this).addClass('selected');
	})
	
	function addUnits(a){
		var sel = document.getElementById('unit');
		sel.innerHTML = "";
		$.each(a, function(){
			var opt = document.createElement('option');
			opt.appendChild( document.createTextNode(this[0]) );
			opt.value = this[1]; 
			sel.appendChild(opt); 
		})
	}
	
	
	//Print
	
	$("#print-btn").on('click', function(){
		$('#map').print();
	})
	
	
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

	
	//User 
	
	$('#user').on('click', function(){
		$(this).hide();
		$('#signin').show();
		$( "#tabs-search" ).tabs( "option", "active", 0);
		$('#tabs-search>ul').hide();
	})
	
	$('#signin').on('click', function(){
		$('#dialog-signin').dialog('open');
	})
	
	$('#sign-in-btn').on('click', function(){
		$('#user').children('span').text($('#form-username').val());
		$('#signin').hide();
		$('#user').show();
		$('#tabs-search>ul').show();
		$('#dialog-signin').dialog('close');
	})
	
	
	$(function() {
		
		//Elements
		
		$( "#nav" ).buttonset();
		
		$( ".tab-button" ).button();
		
		$( "#forest-layers" ).accordion({
			collapsible: true,
			heightStyle: 'content',
			active: false
		});
		
		$( "#tabs-details" ).tabs();
		$( "#tabs-search" ).tabs();
		$( "#tabs-share" ).tabs();
		var tabs = $( "#tabs-report" ).tabs();
		
		$( "#layer-details" ).accordion({
			collapsible: true,
			heightStyle: 'content',
			active: false
		});
		
		$( "#slider" ).slider({
		  value: 100,
		  change: function(event, ui){
				  if(map.hasLayer(forestLayerActive)){
						forestLayerActive.setOpacity(ui.value/100);
				  }
			  }
		});
		
		$( "#tabs-report-date1" ).datepicker({
			dateFormat : "dd-mm-yy",
			showOn: "both",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true,
			buttonText: "Select date"
		});
		$( "#tabs-report-date2" ).datepicker({
			dateFormat : "dd-mm-yy",
			showOn: "both",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true,
			buttonText: "Select date",
			defaultDate: "+1y"
		});
		$( "#tabs-report-date1" ).datepicker('setDate', "-1y");
		$( "#tabs-report-date2" ).datepicker('setDate', "-0d");
		
		$( "#share-date1" ).datepicker({
			dateFormat : "dd-mm-yy",
			showOn: "both",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true,
			buttonText: "Select date"
		});
		$( "#share-date2" ).datepicker({
			dateFormat : "dd-mm-yy",
			showOn: "both",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true,
			buttonText: "Select date"
		});
		$( "#share-date1" ).datepicker('setDate', new Date());
		$( "#share-date2" ).datepicker('setDate', new Date());
		
		$( "#quick-stat-date1" ).datepicker({
			dateFormat : "dd-mm-yy",
			showOn: "both",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true,
			buttonText: "Select date"
		});
		$( "#quick-stat-date2" ).datepicker({
			dateFormat : "dd-mm-yy",
			showOn: "both",
			buttonImage: "images/calendar.png",
			buttonImageOnly: true,
			buttonText: "Select date"
		});
		$( "#quick-stat-date1" ).datepicker('setDate', new Date());
		$( "#quick-stat-date2" ).datepicker('setDate', new Date());
		
		
		//Dialogs
		
		$('#dialog-quick-statistics').dialog({ 
			minWidth:680,
			maxHeight: $(window).height() - 95, 
			position: { my: "left top+2", at: "left bottom", of: $('#nav') },
			autoOpen: false
		});
		
		$('#dialog-signin').dialog({ 
			width:311,
			maxHeight: $(window).height() - 95, 
			position: { my: "center center", at: "center center", of: $('body') },
			autoOpen: false
		});
		
		$( "#dialog-details" ).dialog({ 
			width:311,
			maxHeight: $(window).height() - 95,
			dialogClass: 'noTitleStuff', 
			position: { my: "left top+2", at: "left bottom", of: $('#nav') },
			autoOpen: false
		});
		
		$( "#dialog-forest-layers" ).dialog({ 
			width:340, 
			dialogClass: 'noTitleStuff', 
			position: { my: "left top", at: "left bottom", of: $('#radio1').next() },
			autoOpen: false
		});
		
		$( "#dialog-base-layers" ).dialog({ 
			width:200, 
			dialogClass: 'noTitleStuff', 
			position: { my: "left top", at: "left bottom", of: $('#radio2').next() },
			autoOpen: false
		});
		
		$( "#dialog-reference-layers" ).dialog({ 
			width:220, 
			dialogClass: 'noTitleStuff', 
			position: { my: "left top", at: "left bottom", of: $('#radio6').next() },
			autoOpen: false
		});
		
		$( "#dialog-report" ).dialog({ 
			width:380, 
			dialogClass: 'noTitleStuff', 
			position: { my: "left top", at: "left bottom", of: $('#radio3').next() },
			autoOpen: false,
			open: function(){
				if(forestLayerActive){
					var lr = forestLayerActive.options.layers;
					if($("#quick-stat-type option[value='"+lr+"']").length){
						$('#quick-stat-type').val(lr);
					}
				}
				
				var source = 'http://46.137.159.194/geoserver/wms';
				var bboxArr = map.getBounds();
				var bboxSW = bboxArr.getSouthWest();
				var bboxNE = bboxArr.getNorthEast();
				var bbox = bboxArr.toBBoxString();
				var size = map.getSize();
				var urlTmp;
				var z = map.getZoom();
				if(z<9){
					$('.select-adm-uni').val('vn');
					urlTmp = '';
				} else if(z<11){
					var name = 'formis:Vietnam_Province';
					urlTmp = source.replace('gwc/service/','')+'?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&QUERY_LAYERS='+name+'&LAYERS='+name+'&INFO_FORMAT=application/json&FEATURE_COUNT=3&x='+Math.round(size.x/2)+'&y='+Math.round(size.y/2)+'&WIDTH='+size.x+'&HEIGHT='+size.y+'&CRS=EPSG:4326&STYLES=&BBOX='+bbox;

					$('.select-adm-uni').val('pr');
				} else if(z<14){
					var name = 'formis:Vietnam_District';
					urlTmp = source.replace('gwc/service/','')+'?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&QUERY_LAYERS='+name+'&LAYERS='+name+'&INFO_FORMAT=application/json&FEATURE_COUNT=3&x='+Math.round(size.x/2)+'&y='+Math.round(size.y/2)+'&WIDTH='+size.x+'&HEIGHT='+size.y+'&CRS=EPSG:4326&STYLES=&BBOX='+bbox;

					$('.select-adm-uni').val('di');
				} else {
					var name = 'formis:Vietnam_Commune';
					urlTmp = source.replace('gwc/service/','')+'?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&QUERY_LAYERS='+name+'&LAYERS='+name+'&INFO_FORMAT=application/json&FEATURE_COUNT=3&x='+Math.round(size.x/2)+'&y='+Math.round(size.y/2)+'&WIDTH='+size.x+'&HEIGHT='+size.y+'&CRS=EPSG:4326&STYLES=&BBOX='+bbox;

					$('.select-adm-uni').val('co');
				}
				$('.select-adm-uni').change();
				console.log(urlTmp);
				alert(1);
				$.ajax({
					jsonp : true,
					url: urlTmp,
					dataType: 'html',
				   jsonpCallback: 'getJson',
				   success : function (response) {
					    response = JSON.parse(response);
						var p =response.features[0].properties.PROVINCECO;
						$('.province-data').val(p);
					}, error: function(e){
						console.log(e);
					}
				});
			}
		});
		
		$( "#dialog-search" ).dialog({ 
			width:300, 
			dialogClass: 'noTitleStuff', 
			position: { my: "left top", at: "left bottom", of: $('#radio7').next() },
			autoOpen: false
		});
		
		$( "#dialog-share" ).dialog({ 
			width:300, 
			dialogClass: 'noTitleStuff', 
			position: { my: "left top", at: "left bottom", of: $('#radio4').next() },
			autoOpen: false
		});
		
		$( "#dialog-details" ).dialog('open');
		
		
		//Events
		
		$("#nav :radio").click(function(){
			$('#dialog-search').dialog('close');
			$('#dialog-forest-layers').dialog('close');
			$('#dialog-base-layers').dialog('close');
			$('#dialog-report').dialog('close');
			$('#dialog-quick-statistics').dialog('close');
			$('#dialog-share').dialog('close');
			$( "#dialog-reference-layers" ).dialog('close');
		});
		
		$('#map').on('click', function() {
			$('#dialog-search').dialog('close');
			$('#dialog-forest-layers').dialog('close');
			$('#dialog-base-layers').dialog('close');
			if(!drawControl._toolbars.draw._activeMode){
				$('#dialog-report').dialog('close');
			}
			$('#dialog-quick-statistics').dialog('close');
			$('#dialog-share').dialog('close');
			$( "#dialog-reference-layers" ).dialog('close');
			$('#nav input').removeAttr('checked');
			$( "#nav" ).buttonset('refresh');
		})
		
		$('html').on('click', function(){
			if($('#search').is(':visible')){
				$('#search').hide();
			} else if($('#measure-widget').is(':visible')){
				$('#measure-widget').hide();
				closeMeasure();
			} else if($('#select-widget').is(':visible')){
				$('#select-widget').hide();
			} else if($('#fos').is(':visible')){
				$('#fos').hide();
			}
		})
		
		$('#measure-widget,#select-widget').on('click', function(event){
			event.stopPropagation();
		})
		
		$("#search, #select-btn, #measure-btn, #fos").on('click', function(event){
			event.stopPropagation();
			closeGetInfo();
			closeMeasure();
		})
		
		$( "#radio1" ).click(function(event){
			event.stopPropagation();
			$( "#dialog-forest-layers" ).dialog('open');
		});
		
		$( "#radio2" ).click(function(event){
			event.stopPropagation();
			$( "#dialog-base-layers" ).dialog('open');
		});
		
		$( "#radio6" ).click(function(event){
			event.stopPropagation();
			$( "#dialog-reference-layers" ).dialog('open');
		});
		
		$( "#radio7" ).click(function(event){
			event.stopPropagation();
			$( "#dialog-search" ).dialog('open');
		});
		
		$( "#radio3" ).click(function(event){
			event.stopPropagation();
			$('#dialog-report').dialog('open');
		});
		
		$( "#radio4" ).click(function(event){
			event.stopPropagation();
			$('#dialog-share').dialog('open');
		});
		
		$( "#radio5" ).click(function(event){
			event.stopPropagation();
			window.open('help.pdf','_blank');
		});
		
		$('#dialog-details-close').on('click', function(){
			$( "#dialog-details" ).dialog('close');
			$( "#dialog-details-open" ).show();
		})
		
		$('#dialog-details-open').on('click', function(){
			$( "#dialog-details" ).dialog('open');
			$(this).hide();
		})
		
		tabs.delegate( "span.ui-icon-close", "click", function() {
			var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
			$( "#" + panelId ).remove();
			tabs.tabs( "refresh" );
		});
		
		$.each($('.ui-menu-item'), function(){
			if($(this).hasClass('checkable')){
				$(this).removeClass('ui-menu-item');
			}
		}); 
		
		$('.myCheckbox>input').on('change',function(event){
			if($(this).parent().data('id')=='f'){
				if(map.hasLayer(forestLayerActive)){
					map.removeLayer(forestLayerActive);
				} else {
					map.addLayer(forestLayerActive);
				}
			} else {
				$('.checkable[data-id="'+$(this).parent().data('id')+'"]').click();
			}
		})
		
		/* $('body').on('click', '#legend-title button', function() {
			$('#legend-title button').removeClass('checked');
			$(this).addClass('checked');
		}); */
		
	});

});