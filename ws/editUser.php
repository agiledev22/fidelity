<?php

include 'tools.php';

include 'UserController.php';
// This is the first thing that gets called when this page is loaded
// Creates a new instance of the DailyCheckList class and calls the write_daily_cklist method
$userapi = new UserController;

$userid = $_POST['userid'];
$email = $_POST['email'];
$password = $_POST['password'];
$username = $_POST['username'];

if($userapi->updateUser($userid, $email, $username, $password))
	echo 'success';
/* cURL command line test
CORRECT REQUEST INSERT NEWS (AFTER LOGIN)
curl --data "sessionId=sessionId&newsId=6&news=prova6&title=testo6" http://tools.mynoomi.com/wsStudioLegale/editNews.php
*/
?>