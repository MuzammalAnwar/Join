function getSignUpData() {
    let signUpData = {
        "userID": generateUniqueKey(),
        "name": document.getElementById('inputName').value,
        "email": document.getElementById('inputEmail').value,
        "password": btoa(document.getElementById('inputPassword').value),
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