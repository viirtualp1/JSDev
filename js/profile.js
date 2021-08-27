firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const resumeModal = new bootstrap.Modal(document.getElementById('resume')).show();
        const user = JSON.parse(localStorage.getItem('user'));

        document.getElementById('nav-city').innerHTML = `${locationUser.city} (${locationUser.region})`;    
        document.getElementById('name-input').value = user.name;
        document.getElementById('surname-input').value = user.surname;

        $.fias.token = '236fKe9rzhiE3SB58TbnnaQ4nrY6FEiY';
        $.fias.url = 'https://kladr-api.ru/api.php';
    } else {
        location.href = 'auth.html';
    }
});

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

let keySkills = [];
let workplaces = [];
let indexWorkplace = 0;

function currencySelect(currency) {
    document.getElementById('current-btn').innerHTML = currency;
    currencyUser = currency
}

function salaryNumbersSort() {
    let salaryInput = document.getElementById('salary-input').value;
    document.getElementById('salary-input').value = salaryInput.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function keySkillsAdd() {
    let keySkillsInput = document.getElementById('keySkills-input').value;
    keySkills.push(keySkillsInput);

    document.getElementById('keySkills-content').innerHTML += `
        <span class="badge keySkill bg-secondary" id="${keySkillsInput}">${keySkillsInput} <i class="fas fa-trash deleteKeySkill" onclick="deleteKeySkill('${keySkillsInput}')"></i></span>
    `;
}

function deleteKeySkill(value) {
    let indexElement = keySkills.indexOf(value);
    let htmlElement = document.getElementById(value);
    
    keySkills.splice(indexElement, 1);
    htmlElement.parentNode.removeChild(htmlElement);
}

function addWorkPlace() {
    let monthStartWorkInput = document.getElementById('month-start-work').value,
        yearStartWorkInput = document.getElementById('year-start-work').value,
        monthEndWorkInput = document.getElementById('month-end-work').value,
        yearEndWorkInput = document.getElementById('year-end-work').value,
        nameOrganizationInput = document.getElementById('name-organization-input').value,
        positionInput = document.getElementById('position-input').value,
        workplaceResponsibilitiesInput = document.getElementById('workplaceResponsibilities-textarea').value;

    let workplacesDiv = document.getElementById('workplaces-content');

    workplaces.push({
        monthStartWork: monthStartWorkInput,
        yearStartWork: yearStartWorkInput,

        monthEndWork: monthEndWorkInput,
        yearEndWork: yearEndWorkInput,

        nameOrganization: nameOrganizationInput,
        position: positionInput,
        workplaceResponsibilities: workplaceResponsibilitiesInput,
    });

    workplacesDiv.innerHTML += `
        <div class="card card-workplace" id="${indexWorkplace}" style="width: 18rem;">
            <div class="card-body">
                <a href="#">${monthStartWorkInput} ${yearStartWorkInput} - ${monthEndWorkInput} ${yearEndWorkInput}</a>

                <h5 class="card-title">${positionInput}</h5>
                <p class="card-text">${nameOrganizationInput}</p>

                <button class="btn btn-outline-danger" onclick="deleteWorkplace(${indexWorkplace})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;    

    indexWorkplace++;
}

function deleteWorkplace(index) {
    let element = document.getElementById(`${index}`);

    workplaces.splice(index, 1);
    element.parentNode.removeChild(element);
}