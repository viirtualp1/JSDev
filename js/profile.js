firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.href = 'auth.html';
    }
});

let user = JSON.parse(localStorage.getItem('user'));

$.fias.token = '236fKe9rzhiE3SB58TbnnaQ4nrY6FEiY';
$.fias.url = 'https://kladr-api.ru/api.php';

// City input
$(function () {
	let $address = $('[name="city"]'),
		$parent = $('[name="parent"]');

	$address.fias({
		oneString: true,
		change: function (obj) {
			log(obj);
		}
	});

	$parent.change(function () {
		changeParent($(this).val());
	});

	changeParent($('[name="parent"]:checked').val());

	function changeParent(value) {
		let parentType = null,
			parentId = null;

		switch (value) {
			case 'moscow':
				parentType = $.fias.type.region;
				parentId = '7700000000000';
				break;

			case 'petersburg':
				parentType = $.fias.type.region;
				parentId = '7800000000000';
				break;
		}

		$address.fias({
			parentType: parentType,
			parentId: parentId
		});
	}

	function log(obj) {
		let $log, i;

		$('.js-log li').hide();

		for (i in obj) {
			$log = $('#' + i);

			if ($log.length) {
				$log.find('.value').text(obj[i]);
				$log.show();
			}
		}
	}
});

let vue = new Vue({
    el: '#app',
    data: {
        indexWorkplace: 0,
        keySkillsInput: '',
        locationUser: {
            city: 'Москва',
            region: 'Московская область',
            country: 'Россия',
        },

        workplaces: [{
            monthStart: '',
            yearStart: '',

            monthEnd: '',
            yearEnd: '',

            nameOrganization: '',
            position: '',
            responsibilities: '',
        }],

        resume: {
            name: user.name,
            surname: user.surname,
            phone: '',
            city: '',
            date: '',
            sex: '',
            citizenship: '',
            experienceWork: '',
            careerObj: '',
            salary: '',
            currencyUser: 'руб.',
            professionalArea: '',
            keySkills: [],
            workplacesArray: [],
            aboutMe: '',
            education: '',
            nativeLanguage: '',
            foreignLanguages: '',
        }
    },

    methods: {
        currencySelect: function (currency) {
            document.getElementById('current-btn').innerHTML = currency;
            this.resume.currencyUser = currency
        },

        keySkillsAdd: function () {
            this.resume.keySkills.push(this.resume.keySkillsInput);
        
            document.getElementById('keySkills-content').innerHTML += `
                <span class="badge keySkill bg-secondary" id="${this.resume.keySkillsInput}">${this.resume.keySkillsInput} <i class="fas fa-trash deleteKeySkill" onclick="deleteKeySkill('${this.resume.keySkillsInput}')"></i></span>
            `;
        },

        addWorkPlace: function () {
            let workplacesDiv = document.getElementById('workplaces-content');
        
            this.resume.workplacesArray.push({
                monthStartWork: this.workplaces[0].monthStart,
                yearStartWork: this.workplaces[0].yearStart,
        
                monthEndWork: this.workplaces[0].monthEnd,
                yearEndWork: this.workplaces[0].yearEnd,
        
                nameOrganization: this.workplaces[0].nameOrganization,
                position: this.workplaces[0].position,
                workplaceResponsibilities: this.workplaces[0].responsibilities,
            });
        
            workplacesDiv.innerHTML += `
                <div class="card card-workplace" id="${this.indexWorkplace}" style="width: 18rem;">
                    <div class="card-body">
                        <a href="#">${this.workplaces[0].monthStart} ${this.workplaces[0].yearStart} - ${this.workplaces[0].monthEnd} ${this.workplaces[0].yearEnd}</a>
        
                        <h5 class="card-title">${this.workplaces[0].position}</h5>
                        <p class="card-text">${this.workplaces[0].nameOrganization }</p>
        
                        <button class="btn btn-outline-danger" onclick="deleteWorkplace(${this.indexWorkplace})"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;    
        
            this.indexWorkplace++;
        },

        createResume: function () {
            db.collection('users').doc(`${user.email}`).set(this.resume);

            location.href = 'index.html';
        }
    }
})

window.onload = () => {
    let resumeModal = new bootstrap.Modal(document.getElementById('resume'));
    resumeModal.show();

    document.getElementById('nav-city').innerHTML = `${vue.locationUser.city} (${vue.locationUser.region})`;
};

function deleteKeySkill (value) {
    let indexElement = vue.resume.keySkills.indexOf(value);
    let htmlElement = document.getElementById(value);
    
    vue.resume.keySkills.splice(indexElement, 1);
    htmlElement.parentNode.removeChild(htmlElement);
}

function salaryNumbersSort() {
    let salaryInput = document.getElementById('salary-input').value;
    document.getElementById('salary-input').value = salaryInput.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function deleteWorkplace(index) {
    let element = document.getElementById(`${index}`);

    vue.resume.workplacesArray.splice(index, 1);
    element.parentNode.removeChild(element);
}