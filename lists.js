
var crs3405 = new L.Proj.CRS('EPSG:3405',
	'+proj=utm +zone=48 +ellps=WGS84 +units=m +no_defs'
);

var layersList = [
	{
		name: dictionary['Poverty rate'][lang],
		color: '#674d68',
		layers:[
			{
				name: dictionary['Poverty rate in forest covered provinces in 2014'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_poverty_rate_2014',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Poverty rate in forest covered provinces in 2013'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_poverty_rate_2013',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Poverty rate in forest covered provinces in 2012'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_poverty_rate_2012',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Poverty rate in forest covered provinces in 2010'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_poverty_rate_2010',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Poverty rate in forest covered provinces in 2008'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_poverty_rate_2008',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Poverty rate in forest covered provinces in 2006'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_poverty_rate_2006',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},		
			{
				name: dictionary['Decrease of poverty rate in forest covered provinces within the period 2010-2014'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_poverty_rate_10_14',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Decrease of poverty rate in forest covered provinces within the period 2006-2014'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_poverty_rate_06_14',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Poverty rate in the 64 poorest district in 2012'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:district_poor_households_2012',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			}
		]
	},
	{
		name: dictionary['Forest coverage'][lang],
		color: '#674d68',
		layers:[
			{
				name: dictionary['Forest coverage per province in 2014'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_forest_cover_2014',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Forest coverage per province in 2013'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_forest_cover_2013',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Forest coverage per province in 2012'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_forest_cover_2012',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Forest coverage per province in 2011'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_forest_cover_2011',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Forest coverage per province in 2005'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_forest_cover_2005',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},		
			{
				name: dictionary['Forest coverage change per province within the period 2005-2014'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_forest_cover_05_14',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Forest coverage change per province within the period 2011-2014'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_forest_cover_11_14',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Forest coverage change per province within the period 2005-2011'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_forest_cover_05_11',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Tree canopy cover for year 2000 (Hansen)'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'dss:VN_Hansen_Treecov_v2',
				legend: {
					en: "http://maps.vnforest.gov.vn:802/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=dss:Treecover_Hansen",
					vn: "http://maps.vnforest.gov.vn:802/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&STRICT=false&style=dss:Treecover_Hansen"
				},
				info: "",
				addLayer: true
			}
		]
	},
	{
		name: dictionary['Landuse 2016'][lang],
		color: '#15490b',
		layers:[
			{
				name: dictionary['Agriculture'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_landuse2016_agriculture',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Forest'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_landuse_2016_forest',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Special'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_landuse_2016_special',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Homestead'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_landuse_2016_homestead',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			}
		]
	},
	{
		name: dictionary['Activities and incidents'][lang],
		color: '#15490b',
		layers:[
			{
				name: dictionary['Plantation areas 2012'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_plantation_areas_mard_2012',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Plantation areas 2010'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_plantation_areas_mard_2010',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Plantation areas 2008'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_plantation_areas_mard_2008',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Plantation areas 2006'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_plantation_areas_mard_2006',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Plantation areas 2004'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_plantation_areas_mard_2004',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Plantation areas 2002'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_plantation_areas_mard_2002',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Plantation areas 2000'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_plantation_areas_mard_2000',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Plantation areas 1998'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_plantation_areas_mard_1998',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Plantation areas 1996'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_plantation_areas_mard_1996',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Burned forest 2015 (percentage of province area)'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_burned_forest_mard_2015',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Burned forest 2014 (percentage of province area)'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_burned_forest_mard_2014',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Burned forest 2013 (percentage of province area)'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_burned_forest_mard_2013',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Burned forest 2012 (percentage of province area)'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_burned_forest_mard_2012',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			},
			{
				name: dictionary['Burned forest 2011 (percentage of province area)'][lang],
				url:'http://maps.vnforest.gov.vn:802/geoserver/wms',
				layers:'vfs:vfs_burned_forest_mard_2011',
				legend: {
					en: "",
					vn: ""
				},
				info: ""
			}
		]
	}
];
