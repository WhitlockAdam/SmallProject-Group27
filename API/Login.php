<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Retrieve the input data from the user
$inData = getRequestInfo();

// Initialize user variables
$id = 0;
$firstName = "";
$lastName = "";

// Create a new SQL database connection
$conn = new createDBConnection("localhost", "k", "WeLoveCOP4331", "contactmanager");


// Check if the connection was successful, else return an error
if($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare SQL statement to select user details from the database
    $stmt = $conn->prepare("SELECT ID, firstName, lastName FROM Users WHERE Login=? AND Password=?");
    
    if($stmt) {
        // Bind the input parameters to the SQL statement
        $stmt->bind_param("ss", $inData["login"], $inData["password"]);
        $stmt->execute();
        
        // Execute the statement and get the result
        $result = $stmt->get_result();
        
        // Check if any records were found, if so return the user details, else return an error
        if($row = $result->fetch_assoc()) {
            returnWithInfo($row['firstName'], $row['lastName'], $row['ID']);
        } else {
            returnWithError("No Records Found");
        }
        
        $stmt->close();
    } else {
        returnWithError("SQL Query Failed");
    }
    
    $conn->close();
}

// Create connection with SQL database
function createDBConnection($db_host, $db_user, $db_password, $db_name) {
    $conn = new mysqli($db_host, $db_user, $db_password, $db_name);

    // Check the connection
    if ($conn->connect_error) {
        die("Connection with database failed: " . $mysqli->connect_error);
    }

    return $conn;
}

// Function to get the request information from the user
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send the result as JSON
function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

// Function to return an error message
function returnWithError($err) {
    $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

// Function to return user details if records are found
function returnWithInfo($firstName, $lastName, $id) {
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson($retValue);
}

?>
