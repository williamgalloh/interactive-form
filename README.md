# Interactive Form

JavaScript is used to enhance an interactive registration form for a fictional Full Stack conference.


## Features

- Optional 'other' job role field
- T-shirt color options change based on design selected
- Total cost updates based on activities selected
- Payment fields change based on payment method selected
- Multi-rule form validation is applied to required fields in real-time
	- Fields and their validation rules are checked on load
	- Necessary error hint elements are generated for each rule and appended to fields
	- Fields are validated on key up event (also on form submit) and each individual rule is checked for that field
	- If a field passes/fails a rule, the hint for that rule is hidden/shown
- Detect and disable conflicting activities based on schedule


## Authors

- [@williamgalloh](https://github.com/williamgalloh)