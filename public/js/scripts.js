// Get form elements
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const signupButton = document.getElementById('signupButton');

// Function to enable or disable the signup button
function toggleSignupButton() {
  if (
    nameInput.value.trim() !== '' &&
    passwordInput.value !== '' &&
    confirmPasswordInput.value !== '' &&
    passwordInput.value === confirmPasswordInput.value
  ) {
    signupButton.removeAttribute('disabled');
  } else {
    signupButton.setAttribute('disabled', true);
  }
}

// Event listeners to toggle the signup button on form input changes
nameInput.addEventListener('input', toggleSignupButton);
passwordInput.addEventListener('input', toggleSignupButton);
confirmPasswordInput.addEventListener('input', toggleSignupButton);
