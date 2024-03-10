const fs = require('fs');
const path = require('path');
const { createCanvas, registerFont } = require('canvas');
const { type } = require('express/lib/response');

// Register any custom fonts if needed
registerFont('public/fonts/open-sans/OpenSans-Bold.ttf', { family: 'CustomFont' });

module.exports = (sequelize, DataTypes) => {
    const Client = sequelize.define('Client', {
        // Define your Client model fields
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
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            defaultValue: 'active',
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
        },
    });
    //intialize the account model
    Client.associate = (models) => {
        Client.hasMany(models.Account, {
            foreignKey: 'clientId',
            as: 'accounts',
        });
    };

    // Add hook to handle image upload before creating a new account
    Client.beforeCreate(async (client, options) => {
        // Check if image is provided
        if (!client.image) {
            // Generate profile picture from first name and last name
            const profilePicture = await generateProfilePicture(client.firstName, client.lastName);

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
            client.image = imageFileName;
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


    return Client;
};
