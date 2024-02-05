function validateRegistrationInput(firstname, lastname, email, password, confirmPassword) {
    const validateLength = (value, min, max, fieldName) => {
        if (value.length < min || value.length > max) {
            return `${fieldName} must be between ${min} and ${max} characters long`;
        }
        return null;
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^@]+@[^.]+\..+$/;

        if (!emailRegex.test(email)) {
            return 'Invalid email format. Please enter a valid email address.';
        }

        return null;
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return 'Password must meet the following criteria:\n' +
                '- At least 8 characters long\n' +
                '- Contains at least one lowercase letter\n' +
                '- Contains at least one uppercase letter\n' +
                '- Contains at least one number\n' +
                '- Contains at least one special character';
        }

        return null;
    };

    const lengthErrors = [
        validateLength(firstname, 2, 50, 'First Name'),
        validateLength(lastname, 2, 50, 'Last Name'),
        validateLength(email, 8, 255, 'Email'),
        validateLength(password, 8, 20, 'Password'),
    ].filter((error) => error !== null);

    if (lengthErrors.length > 0) {
        return lengthErrors[0];
    }

    const emailError = validateEmail(email);
    if (emailError !== null) {
        return emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError !== null) {
        return passwordError;
    }

    if (password !== confirmPassword) {
        return 'Passwords do not match. Please enter the same password in both fields.';
    }

    return null; // Validation passed
}


function validateLoginInput(email, password) {
    const validateEmail = (email) => {
        const emailRegex = /^[^@]+@[^.]+\..+$/;

        if (!emailRegex.test(email)) {
            return 'Invalid email format. Please enter a valid email address.';
        }

        return null;
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,20}$/;

        if (!passwordRegex.test(password)) {
            return 'Password must meet the following criteria:\n' +
                '- At least 8 characters long (up to 20 characters)\n' +
                '- Contains at least one lowercase letter\n' +
                '- Contains at least one uppercase letter\n' +
                '- Contains at least one number\n' +
                '- Contains at least one special character';
        }

        return null;
    };

    const emailError = validateEmail(email);
    if (emailError !== null) {
        return emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError !== null) {
        return passwordError;
    }

    return null; // Validation passed
}
