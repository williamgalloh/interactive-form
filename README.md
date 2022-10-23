# Interactive Form

JavaScript is used to enhance an interactive registration form for a fictional Full Stack conference.


## Features

- Optional 'other' job role field
- T-shirt color options change based on design selected
- Total cost updates based on activities selected
- Payment fields change based on payment method selected
- Multi-rule form validation is applied to required fields in real-time
- Detect and disable conflicting activities based on schedule

## Multi-Rule Form Validation

All required fields and their validation rules are checked on load. The Necessary error hint elements are generated for each rule and appended to fields. The fields are validated on key up event (also on form submit) and each individual rule is checked for that field. If a field passes/fails a rule, the hint for that rule is hidden/shown.

## Authors

- [@williamgalloh](https://github.com/williamgalloh)