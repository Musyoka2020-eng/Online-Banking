document.addEventListener('DOMContentLoaded', () => {
    function validateLoginInput({ loginData }) {
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
        const emailError = validateEmail(loginData.email);
        if (emailError !== null) {
            return emailError;
        }
        const passwordError = validatePassword(loginData.password);
        if (passwordError !== null) {
            return passwordError;
        }
        return null; // Validation passed
    }

    const userLogin = document.getElementById('user_login');
    userLogin.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginData = { email, password };
        const validationError = validateLoginInput({ loginData });
        if (validationError) {
            alert(validationError);
            return;
        }
        try {
            const response = await fetch(
                'user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData),
            });
            const data = await response.json();
            if (response.status === 200) {
                alert('Login successful');
                window.location.href = '/userDashboard';
            } else if (response.status === 500) {
                alert('An unexpected error occurred. Please try again.');
            } else if (response.status === 404) {
                alert('User not found');
            } else if (response.status === 406) {
                alert('Invalid email or password');
            } else if (response.status === 409) {
                alert('User already logged in');
            } else {
                // Handle other unexpected statuses gracefully
                alert('An unknown error occurred. Please try again.');
                console.error('Unknown error during login:', data.error);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    });
});