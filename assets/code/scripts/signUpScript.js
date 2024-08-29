let nameInput = document.getElementById('inputName')
let emailInput = document.getElementById('inputEmail')
let passwordInput = document.getElementById('inputPassword')
let confirmedPasswordInput = document.getElementById('inputConfirmPassword');
let checkbox = document.getElementById('policyCheck')

function getSignUpData() {
    return {
        "userID": generateUniqueKey(),
        "name": nameInput.value,
        "email": emailInput.value,
        "password": btoa(passwordInput.value),
        "phone": null,
        "contacts": "N/A",
        "addedTasks": {
            "toDo": {},
            "inProgress": {},
            "awaitFeedback": {},
            "done": {}
        }
    }
}

async function saveUser(signUpData, userID) {
    try {
        await fetchTask(`/${userID}`, signUpData, 'PUT');
        return userID;
    } catch (error) {
        console.error(error);
    }
}

async function signUp(event) {
    event.preventDefault()
    let userData = getSignUpData();
    if (checkbox.checked) {
        if (atob(userData.password) === confirmedPasswordInput.value) {
            await saveUser(userData, userData.userID);
            window.location.href = 'index.html';
        } else {
            notifyFailedAuthentication('input_containerPassword', 'input_containerConfirmedPassword', passwordInput, confirmedPasswordInput, 'Password is not the same', 'Password is not the same', 'Password', 'Confirm Password')
        }
    }
}