// Validate username length
function validateUsername(username) {
    return username.length >= 6;
}

// Validate password complexity
function validatePassword(password) {
    const minLength = 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return password.length >= minLength &&
           hasLowercase &&
           hasUppercase &&
           hasNumber &&
           hasSpecialChar;
}


// Validate email format
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Get password validation message
function getPasswordValidationMessage() {
    return "Password must be at least 8 characters long and contain:\n" +
           "- One lowercase letter\n" +
           "- One uppercase letter\n" +
           "- One number\n" +
           "- One special character";
}

// Export validation functions
export { validateUsername, validatePassword, validateEmail, getPasswordValidationMessage };
