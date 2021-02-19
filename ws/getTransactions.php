<?php
include 'tools.php';

include 'TransactionController.php';
class GetTransactions extends TransactionController {

} 

// This is the first thing that gets called when this page is loaded
$api = new GetTransactions;


if(isset($_POST['card_id'])){
	$card_id = $_POST['card_id'];
	$api->getAllTransactionsByCard($card_id);
}
else if(isset(($_POST['user_id']))){
	$user_id = $_POST['user_id'];
	$api->getAllTransactionsByUser($user_id);
}


/* cURL command line test
CORRECT REQUEST ALL CARDS
curl http://crediti.mynoomi.com/ws/getAllCards.php
CORRECT REQUEST USER NEWS (AFTER LOGIN)
curl --data "session=" http://crediti.mynoomi.com/ws/getAllCards.php
*/
?>