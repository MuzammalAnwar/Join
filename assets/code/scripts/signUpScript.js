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
        await fetchTask(`/${userID}`, signUpData, 'PUT');
        return userID;
    } catch (error) {
        console.error(error);
    }
}

async function signUp() {
    let checkbox = document.getElementById('policyCheck')
    let confirmedPassword = document.getElementById('inputConfirmPassword').value;
    let userData = getSignUpData();
    if (checkbox.checked) {
        if (atob(userData.password) === confirmedPassword) {
            await saveUser(userData, userData.userID);
            window.location.href = 'index.html';
        } else {
            alert('Password is not the same');
        }
    }
}