const actionCodeSettings = {
    url: 'http://localhost:5500/index.html', // url для клика по ссылке в письме
    handleCodeInApp: true,
};

// войти / зарегистрироваться в аккаунт по почте
document.getElementById('sendEmailVerified').addEventListener('click', () => {
    let emailInput = document.getElementById('email-input').value;
    let passwordInput = document.getElementById('password-input').value;

    if (emailInput != '' || passwordInput != '') {
        if (localStorage.getItem('user') === null) {
            Swal.fire({
                title: 'Введите имя и фамилию',
                html: `<input type="text" id="name-input" class="swal2-input" placeholder="Имя">
                        <input type="text" id="surname-input" class="swal2-input" placeholder="Фамилия">`,
                confirmButtonText: 'Далее',
                cancelButtonText: 'Отмена',
                showCancelButton: true,
                focusConfirm: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                preConfirm: () => {
                    const nameInput = Swal.getPopup().querySelector('#name-input').value
                    const surnaneInput = Swal.getPopup().querySelector('#surname-input').value

                    if (!nameInput || !surnaneInput) {
                    Swal.showValidationMessage(`Пожалуйста, введите имя и фамилию`);
                    }

                    return { name: nameInput, surname: surnaneInput }
                }
            }).then((result) => {
                localStorage.setItem('user', JSON.stringify({
                    email: emailInput,
                    name: result.value.name,
                    surname: result.value.surname,
                }));

                db.collection("users/").doc(`${emailInput}`).set({
                    email: emailInput,
                    name: result.value.name,
                    surname: result.value.surname,
                }).then(() => {
                    firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput).then(() => {
                        db.collection('users').doc(`${emailInput}`).get().then((doc) => {
                            if (doc.data().phone) {
                                location.href = 'index.html';
                            } else {
                                location.href = 'profile.html';
                            }
                        });
                    }).catch((error) => { console.error(error); });
                }).catch((error) => { console.log(error); });
            })
        } else {
            firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput).then(() => {
                db.collection("users/").doc(`${emailInput}`).get().then((doc) => {
                    if (doc.data().phone) {
                        location.href = 'index.html';
                    } else {
                        location.href = 'profile.html';
                    }
                }).catch((error) => { console.log(error); });
            }).catch((error) => { console.log(error); });
        }
    } else {
        Swal.fire({
            icon: 'error',
            text: "Введите Email и пароль!"
        });
    }
});

// войти / зарегистрироваться в аккаунт через Google
document.getElementById('google-btn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        localStorage.setItem('user', JSON.stringify({ 
            email: result.user.email,
            name: result.user.displayName,
            surname: '',
        }));

        db.collection("users/").doc(`${result.user.email}`).set({
            email: result.user.email,
            name: result.user.displayName,
            surname: '',
        }).then(() => {
            Swal.fire({
                icon: 'success',
                text: 'Проверьте свою почту!',
            });
        }).catch((error) => { console.log(error); });

        db.collection('users').doc(`${result.user.email}`).get().then((doc) => {
            if (doc.data().phone) {
                location.href = 'index.html';
            } else {
                location.href = 'profile.html';
            }
        });
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