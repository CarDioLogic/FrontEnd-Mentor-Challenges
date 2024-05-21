
let timeframe = "daily";

document.getElementById('daily').addEventListener('click', () => updateTimeframe('daily'));
document.getElementById('weekly').addEventListener('click', () => updateTimeframe('weekly'));
document.getElementById('monthly').addEventListener('click', () => updateTimeframe('monthly'));

function updateTimeframe(newTimeframe) {
    timeframe = newTimeframe;
    fetchData();

    //For visualing updating the timeframe selected
    document.querySelectorAll('.timeText').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(timeframe).classList.add('active');
}

function fetchData(){

    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    
        switch(timeframe){
            case "daily":
                ShowDaily(data);
                break;
            case "weekly":
                ShowWeekly(data);
                break;
            case "monthly":
                ShowMonthly(data)
                break;
            default:
                break;
           }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function ShowDaily(data){
    //Elements: Work, Play, Study, Exercise, Social, Self Care
    data.forEach(element => {

        document.getElementById(`current${element.title}Result`)
        .innerHTML = `${element.timeframes.daily.current}hrs`;

        document.getElementById(`previous${element.title}Result`)
        .innerHTML = `yesterday - ${element.timeframes.daily.previous}hrs`;
    });
}

function ShowWeekly(data){
    //Elements: Work, Play, Study, Exercise, Social, Self Care
    data.forEach(element => {

        document.getElementById(`current${element.title}Result`)
        .innerHTML = `${element.timeframes.weekly.current}hrs`;

        document.getElementById(`previous${element.title}Result`)
        .innerHTML = `last week - ${element.timeframes.weekly.previous}hrs`;
    });
}

function ShowMonthly(data){
    //Elements: Work, Play, Study, Exercise, Social, Self Care
    data.forEach(element => {
        document.getElementById(`current${element.title}Result`)
        .innerHTML = `${element.timeframes.monthly.current}hrs`;

        document.getElementById(`previous${element.title}Result`)
        .innerHTML = `last month - ${element.timeframes.monthly.previous}hrs`;
    });
}

