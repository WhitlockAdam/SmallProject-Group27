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
        $phoneNumber = $data['phone'];
        $address = $data['address'];
        $userId = $data['user_id'];
    
        $stmt = $conn->prepare("INSERT INTO contacts (user_id, firstName, lastName, email, phone, address) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssss", $userId, $firstName, $lastName, $email, $phoneNumber, $address);
    
        if ($stmt->execute()) {
            returnWithSuccess("Contact added successfully!");
        } else {
            returnWithError("Failed to add contact.");
        }
    
        $stmt->close();
        $conn->close();
    }

    // Endpoint for getting all contacts
    // Check if the user is logged in
    session_start();
    if (!isset($_SESSION['user_id'])) {
        returnWithError("User not logged in.");
    }
    
    // Endpoint for getting contacts associated with the logged-in user
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getUserContacts') {
        $user_id = $_SESSION['user_id'];
        $stmt = $conn->prepare("SELECT * FROM contacts WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
    
        $result = $stmt->get_result();
    
        if ($result->num_rows > 0) {
            $contacts = [];
            while ($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
            sendResultInfoAsJson(json_encode($contacts));
        } else {
            returnWithError("No contacts found for this user.");
        }
    
        $stmt->close();
        $conn->close();
    }

}
?>
