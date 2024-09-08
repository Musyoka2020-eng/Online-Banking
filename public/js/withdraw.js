//Withdrawal modal handler
async function validateWithdrawForms(wformData) {
    let isValid = true;
    const amount = wformData.get('amount');
    const password = wformData.get('password');
    const transferTo = wformData.get('transferTo');
    const withdrawFrom = wformData.get('withdrawFrom');

    if (amount < 100) {
        alert('Amount must be at least 100');
        isValid = false;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        isValid = false;
    }

    if (transferTo.length < 5) {
        alert('Invalid account number');
        isValid = false;
    }

    if (withdrawFrom.length < 10) {
        alert('Invalid account number');
        isValid = false;
    }

    return isValid;
}

async function submitWithdrawForm(wformData) {
    try {
        let response = await fetch('/userDashboard/withdraw', {
            method: 'POST',
            body: wformData
        });

        if (!response.ok) {
            let message = JSON.parse(await response.text()).error;
            throw new Error('Withdrawal failed' + message);
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

function handleWithdraw(buttonId) {
    const btn = document.getElementById(buttonId);
    //btn-wmobile-wd
    let parts = buttonId.split("-");
    let fId = parts[1];
    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const form = document.getElementById(`${fId}-modal-form`);
        const wformData = new FormData(form);
        const isValid = await validateWithdrawForms(wformData);
        if (isValid) {
            let response = await submitWithdrawForm(wformData);
            if (response.status === 201) {
                alert('Withdrawal successful, Thank you for banking with us.');
                document.getElementById('withdrawModal').style.display = 'none';
                window.location.reload();
            } else if (response.status === 500) {
                alert('Withdrawal failed: , ' + response.error);
            } else {
                alert('Withdrawal failed, please try again later');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleWithdraw('btn-wagent-wd');
    handleWithdraw('btn-wmobile-wd');
});