// Initialize total variable to keep track of total cost
let total = 0;

let fieldsToValidate = [
	{'field': 'name', 'validation': 'not_empty'},
	{'field': 'email', 'validation': 'email'},
	{'field': 'activities-box', 'validation': 'activity_selected'},
	{'field': 'cc-num', 'validation': 'credit_card_number'},
	{'field': 'zip', 'validation': 'credit_card_zipcode'},
	{'field': 'cvv', 'validation': 'credit_card_cvv'}
];

// Focus name input on load
document.getElementById('name').focus();

// Hide other job input on load
document.getElementById('other-job-role').style.visibility = "hidden";

// Disable color dropdown on load
document.getElementById('color').setAttribute('disabled', true);

// Select credit card as payment option on load
select_payment_option('credit-card');

function select_payment_option(selected_option) {
	const payment_options = document.querySelectorAll('.payment-option');

	for (let payment_option of payment_options) {
		if(payment_option.dataset.method === selected_option) {
			payment_option.style.display = "block";
		} else {
			payment_option.style.display = "none";
		}
	}

	document.getElementById('payment').value = selected_option;
}

function isEmpty(field) {
	let regex = /^\s+$/;

	return (regex.test(field.value) || field.value == "");
}

function isEmail(field) {
	let regex = /^[\w]+@[\w]+\.com$/i;

	return regex.test(field.value);
}

function activitySelected(field) {
	// let field = document.getElementById('activities-box');
	let selected_activities = document.querySelectorAll('#activities input[type="checkbox"]:checked');

	return selected_activities.length > 0;
}

function isValidCreditCardNumber(field) {
		let card_number_regex = /^[0-9]{13,16}$/;

		return card_number_regex.test(field.value);
}

function isValidCreditCardZipcode(field) {
		let zipcode_regex = /^[0-9]{5}$/;

		return zipcode_regex.test(field.value);
}

function isValidCreditCardCvv(field) {
		let cvv_regex = /^[0-9]{3}$/;

		return cvv_regex.test(field.value);
}

let validateField = (field, validation) => {
	let isValid = false;

	switch(validation) {
		case "not_empty":
			isValid = !isEmpty(field);
			break;

		case "email":
			isValid = isEmail(field);
			break;

		case "activity_selected":
			isValid = activitySelected(field);
			break;

		case "credit_card_number":
			isValid = isValidCreditCardNumber(field);
			break;

		case "credit_card_zipcode":
			isValid = isValidCreditCardZipcode(field);
			break;

		case "credit_card_cvv":
			isValid = isValidCreditCardCvv(field);
			break;
	}

	toggleFieldValidClass(field, isValid);
	return isValid;
}

function toggleFieldValidClass(field, valid) {
	let parent = field.parentElement;
	if(valid) {
		parent.classList.remove("not-valid");
		parent.classList.add("valid");
		parent.lastElementChild.style.display = "none";
	} else {
		parent.classList.remove("valid");
		parent.classList.add("not-valid");
		parent.lastElementChild.style.display = "block";
	}
}

function toggleActivitiesFocusClass(e) {
	if(e.target.tagName === "INPUT" && e.target.getAttribute('type') === "checkbox") {
		const checkbox = e.target;
		const label = checkbox.parentElement;

		if(e.type === "focus") {
			label.classList.add("focus");
		} else if(e.type === "blur") {
			label.classList.remove("focus");
		}
	}
}

function updateTotal(checkbox) {
	const cost = parseFloat(checkbox.dataset.cost);

	if(checkbox.checked) {
		total += cost;
	} else {
		total -= cost;
	}

	document.getElementById('activities-cost').innerHTML = `Total: $${total}`;
}

function separateDaytime(string) {
	let dayTime = string.match(/^(\w+)\s(\d{1,2})(am|pm)-(\d{1,2})(am|pm)$/i);
	let day = dayTime[1];
	// Convert start time to 24 hour format
	let startTime = dayTime[3].toLowerCase() === "pm" && dayTime[2] < 12 ? parseInt(dayTime[2]) + 12 : parseInt(dayTime[2]);
	// Convert end time to 24 hour format
	let endTime = dayTime[5].toLowerCase() === "pm" && dayTime[4] < 12 ? parseInt(dayTime[4]) + 12 : parseInt(dayTime[4]);

	return {'day': day, 'start': startTime, 'end': endTime};
}

function toggleConflictingActivities(checkbox) {
	// Check each of the activities for schedule conflict
	let activities = document.querySelectorAll('#activities input[type="checkbox"]:not(:checked)');
	for (let activity of activities) {
		// Skip check if its the main conference or the currently checked/unchecked activity
		if(["all", checkbox.name].includes(activity.name)) {
			continue;
		}

		// Reset activity to initial state, it will be disabled later if it conflicts
		activity.removeAttribute('disabled');
		const label = activity.parentElement;
		label.classList.remove("disabled");

		// Extract schedule data from activity
		let dayTime = separateDaytime(activity.dataset.dayAndTime);

		// Check if this activity conflicts with any of the currently selected activities
		let selectedActivities = document.querySelectorAll('#activities input[type="checkbox"]:checked');
		for (let selectedActivity of selectedActivities) {
			// Skip check if its the main conference
			if(["all"].includes(selectedActivity.name)) {
				continue;
			}

			let selectedDayTime = separateDaytime(selectedActivity.dataset.dayAndTime);
			if(dayTime.day === selectedDayTime.day && (dayTime.start >= selectedDayTime.start && dayTime.start <= selectedDayTime.end)) {
				activity.setAttribute('disabled', true);
				label.classList.add("disabled");
			}
		}
	}
}

// Toggle other job input visibility based on job role value
document.getElementById('title').addEventListener('change', () => { 
	const title = document.getElementById('title').value;
	
	document.getElementById('other-job-role').style.visibility = title === "other" ? "visible" : "hidden";
});

// Toggle color dropdown availability based on design dropdown
document.getElementById('design').addEventListener('change', () => {
	// Hide place holder option in design dropdown after first change
	document.querySelector('#design option:first-child').setAttribute('hidden', true);

	const selected_design = document.getElementById('design').value;
	const colors = document.querySelectorAll('#color option');

	for (let color of colors) {
		let color_design = color.dataset.theme;

		if(color_design !== selected_design && color !== colors[0]) {
			color.setAttribute('hidden', true);
		} else {
			color.removeAttribute('hidden');
		}
	}
	document.querySelector('#color option:first-child').setAttribute('hidden', true);
	document.getElementById('color').value = document.querySelectorAll('#color option[data-theme="' + selected_design + '"]')[0].value;	
	document.getElementById('color').removeAttribute('disabled');	
});

// Update total based on user selection
document.getElementById('activities').addEventListener('change', e => {
	// Detect only for checkbox
	if(e.target.tagName === "INPUT" && e.target.getAttribute('type') === "checkbox") {
		let checkbox = e.target;
		toggleConflictingActivities(checkbox);
		updateTotal(checkbox);
		let activitiesBox = document.getElementById('activities-box');
		validateField(activitiesBox, 'activity_selected');
	}
});

// Handle payment option change event
document.getElementById('payment').addEventListener('change', e => {
	select_payment_option(e.target.value);
});

// Handle form submission event
document.querySelector('form').addEventListener('submit', e => {
	let isValidForm = true;

	for(let fieldToValidate of fieldsToValidate) {
		let field = document.getElementById(fieldToValidate.field); 
		if(!validateField(field, fieldToValidate.validation)) {
			isValidForm = false;
		}
	}

	if(!isValidForm) {
		e.preventDefault();
	}
});

// Validate form fields in real-time
for (let fieldToValidate of fieldsToValidate) {
	// Skip activities as they are already being validated in real time on another event listener
	if(fieldToValidate.field == 'activities-box') {
		continue;
	}

	document.getElementById(fieldToValidate.field).addEventListener('keyup', e => {
		validateField(e.target, fieldToValidate.validation);
	});
}

// Add focus class to activities on focus
let activities = document.querySelectorAll('#activities input[type="checkbox"]');
for (let activity of activities) {
	activity.addEventListener('focus', e => {
		toggleActivitiesFocusClass(e);
	});

	activity.addEventListener('blur', e => {
		toggleActivitiesFocusClass(e);
	});
}