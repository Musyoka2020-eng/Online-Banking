function toggleModal(modalId, btnId) {
    const modals = [];
    modals.push(modalId);
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(btnId);
    const modalForm = modal.querySelectorAll('form');

    // console.log('Modal: ' + modalId + ' Button: ' + btnId);

    if (btn) {
        btn.addEventListener('click', () => {
            // console.log('Button clicked for modal: ' + modalId);
            const toggleModalView = getComputedStyle(modal).display === 'none' ? 'block' : 'none';
            // console.log('Toggle modal view: ' + toggleModalView);
            modal.style.display = toggleModalView;
            windowOnClick(modal);
            trapFocus(modal);
        });

        // Add event listener to the document for close button clicks
        document.addEventListener('click', function (event) {
            // Check if the clicked element is a close button within the modal
            if (event.target.classList.contains('close')) {
                const closeBtn = event.target;
                const modalToClose = closeBtn.closest('.modal');
                // console.log('Close button clicked for modal: ' + modalToClose.id);
                modalForm.forEach((form) => {
                    form.reset();
                });
                modalToClose.style.display = 'none';
            }
        });


    }

    function windowOnClick(modal) {
        window.onclick = function (event) {
            try {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            } catch (error) {
                console.log('Error: ' + error);
            }
        }
    }

    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Trap focus within the modal
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Tab') {
                if (event.shiftKey) { // if shift key pressed for shift + tab combination
                    if (document.activeElement === firstElement) {
                        lastElement.focus(); // add focus for the last focusable element
                        event.preventDefault();
                    }
                } else { // if tab key is pressed
                    if (document.activeElement === lastElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                        firstElement.focus(); // add focus for the first focusable element
                        event.preventDefault();
                    }
                }
            }
        });
    }
}

// tab functionality
const tabItems = document.querySelectorAll('.tab-bar-item');
const tabContentItems = document.querySelectorAll('.tab-content .tab-pane');
// Function to hide all tab content
function hideAllTabContent() {
    tabContentItems.forEach(item => {
        item.classList.remove('active-tab-content');
    });
}
// Function to show tab content based on the clicked tab
function showTabContent(tabId) {
    hideAllTabContent();
    tabItems.forEach(tab => {
        tab.classList.remove('active-tab');
    });
    const clickedTab = document.getElementById(tabId);
    if (!clickedTab) {
        return;
    }
    clickedTab.classList.add('active-tab');
    // Hide all tab content
    // Show the selected tab content with animation
    const contentId = tabId + '-tab';
    const contentItem = document.getElementById(contentId);
    if (contentItem) {
        contentItem.classList.add('active-tab-content');
    }
}
// Show the default tab content (e.g., "Bank")
showTabContent('banks');
// Add click event listeners to tab items
tabItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const clickedTabId = e.target.closest(
            '.tab-bar-item').id;
        hideAllTabContent();
        showTabContent(clickedTabId);
    });
});
const infoButton = document.querySelectorAll('.tab-info-icon');
const tabInfoContent = document.querySelectorAll('.tab-info-content');

function hideAllTabInfoContent() {
    tabInfoContent.forEach(item => {
        item.classList.remove(
            'active-tab-info-content');
    });
}

function showTabInfoContent(tabId) {
    const contentId = tabId + '-tabinfo-content';
    const classname = 'active-tab-info-content';
    const contentItem = document.getElementById(contentId);
    if (contentItem) {
        if (contentItem.classList.contains(classname)) {
            hideAllTabInfoContent();
        } else {
            contentItem.classList.add(classname);
        }
    }
}
// Add click event listener to the "Info" button
infoButton.forEach(button => {
    button.addEventListener('click', (e) => {
        let infoButtonId = e.target.closest(
            '.tab-info-icon')
            .id;
        infoButtonId = infoButtonId.split('-')[
            0];
        console.log(infoButtonId);
        showTabInfoContent(infoButtonId);
    });
});

// $("#banks").click(function() {
//     $("#banks-tab").addClass("active-tab-content");
//     $("#mobile-tab").removeClass("active-tab-content");
// });
// $("#mobile").click(function() {
//     $("#mobile-tab").addClass("active-tab-content");
//     $("#banks-tab").removeClass("active-tab-content");
// });
// $("#banks-tabinfo").click(function() {
//     $("#banks-tabinfo-content").toggle();
// });
// $("#mobile-tabinfo").click(function() {
//     $("#mobile-tabinfo-content").toggle();
// });

// end of tab functionality


