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
        $phoneNumber = $data['phoneNumber'];
        $address = $data['address'];

        $stmt = $conn->prepare("INSERT INTO contacts (firstName, lastName, email, phoneNumber, address) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $firstName, $lastName, $email, $phoneNumber, $address);

        if ($stmt->execute()) {
            returnWithSuccess("Contact added successfully!");
        } else {
            returnWithError("Failed to add contact.");
        }

        $stmt->close();
        $conn->close();
    }

    // Endpoint for searching contacts
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'searchContacts') {
        $searchQuery = $_GET['query'];

        $stmt = $conn->prepare("SELECT * FROM contacts WHERE firstName LIKE ? OR lastName LIKE ?");
        $searchQuery = "%$searchQuery%";
        $stmt->bind_param("ss", $searchQuery, $searchQuery);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $contacts = [];
            while ($row = $result->fetch_assoc()) {
                $contacts[] = $row;
            }
            sendResultInfoAsJson(json_encode($contacts));
        } else {
            returnWithError("No contacts found.");
        }

        $stmt->close();
        $conn->close();
    }

    // Endpoint for deleting a contact
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'deleteContact') {
        $contactId = $_POST['id'];

        $stmt = $conn->prepare("DELETE FROM contacts WHERE id = ?");
        $stmt->bind_param("i", $contactId);

        if ($stmt->execute()) {
            returnWithSuccess("Contact deleted successfully!");
        } else {
            returnWithError("Failed to delete contact.");
        }

        $stmt->close();
        $conn->close();
    }

    // Endpoint for editing a contact
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'editContact') {
        $contactId = $_POST['id'];
        $firstName = $_POST['firstName'];
        $lastName = $_POST['lastName'];
        $email = $_POST['email'];
        $phoneNumber = $_POST['phoneNumber'];
        $address = $_POST['address'];

        $stmt = $conn->prepare("UPDATE contacts SET firstName=?, lastName=?, email=?, phoneNumber=?, address=? WHERE id=?");
        $stmt->bind_param("sssssi", $firstName, $lastName, $email, $phoneNumber, $address, $contactId);

        if ($stmt->execute()) {
            returnWithSuccess("Contact updated successfully!");
        } else {
            returnWithError("Failed to update contact.");
        }

        $stmt->close();
        $conn->close();
    }
}
?>
