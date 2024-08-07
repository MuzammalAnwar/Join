function startAnimation() {

    setTimeout(function () {
        document.getElementById('page1').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('loginPage').classList.add('fade-in');

        let logoContainer = document.getElementById('logoContainer');
        logoContainer.style.height = 'auto';
        logoContainer.style.width = 'auto';

    }, 1000);
}


