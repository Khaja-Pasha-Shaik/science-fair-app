// Get form elements
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const signupButton = document.getElementById('signupButton');

// Function to enable or disable the signup button
function toggleSignupButton() {
  if (
    nameInput.value.trim() !== '' &&
    passwordInput.value !== ''
  ) {
    signupButton.removeAttribute('disabled');
  } else {
    signupButton.setAttribute('disabled', true);
  }
}

// Event listeners to toggle the signup button on form input changes
nameInput.addEventListener('input', toggleSignupButton);
passwordInput.addEventListener('input', toggleSignupButton);