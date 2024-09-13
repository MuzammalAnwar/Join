function startAnimation() {
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('logo').classList.add('slide-to-top-left');
    setTimeout(function () {
        document.getElementById('page1').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('loginPage').classList.add('fade-in');
    }, 1500);
}
