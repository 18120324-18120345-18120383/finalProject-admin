const username = document.getElementsByName("username")[0]
const email = document.getElementsByName("email")[0]
const password = document.getElementsByName("password")[0]
const retypePassword = document.getElementsByName("retypePassword")[0]
const errPassword = document.getElementById("errPassword")
const errUsername = document.getElementById("errUsername")
const errUsernameExist = document.getElementById("errUsernameExist")
const errEmailExist = document.getElementById("errEmailExist")

const validForm = () => {
    if (password.value != retypePassword.value){
        return false;
    }
    if (!checkValidUsername(username.value)){
        return false;
    }
    return true;
}
password.onchange = () => {
    if (password.value != retypePassword.value){
        errPassword.hidden = false;
    } else {
        errPassword.hidden = true;
    }
}
retypePassword.onchange = () => {
    if (password.value != retypePassword.value){
        errPassword.hidden = false;
    } else {
        errPassword.hidden = true;
    }
}
username.onchange = () => {
    if (!checkValidUsername(username.value)){
        errUsername.hidden = false;
    } else {
        errUsername.hidden = true;
    }
    $.getJSON('/api/check-exist-username', {username: username.value}, (data) => {
        console.log("haha ", data)
        if (data == true){
            errUsernameExist.hidden = false;
        } else {
            errUsernameExist.hidden = true;
        }
    });
}
email.onchange = () => {
    $.getJSON('/api/check-exist-email', {email: email.value}, (data) => {
        console.log('hihi ', data)
        if (data == true){
            errEmailExist.hidden = false;
        } else {
            errEmailExist.hidden = true;
        }
    });
}
const checkValidUsername = (usernameVal) => {

    //Check each character of usenameVal if they are valid or not
    let size = usernameVal.length;
    
    for (let i = 0; i < size; i++){
        if (checkValidChar(usernameVal.charCodeAt(i)) == false){
            return false;
        }
    }

    return true;
}
const checkValidChar = (charCode) => {

    //Username just contain alphabet a - z, capital alphabet A - Z and number 0 - 9

    if (charCode >= 48 && charCode <= 57) //48: '0' - 57: '9'
    {
        return true;
    }
    if (charCode >= 65 && charCode <= 90) //65: 'A' - 90: 'Z'
    {
        return true;
    }
    if (charCode >= 97 && charCode <= 122) //97: 'a' - 122: 'z'
    {
        return true;
    }
    
    return false;
}