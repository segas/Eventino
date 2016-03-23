<?php

include('./db_connection.php'); //load config

$result = mysql_query("SELECT DISTINCT flight FROM sensordata");
$counter = 0;
while($row = mysql_fetch_object($result)){
	$flights[$counter] = $row->flight;
	$counter = $counter + 1;
}

echo ('{"flights":'.json_encode($flights).', "error": {"code": "000","message": "Flüge konnten erfolgreich in der Datenbank gefunden werden."}}');
?>
