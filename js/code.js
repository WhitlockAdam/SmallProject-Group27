const urlBase = 'http://4331cop.com/SmallProject-Group27/API';
const extension = 'php';

let user_id = 0;
let firstName = "";
let lastName = "";

function doRegister() {
    let email = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {email: email, password: password, firstName: firstName, lastName: lastName};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                user_id = jsonObject.user_id;

                if (user_id < 1) {
                    document.getElementById("loginResult").innerHTML = "Registration failed. Please try again.";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch(err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function doLogin() {
    user_id = 0;
    firstName = "";
    lastName = "";
    
    let email = document.getElementById("loginName").value; 
    let password = document.getElementById("loginPassword").value; 
    // var hash = md5( password );

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { email: email, password: password };
    // var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                user_id = jsonObject.user_id;

                if (user_id < 1) {        
                    document.getElementById("loginResult").innerHTML = "Email/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch(err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",user_id=" + user_id + ";expires=" + date.toGMTString();
}

function readCookie() {
    user_id = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
	let thisOne = splits[i].trim();
	let tokens = thisOne.split("=");
	if (tokens[0] == "firstName") {
	    firstName = tokens[1];
	} else if (tokens[0] == "lastName") {
	    lastName = tokens[1];
	} else if (tokens[0] == "user_id") {
	    user_id = parseInt(tokens[1].trim());
	}
    }

    if (user_id < 0) {
	window.location.href = "index.html";
    } else {
	document.getElementById("welcomeMessage").textContent = "Welcome, " + firstName + "!";
    }
}


function doLogout()
{
	user_id = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 2025 00:00:00 GMT";
	window.location.href = "index.html";
}

function showAddContactForm() {
    var form = document.getElementById("addContactForm");
    form.style.display = (form.style.display === "none") ? "block" : "none";
}

function addContact() {
    let firstName = document.getElementById("newFirstName").value;
    let lastName = document.getElementById("newLastName").value;
    let email = document.getElementById("newEmail").value;
    let phoneNumber = document.getElementById("newPhoneNumber").value;
    let address = document.getElementById("newAddress").value;

    let jsonPayload = {
        user_id: user_id, // Include user_id in the payload
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        address: address
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/Contacts.php?action=addContact', true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.success) {
                refreshContactList(); // Add this line to refresh the contact list
            } else {
                alert(response.error);
            }
        }
    };

    xhr.send(JSON.stringify(jsonPayload));
}

function refreshContactList() {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", urlBase + '/Contacts.php?action=getAllContacts', true);

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let contacts = JSON.parse(xhr.responseText);
            displayContacts(contacts);
        }
    };

    xhr.send();
}

function displayContacts(contacts) {
    let tableBody = document.getElementById("contactTableBody");
    tableBody.innerHTML = "";

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let row = document.createElement("tr");

        let firstNameCell = document.createElement("td");
        firstNameCell.innerText = contact.firstName;
        row.appendChild(firstNameCell);

        let lastNameCell = document.createElement("td");
        lastNameCell.innerText = contact.lastName;
        row.appendChild(lastNameCell);

        let emailCell = document.createElement("td");
        emailCell.innerText = contact.email;
        row.appendChild(emailCell);

        let phoneNumberCell = document.createElement("td");
        phoneNumberCell.innerText = contact.phoneNumber;
        row.appendChild(phoneNumberCell);

        let addressCell = document.createElement("td");
        addressCell.innerText = contact.address;
        row.appendChild(addressCell);

        let actionsCell = document.createElement("td");
        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.onclick = function() {
            // Add code to handle edit button click here
        };
        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = function() {
            // Add code to handle delete button click here
        };
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    }
}

function searchContacts() {
    let searchQuery = document.getElementById("searchQuery").value;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", urlBase + '/Contacts.php?action=searchContacts&query=' + encodeURIComponent(searchQuery), true);

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let contacts = JSON.parse(xhr.responseText);
            // Code to handle the search results
        }
    };

    xhr.send();
}

function deleteContact(contactId) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/Contacts.php?action=deleteContact', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert(response.success);
                // Code to handle successful deletion of contact
            } else {
                alert(response.error);
            }
        }
    };

    xhr.send("id=" + contactId);
}

function editContact(contactId) {
    let updatedFirstName = document.getElementById("editFirstName").value;
    let updatedLastName = document.getElementById("editLastName").value;
    let updatedEmail = document.getElementById("editEmail").value;
    let updatedPhoneNumber = document.getElementById("editPhoneNumber").value;
    let updatedAddress = document.getElementById("editAddress").value;

    let jsonPayload = {
        id: contactId,
        firstName: updatedFirstName,
        lastName: updatedLastName,
        email: updatedEmail,
        phoneNumber: updatedPhoneNumber,
        address: updatedAddress
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/Contacts.php?action=editContact', true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert(response.success);
                // Code to handle successful editing of contact
            } else {
                alert(response.error);
            }
        }
    };

    xhr.send(JSON.stringify(jsonPayload));
}

