const hamburguerBtn = document.getElementById('hamburguer');
const navbarLinks = document.getElementById('navbar-links');

const productsLinks = document.getElementById('products-link');
const productsSublinks = document.getElementById('product-sublinks');
const companyLinks = document.getElementById('company-link');
const companySublinks = document.getElementById('company-sublinks');
const connectLinks = document.getElementById('connect-link');
const connectSublinks = document.getElementById('connect-sublinks');

hamburguerBtn.addEventListener('click', () => {
    hamburguerBtn.classList.toggle('is-open');
    navbarLinks.classList.toggle('is-open');
})

function closeAllLinks() {
    productsLinks.classList.remove('is-open');
    companyLinks.classList.remove('is-open');
    connectLinks.classList.remove('is-open');

    productsSublinks.classList.remove('is-open');
    companySublinks.classList.remove('is-open');
    connectSublinks.classList.remove('is-open');
}

productsLinks.addEventListener('click', () => {
    if (productsLinks.classList.contains('is-open')) {
        productsLinks.classList.remove('is-open');
        productsSublinks.classList.remove('is-open');
    } else {
        closeAllLinks(); //
        productsLinks.classList.add('is-open');
        productsSublinks.classList.add('is-open');
    }
});

companyLinks.addEventListener('click', () => {
    if (companyLinks.classList.contains('is-open')) {
        companyLinks.classList.remove('is-open');
        companySublinks.classList.remove('is-open');
    } else {
        closeAllLinks();
        companyLinks.classList.add('is-open');
        companySublinks.classList.add('is-open');
    }
});

connectLinks.addEventListener('click', () => {
    if (connectLinks.classList.contains('is-open')) {
        connectLinks.classList.remove('is-open');
        connectSublinks.classList.remove('is-open');
    } else {
        closeAllLinks();
        connectLinks.classList.add('is-open');
        connectSublinks.classList.add('is-open');
    }
});
