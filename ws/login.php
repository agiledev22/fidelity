<?php

include 'tools.php';
    
class Login {

    private $db;
    private $filename = "login.php";
    
    // Constructor - open DB connection
    function __construct() {
        $this->db = new mysqli('localhost', 'vix', 'Gn[Iz,u.^5G-', 'pacchiana');
        $this->db->autocommit(FALSE);
                
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
    
    // Main method to login
    function login() {
        
        $JSON = file_get_contents('php://input');
        $POST_DATA = json_decode($JSON,true);
        // Check for required parameters
        if (//isset($POST_DATA["user"]) && 
            (!empty($POST_DATA["user"])) &&
            //(!empty($POST["user"])) &&
            //isset($POST_DATA["password"]) &&
            (!empty($POST_DATA["password"])) ) {
            //(!empty($POST["password"])) ) {
            
            // Put parameters into local variables
            $user = $POST_DATA["user"];
            //$user = $POST["user"];
            $password = $POST_DATA["password"];
            //$password = $POST["password"];
            
            $stmt = $this->db->prepare("SELECT id, pswd, full_name, role, email FROM users WHERE email=?");  
            $stmt->bind_param("s", $user);
            $stmt->execute();

            if($stmt->error == ""){
                $stmt->bind_result($id, $pswd, $name, $role, $email);
                $stmt->fetch();
                //sendResponse(200, json_encode($pswd));
                if($password == $pswd) {
                    session_start();
                    $_SESSION["userId"] = $id;
                    //$_SESSION["role"] = $role;
                    //$_SESSION["name"] = $fullName;
                    sendResponse(200, json_encode(array("sessionId"=>session_id(),
                                                        "userid"=>$id,
                                                        "name"=>$name,
                                                        'email'=>$email,
                                                        "role"=>$role)));
                }else{
                    sendResponse(403, 'Login Failed');
                }
            }else{
                sendResponse(401, 'Contact admin: '.$stmt->error);
            }
            $stmt->close();
            return true;
        }
        sendResponse(400, 'User or Password missing');
        return false;
    }
} 

// This is the first thing that gets called when this page is loaded
// Creates a new instance of the Login class and calls the login() method
$api = new Login;
$api->login();
/* cURL command line test
CORRECT LOGIN
curl --data "user=sgorup@suppigorup.com&password=call911" http://crediti.mynoomi.com/ws/login.php 
WRONG LOGIN
curl --data "user=nik2208&password=nik2209" http://crediti.mynoomi.com/ws/login.php 
*/
?>
