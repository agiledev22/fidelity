<?php

include 'tools.php';
    
class Logout {

    private $filename = "logout.php";
    
    // Constructor - open DB connection
    function __construct() {
    }

    // Destructor - close DB connection
    function __destruct() {
        
    }
    
    // Main method to logout
    function logout() {
        $JSON = file_get_contents('php://input');
        $POST_DATA = json_decode($JSON,true);
        
        // Check for required parameters
        if (isset($POST_DATA["sessionId"]) ) {
            
            // Put parameters into local variables
            $sessionId = $POST_DATA["sessionId"];
            session_id($sessionId);
            session_start();
            $_SESSION = array();
            session_destroy();
            sendResponse(200, 'Logged out');
            return true;
        }
        sendResponse(400, 'Bad Request');
        return false;
    }
} 

// This is the first thing that gets called when this page is loaded
// Creates a new instance of the DailyCheckList class and calls the write_daily_cklist method
$api = new Logout;
$api->logout();
/* cURL command line test
LOGOUT
curl --data "user=nik2208" http://mynoomi.com:89/wsStudioLegale/logout.php 
*/
?>