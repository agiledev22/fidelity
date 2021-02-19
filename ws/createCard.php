<?php
include 'tools.php';

include 'CardController.php';
include 'UserController.php';
// This is the first thing that gets called when this page is loaded
$cardapi = new CardController;
$userapi = new UserController;

$email = $_POST['email'];
$username = $_POST['fullname'];
$user = $userapi->getUser($email);


// if($user['id'] > 0)
// {
//     $user_id = $user['id'];
//     if($cardapi->createCard($user_id))
//         echo "success";
// }
// else 
//     echo "User not registered!";


$user_id = $user['id'];
if(! ($user_id > 0))
{
	$pwd = $userapi->password_generate(8);
	$userapi->addUser(0, $email, $pwd, $username);
	$user = $userapi->getUser($email, $username);
	$user_id = $user['id'];

	if($cardapi->createCard($user_id))
	    echo "success";
}else{
	echo "User already exists!";
}


?>