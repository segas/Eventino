<?php
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
	header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

	include('./db_connection.php'); //load config

	$postdata = file_get_contents("php://input");
	$userData = json_decode($postdata);
	$id_user = (integer)$userData->userid;
	$name = (string)$userData->name;

	$userData = array('correct' => '', 'id_user' => '', 'username' => '', 'email' => '', 'age' => '', 'sex' => '', 'id_organizer' => '', 'organizer_name' => '');

	if(!empty($id_user) && !empty($name)){
		// Check organizer name
		$resultsname = mysql_query("SELECT id_organizer FROM organizer WHERE name='".$name."' LIMIT 1") or die("Login error! Code: 003");
		$matchname  = mysql_num_rows($resultsname);

		// Check fs_user
		$resultsid = mysql_query("SELECT id_organizer FROM organizer WHERE fs_user='".$id_user."' LIMIT 1") or die("Login error! Code: 003");
		$matchid  = mysql_num_rows($resultsid);

		if($matchname > 0){
			echo ('{"userData":'.json_encode($userData).', "error": {"code": "001","message": "Organisatorname existiert bereits"}}');
		}else {
			if($matchid > 0) {
				echo ('{"userData":'.json_encode($userData).', "error": {"code": "003","message": "Organisatorname existiert bereits"}}');
			}else {
				// Create organizer entry
				$query = 'INSERT INTO organizer (fs_user, name) VALUES ("'.$id_user.'", "'.$name.'");';

				$result=mysql_query($query) or die (mysql_error());

				$results = mysql_query("SELECT id_user, username, email, age, sex, id_organizer, organizer_name FROM user_organizer WHERE id_user='".$id_user."' AND fs_user='".$id_user."' LIMIT 1") or die("Login error! Code: 003");
				$match  = mysql_num_rows($results);

				$res = mysql_fetch_assoc($results);

				if($match > 0 ){
					// login success
					$userData['correct'] = 'True';
					$userData['id_user'] = $res['id_user'];
					$userData['username'] = $res['username'];
					$userData['email'] = $res['email'];
					$userData['age'] = $res['age'];
					$userData['sex'] = $res['sex'];
					$userData['id_organizer'] = $res['id_organizer'];
					$userData['organizer_name'] = $res['organizer_name'];
					echo ('{"userData":'.json_encode($userData).', "error": {"code": "000","message": "Erfolgreich"}}');
				}else{
					// login failed
					$userData['correct'] = 'False';
					echo ('{"userData":'.json_encode($userData).', "error": {"code": "002","message": "Nicht Erfolgreich"}}');
				}
			}
		}

	} else {
		// something failed with submitting data, should never get here!
		echo('{"userData":'.json_encode($userData).', "error": {"code":"005", "message": "Login error! Code: 005"}}');
	}
?>
