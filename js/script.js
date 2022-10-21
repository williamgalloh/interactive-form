// Initialize total variable to keep track of total cost
let total = 0;

// Focus name input on load
document.getElementById('name').focus();

// Hide other job input on load
document.getElementById('other-job-role').style.visibility = "hidden";

// Disable color dropdown on load
document.getElementById('color').setAttribute('disabled', true);

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