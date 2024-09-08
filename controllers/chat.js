const { models: { Chat } } = require('../models');

module.exports = {
    sendMessage: (req, res) => {
        const message = req.body.message;
        const sender = req.session.user.id;
        const receiver = req.body.receiver;
        const chat = {
            message: message,
            sender: sender,
            receiver: receiver
        };
        db.models.Chat.create(chat).then(() => {
            res.redirect('/clients/dashboard');
        }).catch((error) => {
            console.log(error);
            res.redirect('/clients/dashboard');
        });
    }
};