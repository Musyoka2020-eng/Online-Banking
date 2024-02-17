document.addEventListener('DOMContentLoaded', function () {
    // Get the current URL
    // var currentUrl = window.location.pathname;
    var imageUrl =
        "/upload/user_profile/<%= user.image %>";
    document.querySelector('.profileImage').src = imageUrl;
});