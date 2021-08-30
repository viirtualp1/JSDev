const getRandId = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();

let vue = new Vue({
    el: '#app',
    data: {
        skillInput: '',
        currentSkill: '',
        keySkillsInput: '',

        conditionsIndex: 0,
        requirementsIndex: 0,
        responsibilitiesIndex: 0,

        vacancy: {
            name: '',
            aboutVacancy: '',
            company: '',
            salary: '',
            id: getRandId(),
            profArea: '',
            currencySalary: '',
            skills: {
                conditions: {},
                requirements: {},
                responsibilities: {}
            },
            experienceWork: '',
            typeEmployment: '',
            keySkills: [],
            city: '',
            possibleRemoteWork: false,
        }
    },

    methods: {
        currencySelect: function (currency) {
            document.getElementById('current-currency-btn').innerHTML = currency;
            this.vacancy.currencySalary = currency;
        },

        infoCreateVacancy: function () {
            Swal.fire({
                icon: 'info',
                title: 'Информация',
                text: 'Сообщения об откликах придут на ваш аккаунт, где вы и сможете взаимодействовать с вашим потенциальным сотрудником'
            });
        },

        addSkill: function (skill) {
            document.getElementById(`${skill}-ul`).innerHTML += `
                <li id="${this.skillInput}">${this.skillInput} </li>
            `;

            switch (skill) {
                case 'conditions':
                    document.getElementById(`${this.skillInput}`).innerHTML += `<i class="fas fa-pen text-primary edit" onclick="showEditSkill('${skill}', '${this.skillInput}', '${this.conditionsIndex}')"></i>`;

                    this.vacancy.skills.conditions[this.conditionsIndex] = this.skillInput; 
                    this.conditionsIndex++;

                    break;
                case 'requirements':
                    document.getElementById(`${this.skillInput}`).innerHTML += `<i class="fas fa-pen text-primary edit" onclick="showEditSkill('${skill}', '${this.skillInput}', '${this.requirementsIndex}')"></i>`;

                    this.vacancy.skills.requirements[this.requirementsIndex] = this.skillInput; 
                    this.requirementsIndex++; 

                    break;
                case 'responsibilities':
                    document.getElementById(`${this.skillInput}`).innerHTML += `<i class="fas fa-pen text-primary edit" onclick="showEditSkill('${skill}', '${this.skillInput}', '${this.responsibilitiesIndex}')"></i>`;


                    this.vacancy.skills.responsibilities[this.responsibilitiesIndex] = this.skillInput; 
                    this.responsibilitiesIndex++; 
                    break;
            }
        },

        keySkillsAdd: function () {
            this.vacancy.keySkills.push(this.keySkillsInput);
        
            document.getElementById('keySkills-content').innerHTML += `
                <span class="badge keySkill bg-secondary" id="${this.keySkillsInput}">${this.keySkillsInput} <i class="fas fa-trash deleteKeySkill" onclick="deleteKeySkill('${this.keySkillsInput}')"></i></span>
            `;
        },

        createVacancy: function () {
            db.collection('vacancies').doc(`${this.vacancy.name}`).set(this.vacancy);

            Swal.fire({
                icon: 'success',
                title: 'Уведомление',
                text: 'Вакансия успешно создана!',
            });

            location.reload();
        }
    }
})

function showEditSkill(skill, value, index) {
    document.getElementById(value).innerHTML = `
        <div class="input-group">
            <input class="form-control editSkill" id="${value}-edit" type="text" value="${value}">
            <button type="button" class="btn btn-success" onclick="editSkill('${skill}', ${index}, '${value}')"><i class="fas fa-check"></i></button>
        </div>
    `;
}

function editSkill(skill, index, value) { 
    let editInput = document.getElementById(`${value}-edit`).value;

    switch (skill) {
        case 'conditions':
            vue.vacancy.skills.conditions[index] = editInput;
            document.getElementById(`${value}`).id = `${editInput}`;
            document.getElementById(`${editInput}`).innerHTML = `${editInput} <i class="fas fa-pen text-primary edit" onclick="showEditSkill('${skill}', '${editInput}', '${index}')"></i>`;

            break;
        case 'requirements':
            vue.vacancy.skills.requirements[index] = editInput;  
            document.getElementById(`${value}`).id = `${editInput}`;
            document.getElementById(`${editInput}`).innerHTML = `${editInput} <i class="fas fa-pen text-primary edit" onclick="showEditSkill('${skill}', '${editInput}', '${index}')"></i>`;

            break;
        case 'responsibilities':
            vue.vacancy.skills.responsibilities[index] = editInput;
            document.getElementById(`${value}`).id = `${editInput}`;
            document.getElementById(`${editInput}`).innerHTML = `${editInput} <i class="fas fa-pen text-primary edit" onclick="showEditSkill('${skill}', '${editInput}', '${index}')"></i>`;

            break;
    }
};

function deleteKeySkill (keySkill) {
    let indexElement = vue.vacancy.keySkills.indexOf(keySkill);
    let htmlElement = document.getElementById(keySkill);
    
    vue.vacancy.keySkills.splice(indexElement, 1);
    htmlElement.parentNode.removeChild(htmlElement);
}

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