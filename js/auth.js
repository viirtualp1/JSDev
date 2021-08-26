const actionCodeSettings = {
    url: 'http://localhost:5500/index.html', // url для клика по ссылке в письме
    handleCodeInApp: true,
};

// войти / зарегистрироваться в аккаунт по почте
document.getElementById('sendEmailVerified').addEventListener('click', () => {
    let emailInput = document.getElementById('email-input').value;

    if (emailInput != '') {
        firebase.auth().sendSignInLinkToEmail(emailInput, actionCodeSettings).then(() => {
            Swal.fire({
                icon: 'success',
                text: 'Проверьте почту',
            });

            localStorage.setItem('user-email', emailInput);
        }).catch((error) => { console.log(error); });
    } else {
        Swal.fire({
            icon: 'error',
            text: "Введите свой Email!"
        });
    }
});

// войти / зарегистрироваться в аккаунт через Google
document.getElementById('google-btn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        localStorage.setItem('user-email', result.user.email);

        location.href = 'index.html';
    }).catch((error) => { console.log(error); });
});

// войти / зарегистрироваться в аккаунт через Facebook
document.getElementById('facebook-btn').addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log(result);
    }).catch((error) => { console.log(error); });
});

// войти / зарегистрироваться в аккаунт через Github
document.getElementById('github-btn').addEventListener('click', () => {
    const provider = new firebase.auth.GithubAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log(result);
    }).catch((error) => { console.log(error); });
});