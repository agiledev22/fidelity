<?php

class TransactionController{
	private $db;

    // Constructor - open DB connection
    function __construct() {
        $this->db = new mysqli('localhost', 'vix', 'Gn[Iz,u.^5G-', 'pacchiana');
        $this->db->autocommit(TRUE);
                
    /* check connection */
        if (mysqli_connect_errno()) {
            printf("Connect failed: %s\n", mysqli_connect_error());
        	exit();
        }
    }

    // Destructor - close DB connection
    function __destruct() {
        $this->db->close();
    }

    // Main method to get news
    function getAllTransactionsByCard($card_id) {

        $query = "SELECT id, transaction_type, delta, DATE_FORMAT(date, '%d/%m/%Y %H:%i') FROM transactions";
        if($card_id > 0)
            $query .= " WHERE card_id=$card_id";
        $query .= " ORDER BY date DESC";
        $stmt = $this->db->prepare($query);
        
        $stmt->execute();
        
        if($stmt->error == ""){
        
            $stmt->bind_result($id, $transaction_type, $delta, $date);
            $jsonCardsObj = array();
            while ($stmt->fetch()) {
                $cardsObj = new stdClass();
                $cardsObj->id = $id;
                $cardsObj->transaction_type = $transaction_type; 
                $cardsObj->delta = $delta;
                $cardsObj->date = $date;

                array_push($jsonCardsObj,$cardsObj);
            }
            sendResponse(200, json_encode($jsonCardsObj)); //OK
        }else{
            sendResponse(500, 'Query Error'); //Internal Server Error
        }

        $stmt->close();
        return true;
    }

    function getAllTransactionsByUser($user_id) {

        $query = "SELECT t.transaction_type, t.delta, DATE_FORMAT(t.date, '%d/%m/%Y %H:%i'), t.card_id FROM transactions AS t".
            " LEFT JOIN cards AS c ON c.id=t.card_id".
            " WHERE c.user_id=$user_id ORDER BY t.date DESC";

        $stmt = $this->db->prepare($query);
        
        $stmt->execute();
        
        if($stmt->error == ""){
        
            $stmt->bind_result($transaction_type, $delta, $date, $card_id);
            $jsonCardsObj = array();
            while ($stmt->fetch()) {
                $cardsObj = new stdClass();
                $cardsObj->transaction_type = $transaction_type; 
                $cardsObj->delta = $delta;
                $cardsObj->date = $date;
                $cardsObj->card_id = $card_id;

                array_push($jsonCardsObj,$cardsObj);
            }
            sendResponse(200, json_encode($jsonCardsObj)); //OK
        }else{
            sendResponse(500, 'Query Error'); //Internal Server Error
        }

        $stmt->close();
        return true;
    }

    function createTransaction($card_id, $transaction_type, $delta, $date) {
		$query = "INSERT INTO transactions (card_id, transaction_type, delta, date) VALUES ($card_id, $transaction_type, $delta, STR_TO_DATE('$date', '%d/%m/%Y %H:%i:%s'))";
		$stmt = $this->db->prepare($query);

		// run the insert query
		$stmt->execute();
		if($stmt->error != "")
		  echo 'execute() failed';

		if($stmt->error == ""){
			$result = true;
		}
		$stmt->close();
		return $result;
    }

    function deleteTransaction($id)
    {
        $query = "DELETE FROM transactions WHERE `id`=$id";
        $stmt = $this->db->prepare($query);

        $result = false;

        $stmt->execute();
        if($stmt->error != "")
            echo "exectue() failed";
        else
        {
            $result = true;
        }

        $stmt->close();
        return $result;
    }

}