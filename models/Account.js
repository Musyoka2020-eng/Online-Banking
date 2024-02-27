const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');
const { type } = require('express/lib/response');

// Register any custom fonts if needed
registerFont('public/fonts/open-sans/OpenSans-Bold.ttf', { family: 'CustomFont' });

module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
        // Define your Account model fields
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: true,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        accountNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        accountType: {
            type: DataTypes.ENUM('current', 'savings'),
            defaultValue: 'current',
        },
        accountStatus: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'inactive',
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.00,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
        },
    });

    // Add hook to generate account number before creating a new account
    Account.beforeCreate(async (account, options) => {
        // Check if the user's role is 'user'
        if (account.role === 'user') {
            // Generate a unique account number
            const accountNumber = generateAccountNumber();
            account.accountNumber = accountNumber;
        }
    });

    // Function to generate a unique 16-digit account number
    function generateAccountNumber() {
        let accountNumber = '';
        for (let i = 0; i < 16; i++) {
            accountNumber += Math.floor(Math.random() * 10);
        }
        return accountNumber;
    }

    // Add hook to handle image upload before creating a new account
    Account.beforeCreate(async (account, options) => {
        // Check if image is provided
        if (!account.image) {
            // Generate profile picture from first name and last name
            const profilePicture = await generateProfilePicture(account.firstName, account.lastName);

            // Define the directory path
            const directory = path.join(__dirname, '../public/upload/user_profile');

            // Check if the directory exists, if not, create it
            if (!fs.existsSync(directory)) {
                console.log(`Creating directory: ${directory}`);
                fs.mkdirSync(directory, { recursive: true });
            }

            // Generate a unique filename for the image
            const imageFileName = `${Date.now()}-${Math.round(Math.random() * 1000)}.png`;

            // Define the destination directory
            const destination = path.join(directory, imageFileName);
            console.log(`Saving image to: ${destination}`);

            // Save the image to the destination directory
            fs.writeFileSync(destination, profilePicture);
            console.log('Image saved successfully.');

            // Store the image filename in the database
            account.image = imageFileName;
        }
    });

    // Function to generate profile picture from first name and last name
    async function generateProfilePicture(firstName, lastName) {
        const canvas = createCanvas(200, 200);
        const ctx = canvas.getContext('2d');

        // Create a circular gradient background
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 10,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, '#4e54c8');
        gradient.addColorStop(1, '#8f94fb');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw initials
        const initials = getInitials(firstName, lastName);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, canvas.width / 2, canvas.height / 2);

        // Convert canvas to a buffer
        return canvas.toBuffer('image/png');
    }

    function getInitials(firstName, lastName) {
        const firstInitial = firstName.charAt(0).toUpperCase();
        const lastInitial = lastName.charAt(0).toUpperCase();
        return `${firstInitial}${lastInitial}`;
    }


    return Account;
};
