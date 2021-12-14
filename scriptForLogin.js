document.getElementById("login-form").addEventListener('submit',validate);
function validate(event)
{
    event.preventDefault();
    const email = document.getElementsByName('uname')[0].value;
    const password = document.getElementsByName('psw')[0].value;
	auth.signInWithEmailAndPassword(email, password).then(func=>
        {
            func.user.updateProfile({
                displayName: email
            }).then(function () {
                callback(true);
            }, function (error)
            {
                console.log(error);
            });
            window.location.href="postPage.html";
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
                case 'auth/wrong-password':
                {
                    messageForErrors = "Wrong password!";
                    break;
                }
                case 'auth/user-not-found':
                {
                    messageForErrors = "There is no user with this email!";
                        break;
                }
                default:
                    {
                        messageForErrors = "There are some problems with the logging in!";
                    }
            }
            console.log(messageForErrors);
            console.log(errorCode);
            document.getElementById('errors').innerHTML = messageForErrors;
            callback(false, errorCode, messageForErrors);
        }
    );
     
}
function myFunction() {
    var x = document.getElementById("psw");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }