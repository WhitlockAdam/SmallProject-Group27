<!DOCTYPE html>
<html>
<head>
  <title>Contact Manager</title>
  <script type="text/javascript" src="js/md5.js"></script>
  <script type="text/javascript" src="js/code.js"></script>
  <link href="css/styles.css" rel="stylesheet" />
  <link
          href="https://fonts.googleapis.com/css?family=Ubuntu"
          rel="stylesheet"
  />
</head>
<body>
<h1 id="title">Contact Manager</h1>

<div id="loginDiv">
  <span id="inner-title">Sign Up</span><br />
  <label for="firstName">First Name</label>
  <input type="text" id="firstName" /><br />
  <label for="lastName">Last Name</label>
  <input type="text" id="lastName" /><br />
  <label for="loginName">Email</label>
  <input type="text" id="loginName" /><br />
  <label for="loginPassword">Password</label>
  <input type="password" id="loginPassword" /><br />
  <button type="button" id="loginButton" class="buttons">Sign Up</button>
  <span id="loginResult"></span>
  <br />
  <span id="loginLinkText">Already have an account? </span><a href="./index.html" id="loginLink">Click here</a>
</div>
</body>
</html>
