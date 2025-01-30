const menu = document.querySelector('.nav-menu');
const navBar = document.querySelector('.nav-bar');

menu.addEventListener('click', function () {
    if (navBar.classList.contains('active')) {
        navBar.classList.remove('active');
    } else {
        navBar.classList.add('active');
    }    
});

const links = Array.from(navBar.children);
links.forEach(link => {
    link.addEventListener('click', () => {
        if (navBar.classList.contains('active')) {
            navBar.classList.remove('active');
    }})
});