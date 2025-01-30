const cart = document.querySelector('.cart');
const cartIcon = document.querySelector('.cart-icon');
const cartClose = document.querySelector('.close-cart');

cartIcon.addEventListener('click', () => {
    console.log('cartIcon clicked');
    if (cart.classList.contains('active')) {
        cart.classList.remove('active');
    } else {
        cart.classList.add('active');
    }
});

cartClose?.addEventListener('click', () => {
    cart.classList.remove('active');
});


    