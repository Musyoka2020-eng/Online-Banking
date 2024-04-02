//Deposit modal handler
async function validateDepositForm(formData) {
    // const depositFrom = formData.get('depositFrom');
    const transferFrom = formData.get('transferFrom');
    const depositTo = formData.get('depositTo');
    const amount = parseFloat(formData.get('amount'));
    const password = formData.get('password');

    // if (!depositFrom.trim()) {
    //     alert('Please select a bank to deposit from');
    //     return false;
    // }

    if (transferFrom.length < 5) {
        alert('Agent number must be 5 digits');
        return false;
    }

    if (depositTo.length < 10) {
        alert('Deposit account number must be 10 digits');
        return false;
    }

    if (isNaN(amount) || amount < 100) {
        alert('Amount must be a valid number greater than or equal to 100');
        return false;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return false;
    }

    return true;
}
async function submitDepositForm(formData) {
    try {
        const response = await fetch('/userDashboard/deposit', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            let message = JSON.parse(await response.text()).error;
            throw new Error('Failed to deposit: ' + message);
        }
        const result = await response.json();
        return {
            status: response.status,
            result
        };
    } catch (error) {
        return {
            status: 500,
            error: error.message
        };
    }
}
function handleDeposit(btnid) {
    document.getElementById(btnid).addEventListener('click', async () => {
        const parts = btnid.split('-')[1];
        // const id = btn === 'agentdepo' ? 'agent' : 'mobile';
        let id = parts;
        //remove the last 4 characters from the id
        id = id.substring(0, id.length - 4);
        console.log('ID: ', id);
        const formData = new FormData(document.getElementById(`${id}-modal-form`));

        try {
            const isValid = await validateDepositForm(formData);

            if (isValid) {
                const response = await submitDepositForm(formData);

                if (response.status === 201) {
                    alert('Deposit successful, Thank you for banking with us.');
                    document.getElementById('depositModal').style.display = 'none';
                    window.location.reload();
                } else if (response.status === 500) {
                    alert('Failed to deposit: ' + response.error);
                } else {
                    alert('Failed to deposit, please try again later');
                }
            }
        } catch (error) {
            alert(error.message);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleDeposit('btn-agentdepo');
    handleDeposit('btn-mobiledepo');
});