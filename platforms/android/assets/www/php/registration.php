<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST,GET,OPTIONS');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

include('./db_connection.php'); //load config

function saltPassword($password, $salt){
	return hash('sha256', $password . $salt);
}

$postdata = file_get_contents("php://input");
$userData = json_decode($postdata);
$username = (string)$userData->username;
$password = (string)$userData->password;
$email = (string)$userData->email;
$age = (string)$userData->age;
$sex = (string)$userData->sex;
$password = saltPassword($password, $username);

$userData = array('correct' => '', 'id_user' => '', 'username' => '', 'email' => '', 'age' => '', 'sex' => '');

if(!empty($username) && !empty($password) && !empty($email) && !empty($age) && !empty($sex)){
	// Check if User exists
	$resultsusername = mysql_query("SELECT id_user FROM user WHERE username='".$username."' LIMIT 1") or die("Login error! Code: 003");
	$matchusername  = mysql_num_rows($resultsusername);
	// Check if Email-address exists
	$resultsemail = mysql_query("SELECT id_user FROM user WHERE email='".$email."' LIMIT 1") or die("Login error! Code: 003");
	$matchemail  = mysql_num_rows($resultsemail);

	if($matchusername > 0){
		echo ('{"userData":'.json_encode($userData).', "error": {"code": "001","message": "User existiert bereits"}}');
	}else if($matchemail > 0){
		echo ('{"userData":'.json_encode($userData).', "error": {"code": "003","message": "Email existiert bereits"}}');
	} else {
		$query = 'INSERT INTO user (username, password, email, age, sex) VALUES ("'.$username.'", "'.$password.'", "'.$email.'", "'.$age.'", "'.$sex.'");';
		$result = mysql_query($query) or die (mysql_error());

		$username = mysql_escape_string($username);
		
		$results = mysql_query("SELECT id_user, username, email, age, sex FROM user WHERE username='".$username."' AND password='".$password."' LIMIT 1") or die("Login error! Code: 003");
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
			echo ('{"userData":'.json_encode($userData).', "error": {"code": "000","message": "Registration hat funktioniert."}}');
		}else{
			// login failed
			$userData['correct'] = 'False';
			echo ('{"userData":'.json_encode($userData).', "error": {"code": "002","message": "Registration hat nicht funktioniert"}}');
		}
	}


} else {
	// something failed with submitting data, should never get here!
	echo('{"userData":'.json_encode($userData).', "error": {"code":"005", "message": "Login error! Code: 005"}}');
}

?>
