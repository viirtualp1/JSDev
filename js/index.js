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
        indexWorkplace: 0,
        keySkillsInput: '',

        user: {},
        workplaces: [{
            monthStart: '',
            yearStart: '',

            monthEnd: '',
            yearEnd: '',

            nameOrganization: '',
            position: '',
            responsibilities: '',
        }],
    },
    methods: {
        currencySelect: function (currency) {
            document.getElementById('current-currency-btn').innerHTML = currency;
        },

        keySkillsAdd: function () {
            this.user.keySkills.push(this.keySkillsInput);
        },

        deleteKeySkill: function (keySkill) {
            let indexElement = this.user.keySkills.indexOf(keySkill);
            let htmlElement = document.getElementById(keySkill);
            
            this.user.keySkills.splice(indexElement, 1);
            htmlElement.parentNode.removeChild(htmlElement);
        },

        deleteWorkplace: function (indexWorkplace) {
            let element = document.getElementById(`${indexWorkplace}`);

            this.user.workplacesArray.splice(index, 1);
            element.parentNode.removeChild(element);
        },

        addWorkPlace: function () {
            this.user.workplacesArray.push({
                monthStartWork: this.workplaces[0].monthStart,
                yearStartWork: this.workplaces[0].yearStart,
        
                monthEndWork: this.workplaces[0].monthEnd,
                yearEndWork: this.workplaces[0].yearEnd,
        
                nameOrganization: this.workplaces[0].nameOrganization,
                position: this.workplaces[0].position,
                workplaceResponsibilities: this.workplaces[0].responsibilities,
            });
        
            this.indexWorkplace++;
        },

        updateResume: function () {
            db.collection('users').doc(`${JSON.parse(localStorage.getItem('user')).email}`).set(this.user);
        }
    },
});

// getting the current user from the db
db.collection('users').doc(JSON.parse(localStorage.getItem('user')).email).get().then((doc) => {
    // equate the value from db to vue object
    vue.user = doc.data();

    document.getElementById('name-user').innerHTML = doc.data().name;
    document.getElementById('email-user').innerHTML = JSON.parse(localStorage.getItem('user')).email;

    document.getElementById('avatar-user').src = firebase.auth().currentUser.photoURL;

    document.getElementById('current-currency-btn').innerHTML = vue.user.currencyUser;
});

function signOut() {
    firebase.auth().signOut().then(() => { 
        localStorage.removeItem('user');
        location.href = 'auth.html';
    }).catch((error) => { console.log(error); });
}