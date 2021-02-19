<?php
include 'tools.php';
include 'TransactionController.php';
// This is the first thing that gets called when this page is loaded
class DeleteTransactions extends TransactionController {

} 

$api = new DeleteTransactions;
$id = $_POST['transaction_id'];

if($api->deleteTransaction($id))
	echo "success";
else
	echo "Can not delete this transaction!";

?>