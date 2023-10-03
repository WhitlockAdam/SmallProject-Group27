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
            if (this.readyState === 4 && this.status === 200) {
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
            if (this.readyState === 4 && this.status === 200) {
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
	if (tokens[0] === "firstName") {
	    firstName = tokens[1];
	} else if (tokens[0] === "lastName") {
	    lastName = tokens[1];
	} else if (tokens[0] === "userId") {
	    userId = parseInt(tokens[1].trim());
	}
    }

    if (userId < 0) {
	window.location.href = "index.html";
    } else {
	document.getElementById("welcomeMessage").textContent = "Welcome, " + firstName + "!";
    //print out the user id to the console
    console.log(userId);
    }
}

function showAddContactForm() {
    var form = document.getElementById("addContactForm");
    form.style.display = (form.style.display === "none") ? "block" : "none";
}

function addContact() {
    let firstName = document.getElementById("newFirstName").value;
    let lastName = document.getElementById("newLastName").value;
    let email = document.getElementById("newEmail").value;
    let phone = document.getElementById("newPhoneNumber").value;
    let address = document.getElementById("newAddress").value;

    // Read the userId from the cookie
    let userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
        if (tokens[0] === "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    let jsonPayload = {
        id: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address: address
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", urlBase + '/Contacts.php?action=addContact', true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(xhr.responseText);
            if (response.success) {
                alert(response.success);
                displayContacts();
            } else {
                alert(response.error);
            }
        }
    };

    xhr.send(JSON.stringify(jsonPayload));

    // Clear the form and close it
    document.getElementById("addContactForm").style.display = "none";
    document.getElementById("newFirstName").value = "";
    document.getElementById("newLastName").value = "";
    document.getElementById("newEmail").value = "";
    document.getElementById("newPhoneNumber").value = "";
    document.getElementById("newAddress").value = "";
}

function displayContacts() {
    let userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
        if (tokens[0] === "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `${urlBase}/Contacts.php?action=getContacts&id=${userId}`, true);

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let contacts = JSON.parse(xhr.responseText);

            let tableBody = document.getElementById("contactTableBody");
            tableBody.innerHTML = ""; // Clear existing data

            for (let i = 0; i < contacts.length; i++) {
                let contact = contacts[i];
                let row = document.createElement("tr");

                let columns = ["firstName", "lastName", "email", "phone", "address"];

                for (let j = 0; j < columns.length; j++) {
                    let column = columns[j];
                    let cell = document.createElement("td");
                    cell.textContent = contact[column];
                    row.appendChild(cell);
                }

                tableBody.appendChild(row);
            }
        }
    };
    xhr.send();
}