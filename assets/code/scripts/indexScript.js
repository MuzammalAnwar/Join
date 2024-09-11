let emailInput = document.getElementById('inputEmail');
let passwordInput = document.getElementById('inputPassword');
emailInput.value = 'tester_mail@test.com';
passwordInput.value = 'testing';

/**
 * Retrieves login data from input fields and returns an object with this data.
 *
 * @returns {Object} - The login data object containing email and password.
 */
function getLoginData() {
    return {
        email: emailInput.value,
        password: btoa(passwordInput.value)
    };
}

/**
 * Authenticates a user by checking the provided email and password against stored user data.
 *
 * @returns {Promise<Object|null>} - Resolves with the user object if authentication is successful, or null if authentication fails.
 */
async function authenticateUser() {
    let loginData = getLoginData();
    let signUpData = await fetchTask(``, null, 'GET');
    let keys = Object.keys(signUpData);
    for (let i = 0; i < keys.length; i++) {
        let signedUpUser = signUpData[keys[i]];
        if (signedUpUser.email === loginData.email && signedUpUser.password === loginData.password) {
            return signedUpUser;
        }
    }
    return null;
}

/**
 * Handles the login process. Validates user credentials and redirects upon successful authentication.
 *
 * @param {Event} event - The submit event from the login form.
 * @returns {Promise<void>} - Resolves when the login process is complete.
 */
function proceedLogin(event) {
    event.preventDefault();
    authenticateUser().then(user => {
        if (user) {
            localStorage.setItem('loggedInUserID', user.userID);
            window.location.href = 'summeryUser.html';
        } else {
            notifyFailedAuthentication('input_containerEmail', 'input_containerPassword', emailInput, passwordInput, 'Please enter valid email', 'Please enter valid password', 'Email', 'Password'
            );
        }
    });
}