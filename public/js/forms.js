function formhash(form, username, password) {

    // Check username length
    if(username.value.length < 4){
        alert("Username too short! Minimum 4 characters");
        return false;
    }

    // Make sure password is long enough
    if(password.value.length < 6){
        alert("Password too short! Minimum 6 characters");
        return false;
    }

    // Create a new element input, this will be our hashed password field. 
    var p = document.createElement("input");
 
    // Add the new element to our form. 
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);
 
    // Make sure the plaintext password doesn't get sent. 
    password.value = "";
 
    // Finally submit the form. 
    form.submit();
}

function regformhash(form, username, password, confirmpass) {

    // Check username length
    if(username.value.length < 4){
        alert("Username too short! Minimum 4 characters");
        return false;
    }

    // Make sure password is long enough
    if(password.value.length < 6){
        alert("Password too short! Minimum 6 characters");
        return false;
    }

    // Make sure passwords match
    if(password.value !== confirmpass.value){
        alert("Passwords do not match! Please try again.");
        return false;
    }

    // Create a new element input, this will be our hashed password field. 
    var p = document.createElement("input");
 
    // Add the new element to our form. 
    form.appendChild(p);
    p.name = "p";
    p.type = "hidden";
    p.value = hex_sha512(password.value);
 
    // Make sure the plaintext password doesn't get sent. 
    password.value = "";
    confirmpass.value = "";

    // Finally submit the form. 
    form.submit();
}