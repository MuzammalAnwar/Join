let nameInput = document.getElementById('inputName')
let emailInput = document.getElementById('inputEmail')
let passwordInput = document.getElementById('inputPassword')
let confirmedPasswordInput = document.getElementById('inputConfirmPassword');
let checkbox = document.getElementById('policyCheck')

/**
 * Retrieves user sign-up data from input fields and returns an object with this data.
 *
 * @returns {Object} - The sign-up data object containing userID, name, email, password, phone, contacts, and addedTasks.
 */
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
    };
}

/**
 * Saves user data to the server.
 *
 * @param {Object} signUpData - The user data to be saved.
 * @param {string} userID - The unique user ID.
 * @returns {Promise<string>} - Resolves with the userID if the save operation is successful.
 * @throws {Error} - If the save operation fails.
 */
async function saveUser(signUpData, userID) {
    try {
        await fetchTask(`/${userID}`, signUpData, 'PUT');
        return userID;
    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
}

/**
 * Handles the sign-up process. Validates user input and saves user data if valid.
 *
 * @param {Event} event - The submit event from the form.
 * @returns {Promise<void>} - Resolves when the sign-up process is complete.
 */
async function signUp(event) {
    event.preventDefault(); // Prevents the default form submission.
    let userData = getSignUpData(); // Retrieves user data.
    if (checkbox.checked) { // Checks if the terms and conditions checkbox is selected.
        if (atob(userData.password) === confirmedPasswordInput.value) { // Validates password match.
            await saveUser(userData, userData.userID); // Saves user data.
            window.location.href = 'index.html'; // Redirects to the home page.
        } else {
            notifyFailedAuthentication('input_containerPassword', 'input_containerConfirmedPassword', passwordInput, confirmedPasswordInput, 'Password is not the same', 'Password is not the same', 'Password', 'Confirm Password');
        }
    }
}
