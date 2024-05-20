const adviceBtn = document.getElementById('adviceBtn');
const title = document.getElementById('title');
const adviceText = document.getElementById('adviceText');

adviceBtn.addEventListener('click', async() => {
    let advice = await getAdvice();
    console.log(advice)
    title.innerHTML = `ADVICE #${advice.slip.id}`;
    adviceText.innerHTML = `"${advice.slip.advice}"`;
})

async function getAdvice() {
    const apiUrl = 'https://api.adviceslip.com/advice';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}
