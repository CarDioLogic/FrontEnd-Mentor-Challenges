const chart = document.getElementById('chart');

fetch('data.json')
.then(response => response.json())
.then(data => {
    console.log(data);
    let maxDay = findMaxDay(data);
    let totalSpent = 0;

    data.forEach(element => {
        let column = document.createElement('div');
        column.classList.add('column');

        let priceBox = document.createElement('div');
        priceBox.classList.add('valueBox', 'hide');
        let price = document.createElement('p');
        price.innerHTML = `$${element.amount}`
        totalSpent += element.amount;
        priceBox.appendChild(price);

        let bar = document.createElement('div');
        bar.classList.add('loading-bar');
        if(element.day == maxDay){
            bar.classList.add('maxDayBar');
        }

        let name = document.createElement('p');
        name.innerHTML = element.day;

        bar.style.height = `${element.amount * 2}px`;

        bar.addEventListener('click', () => {
            priceBox.classList.toggle('hide');
        })

        column.appendChild(priceBox);
        column.appendChild(bar);
        column.appendChild(name);
        chart.appendChild(column);
    });

    document.getElementById('weeklyExpenses').innerHTML = `$${totalSpent}`;
})
.catch(error => {
    console.error('Error fetching data:', error);
});

function findMaxDay(data){
    let maxDay = ""
    let maxValue = 0;

    data.forEach(item => {
        if (item.amount > maxValue) {
            maxValue = item.amount;
            maxDay = item.day;
        }
    });

    console.log(`Day with highest expense is: ${maxDay}`)
    return maxDay
}