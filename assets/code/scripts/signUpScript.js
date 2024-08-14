

function getSignUpData() {
    let name = document.getElementById('inputName').value;
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('inputPassword').value;
    let userID = generateUniqueKey();

    let signUpData = {
        "userID": userID,
        "name": name,
        "email": email,
        "password": btoa(password),
        "phone": null,
        "contacts": "N/A",
        "addedTasks": {
            "toDo": {},
            "inProgress": {},
            "awaitFeedback": {},
            "done": {}
        }
    }
    return signUpData
}

async function saveUser(signUpData, userID) {
    try {
        let response = await fetchTask(`/${userID}`, signUpData, 'PUT');
        console.log("User signed up: ", response);
        return userID;
    } catch (error) {
        console.error(error);
    }
}

function signUp() {
    let checkbox = document.getElementById('policyCheck')
    let confirmedPassword = document.getElementById('inputConfirmPassword').value;
    let userData = getSignUpData();
    if (checkbox.checked) {
        atob(userData.password) === confirmedPassword ? saveUser(userData, userData.userID) : alert('password is not same');
    } else {
        alert('accept privacy policy');
    }
}