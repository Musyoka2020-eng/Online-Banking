$(document).ready(() => {
    $('#send').click((e) => {
        e.preventDefault();
        const message = $('#message').val();
        const handle = $('#handle').val();
        const chatID = $('#chat-id').val();
        const agent = $('#agentId').val();

        if (message === '' || handle === '') {
            alert('Please enter a message and handle');
            return;
        }

        if (agent === '') {
            alert('Please select an agent');
            return;
        }

        if (chatID === '') {
            console.log('Generating new chat');
            // Generate a new chat ID and wait for it to be resolved
            generateChatID().then(id => {
                $('#chat-id').val(id);
                proceedWithChat(id);
            }).catch(err => {
                console.error(err);
            });
        } else {
            proceedWithChat(chatID);
        }

        // Function to generate chat ID
        function generateChatID() {
            return new Promise((resolve, reject) => {
                const id = Math.random().toString(36).slice(2);
                if (id) {
                    resolve(id);
                } else {
                    reject('Error generating chat ID');
                }
            });
        }

        // Function to proceed after chat ID is generated or already exists
        function proceedWithChat(chatID) {
            console.log(`Message: ${message}, Handle: ${handle}, Chat ID: ${chatID}, Agent: ${agent}`);
            const data = { message, handle, chatID, receiver: agent, sender: 'client' };
            const url = '/userDashboard/sendMessage';
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            };

            fetch(url, options)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    $('#message').val('');
                    $('#handle').val('');
                    // $('#chat').append(`<div class="message"><p>${data.message}</p><span>${data.handle}</span></div>`);
                })
                .catch(err => {
                    console.error(err);
                    alert('Error sending message');
                });
        }
    });

    $('#agent').change((e) => {
        e.preventDefault();
        const agent = $('#agent').val();
        const agentId = $('#agentId').val();
        if (agent !== agentId) {
            $('#agentId').val(agent);
            $('#chat-id').val('');
        }
    });
});
