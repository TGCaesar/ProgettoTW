
const Username = document.getElementById("input-email-signup");
const Password = document.getElementById("input-psw-signup");
const Button = document.getElementById("btn");
const RealName = document.getElementById("input-name-signup");
const LastName = document.getElementById("input-lastname-signup")
let ErrorMsgs = {
    NoUserName : document.createTextNode ("Inserire nome utente"),
    NoPassword : document.createTextNode ("Inserire Password"),
    ShortPassword : document.createTextNode ("La password deve avere almeno 8 caratteri"),
    InvalidName : document.createTextNode ("Il nome utente deve avere almeno 3 caratteri"),
    NoName : document.createTextNode ("Inserire nome vero"),
    NoLastname : document.createTextNode ("Inserire il cognome"),
    ExistingAccount : document.createTextNode("Il nome utente inserito è già in uso")
}
const ErrorP = document.getElementById ("ErrorMsg")

function signin () {
    event.preventDefault ()
    let user = {
    username : Username.value,
    password : Password.value,
    name : RealName.value,
    lastname : LastName.value
    };
    if (user.username) {
        if (user.username.length>=3) {
            if (user.name) {
                if (user.lastname) {
                    if (user.password) {
                        if (user.password.length>=8){
                            //chiamata http al backend, data è true se l'account è stato creato, altrimenti è false
                            $.post('http://localhost:6060/signup', user,function(data){if(data){
                                //nel caso il signup è avvenuto con successo
                            } else {
                                if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
                                ErrorP.appendChild(ErrorMsgs.ExistingAccount)
                            }
                        })
                            console.log(user.username+" "+user.password+" "+user.name+" "+user.lastname);
                        } else {
                            if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
                            ErrorP.appendChild(ErrorMsgs.ShortPassword)
                        }

                    } else {
                        if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
                        ErrorP.appendChild(ErrorMsgs.NoPassword)
                    }
                } else {
                    if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
                    ErrorP.appendChild(ErrorMsgs.NoLastname)
                }
            } else {
                if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
                ErrorP.appendChild(ErrorMsgs.NoName)
            }
        } else {

            if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
            ErrorP.appendChild(ErrorMsgs.InvalidName)

        }
    } else {
        if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
        ErrorP.appendChild(ErrorMsgs.NoUserName)
    }
} 
