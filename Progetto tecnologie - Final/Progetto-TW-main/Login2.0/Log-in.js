
const Email = document.getElementById("input-email");
const Password = document.getElementById("input-psw");
const Button = document.getElementById("btn")
const check = document.getElementById("input-check")
let ErrorMsgs = {
    NoName : document.createTextNode ("Inserire nome utente"),
    NoPassword : document.createTextNode ("Inserire Password"),
    ShortPassword : document.createTextNode ("La password deve avere almeno 8 caratteri"),
    InvalidName : document.createTextNode ("Il nome utente deve avere almeno 3 caratteri"),
    NoAccount : document.createTextNode ("Account non esistente"),
    WrongPassword : document.createTextNode("Password errata")
}
const ErrorP = document.getElementById ("ErrorMsg")

function login () {
    event.preventDefault ()
    let user = {
    username : Email.value,
    password : Password.value,
    };
    if (user.username) {
        if ( user.username.length>=3) {
        if (user.password) {
            if (user.password.length>=8){
                //la chiamata al backend, se non esiste account che combacia l'username data è null, se esiste ma la password è sbagliata data è un oggetto contenente la variabile success = false, se username e password combaciano ritorna l'oggetto contenete i dati dell'account + success = true
            $.post('http://localhost:6060/login',user,function(data){
                if(data) {
                    if(data.success) {
                        //caso in cui il login avviene con successo
                        console.log("login")
                        if(check.value)
                        {
                            localStorage.setItem("selfie-user",user.username)
                        } else {
                            sessionStorage.setItem("selfie-user",user.username)
                        }
                    } else {
                        //caso in cui esiste un account con l'username corrispondente ma la password è sbagliata
                        if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
                        ErrorP.appendChild(ErrorMsgs.WrongPassword)
                    }
                } else {
                    //casp in cui non esiste account con l'username corrispondente
                    if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
                    ErrorP.appendChild(ErrorMsgs.NoAccount)
                }
            })
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
                ErrorP.appendChild(ErrorMsgs.InvalidName)
           }
    } else {
        if (ErrorP.hasChildNodes()) {ErrorP.removeChild(ErrorP.firstChild)}
        ErrorP.appendChild(ErrorMsgs.NoName)
    }
} 


// Al momento salva solo l'username su localStorage o sessionStorage sulla chiave "selfie-user", forse da cambiare


/*
// codice di logout
logout () {
    if(sessionStorage.getItem("selfie-user")) {
        sessionStorage.removeItem("selfie-user")
    }
    if (localStorage.getItem("selfie-user")) {
        localStorage.removeItem("selfie-user")
    }
}

*/