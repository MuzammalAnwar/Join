function toggleUserMenu() {
    let menu = document.getElementById('userMenu');
    menu.classList.toggle('d_none');
}

document.addEventListener('click', function (event) {
    let userMenuButton = document.getElementById('userMenuButton');
    let userMenu = document.getElementById('userMenu');

    let isClickInside = userMenuButton.contains(event.target) || userMenu.contains(event.target);
    if (!isClickInside) {
        // Check if the menu is visible before hiding
        if (!userMenu.classList.contains('d_none')) {
            userMenu.classList.add('d_none');
        }
    }
});

