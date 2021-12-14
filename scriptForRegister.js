//Adding an event listener for the button
document.getElementById("register-form").addEventListener('submit',validate);
//Declaring a function for validation
function validate(event)
{
    //Preventing the default behavior of the button
    event.preventDefault();
    //Decraing and taking the values of the Log In information
    const username = document.getElementsByName('uname')[0].value;
    const password = document.getElementsByName('psw')[0].value;
    const repeatedPassword = document.getElementsByName('rpsw')[0].value;
    const email = document.getElementsByName('email')[0].value;
    const BirthDay = document.getElementById('Day').value;
    const BirthMonth = document.getElementById('Month').value;
    const BirthYear = document.getElementById('Year').value;
    var gender = undefined;
    if(document.getElementById('m').checked) gender = document.getElementById('m').value;
    if(document.getElementById('f').checked) gender = document.getElementById('f').value;
    if(document.getElementById('o').checked) gender = document.getElementById('o').value;
    var messageForErrors;
    //Checking whether all of the users information is valid
    if(BirthDay!= 'Day' && BirthMonth!= 'Month' && BirthYear!= 'Year' && gender!= undefined)
    {
        //Declaring the requerments for the password and the username
        var validPassword = (password.length>=8 && password.match(/\d+/g) && password.match(/[a-zA-Z]/) && password===repeatedPassword);
        var validUsername = (username.length>=8 && password.match(/^[0-9a-zA-Z]+$/))
        if(validPassword && validUsername)
        {
            //If everything is valid register the user
            console.log("User data verification correct");
            auth.createUserWithEmailAndPassword(email,password).then(func=>
                {
                    func.user.updateProfile({
                        displayName: username
                    }).then(function () {
                        callback(true);
                    }, function (error)
                    {
                        console.log(error);
                    });
                    window.location.href="loginPage.html";
                },(error) => {
                    const errorCode = error.code;
                    let messageForErrors;
                    switch (errorCode) 
                    {
                        case 'auth/email-already-in-use':
                            {
                                messageForErrors = "There is an account with this email already!";
                                break;
                            }
                        case 'auth/invalid-email':
                            {
                                messageForErrors = "Invalid email!";
                                break;
                            }
                        default:
                            {
                                messageForErrors = "There are some problems with the registration!";
                            }
                    }
                    document.getElementById('errors').innerHTML = messageForErrors;
                    console.log(errorMessage);
                    callback(false, errorCode, errorMessage);
                }
            )
            
        } 
        else
        {
            //Checking where is the error with the password input
            if(password.length<8) messageForErrors = "Password is too short, ";
            if(password!==repeatedPassword)
            {
                if(messageForErrors==undefined) messageForErrors="Passwords does not match, ";
                else messageForErrors = messageForErrors + "passwords does not match, ";
            }
            if(!password.match(/\d+/g))
            {
                if(messageForErrors==undefined) messageForErrors="Password doesn't contain a digit, ";
                else messageForErrors = messageForErrors + "password does not contain digit, ";
            }
            if(!password.match(/[a-zA-Z]/))
            {
                if(messageForErrors==undefined) messageForErrors="Password doesn't contain a letter, ";
                else messageForErrors = messageForErrors + "password does not contain a letter, ";
            }
            //Checking where is the error with the username input
            if(username.length<8)
            {
                if(messageForErrors==undefined) messageForErrors="Username is too short, ";
                else messageForErrors = messageForErrors + "username is too short, ";
            }
            messageForErrors = messageForErrors.substring(0,messageForErrors.length-2)+"!";
            //Printing a message that shows where are the errors
            document.getElementById('errors').innerHTML = messageForErrors;
        }
    } 
    else
    {
        //Checking what is the error with the date
        var message = "You did not choosed ";
        if(BirthDay == 'Day' ||BirthMonth == 'Month'||BirthYear == 'Year')
        {
            message = message + "birth date, ";
        } 
        if(gender == undefined) message = message + "gender, ";
        message = message.substring(0,message.length-2)+"!";
        document.getElementById('errors').innerHTML = message;
    }
}