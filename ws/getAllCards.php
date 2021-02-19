<?php
include 'tools.php';

include 'CardController.php';
class GetAllCards extends CardController {

} 

// This is the first thing that gets called when this page is loaded
$api = new GetAllCards;
$api->getAllCards();
/* cURL command line test
CORRECT REQUEST ALL CARDS
curl http://crediti.mynoomi.com/ws/getAllCards.php
CORRECT REQUEST USER NEWS (AFTER LOGIN)
curl --data "session=" http://crediti.mynoomi.com/ws/getAllCards.php
*/
?>