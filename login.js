document.addEventListener('DOMContentLoaded', () => {
    // Side Navigation Toggle
    const sideNav = document.getElementById('side-nav');
    const burgerMenu = document.getElementById('burger-menu');
    const mainContent = document.querySelector('.main-content');

    burgerMenu.addEventListener('click', () => {
        sideNav.classList.toggle('open');
        mainContent.classList.toggle('shifted');
    });
});