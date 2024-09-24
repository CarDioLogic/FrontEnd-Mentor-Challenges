const hambuguerBtn = document.getElementById('hamburger');
const linksNav = document.getElementById('links');

const features = document.getElementById('features');
const company = document.getElementById('company');
const subMenuFeatures = document.getElementById('subMenuFeatures');
const subMenuCompany = document.getElementById('subMenuCompany');

hambuguerBtn.addEventListener('click', () => {

    document.querySelector('.content').classList.toggle('is-open');
    hambuguerBtn.classList.toggle('is-open');
    linksNav.classList.toggle('is-open');
});


features.addEventListener('click', (event) => {
    event.preventDefault();

    document.querySelector('#features img').classList.toggle('is-open');
    subMenuFeatures.classList.toggle('is-open');

});

company.addEventListener('click', (event) => {
    event.preventDefault();

    document.querySelector('#company img').classList.toggle('is-open');
    subMenuCompany.classList.toggle('is-open');
});

