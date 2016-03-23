<?php

include('./db_connection.php'); //load config

$postdata = file_get_contents("php://input");
$loginData = json_decode($postdata);
$username = $loginData->username;
$password = $loginData->password;

$userData = array('correct' => '',
                'userid' => '',
				'firstname' => '',
				'lastname' => '',
				'username' => '',
				'active' => '');

$query = "SELECT userid, firstname, lastname, username, passwd FROM user WHERE username='".$username."' AND passwd='".$password."' LIMIT 1;";

$results = mysql_query($query) or die("Login error! Code: 003");
$match  = mysql_num_rows($results);


if(!empty($username) && !empty($password)){

	//echo($username.'  '.$password);

	$username = mysql_escape_string($username);
	$password = mysql_escape_string($password);

	$results = mysql_query("SELECT userid, firstname, lastname, username, active FROM user WHERE username='".$username."' AND passwd='".$password."' LIMIT 1") or die("Login error! Code: 003");
	$match  = mysql_num_rows($results);

	$res = mysql_fetch_assoc($results);

    echo $res[''];

	if($match > 0 ){
			// login success
            $userData['correct'] = 'True';
			$userData['userid'] = $res['userid'];
			$userData['firstname'] = $res['firstname'];
			$userData['lastname'] = $res['lastname'];
			$userData['username'] = $res['username'];
			$userData['active'] = $res['active'];
			echo ('{"userData":'.json_encode($userData).', "error": {"code": "000","message": "The email or password you entered is correct."}}');
	}else{
		// login failed
        $userData['correct'] = 'False';
		echo ('{"userData":'.json_encode($userData).', "error": {"code": "002","message": "The email or password you entered is incorrect."}}');
	}
} else {
	// something failed with submitting data, should never get here!
	echo('{"userData":'.json_encode($userData).', "error": {"code":"005", "message": "Login error! Code: 005"}}');
}
?>
