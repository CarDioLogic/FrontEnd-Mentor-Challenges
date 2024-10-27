const hambuguerBtn = document.getElementById('hamburgerBtn');
const links = document.getElementById('links');

hambuguerBtn.addEventListener('click', () => {
    const isOpened = hambuguerBtn.getAttribute('aria-expanded');

    if(isOpened === 'false'){
        hambuguerBtn.setAttribute('aria-expanded', true);
        links.setAttribute('aria-expanded', true);
        links.classList.add('links--visible');
    } else {
        hambuguerBtn.setAttribute('aria-expanded', false);  
        links.setAttribute('aria-expanded', false); 
        links.classList.remove('links--visible');
    }
});