<?php

include 'tools.php';

include 'UserController.php';
// This is the first thing that gets called when this page is loaded
// Creates a new instance of the DailyCheckList class and calls the write_daily_cklist method
$userapi = new UserController;

$email = $_POST['email'];
$pwd = $userapi->password_generate(8);

$user = $userapi->getUser($email);
$user_id = $user['id'];
if(! ($user_id > 0))
{
	echo "User is not registered!";
}else{
	$pwd = $userapi->password_generate(8);
	if($userapi->resetPassword($user_id, $pwd))
	{
		if($userapi->sendNewPasswordEmail("You requested new password!", $email, $pwd))
			echo "success";
		else
			echo "Could not send email";
	}
	else
	{
		echo "Something went wrong!";
	}
}

/* cURL command line test
CORRECT REQUEST INSERT NEWS (AFTER LOGIN)
curl --data "sessionId=sessionId&newsId=6&news=prova6&title=testo6" http://tools.mynoomi.com/wsStudioLegale/editNews.php
*/
?>