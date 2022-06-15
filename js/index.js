let numberResponsesUser;

Vue.component('vacancy', {
  props: ['data'],

  template: `
        <div>
            <div class="card vacancy mb-3">
                <div class="card-body">
                    <small class="salary-vacancy text-muted">{{ data.salary }} {{ data.currencySalary }}</small>
                    <h5 class="card-title title-vacancy" @click="this.openModal(data.id)">{{ data.name }}</h5>
                    
                    <h6 class="card-subtitle mb-2 text-muted">{{ data.possibleRemoteWork === true ? 'Можно работать из дома' : '' }}</h6>
                    <small class="text-muted">{{ data.company }} <i class="fas fa-check-circle text-primary"></i></small>
                    <small class="text-muted d-block">{{ data.city }}</small>

                    <p class="card-text">{{ countWords(data.aboutVacancy) <= 30 ? data.aboutVacancy : wordOutput(data.aboutVacancy, 25) }}</p>
                    <button type="button" class="btn btn-outline-success" onclick="this.disabled = true;" @click="response(data)">Откликнуться</button>
                </div>
            </div>

            <div class="modal fade" :id="data.id" aria-hidden="true" tabindex="-1">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div class="vacancy-company">
                                <p class="vacancy-name-company">{{ data.company }} <i class="fas fa-check-circle text-primary"></i></p>
                                <p class="vacancy-city-company">{{ data.city }}</p>
                            </div>

                            <div class="vacancy-main-info">
                                <h4 class="modal-title fw-bold" id="exampleModalToggleLabel2">{{ data.name }}</h4>
                                <h5 class="mt-2">{{ data.salary }} {{ data.currencySalary }}</h5>
                            </div>

                            <div class="vacancy-actions-btns">
                                <button class="btn btn-success" onclick="this.disabled = true;" @click="response(data)">Откликнуться</button> 
                                <button class="btn btn-warning" title="Добавить в избранное">
                                    <i class="far fa-star vacancy-add-favourite"></i>
                                </button>
                                <button class="btn btn-danger" title="Скрыть">
                                    <i class="fas fa-ban vacancy-hide"></i>
                                </button>
                            </div>

                            <div class="vacancy-what-is-needed">
                                <p class="vacancy-work-experience mt-3 mb-0">Опыт работы: {{ data.experienceWork }}</p>
                                <p class="vacancy-employment">{{ data.typeEmployment }}, {{ data.possibleRemoteWork === true ? 'удаленная работа' : '' }}</p>
                            </div>

                            <div class="vacancy-description">
                                <p class="vacancy-description-text">{{ data.aboutVacancy }}</p>
                            </div>

                            <div class="vacancy-skills">
                                <div class="vacancy-skill-responsibilities">
                                    <p class="vacancy-title-responsibilities fw-bold mb-0">Обязанности: </p>

                                    <ul class="vacancy-ul-responsibilities">
                                        <li v-for="responsibilitie in data.skills.responsibilities">{{ responsibilitie }}</li>
                                    </ul>
                                </div>
                                <div class="vacancy-skill-requirements">
                                    <p class="vacancy-title-requirements fw-bold mb-0">Требования: </p>

                                    <ul class="vacancy-ul-requirements">
                                        <li v-for="requirement in data.skills.requirements">{{ requirement }}</li>
                                    </ul>
                                </div>
                                <div class="vacancy-skill-condition">
                                    <p class="vacancy-title-condition fw-bold mb-0">Условия: </p>
                                
                                    <ul class="vacancy-ul-condition">
                                        <li v-for="condition in data.skills.conditions">{{ condition }}</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="vacancy-keySkills">
                                <h4 class="fw-bold vacancy-keySkills">Ключевые навыки</h4>
                                <span class="badge keySkill bg-secondary" v-for="keySkill in data.keySkills">{{ keySkill }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

  methods: {
    countWords: function (str) {
      return str.trim().split(/\s+/).length;
    },

    wordOutput: function (str, words) {
      let output = '';

      for (let i = 0; i < words; i++) {
        output += ` ${str.trim().split(/\s+/)[i]}`;
      }

      return `${output}...`;
    },

    response: function (data) {
      if (data.creator === JSON.parse(localStorage.getItem('user')).email) {
        db.collection('users')
          .doc(data.creator)
          .get()
          .then((doc) => {
            numberResponsesUser = doc.data().numberResponses;
            numberResponsesUser++;

            db.collection('users').doc(data.creator).update({
              numberResponses: numberResponsesUser,
            });
          });

        db.collection('users')
          .doc(data.creator)
          .get()
          .then((doc) => {
            let responses = doc.data().responses;

            try {
              responses.push(data.name);

              db.collection('users').doc(data.creator).set(
                {
                  responses: responses,
                },
                { merge: true },
              );
            } catch {
              db.collection('users')
                .doc(data.creator)
                .set(
                  {
                    responses: [data.name],
                  },
                  { merge: true },
                );
            }
          });

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'success',
          title: 'Отклик отправлен!',
        });
      }
    },
  },
});

let vue = new Vue({
  el: '#app',
  data: {
    indexWorkplace: 0,
    keySkillsInput: '',

    user: {},
    vacancies: [],

    filterVacancies: {
      keyWords: '',
      profArea: 'Любая',
      branch: '',
      city: '',
      salary: '',
      currency: '',
      workExperience: '',
      typeEmployment: '',
    },

    workplaces: [
      {
        monthStart: '',
        yearStart: '',

        monthEnd: '',
        yearEnd: '',

        nameOrganization: '',
        position: '',
        responsibilities: '',
      },
    ],
  },
  methods: {
    currencySelect: function (currency) {
      document.getElementById('current-currency-btn').innerHTML = currency;
    },

    currencySelectFilter: function (currency) {
      document.getElementById('current-btn').innerHTML = currency;
      this.filterVacancies.currency = currency;
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
      db.collection('users')
        .doc(`${JSON.parse(localStorage.getItem('user')).email}`)
        .set(this.user);
    },

    filterVacanciesFunc: function () {
      for (let i = 0; i < this.vacancies.length; i++) {
        let keywords = this.filterVacancies.keyWords.trim().split(/\s+/);
        let nameVacancy = this.vacancies[i].name.trim().split(/\s+/);
        let vacancyElem = document.getElementsByClassName('vacancy')[i];

        for (let j = 0; j < keywords.length; j++) {
          if (keywords[j] === nameVacancy[j]) {
            vacancyElem.style.display = '';
          } else {
            vacancyElem.style.display = 'none';
          }
        }

        if (
          this.filterVacancies.profArea === this.vacancies[i].profArea ||
          this.filterVacancies.branch === this.vacancies[i].branch ||
          this.filterVacancies.city === this.vacancies[i].city ||
          (this.filterVacancies.salary >= this.vacancies[i].salary &&
            this.filterVacancies.currency === this.vacancies[i].currencySalary) ||
          this.filterVacancies.workExperience === this.vacancies[i].experienceWork ||
          this.filterVacancies.typeEmployment === this.vacancies[i].typeEmployment
        ) {
          vacancyElem.style.display = '';
        } else {
          vacancyElem.style.display = 'none';
        }
      }
    },
  },
});

localStorage.getItem('user') == null ? (location.href = 'auth.html') : null;

// getting the current user from the db
db.collection('users')
  .doc(JSON.parse(localStorage.getItem('user')).email)
  .get()
  .then((doc) => {
    // equate the value from db to vue object
    vue.user = doc.data();

    document.getElementById('name-user').innerHTML = doc.data().name;
    document.getElementById('email-user').innerHTML = JSON.parse(
      localStorage.getItem('user'),
    ).email;

    document.getElementById('avatar-user').src = firebase.auth().currentUser.photoURL;

    document.getElementById('current-currency-btn').innerHTML = vue.user.currencyUser;
  });

db.collection('vacancies')
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      vue.vacancies.push(doc.data());
    });

    recommendedVacancies();
  })
  .catch((error) => {
    console.log(error);
  });

function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      localStorage.removeItem('user');
      location.href = 'auth.html';
    })
    .catch((error) => {
      console.log(error);
    });
}

function searchVacancies() {
  let input = document.getElementById('search-vacancy-input').value;
  input = input.toLowerCase();

  // Перебирайте все элементы списка и скрывайте те, которые не соответствуют поисковому запросу
  for (let i = 0; i < vue.vacancies.length; i++) {
    let vacancy = vue.vacancies[i];
    let vacancyElem = document.getElementsByClassName('vacancy')[i];

    let vacancyName = vacancy.name.toLowerCase();
    let vacancyDescription = vacancy.aboutVacancy.toLowerCase();

    if (
      vacancyName.indexOf(input) > -1 ||
      vacancyDescription.indexOf(input) > -1 ||
      (input === 'удаленная' && vacancy.possibleRemoteWork === true) ||
      (input === 'дома' && vacancy.possibleRemoteWork === true)
    ) {
      vacancyElem.style.display = '';
    } else {
      vacancyElem.style.display = 'none';
    }
  }
}

function openModal(id) {
  let modal = new bootstrap.Modal(document.getElementById(id));
  modal.show();
}

function recommendedVacancies() {
  let vacancyRecommendedDiv = document.getElementById('recommended-for-you-content');

  let careerObjUser = vue.user.careerObj.trim().split(/\s+/),
    salary = vue.user.salary,
    keySkills = vue.user.keySkills,
    profArea = vue.user.professionalArea;

  // careerObj, salary, keySkills, professionalArea

  for (let i = 0; i < vue.vacancies.length; i++) {
    let vacancyNames = vue.vacancies[i].name.trim().split(/\s+/);

    for (let j = 0; j < careerObjUser.length; j++) {
      if (careerObjUser[j] === vacancyNames[j]) {
        vacancyRecommendedDiv.innerHTML += `
                    <div class="vacancy-recommended">
                        <i class="fas fa-file-alt" id="open-recommended-vacancy" onclick="openModal(${vue.vacancies[i].id})"></i>

                        <p id="title-recommended-vacancy">${vue.vacancies[i].name}</p>
                        <small class="text-muted">${vue.vacancies[i].salary} ${vue.vacancies[i].currencySalary}</small> <small class="text-muted">${vue.vacancies[i].company}, ${vue.vacancies[i].city}</small>
                    </div>
                `;
      }
    }

    for (let ks = 0; ks < keySkills.length; ks++) {
      for (let ksVacancy = 0; ksVacancy < vue.vacancies[i].keySkills.length; ksVacancy++) {
        if (keySkills[ks] === vue.vacancies[i].keySkills[ksVacancy]) {
          vacancyRecommendedDiv.innerHTML += `
                        <div class="vacancy-recommended">
                            <i class="fas fa-file-alt" id="open-recommended-vacancy" onclick="openModal(${vue.vacancies[i].id})"></i>

                            <p id="title-recommended-vacancy">${vue.vacancies[i].name}</p>
                            <small class="text-muted">${vue.vacancies[i].salary} ${vue.vacancies[i].currencySalary}</small> <small class="text-muted">${vue.vacancies[i].company}, ${vue.vacancies[i].city}</small>
                        </div>
                    `;
        }
      }
    }

    if (vue.vacancies.salary >= salary || vue.vacancies[i].professionalArea === profArea) {
      vacancyRecommendedDiv.innerHTML += `
                <div class="vacancy-recommended">
                    <i class="fas fa-file-alt" id="open-recommended-vacancy" onclick="openModal(${vue.vacancies[i].id})"></i>

                    <p id="title-recommended-vacancy">${vue.vacancies[i].name}</p>
                    <small class="text-muted">${vue.vacancies[i].salary} ${vue.vacancies[i].currencySalary}</small> <small class="text-muted">${vue.vacancies[i].company}, ${vue.vacancies[i].city}</small>
                </div>
            `;
    }
  }
}
