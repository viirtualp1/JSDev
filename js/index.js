Vue.component('vacancy', {
    template: `
        <div class="card vacancy mb-3">
            <div class="card-body">
                <small class="salary-vacancy text-muted">70 000 руб. - 80 000 руб.</small>
                <h5 class="card-title">Junior Front-End Javascript</h5>
                
                <h6 class="card-subtitle mb-2 text-muted">Можно работать из дома</h6>
                <small class="text-muted">Яндекс <i class="fas fa-check-circle text-primary"></i></small>
                <small class="text-muted d-block">Москва</small>

                <p class="card-text">Разрабатывать веб-приложения, которые контактируют с базой данных.
                    Хорошие знания HTML/CSS/JS (+Vue).</p>
                <button type="button" class="btn btn-outline-success">Откликнуться</button>
            </div>
        </div>
    `
});

let vue = new Vue({
    el: '#app',
    data: {
        user: {}
    },
    methods: {
        currencySelect: function (currency) {
            document.getElementById('current-btn').innerHTML = currency;
        },
    },
});

// getting the current user from the db
db.collection('users').doc(JSON.parse(localStorage.getItem('user')).email).get().then((doc) => {
    // equate the value from db to vue object
    vue.user = doc.data();

    document.getElementById('nav-city').innerHTML = doc.data().city;
    document.getElementById('nav-city-mob').innerHTML = doc.data().city;

    document.getElementById('name-user').innerHTML = doc.data().name;
    document.getElementById('email-user').innerHTML = JSON.parse(localStorage.getItem('user')).email;

    document.getElementById('avatar-user').src = firebase.auth().currentUser.photoURL;
});

function signOut() {
    firebase.auth().signOut().then(() => { 
        localStorage.removeItem('user');
        location.href = 'auth.html';
    }).catch((error) => { console.log(error); });
}