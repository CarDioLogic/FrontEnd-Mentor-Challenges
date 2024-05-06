var currentDate = new Date();
var day = currentDate.getDate();
var month = currentDate.getMonth() + 1;
var year = currentDate.getFullYear();

let dayValue = parseInt(document.getElementById('dayInput').value);
let monthValue = parseInt(document.getElementById('monthInput').value);
let yearValue = parseInt(document.getElementById('yearInput').value);

let dayValid = false;
let monthValid = false;
let yearValid = false;

dayInput.addEventListener('input', function(event) {
    dayValue = parseInt(document.getElementById('dayInput').value);
    monthValue = parseInt(document.getElementById('monthInput').value);

    validateDay();

    //show results
});

function validateDay(){
    if(dayValue <= 0 || dayValue > 31 || isNaN(dayValue) ||
    (monthValue != 2 && monthValue % 2 == 0 && dayValue > 30) ||
    (monthValue != 2 && monthValue % 2 != 0 && dayValue > 31)
    || (isLeapYear(yearValue) && monthValue == 2 && dayValue > 29) ||
        ((isLeapYear(yearValue) == false && monthValue == 2 && dayValue > 28))) {
        document.getElementById('days').textContent = "--";
        dayValid = false;
        displayDayError();

    } else {
        dayValid = true;
        removeDayError();
        showResults();
    }
}

function validateMonth(){
    if(monthValue <= 0 || monthValue > 12 || isNaN(monthValue)) {
        document.getElementById('months').textContent = "--";
        monthValid = false
        displayMonthError();
    } else {
        monthValid = true;
        removeMonthError();
        showResults();
    }
}

function validateYear(){
    let currentYearInt = parseInt(year.toString());

    if(yearValue > currentYearInt || yearValue <= 0){
        document.getElementById('years').textContent = "--";
        displayYearError();
        yearValid = false;
    } else {
        yearValid = true;
        removeYearError();
        showResults();
    }
}

function showResults(){

    if (dayValid && monthValid && yearValid) {
        let inputDate = new Date(yearValue, monthValue - 1, dayValue);
        let currentDate = new Date();
        
        let ageDifference = currentDate.getFullYear() - inputDate.getFullYear();
        
        if (currentDate.getMonth() < inputDate.getMonth() || 
            (currentDate.getMonth() === inputDate.getMonth() && 
             currentDate.getDate() < inputDate.getDate())) {
            ageDifference--;
        }
        
        let ageYears = ageDifference;
        let ageMonths = 0;
        let ageDays = 0;
    
        if (currentDate.getMonth() < inputDate.getMonth()) {
            ageMonths = 12 - (inputDate.getMonth() - currentDate.getMonth());
        } else {
            ageMonths = currentDate.getMonth() - inputDate.getMonth();
        }
    
        if (currentDate.getDate() < inputDate.getDate()) {
            let tempDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, inputDate.getDate());
            let timeDiff = currentDate.getTime() - tempDate.getTime();
            ageDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        } else {
            ageDays = currentDate.getDate() - inputDate.getDate();
        }
    
        document.getElementById('years').textContent = ageYears;
        document.getElementById('months').textContent = ageMonths;
        document.getElementById('days').textContent = ageDays;
    }
}

monthInput.addEventListener('input', function(event) {
    dayValue = parseInt(document.getElementById('dayInput').value);
    monthValue = parseInt(document.getElementById('monthInput').value);
    validateMonth();

    if(monthValid){
        validateDay();
    }

});

yearInput.addEventListener('input', function(event) {
    dayValue = parseInt(document.getElementById('dayInput').value);
    yearValue = parseInt(document.getElementById('yearInput').value);

    validateYear();

    if(yearValid){
        validateDay();
    }
});

function displayDayError(){
    document.getElementById('dayError').innerHTML = "Must be a valid day";
    document.getElementById('dayLabel').classList.add('error');
    document.getElementById('dayInput').classList.add('errorInput');
    document.getElementById('dayContainer').classList.add('error');
}
function removeDayError(){
    document.getElementById('dayError').innerHTML = "";
    document.getElementById('dayLabel').classList.remove('error');
    document.getElementById('dayInput').classList.remove('errorInput');
    document.getElementById('dayContainer').classList.remove('error');
}

function displayMonthError(){
    document.getElementById('monthError').innerHTML = "Must be a valid month";
    document.getElementById('monthLabel').classList.add('error');
    document.getElementById('monthInput').classList.add('errorInput');
    document.getElementById('monthContainer').classList.add('error');
}
function removeMonthError(){
    document.getElementById('monthError').innerHTML = "";
    document.getElementById('monthLabel').classList.remove('error');
    document.getElementById('monthInput').classList.remove('errorInput');
    document.getElementById('monthContainer').classList.remove('error');
}

function displayYearError(){
    document.getElementById('yearError').innerHTML = "Must be a valid year";
    document.getElementById('yearLabel').classList.add('error');
    document.getElementById('yearInput').classList.add('errorInput');
    document.getElementById('yearContainer').classList.add('error');
}
function removeYearError(){
    document.getElementById('yearError').innerHTML = "";
    document.getElementById('yearLabel').classList.remove('error');
    document.getElementById('yearInput').classList.remove('errorInput');
    document.getElementById('yearContainer').classList.remove('error');
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}