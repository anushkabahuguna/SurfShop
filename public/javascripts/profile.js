let newPasswordValue;
let confirmationValue;
const submitBtn = document.getElementById('update-profile');
const newPassword = document.getElementById('new-password');
const confirmation = document.getElementById('password-confirmation');
const validationMessage = document.getElementById('validation-message');
function validatePasswords(message, add, remove) {
		validationMessage.textContent = message;
		validationMessage.classList.add(add);
		validationMessage.classList.remove(remove);
}
confirmation.addEventListener('input', e => {
	e.preventDefault();
	newPasswordValue = newPassword.value;
	confirmationValue = confirmation.value;
	if (newPasswordValue !== confirmationValue) {
	  validatePasswords('Passwords must match!', 'color-red', 'color-green');
		 submitBtn.setAttribute('disabled', true);
	} else {
		validatePasswords('Passwords match!', 'color-green', 'color-red');
		submitBtn.removeAttribute('disabled');
	}
});

// first way

// form.addEventListener('submit', e => {
// 	if (newPasswordValue !== confirmationValue) {
// // 		not necessary to put here as we put it down in submit
// 		e.preventDefault();
// 		const error = document.getElementById('error');
// 		if(!error) {
// // 			here we dont have access to server side flash messages (req) so we had to create our own h1
// 			const flashErrorH1 = document.createElement('h1');
// 			flashErrorH1.classList.add('color-red');
// // 			if already error comes from dom side then add to h1
// 			flashErrorH1.setAttribute('id', 'error');
// 			flashErrorH1.textContent = 'Passwords must match!';
// 			const navbar = document.getElementById('navbar');
// 			navbar.parentNode.insertBefore(flashErrorH1, navbar.nextSibling);
// 		}
// 	}
// });

// second way in confirmation method 
// we are disabling the submit button if password dont match














