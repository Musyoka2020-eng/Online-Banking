const { get, status } = require('express/lib/response');
const { models: { Chat, Message } } = require('../models');

module.exports = {
    sendMessage: async (req, res) => {
        try {
            const { message, receiver, chatID, sender: senderType, handle } = req.body;
            const sender = req.session.user.id;

            if (!message || !sender || !receiver || !chatID) {
                return res.status(400).send('Invalid data, unknown sender or receiver');
            }

            // Find the existing chat
            let chat = await Chat.findOne({ where: { chatId: chatID } });

            // If chat does not exist, create a new chat
            if (!chat) {
                const chatData = {
                    clientId: senderType === 'client' ? sender : receiver,
                    agentId: senderType === 'client' ? receiver : sender,
                    chatId: chatID,
                    status: 'active',
                };

                chat = await Chat.create(chatData);
            }

            // Create a new message in the chat
            const newMessage = await Message.create({
                chatId: chatID,
                handle,
                message,
                sender: senderType,
                status: 'sent',
            });

            res.status(201).json(newMessage);

        } catch (error) {
            console.error('Error processing message:', error);
            res.status(500).json({ error: 'An error occurred while processing the message' });
        }
    },
    getMessages: async (req, res) => {
        try {
            const { chatID } = req.params;
            console.log(chatID);

            if (!chatID) {
                return res.status(400).send({ status: 400, error: 'Invalid chat ID or Chat is not available' });
            }

            const chat = await Chat.findOne({ where: { chatId: chatID } });
            const messages = await Message.findAll({ where: { chatId: chatID } });
            //combine the chat and messages
            const chatMessages = { chat, messages };

            res.status(200).json(chatMessages);

        } catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ error: 'An error occurred while fetching messages' });
        }
    },
    getChatID: async (req, res) => {
        try {
            const client = req.session.user.id;
            const { agent } = req.query;
            console.log(agent, client);

            if (!agent || !client) {
                return res.status(400).send({ status: 400, error: 'Invalid data, unknown agent or client' });
            }

            const chat = await Chat.findOne({
                where: {
                    clientId: client,
                    agentId: agent,
                    status: 'active',
                }
            });

            if (!chat) {
                return res.status(404).send({ status: 404, error: 'No active chat found' });
            }

            res.status(200).json(chat);

        } catch (error) {
            console.error('Error fetching chat ID:', error);
            res.status(500).json({ error: 'An error occurred while fetching chat ID' });
        }
    },
};
