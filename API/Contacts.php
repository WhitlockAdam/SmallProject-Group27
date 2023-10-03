<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

// Function to create a new SQL database connection
function createDBConnection($db_host, $db_user, $db_password, $db_name) {
    $conn = new mysqli($db_host, $db_user, $db_password, $db_name);

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
function returnWithSuccess($msg) {
    $retValue = '{"success":"' . $msg . '"}';
    sendResultInfoAsJson($retValue);
}

$conn = createDBConnection("localhost", "golden", "password", "contactmanager");

// Check if the connection was successful, else return an error
if($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Endpoint for adding a new contact
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'addContact') {
        $data = getRequestInfo();
        $firstName = $data['firstName'];
        $lastName = $data['lastName'];
        $email = $data['email'];
        $phone = $data['phone'];
        $address = $data['address'];
        $userId = $data['id'];
    
        $stmt = $conn->prepare("INSERT INTO contacts (id, firstName, lastName, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssss", $userId, $firstName, $lastName, $email, $phone, $address);
    
        if ($stmt->execute()) {
            returnWithSuccess("Contact added successfully!");
        } else {
            returnWithError("Failed to add contact.");
        }
    
        $stmt->close();
        $conn->close();
    }

    // Endpoint for getting all contacts where user id is passed in
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getContacts') {
        $userId = $_GET['id'];
        $stmt = $conn->prepare("SELECT * FROM contacts WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $contacts = array();
        while ($row = $result->fetch_assoc()) {
            $contacts[] = $row;
        }
        $retValue = '{"contacts":' . json_encode($contacts) . '}';
        sendResultInfoAsJson($retValue);
        $stmt->close();
        $conn->close();
    }
}
?>
