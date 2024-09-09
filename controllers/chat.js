const { models: { Chat, Message } } = require('../models');

module.exports = {
    sendMessage: async (req, res) => {
        const message = req.body.message;
        const sender = req.session.user.id;
        const receiver = req.body.receiver;
        const chatID = req.body.chatID;
        const senderType = req.body.sender;

        // console.log(`Message: ${message}, Sender: ${sender}, Receiver: ${receiver}, Chat ID: ${chatID}, Sender Type: ${senderType}`);

        if (!message || !sender || !receiver || !chatID) {
            return res.status(400).send('Invalid data, Unkown sender or receiver');
        }

        await Chat.findOne({ chatID }).then(chat => {
            if (!chat) {
                // Create a new chat
                if (senderType === 'client') {
                    Chat.create({
                        clientId: sender,
                        agentId: receiver,
                        chatId: chatID,
                        sender: senderType,
                        status: 'active',
                    }).then(newChat => {
                        Message.create({
                            chatId: chatID,
                            handle: req.body.handle,
                            message,
                            status: 'sent',
                        }).then(newMessage => {
                            res.status(201).json(newMessage);
                        }).catch(err => {
                            console.error(err);
                            res.status(500).send('Error creating message');
                        });
                    }).catch(err => {
                        console.error(err);
                        res.status(500).send('Error creating chat');
                    });
                } else {
                    Chat.create({
                        clientId: receiver,
                        agentId: sender,
                        chatId: chatID,
                        sender: senderType,
                        status: 'active',
                    }).then(newChat => {
                        Message.create({
                            chatId: chatID,
                            handle: req.body.handle,
                            message,
                            status: 'sent',
                        }).then(newMessage => {
                            res.status(201).json(newMessage);
                        }).catch(err => {
                            console.error(err);
                            res.status(500).send('Error creating message');
                        });
                    }).catch(err => {
                        console.error(err);
                        res.status(500).send('Error creating chat');
                    });
                }
            } else { // Chat exists
                Message.create({
                    chatId: chatID,
                    handle: req.body.handle,
                    message,
                    status: 'sent',
                }).then(newMessage => {
                    res.status(201).json(newMessage);
                }).catch(err => {
                    console.error(err);
                    res.status(500).send('Error creating message');
                });
            }
        }).catch(err => {
            console.error(err);
            res.status(500).send('Error finding chat by ID');
        });
    }
};