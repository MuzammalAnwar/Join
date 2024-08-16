function toggleUserMenu() {
    let menu = document.getElementById('userMenu');
    menu.classList.toggle('d_none');
}

document.addEventListener('click', function (event) {
    let isClickInside = document.getElementById('userMenuButton').contains(event.target) || document.getElementById('userMenu').contains(event.target);

    if (!isClickInside) {
        document.getElementById('userMenu').style.display = 'none';
    }
});
