const actionCodeSettings = {
    url: 'http://localhost:5500/index.html', // url для клика по ссылке в письме
    handleCodeInApp: true,
};

// войти / зарегистрироваться в аккаунт по почте
document.getElementById('sendEmailVerified').addEventListener('click', () => {
    let emailInput = document.getElementById('email-input').value;

    if (emailInput != '') {
        firebase.auth().sendSignInLinkToEmail(emailInput, actionCodeSettings).then(() => {

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
                    let fullName = `${result.value.name} ${result.value.surname}`;
    
                    localStorage.setItem('user', JSON.stringify({
                        email: emailInput,
                        fullName: fullName,
                    }));
    
                    db.collection("users/").doc(`${emailInput}`).set({
                        email: emailInput,
                        fullName: fullName,
                    }).then(() => {
                        Swal.fire({
                            icon: 'success',
                            text: 'Проверьте свою почту!',
                        });
                    }).catch((error) => { console.log(error); });
                })
            } else {
                db.collection("users/").doc(`${emailInput}`).get().then((doc) => {
                    if (doc.exists) {
                        console.log("Document data:", doc.data());
                    } else {
                        console.log("No such document!");
                    }
                }).catch((error) => { console.log(error); });
            }
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
        localStorage.setItem('user', JSON.stringify({ 
            email: emailInput,
            fullName: result.user.displayName,
        }));

        db.collection("users/").doc(`${emailInput}`).set({
            email: emailInput,
            fullName: result.user.displayName,
        }).then(() => {
            Swal.fire({
                icon: 'success',
                text: 'Проверьте свою почту!',
            });
        }).catch((error) => { console.log(error); });

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