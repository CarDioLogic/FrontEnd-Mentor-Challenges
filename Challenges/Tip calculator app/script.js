let tipPercentage = 0;
let bill = 0;
let nbrPeople = 0;

document.querySelectorAll('.calculatorBtn').forEach(element => {
    element.addEventListener('click', () => {
        tipPercentage = parseInt(element.value, 10);
        console.log(`Tip percentage: ${tipPercentage}`)
        calculateTips();
    });
});

document.getElementById('customTip').addEventListener('input', (e) => {
    tipPercentage = validateValue(e.target.value, "customTip", null);
    console.log(`Tip percentage: ${tipPercentage}`)
    calculateTips();
})

document.getElementById('nbrPeople').addEventListener('input', (e) => {
    nbrPeople = validateValue(e.target.value, "nbrPeople", "errorNbrPeople");
    console.log(`Number of people: ${nbrPeople}`)
    calculateTips();
})

document.getElementById('bill').addEventListener('input', (e) => {
    bill = validateValue(e.target.value, "bill", "errorBill");
    console.log(`Bill to pay: ${bill}`)
    calculateTips();
})


document.getElementById('resetBtn').addEventListener('click', () => {
    location.reload();
})

function validateValue(value, inputId, elementSpanId){
    if(value == 0){
        elementSpanId !== null ? document.getElementById(elementSpanId).innerHTML = "Can´t be zero" : "";
        document.getElementById(inputId).classList.add('errorInput');
    }
    else if(value < 0){
        elementSpanId !== null ? document.getElementById(elementSpanId).innerHTML = "Can´t be negative" : "";
        document.getElementById(inputId).classList.add('errorInput');
    }
    else if(isNaN(value)){
        elementSpanId !== null ? document.getElementById(elementSpanId).innerHTML = "Must be a number" : "";
        document.getElementById(inputId).classList.add('errorInput');
    }
    else{
        elementSpanId !== null ? document.getElementById(elementSpanId).innerHTML = "" : "";
        document.getElementById(inputId).classList.remove('errorInput');

        return value;
    }
}

function calculateTips() {
    if (bill > 0 && tipPercentage > 0 && nbrPeople > 0) {
        console.log(`Bill: ${bill}, Tip percentage: ${tipPercentage}, Number of people: ${nbrPeople}`);

        let tipPerPerson = (bill * (tipPercentage / 100) / nbrPeople).toFixed(2);
        let totalPerPerson = (parseFloat(bill / nbrPeople) + parseFloat(tipPerPerson)).toFixed(2);

        document.getElementById('tipResult').innerHTML = "$" + tipPerPerson;
        document.getElementById('totalResult').innerHTML = "$" + totalPerPerson;
    }
}
