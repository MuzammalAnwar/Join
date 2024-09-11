function startAnimation() {
    // Hide the login page initially
    document.getElementById('loginPage').classList.add('hidden');

    // Start the logo animation to move it to the top-left
    document.getElementById('logo').classList.add('slide-to-top-left');

    // After the logo reaches the top-left, show the login page with fade-in
    setTimeout(function () {
        document.getElementById('page1').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('loginPage').classList.add('fade-in');
    }, 1500);
}
