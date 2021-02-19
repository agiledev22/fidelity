<?php

class UserController{
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

    function getUser($email, $fullname='') {
        $buffer_qry = '';

        if($fullname != '')
            $buffer_qry = " AND full_name='$fullname'";

    	$query = "SELECT id, pswd, full_name, role, reg_date, last_edit, active FROM users WHERE email='$email'".$buffer_qry;

        $stmt = $this->db->prepare($query);  
        $stmt->execute();

        $user = array();

        if($stmt->error == ""){
        	$stmt->bind_result($id, $pswd, $full_name, $role, $reg_date, $last_edit, $active);
        	$stmt->fetch();

        	$user = array('id' => $id, 'pswd' => $pswd, 'full_name' => $full_name, 'role' => $role, 'reg_date' => $reg_date, 'last_edit' => $last_edit, 'active' => $active);
        }
        $stmt->close();
        return $user;
    }

    function getUsers() {
		$stmt = $this->db->prepare("SELECT * FROM users");
		$stmt->execute();
        $jsonCardsObj = array();

        if($stmt->error == ""){
        
            $stmt->bind_result($id, $pswd, $full_name, $role, $reg_date, $last_edit, $active);
            while ($stmt->fetch()) {
                $userObj = new stdClass();
                $userObj->id = $id; 
                $userObj->pswd = $pswd;
                $userObj->full_name = $full_name;
                $userObj->full_name = $full_name;
                $userObj->role = $role;
                $userObj->reg_date = $reg_date;
                $userObj->last_edit = $last_edit;
                $userObj->active = $active;

                array_push($jsonCardsObj,$userObj);
            }
        }
        return $jsonCardsObj;
    }

    function addUser($role, $email, $pswd, $full_name) {
		$query = "INSERT INTO users(`pswd`,`full_name`, `role`, `email`)
		VALUES ('$pswd', '$full_name', $role, '$email')";
		$stmt = $this->db->prepare($query);

		// run the insert query
		$stmt->execute();
		if($stmt->error == ""){
            $this->sendNewPasswordEmail("You are a new user of mynoomi!", $email, $pswd);
			return true;
		}else{
			return false;
		}
    }

    function updateUser($id, $email, $full_name, $password) {
    	$qry_buffer = "";
    	if($password!="")
    		$qry_buffer = ", `pswd` = '$password'";

		$query = "UPDATE users SET `email` = '$email', `full_name` = '$full_name'" .$qry_buffer. " WHERE `id` = '". (int) $id ."'";
		$stmt = $this->db->prepare($query);
		$stmt->execute();
		if($stmt->error != "")
		  echo 'execute() failed';

		if($stmt->error == ""){
			$result = true;
		}
		$stmt->close();
		return $result;
    }

    function resetPassword($id, $password){
        $query = "UPDATE users SET `pswd` = '$password' WHERE `id` = '". (int) $id ."'";
        $stmt = $this->db->prepare($query);
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

    function sendNewPasswordEmail($subject, $email, $password)
    {
        $to = $email; /* '. ',';  separated by comma for another email (useful if you want to keep records(sending to yourself))*/;

        $bound_text = "----*%$!$%*";
        $bound = "--".$bound_text."\r\n";
        $bound_last = "--".$bound_text."--\r\n";

        $headers = "From: info@burgheria.it\r\n";
        $headers .= "MIME-Version: 1.0\r\n" .
                "Content-Type: multipart/mixed; boundary=\"$bound_text\""."\r\n" ;

        $message = " you may wish to enable your email program to accept HTML \r\n".
                $bound;

        $message .=
        'Content-Type: text/html; charset=UTF-8'."\r\n".
        'Content-Transfer-Encoding: 7bit'."\r\n\r\n".
        '
        <!-- here is where you format the email to what you need, using html you can use whatever style you want (including the use of images)-->
                <BODY BGCOLOR="White">
                <body>

                <div style=" height="40" align="left">

                <font size="10" color="#000000" style="text-decoration:none;font-family:Lato light">
                <div class="info" Style="align:left;">

                <p>Your password is <span style="color:blue">' . $password . '</span></p>
                <p>-----------------------------------------------------------------------------------------------------------------</p>
                </br>
                <p>( This is an automated message, please do not reply to this message, if you have any queries please contact someone@someemail.com )</p>
                </font>
                </div>
                </body>
            '."\n\n".
                                                                        $bound_last;

        $sent = mail($to, $subject, $message, $headers); // finally sending the email
        return $sent;
    }

    function deleteUser($id) {
		$query = "DELETE FROM users WHERE `id` = '". (int) $id ."' AND role=0";
		$stmt = $this->db->prepare($query);
		$stmt->execute();
		if($stmt->error == ""){
			return true;
		}else{
			return false;
		}
    }

    function password_generate($chars) 
    {
      $data = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcefghijklmnopqrstuvwxyz';
      return substr(str_shuffle($data), 0, $chars);
    }

}