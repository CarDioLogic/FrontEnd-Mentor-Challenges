const counterOverlayContainers = document.querySelectorAll(".overlay");
const countdownTarget = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).getTime();

let days    = 0;
let hours   = 0;
let minutes = 0;
let seconds = 0;

document.addEventListener("DOMContentLoaded", () => {
    initCountdown();
    setInterval(updateCountdown, 1000);
});

function initCountdown(){
    const now = Date.now();
    const timeRemaining = countdownTarget - now;

    updateTime(timeRemaining);
    updateCardsUI();
}

function updateCountdown() {
    const now = Date.now();
    const timeRemaining = countdownTarget - now;

    if (timeRemaining <= 0) return;

    updateTime(timeRemaining);
    updateCardsUI();
}

function updateTime(timeRemaining){
    days    = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    hours   = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
    seconds = Math.floor((timeRemaining / 1000) % 60);
}

function updateCardsUI(){
    updateCard("days", days);
    updateCard("hours", hours);
    updateCard("minutes", minutes);
    updateCard("seconds", seconds);
}

function updateCard(type, newValue) {
    const card = document.querySelector(`.counter-card[data-type="${type}"]`);
    const valueEl = card.querySelectorAll(".value");
    const overlay = card.querySelector(".overlay");

    let shouldFlip = false
    valueEl.forEach(element => {
        const oldValue = parseInt(element.textContent, 10);
        if (oldValue !== newValue) {
            shouldFlip = true;
        }

        element.textContent = newValue.toString().padStart(2, "0");
    });

    if(shouldFlip) triggerFlip(overlay);
}


function triggerFlip(overlay) {
    overlay.classList.remove("flip");
    
    void overlay.offsetWidth;

    overlay.classList.add("flip");
}

