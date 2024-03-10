const crypto = require('crypto');

module.exports = {
    encryptAccountNumber: (accountNumber, secretKey) => {
        // Ensure secretKey is a Buffer object
        const keyBuffer = Buffer.from(secretKey, 'hex');

        // Generate a random IV (Initialization Vector)
        const iv = crypto.randomBytes(16);

        // Create the cipher using createCipheriv
        const cipher = crypto.createCipheriv('aes-256-cbc', keyBuffer, iv);

        // Encrypt the accountNumber
        let encrypted = cipher.update(accountNumber, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Return the IV along with the encrypted data
        return {
            iv: iv.toString('hex'),
            encryptedData: encrypted
        };
    },

    decryptAccountNumber: (encryptedData, iv, secretKey) => {
        // Ensure secretKey and IV are Buffer objects
        const keyBuffer = Buffer.from(secretKey, 'hex');
        const ivBuffer = Buffer.from(iv, 'hex');

        // Create the decipher using createDecipheriv
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

        // Decrypt the encryptedData
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        // Return the decrypted accountNumber
        return decrypted;
    },

    obfuscateAccountNumber: (accountNumber) => {
        // Extract the first four characters and the last four characters of the account number
        const firstFour = accountNumber.slice(0, 4);
        const lastFour = accountNumber.slice(-4);

        // Calculate the number of asterisks needed
        const asterisksCount = accountNumber.length - 8;

        // Create a string of asterisks with the same length as the characters to be obfuscated
        const asterisks = '*'.repeat(asterisksCount);

        // Concatenate the first four characters, asterisks, and last four characters
        return `${firstFour}${asterisks}${lastFour}`;
    }

};
