$(document).ready(() => {
    $('#send').click((e) => {
        e.preventDefault();
        const message = $('#message').val();
        const handle = $('#handle').val();
        const chatID = $('#chat-id').val();

        if (message === '' || handle === '') {
            alert('Please enter a message and handle');
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
            console.log(`Message: ${message}, Handle: ${handle}, Chat ID: ${chatID}`);
            $.ajax({
                url: '/userDashboard/sendMessage',
                type: 'POST',
                data: {
                    message,
                    handle,
                    chatID
                },
                success: (data) => {
                    console.log(data);
                    $('#message').val('');
                    // $('#handle').val('');
                },
                error: (err) => {
                    console.error(err);
                }
            });
        }
    });
});
