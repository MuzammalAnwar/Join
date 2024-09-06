function startAnimation() {
    document.getElementById('loginPage').classList.add('hidden');
    setTimeout(function () {
        document.getElementById('page1').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('loginPage').classList.add('fade-in');
    }, 2000);
}
