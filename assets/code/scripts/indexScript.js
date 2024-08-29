let emailInput = document.getElementById('inputEmail');
let passwordInput = document.getElementById('inputPassword');

function getLoginData() {
    return {
        email: emailInput.value,
        password: btoa(passwordInput.value)
    };
}

async function authenticateUser() {
    let loginData = getLoginData();
    let signUpData = await fetchTask(``, null, 'GET');
    let keys = Object.keys(signUpData);
    for (let i = 0; i < keys.length; i++) {
        let signedUpUser = signUpData[keys[i]];
        if (signedUpUser.email == loginData.email && signedUpUser.password == loginData.password) {
            return signedUpUser;
        }
    }
    return null;
}

function proceedLogin(event) {
    event.preventDefault();
    authenticateUser().then(user => {
        if (user) {
            localStorage.setItem('loggedInUserID', user.userID);
            window.location.href = 'summeryUser.html';
        } else {
            notifyFailedAuthentication('input_containerEmail', 'input_containerPassword', emailInput, passwordInput, 'Please enter valid email', 'Please enter valid password', 'Email', 'Password')
        }
    });
}