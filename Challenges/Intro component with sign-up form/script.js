function validateForm() {
  var firstName = document.forms["myForm"]["firstName"].value;
  var lastName = document.forms["myForm"]["lastName"].value;
  var email = document.forms["myForm"]["email"].value;
  var password = document.forms["myForm"]["password"].value;

  if (firstName == "" || lastName == "" || email == "" || password == "") {
    alert("All fields must be filled out");
    return false;
  }

  var emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  if (!emailRegex.test(email)) {
    alert("Invalid email address");
    return false;
  }

  return true;
}
