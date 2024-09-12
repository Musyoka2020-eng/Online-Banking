$(document).ready(() => {
    // Bind event handlers
    $('#send').click(handleSendClick);
    $('#chat_agent').change(handleAgentChange);

    async function handleSendClick(e) {
        e.preventDefault();
        const message = $('#message').val();
        const handle = $('#handle').val();
        const chatID = $('#chat-id').val();
        const agent = $('#chat_agentId').val();

        if (!validateInputs(message, handle, agent)) return;

        try {
            if (!chatID) {
                console.log('Generating new chat');
                const newChatID = await generateChatID();
                $('#chat-id').val(newChatID);
                await proceedWithChat(newChatID, message, handle, agent);
            } else {
                await proceedWithChat(chatID, message, handle, agent);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleAgentChange(e) {
        e.preventDefault();
        const selectedAgent = $('#chat_agent').val();
        const currentAgentId = $('#chat_agentId').val();

        if (selectedAgent !== currentAgentId) {
            $('#chat_agentId').val(selectedAgent);
            await getChatID(selectedAgent);
        } else {
            console.log('Agent has not changed');
        }
    }

    function validateInputs(message, handle, agent) {
        if (!message || !handle) {
            alert('Please enter a message and handle');
            return false;
        }
        if (!agent) {
            alert('Please select an agent');
            return false;
        }
        return true;
    }

    function generateChatID() {
        return new Promise((resolve, reject) => {
            const id = Math.random().toString(36).slice(2);
            id ? resolve(id) : reject('Error generating chat ID');
        });
    }

    async function proceedWithChat(chatID, message, handle, agent) {
        const data = { message, handle, chatID, receiver: agent, sender: 'client' };
        const url = '/userDashboard/sendMessage';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            $('#message').val('');
            $('#handle').val('');
            await fetchMessages(chatID);
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Error sending message');
        }
    }

    async function fetchMessages(chatID) {
        const url = `/userDashboard/getMessages/${chatID}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayMessages(data);
        } catch (err) {
            console.error('Error fetching messages:', err);
            if (err.status === 400) {
                displayMessages({ error: 'Invalid request' });
            } else {
                displayMessages({ error: 'An error occurred while fetching messages' });
            }
        }
    }

    async function getChatID(agentId) {
        const url = `/userDashboard/getChatID?agent=${agentId}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            $('#chat-id').val(data.chatId);
            await fetchMessages(data.chatId);
        } catch (err) {
            console.error('Error fetching chat ID:', err);
            displayMessages({ error: 'Unable to fetch chat ID' });
        }
    }

    function displayMessages(messages) {
        const messagesContainer = $('#chat-window').addClass('chat-window').empty();

        if (messages.error) {
            const errorFeedback = $('<div>').addClass('feedback-message')
                .append($('<p>').text(`An error occurred: ${messages.error}`));
            messagesContainer.append(errorFeedback);
            return;
        }

        if (!messages.messages || messages.messages.length === 0) {
            const welcomeMessage = $('<div>').addClass('feedback-message')
                .append($('<p>').text('Welcome to the chat! Please enter your handle and message to chat with an agent.'));
            messagesContainer.append(welcomeMessage);
            return;
        }

        let currentHandle = '';

        for (const msg of messages.messages) {
            if (msg.handle !== currentHandle) {
                currentHandle = msg.handle;
                const handleContainer = $('<div>').addClass('handle-container');
                const handleName = $('<div>').addClass('handle-name').text(`Handle: ${msg.handle}`);
                handleContainer.append(handleName);
                messagesContainer.append(handleContainer);
            }

            const messageContainer = $('<div>').addClass('message-container');
            const messageText = $('<p>').text(msg.message);
            messageContainer.append(messageText);

            if (msg.sender === 'client') {
                messageContainer.addClass('requester-message');
            } else {
                messageContainer.addClass('feedback-message');
            }

            messagesContainer.append(messageContainer);
        }

        const lastMessage = messages.messages[messages.messages.length - 1];
        if (lastMessage.sender === 'client') {
            const waitingMessage = $('<div>').addClass('waiting-for-reply')
                .text("Waiting for agent's reply...");
            messagesContainer.append(waitingMessage);
        }
    }

});
