// Initialize total variable to keep track of total cost
let total = 0;

// Initiallize a list of all fields that need validation
let fieldsToValidate = [
	{'field': 'name', 'validation': ['not_empty']},
	{'field': 'email', 'validation': ['not_empty', 'email']},
	{'field': 'activities-box', 'validation': ['activity_selected']},
	{'field': 'cc-num', 'validation': ['not_empty', 'credit_card_number']},
	{'field': 'zip', 'validation': ['not_empty', 'credit_card_zipcode']},
	{'field': 'cvv', 'validation': ['not_empty', 'credit_card_cvv']}
];

// Add hidden validation hints to necessary fields on load
for (let fieldToValidate of fieldsToValidate) {
	// Skip activities field
	if(fieldToValidate.field === 'activities-box') {
		continue;
	}

	let field = document.getElementById(fieldToValidate.field);
	let fieldLabel = field.parentElement;
	for (let validation of fieldToValidate.validation) {
		let fieldLabelText = fieldLabel.textContent.match(/(\w+\s?\w+?\:)/i);
		let hintText = "";
		switch(validation) {
			case "not_empty":								
				hintText = 'cannot be blank';
				break;

			case "email":
				hintText = 'must be formatted correctly';
				break;

			// case "activity_selected":
			// 	isValid = activitySelected(field);
			// 	break;

			case "credit_card_number":
				hintText = 'must be between 13 - 16 digits';
				break;

			case "credit_card_zipcode":
				hintText = 'must be 5 digits';
				break;

			case "credit_card_cvv":
				hintText = 'must be 3 digits';
				break;
		}

		if(fieldLabelText && fieldLabelText.length > 0) {
			fieldLabelText = fieldLabelText[1].replace(":", "");
			let hint = `<span data-validation="${validation}" class="hint">${fieldLabelText} field ${hintText}</span>`;
			fieldLabel.insertAdjacentHTML('beforeend', hint);
		}
	}
}

// Focus name input on load
document.getElementById('name').focus();

// Hide other job input on load
document.getElementById('other-job-role').style.visibility = "hidden";

// Disable color dropdown on load
document.getElementById('color').setAttribute('disabled', true);

// Select credit card as payment option on load
selectPaymentOption('credit-card');

/**
 * selectPaymentOption
 * 
 * Hides/shows payment method fields depending on option selected
 *
 * @param {string} selected_option - option value of selected payment method 
 */
function selectPaymentOption(selected_option) {
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

/**
 * validateField
 * 
 * Checks if a field is valid or not based on supplied validation rules
 *
 * @param {DOMElement} field - field element to be validated
 * @param {array} validation - validation rules to check
 * @returns {boolean} returns weather the field passed all the validation rules or not
 */
let validateField = (field, validation) => {
	let isValid = false;

	for (let i = 0; i < validation.length; i++) {
		switch(validation[i]) {
			case "not_empty":
				var regex = /^\s+$/;

				isValid = !(regex.test(field.value) || field.value == "");
				break;

			case "email":
				var regex = /^[\w]+@[\w]+\.com$/i;

				isValid = regex.test(field.value);
				break;

			case "activity_selected":
				var selected_activities = document.querySelectorAll('#activities input[type="checkbox"]:checked');

				isValid = selected_activities.length > 0;
				break;

			case "credit_card_number":
				var card_number_regex = /^[0-9]{13,16}$/;

				isValid = card_number_regex.test(field.value);
				break;

			case "credit_card_zipcode":
				var zipcode_regex = /^[0-9]{5}$/;

				isValid = zipcode_regex.test(field.value);
				break;

			case "credit_card_cvv":
				var cvv_regex = /^[0-9]{3}$/;

				isValid = cvv_regex.test(field.value);
				break;
		}

		toggleFieldValidationHint(field, validation[i], isValid);
	}

	toggleFieldValidClass(field, isValid);
	return isValid;
}

/**
 * toggleFieldValidationHint
 *
 * Show/hide validation hints on fields
 *
 * @param {DOMElement} field - field element being validated
 * @param {string} validation - validation rule being validated
 * @param {boolean} valid - wether the specific validation rule was valid or not
 */
function toggleFieldValidationHint(field, validation, valid) {
	let parent = field.parentElement;
	for (const child of parent.children) {
		  if(child.classList.contains('hint') && (child.dataset.validation === validation || field.getAttribute('id') === 'activities-box')) {
		  	child.style.display = valid ? "none" : "block";
		  }
		}
}

/**
 * toggleFieldValidClass
 * 
 * Add/remove valid/not-valid class on fields
 *
 * @param {DOMElement} field - field element to be validated
 * @param {boolean} valid - wether the specific validation rule was valid or not
 */
function toggleFieldValidClass(field, valid) {
	let parent = field.parentElement;
	if(valid) {
		parent.classList.remove("not-valid");
		parent.classList.add("valid");
	} else {
		parent.classList.remove("valid");
		parent.classList.add("not-valid");
	}
}

/**
 * toggleActivitiesFocusClass
 * 
 * Enhance visibility of activity element when browser is focused on its input field
 *
 * @param {event} e - event object passed by listener
 */
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

/**
 * separateDaytime
 * 
 * Separate an activity's schedule string into usable day/time variables
 *
 * @param {string} string - string representing an activity's schedule ('Wednesday 1pm-4pm')
 * @returns {Object} object containing the usable parts of the schedule
 */
function separateDaytime(string) {
	let dayTime = string.match(/^(\w+)\s(\d{1,2})(am|pm)-(\d{1,2})(am|pm)$/i);
	let day = dayTime[1];
	// Convert start time to 24 hour format
	let startTime = dayTime[3].toLowerCase() === "pm" && dayTime[2] < 12 ? parseInt(dayTime[2]) + 12 : parseInt(dayTime[2]);
	// Convert end time to 24 hour format
	let endTime = dayTime[5].toLowerCase() === "pm" && dayTime[4] < 12 ? parseInt(dayTime[4]) + 12 : parseInt(dayTime[4]);

	return {'day': day, 'start': startTime, 'end': endTime};
}

/**
 * toggleConflictingActivities
 * 
 * Enable/disable activities based on conflicting schedules with other activities
 *
 * @param {DOMElement} checkbox - checkbox element of selected activity
 */
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

// Update total based on user selection, validate activity fields in real-time, and toggle conflicting activities
document.getElementById('activities').addEventListener('change', e => {
	// Detect only for checkbox
	if(e.target.tagName === "INPUT" && e.target.getAttribute('type') === "checkbox") {
		let checkbox = e.target;

		const cost = parseFloat(checkbox.dataset.cost);

		if(checkbox.checked) {
			total += cost;
		} else {
			total -= cost;
		}

		document.getElementById('activities-cost').innerHTML = `Total: $${total}`;

		toggleConflictingActivities(checkbox);
		let activitiesBox = document.getElementById('activities-box');
		validateField(activitiesBox, ['activity_selected']);
	}
});

// Handle payment option change event
document.getElementById('payment').addEventListener('change', e => {
	selectPaymentOption(e.target.value);
});

// Handle form submission event
document.querySelector('form').addEventListener('submit', e => {
	let isValidForm = true;

	for(let fieldToValidate of fieldsToValidate) {
		// Validate credit card only if its the payment method selected
		let selectedPaymentMethod = document.getElementById('payment').value;
		if(selectedPaymentMethod !== 'credit-card' && ['cc-num', 'zip', 'cvv'].includes(fieldToValidate.field)) {
			continue;
		}

		let field = document.getElementById(fieldToValidate.field); 
		if(!validateField(field, fieldToValidate.validation)) {
			isValidForm = false;
		}
	}

	// Instead of preventing form submission immidiately, we wait until all fields are validated to show user all errors.
	if(!isValidForm) {
		e.preventDefault();
	}
});

// Add event listeners to validate form fields in real-time
for (let fieldToValidate of fieldsToValidate) {
	// Skip activities as they are already being validated in real time on another event listener
	if(fieldToValidate.field == 'activities-box') {
		continue;
	}

	document.getElementById(fieldToValidate.field).addEventListener('keyup', e => {
		validateField(e.target, fieldToValidate.validation);
	});
}

// Add focus class to activities on focus.
// CAN BE IMPROVED: 
// In future can target parent element and use 'useCapture' option in 'addEventListener' 
// or use 'focusin' event instead of 'focus' as the event to listen for
let activities = document.querySelectorAll('#activities input[type="checkbox"]');
for (let activity of activities) {
	activity.addEventListener('focus', e => {
		toggleActivitiesFocusClass(e);
	});

	activity.addEventListener('blur', e => {
		toggleActivitiesFocusClass(e);
	});
}