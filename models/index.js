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
db.models.Transaction = require('./Transaction')(sequelize, Sequelize.DataTypes);
db.models.Provider = require('./Provider')(sequelize, Sequelize.DataTypes);
db.models.Chat = require('./Chat')(sequelize, Sequelize.DataTypes);
db.models.Message = require('./Message')(sequelize, Sequelize.DataTypes);

module.exports = db