const controllers = {};
controllers.client = require('./client');
controllers.account = require('./account');
controllers.chat = require('./chat');

module.exports = controllers;