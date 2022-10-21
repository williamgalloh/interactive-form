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

function isFieldEmpty(field) {
	let regex = /^\s+$/;

	return (regex.test(field.value) || field.value == "");
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

function isValidName() {
	let field = document.getElementById('name');
	
	let isValid = !isFieldEmpty(field);

	toggleFieldValidClass(field, isValid);
	return isValid;
}

function isValidEmail() {
	let field = document.getElementById('email');
	let regex = /[\w]+@[\w]+\.com/i;

	let isValid = regex.test(field.value);

	toggleFieldValidClass(field, isValid);
	return isValid;
}

function isValidActivities() {
	let selected_activities = document.querySelectorAll('#activities input[type="checkbox"]:checked');
	let field = document.getElementById('activities-box');
	let isValid = selected_activities.length > 0;

	toggleFieldValidClass(field, isValid);
	return isValid;
}

function isValidPayment() {
	let field = document.getElementById('payment');

	if(field.value === 'credit-card') {
		let card_number = document.getElementById('cc-num');
		let card_number_regex = /^[0-9]{13,16}$/;

		let zipcode = document.getElementById('zip');
		let zipcode_regex = /^[0-9]{5}$/;

		let cvv = document.getElementById('cvv');
		let cvv_regex = /^[0-9]{3}$/;

		let isCreditCardNumberValid = card_number_regex.test(card_number.value);
		toggleFieldValidClass(card_number, isCreditCardNumberValid);

		let isZipcodeValid = zipcode_regex.test(zipcode.value);
		toggleFieldValidClass(zipcode, isZipcodeValid);

		let isCvvValid = cvv_regex.test(cvv.value);
		toggleFieldValidClass(cvv, isCvvValid);
		
		return isCreditCardNumberValid && isZipcodeValid && isCvvValid;
	}

	return true;
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

		if(color_design !== selected_design) {
			color.setAttribute('hidden', true);
		} else {
			color.removeAttribute('hidden');
		}
	}

	document.getElementById('color').removeAttribute('disabled');	
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
	let is_valid_name = isValidName();
	let is_valid_email = isValidEmail();
	let is_valid_activities = isValidActivities();
	let is_valid_payment = isValidPayment();
	if(!is_valid_name || !is_valid_email || !is_valid_activities || !is_valid_payment) {
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

