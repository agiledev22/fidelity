<?php

include 'tools.php';

include 'UserController.php';
// This is the first thing that gets called when this page is loaded
// Creates a new instance of the DailyCheckList class and calls the write_daily_cklist method
$userapi = new UserController;

$userid = $_POST['userid'];

if($userapi->deleteUser($userid))
	echo 'success';
else
	echo "Can not delete the account!";
/* cURL command line test
CORRECT REQUEST INSERT NEWS (AFTER LOGIN)
curl --data "sessionId=sessionId&newsId=6&news=prova6&title=testo6" http://tools.mynoomi.com/wsStudioLegale/editNews.php
*/
?>