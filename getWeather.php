<!--  OBSOLETE  -->
<?php
$lat = $_GET['lat'];
$lon = $_GET['lon'];
echo file_get_contents('http://api.met.no/weatherapi/locationforecast/2.0/classic?lat=' . $lat . ';lon=' . $lon);
?>
