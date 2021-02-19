<?php
include 'tools.php';
include 'TransactionController.php';
// This is the first thing that gets called when this page is loaded
class AddTransactions extends TransactionController {

} 

$api = new AddTransactions;
$data = $_POST['data'];

foreach ($data as $key => $value) {
	print_r($value);
	$api->createTransaction($value['card_id'], $value['transaction_type'], $value['amount'], $value['date']);
}

?>