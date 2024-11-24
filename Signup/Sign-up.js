
const Email = document.getElementById("input-email-signup");
const Password = document.getElementById("input-psw-signup");
const Button = document.getElementById("btn")
let ErrorMsgs = {
    NoEmail : document.createTextNode ("Inserire Email"),
    NoPassword : document.createTextNode ("Inserire Password"),
    ShortPassword : document.createTextNode ("La password deve avere almeno 8 caratteri"),
    InvalidEmail : document.createTextNode ("Email non valida")
}
const ErrorP = document.getElementById ("ErrorMsg")

function signin () {
    event.preventDefault ()
    let user = {
    username : Email.value,
    password : Password.value,
    };
    if (user.username) {
        if ( /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.username)) {
        if (user.password) {
            if (user.password.length>=8){
            
            console.log(user.username+" "+user.password);
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
                ErrorP.appendChild(ErrorMsgs.InvalidEmail)
           }
    } else {
        if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
        ErrorP.appendChild(ErrorMsgs.NoEmail)
    }
} 
