const urlBase = 'http://4331cop.com/SmallProject-Group27/API';
const extension = 'php';

let userId = 0;
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
                userId = jsonObject.id;

                if (userId < 1) {
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
    userId = 0;
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
                userId = jsonObject.id;

                if (userId < 1) {        
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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
	let thisOne = splits[i].trim();
	let tokens = thisOne.split("=");
	if (tokens[0] == "firstName") {
	    firstName = tokens[1];
	} else if (tokens[0] == "lastName") {
	    lastName = tokens[1];
	} else if (tokens[0] == "userId") {
	    userId = parseInt(tokens[1].trim());
	}
    }

    if (userId < 0) {
	window.location.href = "index.html";
    } else {
	document.getElementById("welcomeMessage").textContent = "Welcome, " + firstName + "!";
    }
}


function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 2025 00:00:00 GMT";
	window.location.href = "index.html";
}

// Need to implement this
function addContact() {
    
}

function searchContacts() {
    let searchQuery = document.getElementById("searchQuery").value;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", urlBase + '/contacts.php?action=searchContacts&query=' + encodeURIComponent(searchQuery), true);

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
    xhr.open("POST", urlBase + '/contacts.php?action=deleteContact', true);
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
    xhr.open("POST", urlBase + '/contacts.php?action=editContact', true);
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

