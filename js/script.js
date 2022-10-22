// Initialize total variable to keep track of total cost
let total = 0;

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
	let regex = /[\w]+@[\w]+\.com/i;

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

function validateField(field, validation) {
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

	document.getElementById('color').value = "";
	document.getElementById('color').removeAttribute('disabled');	
});

// Toggle color dropdown availability based on design dropdown
document.getElementById('color').addEventListener('change', () => {
	// Hide place holder option in design dropdown after first change
	document.querySelector('#color option:first-child').setAttribute('hidden', true);
});

// Update total based on user selection
document.getElementById('activities').addEventListener('change', e => {
	// Detect only for checkbox
	if(e.target.tagName === "INPUT" && e.target.getAttribute('type') === "checkbox") {
		const checkbox = e.target;
		const cost = parseFloat(checkbox.dataset.cost);

		if(checkbox.checked) {
			total += cost;
		} else {
			total -= cost;
		}

		document.getElementById('activities-cost').innerHTML = `Total: $${total}`;
	}
});

// Handle payment option change event
document.getElementById('payment').addEventListener('change', e => {
	select_payment_option(e.target.value);
});

// Handle form submission event
document.querySelector('form').addEventListener('submit', e => {
	let validateFields = [
		{'field': 'name', 'validation': 'not_empty'},
		{'field': 'email', 'validation': 'email'},
		{'field': 'activities-box', 'validation': 'activity_selected'},
		{'field': 'cc-num', 'validation': 'credit_card_number'},
		{'field': 'zip', 'validation': 'credit_card_zipcode'},
		{'field': 'cvv', 'validation': 'credit_card_cvv'}
	];

	let isValidForm = true;

	for(let validateField of validateFields) {
		let field = document.getElementById(validateField.field); 
		if(!validateField(field, validateField.validation)) {
			isValidForm = false;
		}
	}

	if(isValidForm) {
		e.preventDefault();
	}
});

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

