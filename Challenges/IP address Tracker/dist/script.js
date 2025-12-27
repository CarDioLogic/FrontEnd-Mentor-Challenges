const mapZoom = 13;
const map = L.map('map', {
    center: [51.505, -0.09],
    zoom: mapZoom,
    zoomControl: false,
    //   scrollWheelZoom: false
});
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
var marker = L.marker([51.5, -0.09]).addTo(map);
const customIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -35]
});
marker.setIcon(customIcon);
const searchForm = document.getElementById("search-location-from");
const apiKeyForm = document.getElementById("api-key-form");
const ipAddressEl = document.getElementById("ip-address");
const locationEl = document.getElementById("location");
const timezoneEl = document.getElementById("timezone");
const ispEl = document.getElementById("isp");
const modalEl = document.getElementById("modal");
const apiKeyConstant = "apiKey_IpAddressTracker";
let apiKey = null;
document.addEventListener("DOMContentLoaded", async () => {
    checkForUserApiKey();
    setupEvents();
});
function checkForUserApiKey() {
    apiKey = localStorage.getItem(apiKeyConstant);
    if (!apiKey) {
        modalEl.classList.remove('hidden');
        alert("Define an api key.");
        saveApiKey();
    }
    else {
        let input = document.getElementById("api-key-input");
        input.value = apiKey;
        modalEl.classList.add('hidden');
    }
}
function setupEvents() {
    searchForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        let searchInput = searchForm.querySelector("#search-input")?.value.trim();
        if (searchInput)
            renderLocationOnPage(searchInput);
    });
    document.getElementById("open-modal-btn")?.addEventListener("click", () => {
        modalEl.classList.remove("hidden");
    });
    modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) {
            checkForUserApiKey(); //doesnt let the modal close if no apiKey is defined
        }
    });
    apiKeyForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        saveApiKey();
    });
}
function saveApiKey() {
    apiKey = apiKeyForm.querySelector("#api-key-input")?.value.trim() ?? "";
    if (apiKey != "") {
        modalEl.classList.add('hidden');
        localStorage.setItem(apiKeyConstant, apiKey);
    }
}
async function renderLocationOnPage(searchInput) {
    let locationData = await searchLocation(searchInput);
    if (!locationData)
        return;
    ipAddressEl.textContent = locationData.ip;
    locationEl.textContent = `${locationData.location.city}, ${locationData.location.city} ${locationData.location.postalCode}`;
    timezoneEl.textContent = locationData.location.timezone;
    ispEl.textContent = locationData.isp;
    //render the map
    map.setView([locationData.location.lat, locationData.location.lng], mapZoom);
    marker.setLatLng([locationData.location.lat, locationData.location.lng]);
}
async function searchLocation(input) {
    let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}`;
    url += isIpAddress(input) ? `&ipAddress=${input}` : `&domain=${input}`;
    let locationData = await fetchData(url);
    return locationData;
}
//not working due to cors....
// async function checkApiKeyBalance(){
//     if(!apiKey || apiKey == ''){
//         alert("No api key defined");
//         return;
//     }
//     let url = `https://geo.ipify.org/service/account-balance?apiKey=${apiKey}`;
//     let balance = await fetchData(url);
//     return balance;
// }
async function fetchData(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Http error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        alert("Error fecthing data. Check your api key.");
        console.error("Error fecthing data", error);
        return null;
    }
    ;
}
function isIpAddress(input) {
    const parts = input.split('.');
    if (parts.length !== 4)
        return false;
    return parts.every(part => {
        if (!/^\d+$/.test(part))
            return false;
        const num = Number(part);
        return num >= 0 && num <= 255 && String(num) === part;
    });
}
export {};
//# sourceMappingURL=script.js.map