const Sequelize = require('sequelize')
const dbConfig = require('../config/db-config')

const sequelize = new Sequelize(dbConfig.DBNAME, dbConfig.USERNAME, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT
});

const db = {};
db.sequelize = sequelize;
db.models = {};
db.models.Client = require('./Client')(sequelize, Sequelize.DataTypes);
db.models.Account = require('./Account')(sequelize, Sequelize.DataTypes);
db.models.Trasaction = require('./Transaction')(sequelize, Sequelize.DataTypes);

module.exports = db