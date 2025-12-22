require('dotenv').config();

module.exports = {
    HOST: process.env.DB_HOST || 'localhost',
    USERNAME: process.env.DB_USERNAME || 'root',
    PASSWORD: process.env.DB_PASSWORD || '',
    DBNAME: process.env.DB_NAME || 'online_banking',
    DIALECT: process.env.DB_DIALECT || 'mysql'
}