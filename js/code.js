const urlBase = "http://4331cop.com/SmallProject-Group27/API";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function doRegister() {
  let email = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;

  document.getElementById("loginResult").innerHTML = "";

  let tmp = {
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/Register." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "Registration failed. Please try again.";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "contacts.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
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

  let url = urlBase + "/Login." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "Email/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "contacts.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

function doLogOut() {
  userId = 0;
  firstName = "";
  lastName = "";
  saveCookie();
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  console.log(userId);
  console.log(firstName);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  console.log(firstName);
  console.log(lastName);
  firstName = "";
  lastName = "";
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] === "firstName") {
      console.log("FN");
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
    document.getElementById("welcomeMessage").textContent =
      "Welcome, " + firstName + "!";
    //print out the user id to the console
    console.log(userId);
  }
}

function showAddContactForm() {
  var form = document.getElementById("addContactForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
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
    address: address,
  };

  let xhr = new XMLHttpRequest();
  xhr.open("POST", urlBase + "/Contacts.php?action=addContact", true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
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
  xhr.open(
    "GET",
    `${urlBase}/Contacts.php?action=getContacts&id=${userId}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let contacts = JSON.parse(xhr.responseText);

      let tableBody = document.getElementById("contactTableBody");
      tableBody.innerHTML = ""; // Clear existing data

      for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let row = document.createElement("tr");

        let columns = [
          "firstName",
          "lastName",
          "email",
          "phone",
          "address",
          "actions",
        ]; // Add actions column

        for (let j = 0; j < columns.length; j++) {
          let column = columns[j];
          let cell = document.createElement("td");

          if (column === "actions") {
            // Create edit and delete buttons
            let editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function () {
              editContact(contact.contact_id);
            });

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
              deleteContact(contact.contact_id);
            });

            cell.appendChild(editButton);
            cell.appendChild(deleteButton);
          } else {
            cell.textContent = contact[column];
          }

          row.appendChild(cell);
        }

        tableBody.appendChild(row);
      }
    }
  };
  xhr.send();
}

function editContact(contactId) {
    console.log(contactId);
    let url = `${urlBase}/Contacts.php?action=editContactById`;
    let jsonPayload = JSON.stringify({ contact_id: contactId });

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
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
    xhr.send(jsonPayload);

    document.getElementById("editContactForm").style.display = "block";
    document.getElementById("addContactForm").style.display = "none";

    document.getElementById("editContactId").value = "";
    document.getElementById("editContactId").value = contactId;
    document.getElementById("editContactId").disabled = true;

    document.getElementById("editFirstName").focus();
    document.getElementById("editFirstName").select();
    document.getElementById("editLastName").focus();
    document.getElementById("editLastName").select();
    document.getElementById("editEmail").focus();
    document.getElementById("editEmail").select();
    document.getElementById("editPhoneNumber").focus();
    document.getElementById("editPhoneNumber").select();
    document.getElementById("editAddress").focus();
    document.getElementById("editAddress").select();
}

function deleteContact(contactId) {
  console.log(contactId);
  let url = `${urlBase}/Contacts.php?action=deleteContactById`;
  let jsonPayload = JSON.stringify({ contact_id: contactId });

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
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
  xhr.send(jsonPayload);
}

function searchContacts() {
  let query = document.getElementById("searchContact").value;
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
  xhr.open(
    "GET",
    `${urlBase}/Contacts.php?action=getContacts&id=${userId}`,
    true
  );

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let contacts = JSON.parse(xhr.responseText);

      let tableBody = document.getElementById("contactTableBody");
      tableBody.innerHTML = ""; // Clear existing data

      for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let row = document.createElement("tr");

        let columns = [
          "firstName",
          "lastName",
          "email",
          "phone",
          "address",
          "actions",
        ]; // Add actions column

        for (let j = 0; j < columns.length; j++) {
          let column = columns[j];
          let cell = document.createElement("td");

          if (column === "actions") {
            let editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", function () {
              editContact(contact.id);
            });

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", function () {
              deleteContact(contact.id);
            });

            cell.appendChild(editButton);
            cell.appendChild(deleteButton);
          } else {
            cell.textContent = contact[column];
          }

          row.appendChild(cell);
        }

        if (
          contact.firstName.includes(query) ||
          contact.lastName.includes(query) ||
          contact.email.includes(query)
        ) {
          tableBody.appendChild(row);
        }
      }
    }
  };
  xhr.send();
}
