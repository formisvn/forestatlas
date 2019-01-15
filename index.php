
<html>
<head>

	<?php 
		include('dictionary.php');
		
		// Detect the language version
		$lang = 'en';
		$langLong = 'en_US';
		$url = $_SERVER['REQUEST_URI'];
		$end = end((explode('/', rtrim($url, '/'))));
		if($end == 'vn'){
			$lang = 'vn';
			$langLong = 'vn_VN';
		}
		
		function dictionary($name) {
			global $dictionaryArray, $lang;
			if(isset($dictionaryArray[$name])){
				return $dictionaryArray[$name][$lang];
			} else {
				return $name;
			}
		}
	?>
	<script>
		var dictionary =<?php echo json_encode($dictionaryArray); ?>;
		var dictionary_attr =<?php echo json_encode($dictionaryAttr); ?>;
		var lang = "<?php echo $lang; ?>";
		var langLong = "<?php echo $langLong; ?>";
	</script>
	<link rel="icon" href="images/VNforest_Logo.png" type="image/x-icon"/>
	<title><?php echo dictionary('Vietnam Forestry Statistics'); ?></title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<script src="jquery.js"></script>
	<script src="jquery-ui.min.js"></script>
	<link rel="stylesheet" href="src/leaflet.css" />
	<link rel="stylesheet" type="text/css" href="jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="jquery-ui.theme.css">
	<link rel="stylesheet" type="text/css" href="jquery-ui.structure.css">
	<link rel="stylesheet" type="text/css" href="dss.css">
	<style>
		<?php if($lang=='vn'){ ?>
		.language-version-en{
			display: none;
		}
		<?php } else { ?>
		.language-version-vn{
			display: none;
		}
		<?php } ?>
	</style>
</head>
<body>

	<div id='banner-top' class='nav-top'>
		<div id='banner-top-title' class='nav-top'>
			<h1><?php echo dictionary('Vietnam Forestry Statistics'); ?></h1>
		</div>
		<div id='banner-top-forest-title' class='nav-top forest-title'><h3></h3></div>
		<div id='admin-tools' class='nav-top'>
			<div id="lng-change"  class='nav-top'>
				<a id="lng-change-vi" <?php if($lang=='vn'){echo 'style="display:none;"';}; ?> class='lng-change' href="vn"><img src="images/vn.png"></a>
				<a id="lng-change-en" <?php if($lang=='en'){echo 'style="display:none;"';}; ?> class='lng-change' href="en"><img src="images/en.png"></a>
			</div>
		</div>
		<div id='map-tools' class='nav-top'>
			<button id='info-btn' class='tool-btn' title="<?php echo dictionary('Information'); ?>"><img src='images/circle.png'></button>
		</div>
	</div>
	
	<div id="dialog-layers"></div>
	<div id="dialog-details" style="display:none">
		<button id='dialog-details-close'>X</button>
		<div id='tabs-details'>
			<ul>
				<li><a href="#tabs-details-2"><?php echo dictionary('Map legend'); ?></a></li>
				<li><a href="#tabs-details-3"><?php echo dictionary('Info'); ?></a></li>
			</ul>
			<div id="tabs-details-2">
				<div id='legend-title' class='forest-title'><h3></h3></div>
				<div id='legend-container'>
					<p>
						<img id='legend' src=''>
					</p>
				</div>
			</div>
			<div id="tabs-details-3">
				<p id='info-no-data' style='display:none;'><?php echo dictionary('No data'); ?></p>
				<div id='info-container'></div>
			</div>
		</div>
	</div>
	
	<div id='map-container'>
		<div id="map">
			<title></title>
			<div id="leaflet-layer-no-data" class="language-version-<?php echo $lang; ?>" style='display:none;'><?php echo dictionary('Forest resource data is not available in this scale'); ?></div> 
			<button id='dialog-details-open' style='display:none;'><</button>	
		</div>
	</div>
	
	<script src="src/leaflet.js"></script>
	<script src="proj4.js"></script>
	<script src="proj4leaflet.js"></script>
	<script src="lists.js"></script>
	<script src="dss.js"></script>
</body>
</html>