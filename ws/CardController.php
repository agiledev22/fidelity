<?php

class CardController{
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
    function getAllCards() {

        $JSON = file_get_contents('php://input');
        $POST_DATA = json_decode($JSON,true);
        // Check for required parameters
        if (isset($POST_DATA["sessionId"])) {
            
            // Put parameters into local variables
            $sessionId = $POST_DATA["sessionId"];
            session_id($sessionId);
            session_start();
            $query = "SELECT cards.id, DATE_FORMAT(IFNULL(transactions.date, cards.created_at), '%d/%m/%Y %H:%i') AS created_at, transactions.delta AS amount, users.id AS user_id, users.email AS email, users.full_name AS full_name, transactions.transaction_type AS transaction_type ".
            	"FROM cards LEFT JOIN transactions ON transactions.card_id=cards.id ".
            	"LEFT JOIN users ON users.id=cards.user_id ".
            	"ORDER BY created_at DESC, id DESC";
            $stmt = $this->db->prepare($query);
            
            $stmt->execute();
            
            if($stmt->error == ""){
            
                $stmt->bind_result($card_id, $created_at, $amount, $user_id, $email, $full_name, $transaction_type);
                $jsonCardsObj = array();
                while ($stmt->fetch()) {
                    $cardsObj = new stdClass();
                    $cardsObj->id = $card_id; 
                    $cardsObj->amount = $amount;
                    $cardsObj->created_at = $created_at;
                    $cardsObj->user_id = $user_id;
                    $cardsObj->email = $email;
                    $cardsObj->full_name = $full_name;
                    $cardsObj->transaction_type = $transaction_type;

                    array_push($jsonCardsObj,$cardsObj);
                }

                $count = $this->getCardCount();
                sendResponse(200, json_encode(array("data"=>$jsonCardsObj, "card_count"=>$count))); //OK
            }else{
                sendResponse(500, 'Query Error'); //Internal Server Error
            }
        }
        $stmt->close();
        return true;
    }

    function getCardCount() {
        $query = "SELECT count(1) AS cnt FROM cards";
        $stmt = $this->db->prepare($query);  
        $stmt->execute();

        $count = 0;

        if($stmt->error == ""){
            $stmt->bind_result($count);
            $stmt->fetch();
        }
        $stmt->close();
        return $count;
    }

    function getVacantCardID()
    {
        $i = 1;
        while ($i < 9999) {
            echo 'checking '.$i;
            if($this->checkIfVacant($i))
                return $i;
            $i++;
        }
    }

    function checkIfVacant($id)
    {
        $query = "SELECT id FROM cards WHERE id=$id";
        echo 'query = '.$query;
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $jsonCardsObj = array();

        $stmt->bind_result($found_id);
        $stmt->fetch();
        echo "found_id = ".$found_id;
        if($found_id > 0)
            return false;
        else
            return true;

    }

    function createCard($user_id) {

        $id = $this->getVacantCardID();

        echo 'vacant id is'.$id;
		$query = "INSERT INTO cards (id, user_id) VALUES ($id, $user_id)";
		$stmt = $this->db->prepare($query);

		// run the insert query
		$stmt->execute();
		if($stmt->error != "")
		  echo 'execute() failed';
        $result = false;
		if($stmt->error == ""){
			$result = true;
		}
		$stmt->close();
		return $result;
    }

}