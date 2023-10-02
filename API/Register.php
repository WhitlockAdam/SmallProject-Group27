<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Retrieve the input data from the user
$inData = getRequestInfo();

// Create a new SQL database connection
$conn = createDBConnection("localhost", "golden", "password", "contactmanager");

// Check if the connection was successful, else return an error
if($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Prepare SQL statement to insert user details into the database
    $stmt = $conn->prepare("INSERT INTO users (email, password, firstname, lastname) VALUES (?, ?, ?, ?)");
    
    if($stmt) {
        // Bind the input parameters to the SQL statement
        $stmt->bind_param("ssss", $inData["email"], $inData["password"], $inData["firstName"], $inData["lastName"]);
        $stmt->execute();
        
        // Check if the insertion was successful
        if($stmt->affected_rows > 0) {
            returnWithInfo("User registered successfully.");
        } else {
            returnWithError("Registration failed. Please check your input.");
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
        die("Connection with database failed: " . $conn->connect_error);
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
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

// Function to return a success message
function returnWithInfo($msg) {
    $retValue = '{"message":"' . $msg . '","error":""}';
    sendResultInfoAsJson($retValue);
}
?>
