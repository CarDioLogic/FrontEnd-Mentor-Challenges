const form = document.getElementById('emailForm');
const emailInput = document.getElementById('email');
const emailReceiver = document.getElementById('emailReceiver');
const submitedForm = document.getElementById('submitedForm');
const errorMessage = document.querySelector('.error-message');
const card = document.getElementById('card');
const cardValid = document.getElementById('submitedForm'); 

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!emailInput.value.trim()) {

        errorMessage.textContent = "Please enter your email address.";
        emailInput.classList.add('error'); 
        emailInput.toggleAttribute('invalid');

      } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput.value)) {

        errorMessage.textContent = "Please enter a valid email address.";
        emailInput.classList.add('error');

      } else {

        emailReceiver.textContent = emailInput.value;
        errorMessage.textContent = "";
        emailInput.classList.remove('error');
        card.classList.add('hidden'); 
        cardValid.classList.remove('hidden');

      }
})

document.getElementById('dismissBtn').addEventListener('click', function(){
  cardValid.classList.add('hidden');
  card.classList.remove('hidden');
  emailInput.value = "";
});

