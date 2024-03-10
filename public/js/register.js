document.addEventListener('DOMContentLoaded', () => {

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


    const creatAccEl = document.getElementById('create_account');
    creatAccEl.addEventListener('click', async (e) => {
        e.preventDefault();
        const firstname = document.getElementById(
            'firstname').value;
        const lastname = document.getElementById(
            'lastname').value;
        const email = document.getElementById('email')
            .value;
        const password = document.getElementById(
            'password').value;
        const confirmPassword = document.getElementById(
            'confirm-password').value;
        const validationError =
            validateRegistrationInput(firstname,
                lastname, email, password,
                confirmPassword);
        if (validationError) {
            alert(validationError);
            return;
        }
        try {
            const response = await fetch(
                'clients/register-client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname,
                    lastname,
                    email,
                    password,
                }),
            });
            const data = await response.json();
            if (response.status === 201) {
                alert(
                    `Account created Welcome to Hulu Banking ${data.firstName} ${data.lastName}`
                );
                window.location.href = 'clients/login';
            }
            if (response.status === 409) alert(
                `An account already exists with the email address ${email}. Please use a different email address.`
            );
            if (response.status === 501) alert(
                'An error occurred while creating your account. Please try again later.'
            );
            if (response.status === 502) alert(
                'An error occurred while creating your account and client. Please try again later.'
            );
        } catch (error) {
            console.log('Error creating account:', error);
        }
    });
});

