document.addEventListener('DOMContentLoaded', function () {
    function showPassword(ElementId, toggleId) {
        const password = document.getElementById(ElementId);
        const toggle = document.getElementById(toggleId);
        if (toggle) {
            toggle.addEventListener('click', () => {
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                toggle.textContent = type === 'password' ? 'Show' : 'Hide';
            });
        }
    }
    showPassword('oldPassword', 'showOldPassword');
    showPassword('password', 'showNewPassword');
    showPassword('confirmpassword', 'showConfirmPassword');

    function validateUpdateProfileInput(updateData) {
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

        const errors = [];

        if (!updateData.oldPassword) {
            errors.push('Please enter your password');
        }

        if (updateData.password) {
            const passwordError = validatePassword(updateData.password) || validateLength(updateData.password, 8, 20, 'Password');
            if (passwordError) {
                errors.push(passwordError);
            }
        }

        errors.push(
            validateLength(updateData.firstname, 2, 50, 'First Name'),
            validateLength(updateData.lastname, 2, 50, 'Last Name'),
            validateLength(updateData.email, 8, 255, 'Email'),
            validateLength(updateData.phone, 10, 10, 'Phone'),
            validateLength(updateData.address, 2, 255, 'Address'),
            validateLength(updateData.city, 2, 50, 'City'),
            validatePassword(updateData.oldPassword),
            validateEmail(updateData.email)
        );

        return errors.filter((error) => error !== null)[0] || null; // Return the first error, or null if validation passed
    }


    const updateProfile = document.getElementById('update_profile');
    updateProfile.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Update profile button clicked');

        const getInputValue = (id) => document.getElementById(id).value.trim();

        const firstname = getInputValue('firstname');
        const lastname = getInputValue('lastname');
        const email = getInputValue('email');
        const phone = getInputValue('phone');
        const address = getInputValue('address');
        const city = getInputValue('city');
        const gender = getInputValue('gender');
        const dateofbirth = getInputValue('dateofbirth');
        const oldPassword = getInputValue('oldPassword');
        const password = getInputValue('password');
        const confirmpassword = getInputValue('confirmpassword');

        const form = document.getElementById('update_profile_form');
        const method = form.getAttribute('method');
        const url = '/clients/update-profile';

        const updateData = {
            firstname,
            lastname,
            email,
            phone,
            address,
            city,
            gender,
            dateofbirth,
            oldPassword,
            password: password || undefined,
        };

        console.log('Update data:', updateData);

        const validationError = validateUpdateProfileInput(updateData);
        if (validationError) {
            alert(validationError);
            return;
        }

        if (password && confirmpassword && password !== confirmpassword) {
            alert('Password and confirm password do not match');
            return;
        }

        if (oldPassword === password) {
            alert('Old password and new password cannot be the same');
            return;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profile updated successfully');
                window.location.href = '/userDashboard';
            } else if (response.status === 404) {
                alert('User not found');
            } else if (response.status === 405) {
                alert('Old password is required');
            } else if (response.status === 406) {
                alert('Invalid password');
            } else {
                alert('An error occurred. Please try again');
                console.log('Error updating profile:', data.error);
            }
        } catch (error) {
            alert('An error occurred. Please try again');
            console.log('Error updating profile:', error.message);
        }
    });

});   