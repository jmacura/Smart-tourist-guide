<?php
$lat = $_GET['lat'];
$lon = $_GET['lon'];
echo file_get_contents('http://api.met.no/weatherapi/locationforecast/1.9/?lat=' . $lat . ';lon=' . $lon);
?>
