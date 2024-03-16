function toggleModal(modalId, btnId) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(btnId);
    const modalForm = modal.querySelector('form');

    if (btn) {
        btn.addEventListener('click', () => {
            const toggleModalView = getComputedStyle(modal).display === 'none' ? 'block' : 'none';
            modal.style.display = toggleModalView;
        });

        // Add event listener to the document for close button clicks
        document.addEventListener('click', function (event) {
            // Check if the clicked element is a close button within the modal
            if (event.target.classList.contains('close')) {
                const closeBtn = event.target;
                const modalToClose = closeBtn.closest('.modal');
                // console.log('Close button clicked for modal: ' + modalToClose.id);
                modalForm.reset();
                modalToClose.style.display = 'none';
            }
        });
    }
}
