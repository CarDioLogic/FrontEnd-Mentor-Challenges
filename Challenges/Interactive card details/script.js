const ccForm = document.getElementById('ccForm');
const confirmPage = document.getElementById('confirmationPage');

const cardNumber = document.getElementById('cardNumber');
const cardname = document.getElementById('cardName');
const cardDate = document.getElementById('cardDate');

ccForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if(validateFormFields()){
        cardname.innerHTML = document.getElementById('name').value;
        cardNumber.innerHTML = formatNumber(document.getElementById('number').value);
        cardDate.innerHTML = document.getElementById('dateMonth').value + "\\" + document.getElementById('dateYear').value;
    
        ccForm.innerHTML = "";
        ccForm.classList.add('hide');
        confirmPage.classList.remove('hide');
    }
});

function validateFormFields(){
    let isValid = true;

    let currentYear = new Date().getFullYear();

    if(!/^\d{16}$/.test(document.getElementById('number').value)){
        isValid = false;
        document.getElementById('number').classList.add('inputError');
        document.getElementById('errorNumber').innerHTML = "Wrong Format";
    } else {
        document.getElementById('number').classList.remove('inputError');
        document.getElementById('errorNumber').innerHTML = "";
    }

    if(parseInt(document.getElementById('dateMonth').value) <= 0 || 
    parseInt(document.getElementById('dateMonth').value) > 12 ||
    !/^\d{1,2}$/.test(document.getElementById('dateMonth').value)){
        isValid = false;
        document.getElementById('dateMonth').classList.add('inputError');
        document.getElementById('errorDate').innerHTML = "Wrong date";
    } else {
        document.getElementById('dateMonth').classList.remove('inputError');
        document.getElementById('errorDate').innerHTML = "";
    }

    if(parseInt(document.getElementById('dateYear').value) <= 0 || 
    parseInt(document.getElementById('dateYear').value) > currentYear ||
    !/^\d{4}$/.test(document.getElementById('dateYear').value)){
        isValid = false;
        document.getElementById('dateYear').classList.add('inputError');
        document.getElementById('errorDate').innerHTML = "Wrong date";
    } else {
        document.getElementById('dateYear').classList.remove('inputError');
        document.getElementById('errorDate').innerHTML = "";
    }

    if(!/^\d{3}$/.test(document.getElementById('cvc').value)){
        isValid = false;
        document.getElementById('cvc').classList.add('inputError');
        document.getElementById('errorCvc').innerHTML = "Wrong Format";
    } else {
        document.getElementById('cvc').classList.remove('inputError');
        document.getElementById('errorCvc').innerHTML = "";
    }



    return isValid;
}

function formatNumber(ccNumber) {
    let numGroups = Math.ceil(ccNumber.length / 4);
    
    let substrings = [];
    
    for (let i = 0; i < numGroups; i++) {
        let sub = ccNumber.substring(i * 4, (i + 1) * 4);
        
        substrings.push(sub);
    }
    
    let result = substrings.join(' ');
    
    return result;
}