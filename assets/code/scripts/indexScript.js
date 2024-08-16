function getLoginData() {
    let loginData = {
        "email": document.getElementById('inputEmail').value,
        "password": btoa(document.getElementById('inputPassword').value)
    }
    return loginData
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

function proceedLogin() {
    authenticateUser().then(user => {
        if (user) {
            window.location.href = 'summeryUser.html';
            // renderTasks('toDo', 'categoryToDo', `/${user.userID}`);
        } else {
            alert('Incorrect password or email')
        }
    });
}