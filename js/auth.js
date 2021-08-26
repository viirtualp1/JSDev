const actionCodeSettings = {
    url: 'http://localhost:5500/index.html',
    handleCodeInApp: true,
};

document.getElementById('sendEmailVerified').addEventListener('click', () => {
    let emailInput = document.getElementById('email-input').value;

    if (emailInput != '') {
        firebase.auth().sendSignInLinkToEmail(emailInput, actionCodeSettings).then(() => {
          Swal.fire({
              icon: 'success',
              text: 'Проверьте почту',
          });
        }).catch((error) => { console.log(error); });
    } else {
        Swal.fire({
            icon: 'error',
            text: "Введите свой Email!"
        });
    }
});

document.getElementById('google-btn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log(result.user.email);
    }).catch((error) => { console.log(error); });
});

document.getElementById('facebook-btn').addEventListener('click', () => {
    const provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log(result);
    }).catch((error) => { console.log(error); });
});

document.getElementById('github-btn').addEventListener('click', () => {
    const provider = new firebase.auth.GithubAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        console.log(result);
    }).catch((error) => { console.log(error); });
});