"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const base_geocoding_api_url = 'https://geocoding-api.open-meteo.com/v1/';
const base_openMeteo_api_url = 'https://api.open-meteo.com/v1/';
const mainContainer = document.getElementById('main_container');
let metricUnits = {
    temperature: "celsius",
    wind_speed: "kmh",
    precipitation: "mm"
};
let imperialUnits = {
    temperature: "fahrenheit",
    wind_speed: "mph",
    precipitation: "inch"
};
let unitsDict = {
    temperature: "celsius",
    wind_speed: "kmh",
    precipitation: "mm"
};
let currentLocation = {
    name: "",
    country: "",
    timezone: null,
    coordinates: {
        latitude: "",
        longitude: "",
    }
};
let selectedDate = new Date(); //i think this is basically just a currentDate (not current selected)
let hourlyForecast;
// let hourlyForecast: SimpleForecast[]; //for all week - forecast by hour
function isMetricUnits(dict) {
    return Object.keys(metricUnits).every((key) => dict[key] === metricUnits[key]);
}
function updateUnitsOnLocalStorage() {
    Object.keys(unitsDict).forEach((key) => {
        localStorage.setItem(key, unitsDict[key]);
    });
    renderUnitsOptionsContainer();
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield initCurrentLocation();
        renderUnitsOptionsContainer();
        initLocationOptionsContainer();
        setupEvents();
        yield getForecast(); //initial forecast call with current location
    });
}
function getCurrentCoordinates() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
            currentLocation.coordinates.latitude = String(position.coords.latitude);
            currentLocation.coordinates.longitude = String(position.coords.longitude);
            resolve();
        }, (error) => {
            reject(error);
        });
    });
}
function initCurrentLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        yield getCurrentCoordinates();
        const data = yield getLocationDetails(currentLocation.coordinates.latitude, currentLocation.coordinates.longitude);
        if (data) {
            currentLocation.name = (_b = (_a = data.address) === null || _a === void 0 ? void 0 : _a.city) !== null && _b !== void 0 ? _b : ' - ';
            currentLocation.country = (_d = (_c = data.address) === null || _c === void 0 ? void 0 : _c.country) !== null && _d !== void 0 ? _d : ' - ';
        }
    });
}
function setupEvents() {
    //event delegation -> attach event to parent
    document.body.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const target = e.target;
        if (target.matches("#units-btn") || target.closest('#units-btn') ||
            target.matches("#switch_to_imperial_container") || target.closest('#switch_to_imperial_container')) {
            toggleUnitsOptionContainer();
        }
        else if (target.matches("#week_days_btn") || target.closest('#week_days_btn')) {
            toggleDaysOptionContainer();
        }
        else {
            closeFloatingContainers(); //check if theres no weird stuff happening with this!!!!
        }
        if (target.matches("#switch_to_imperial_container") || target.closest('#switch_to_imperial_container')) {
            if (isMetricUnits(unitsDict))
                unitsDict = Object.assign({}, imperialUnits);
            else
                unitsDict = Object.assign({}, metricUnits);
            updateUnitsOnLocalStorage();
            getForecast();
        }
        if (target.matches("#retry_btn") || target.closest('#retry_btn')) {
            hideErrorContainer();
            yield getForecast();
        }
        const dayOptionEl = target.closest(".days-options-container .option");
        if (dayOptionEl) {
            clearSelectedFromDaysOptions();
            dayOptionEl.classList.add("selected");
            let selectedDateString = (_a = dayOptionEl.getAttribute('data-date')) !== null && _a !== void 0 ? _a : '';
            selectedDate = new Date(selectedDateString);
            renderHourlyForecast(selectedDateString); //decided to pass the string to filter the array better
        }
        const optionEl = target.closest(".units-options-container .option");
        if (optionEl) {
            let unitKey = optionEl.getAttribute("data-unit");
            let value = optionEl.getAttribute("data-value");
            if (unitKey && value) {
                unitsDict[unitKey] = value;
                localStorage.setItem(unitKey, value);
            }
            clearSelectedFromUnitOptions(unitKey !== null && unitKey !== void 0 ? unitKey : '');
            optionEl.classList.add('selected');
            renderUnitsOptionsContainer();
            yield getForecast();
        }
        if (target.matches('#search-location-btn')) {
            const searchInput = document.getElementById('search-location-input');
            if (searchInput) {
                renderLocations(searchInput.value);
            }
        }
        let locationOption = target.closest('#location');
        if (locationOption) {
            currentLocation.coordinates.longitude = (_b = locationOption.getAttribute('data-longitude')) !== null && _b !== void 0 ? _b : '';
            currentLocation.coordinates.latitude = (_c = locationOption.getAttribute('data-latitude')) !== null && _c !== void 0 ? _c : '';
            currentLocation.name = (_d = locationOption.getAttribute('data-name')) !== null && _d !== void 0 ? _d : '';
            currentLocation.country = (_e = locationOption.getAttribute('data-country')) !== null && _e !== void 0 ? _e : '';
            //update the input with the searched location??
            //get forecast data and render??
            getForecast();
        }
    }));
}
function renderLocations(search) {
    return __awaiter(this, void 0, void 0, function* () {
        let locationsContainer = document.getElementById('locations_container');
        if (!locationsContainer)
            return;
        let htmlLoading = `
        <div class="location flex">
            <img src="assets/images/icon-loading.svg" class="spinning" alt="loading icon">
            <span>Search in progress</span>
        </div>`;
        if (locationsContainer) {
            locationsContainer.classList.remove('hidden');
            locationsContainer.innerHTML = htmlLoading;
        }
        let locations = yield searchLocations(search);
        if (locations.length < 1) {
            locationsContainer.classList.add('hidden');
            renderLocationNotFoundContainer();
        }
        else {
            hideLocationNotFoundContainer();
        }
        let html = '';
        locations.forEach((location) => {
            html += `
            <div class="location" id="location" 
            data-name="${location.name}" data-country="${location.country}"
            data-longitude="${location.coordinates.longitude}" data-latitude="${location.coordinates.latitude}">
                <span class="">${location.name} (${location.country})</span>
            </div>
        `;
        });
        if (locationsContainer) {
            locationsContainer.innerHTML = html;
        }
    });
}
function getUnits() {
    Object.keys(unitsDict).forEach((key) => {
        console.log("key:", key);
        console.log("value:", localStorage.getItem(key));
        unitsDict[key] = localStorage.getItem(key) || unitsDict[key];
        console.log("dict value:", unitsDict[key]);
    });
}
function clearSelectedFromUnitOptions(unit = '') {
    let selector = `.units-options-container .option`;
    selector += unit ? `[data-unit="${unit}"]` : '';
    let options = document.querySelectorAll(selector);
    options.forEach((option) => {
        option.classList.remove('selected');
    });
}
function clearSelectedFromDaysOptions() {
    let options = document.querySelectorAll('.days-options-container .option');
    options.forEach((option) => {
        option.classList.remove('selected');
    });
}
function closeFloatingContainers() {
    const floatingContainers = document.querySelectorAll('.floating-container');
    floatingContainers.forEach((container) => {
        container.classList.add('hidden');
    });
}
function toggleUnitsOptionContainer() {
    const unitsContainer = document.getElementById('units-container');
    if (unitsContainer) {
        unitsContainer.classList.toggle('hidden');
    }
}
function toggleDaysOptionContainer() {
    const daysContainer = document.getElementById('days_container');
    if (daysContainer) {
        daysContainer.classList.toggle('hidden');
    }
}
function renderUnitsOptionsContainer() {
    var _a;
    getUnits();
    (_a = document.getElementById('units-container')) === null || _a === void 0 ? void 0 : _a.remove(); //restart container
    const html = `
        <div class="units-container floating-container light-border hidden" id="units-container">
            <div class="switch-to-imperial-container" id="switch_to_imperial_container">
            <p>Switch to <span>${isMetricUnits(unitsDict) ? "imperial" : "metric"}</span></p>
            </div>
            <div class="units-options-container">
            <div class="title">
                <span>Temperature</span>
            </div>
            <div class="option ${unitsDict.temperature == "celsius" ? "selected" : ""}" data-unit="temperature" data-value="celsius">
                <span>Celsius (ºC)</span>
                <span class="checkmark-icon"><img src="assets/images/icon-checkmark.svg" alt="checkmark-icon"></span>
            </div>
            <div class="option ${unitsDict.temperature == "fahrenheit" ? "selected" : ""}" data-unit="temperature" data-value="fahrenheit">
                <span>Fahrenheit (ºF)</span>
                <span class="checkmark-icon"><img src="assets/images/icon-checkmark.svg" alt="checkmark-icon"></span>
            </div>
            </div>
            <div class="units-options-container">
            <div class="title">
                <span>Wind speed</span>
            </div>
            <div class="option ${unitsDict.wind_speed == "kmh" ? "selected" : ""}" data-unit="wind_speed" data-value="kmh">
                <span>km/h</span>
                <span class="checkmark-icon"><img src="assets/images/icon-checkmark.svg" alt="checkmark-icon"></span>
            </div>
            <div class="option ${unitsDict.wind_speed == "mph" ? "selected" : ""}" data-unit="wind_speed" data-value="mph">
                <span>mph</span>
                <span class="checkmark-icon"><img src="assets/images/icon-checkmark.svg" alt="checkmark-icon"></span>
            </div>
            </div>
            <div class="units-options-container">
            <div class="title">
                <span>Precipitation</span>
            </div>
            <div class="option ${unitsDict.precipitation == "mm" ? "selected" : ""}" data-unit="precipitation" data-value="mm">
                <span>Millimeters (mm)</span>
                <span class="checkmark-icon"><img src="assets/images/icon-checkmark.svg" alt="checkmark-icon"></span>
            </div>
            <div class="option ${unitsDict.precipitation == "inch" ? "selected" : ""}" data-unit="precipitation" data-value="inch">
                <span>Inches (in)</span>
                <span class="checkmark-icon"><img src="assets/images/icon-checkmark.svg" alt="checkmark-icon"></span>
            </div>
            </div>
        </div>
    `;
    const nav = document.getElementById('nav');
    if (nav)
        nav.innerHTML += html;
}
function initLocationOptionsContainer() {
    const html = `
        <div class="locations-container floating-container hidden" id="locations_container">
        </div>
    `;
    const container = document.getElementById('text_input_container');
    if (container)
        container.innerHTML += html;
}
function hideErrorContainer() {
    var _a;
    (_a = document.getElementById('weather_parent_container')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
    const errorContainer = document.getElementById('error_container');
    if (errorContainer) {
        errorContainer.classList.add('hidden');
    }
}
function renderErrorContainer() {
    var _a;
    (_a = document.getElementById('weather_parent_container')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    const errorContainer = document.getElementById('error_container');
    if (errorContainer) {
        errorContainer.classList.remove('hidden');
    }
    else {
        const html = ` 
        <div class="error-container" id="error_container">
            <img class="error-icon" src="assets/images/icon-error.svg" alt="error-icon">
            <h1>Something went wrong</h1>
            <span>We couldn't connect you to the server (API error). Please try again in a few moments.</span>
            <button class="btn" id="retry_btn">
                <span><img src="assets/images/icon-retry.svg" alt="retry-icon"></span>
                <span>Retry</span>
            </button>
        </div>`;
        if (mainContainer)
            mainContainer.innerHTML += html;
    }
}
function hideLocationNotFoundContainer() {
    var _a;
    (_a = document.querySelector('#weather_parent_container .body')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
    const notFoundContainer = document.getElementById('not_found_container');
    if (notFoundContainer) {
        notFoundContainer.classList.add('hidden');
    }
}
function renderLocationNotFoundContainer() {
    var _a;
    (_a = document.querySelector('#weather_parent_container .body')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    let weatherParentContainer = document.querySelector('#weather_parent_container');
    let notFoundContainer = document.getElementById('not_found_container');
    if (notFoundContainer) {
        notFoundContainer.classList.remove('hidden');
    }
    else {
        const html = ` 
            <div class="not-found-container" id="not_found_container">
                <h2>No Search results found!</h2>
            </div>`;
        if (weatherParentContainer)
            weatherParentContainer.innerHTML += html;
    }
}
//api client
function searchLocations(location_1) {
    return __awaiter(this, arguments, void 0, function* (location, lang = 'en', count = 10) {
        try {
            const url = `${base_geocoding_api_url}search?name=${location}&language=${lang}&count=${count}&format=json`;
            const res = yield fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = yield res.json();
            const locations = Array.isArray(data.results)
                ? data.results.map((item) => {
                    var _a, _b, _c;
                    return ({
                        name: (_a = item.name) !== null && _a !== void 0 ? _a : "Unknown",
                        country: item.country,
                        timezone: item.timezone,
                        coordinates: {
                            latitude: (_b = item.latitude) !== null && _b !== void 0 ? _b : 0,
                            longitude: (_c = item.longitude) !== null && _c !== void 0 ? _c : 0
                        }
                    });
                })
                : [];
            return locations;
        }
        catch (error) {
            console.error("Error fetching geocoding data:", error);
            renderErrorContainer();
            return [];
        }
    });
}
function getForecast() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            selectedDate = new Date();
            let url = `${base_openMeteo_api_url}forecast?latitude=${currentLocation.coordinates.latitude}&longitude=${currentLocation.coordinates.longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,weather_code&temperature_unit=${unitsDict.temperature}&wind_speed_unit=${unitsDict.wind_speed}&precipitation_unit=${unitsDict.precipitation}`;
            url += `&current=weather_code,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min`;
            const res = yield fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = yield res.json();
            hourlyForecast = data.hourly;
            renderCurrentWeatherCard(data.current.weather_code, data.current.temperature_2m);
            renderForecastDetails(data.current.temperature_2m, data.current.wind_speed_10m, data.current.precipitation);
            renderDailyForecast(data.daily);
            renderDayOptions(data.daily.time);
            renderHourlyForecast(new Date().toISOString().split("T")[0]);
            console.log("Forecast", data);
        }
        catch (error) {
            console.error("Error fetching geocoding data:", error);
            renderErrorContainer();
        }
    });
}
function getLocationDetails() {
    return __awaiter(this, arguments, void 0, function* (latitude = "", longitude = "") {
        try {
            let url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude !== null && latitude !== void 0 ? latitude : currentLocation.coordinates.latitude}&lon=${longitude !== null && longitude !== void 0 ? longitude : currentLocation.coordinates.longitude}`;
            const res = yield fetch(url);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            const data = yield res.json();
            return data;
        }
        catch (error) {
            console.error("Error fetching geocoding data:", error);
            renderErrorContainer();
        }
    });
}
function renderCurrentWeatherCard(weatherCode = 9999, temperature = "", date = new Date()) {
    var _a;
    (_a = document.getElementById('current_forecast')) === null || _a === void 0 ? void 0 : _a.classList.remove('loading');
    const currentLocationEl = document.getElementById('current_location');
    const currentDateEl = document.getElementById('current_date');
    const currentForecastIcon = document.getElementById('current_forecast_icon');
    const currentTemperature = document.getElementById('current_temperature');
    if (!currentLocationEl || !currentDateEl || !currentForecastIcon || !currentTemperature)
        return;
    currentLocationEl.innerHTML = `${currentLocation.name}, ${currentLocation.country}`;
    currentDateEl.innerHTML = getFullDate(date);
    currentForecastIcon.src = getForecastIconUrl(weatherCode);
    currentTemperature.innerHTML = `${temperature} º`;
}
function renderForecastDetails(temperature = "", windSpeed = "", precipitation = "") {
    var _a;
    (_a = document.getElementById('current_forecast_details')) === null || _a === void 0 ? void 0 : _a.classList.remove('loading');
    const temperatureEl = document.getElementById('forecast_details_temperature');
    const windSpeedEl = document.getElementById('forecast_details_wind_speed');
    const precipitationEl = document.getElementById('forecast_details_precipitation');
    if (!temperatureEl || !windSpeedEl || !precipitationEl)
        return;
    temperatureEl.innerHTML = `${temperature !== null && temperature !== void 0 ? temperature : '-'} º`;
    windSpeedEl.innerHTML = `${windSpeed !== null && windSpeed !== void 0 ? windSpeed : '-'} ${unitsDict.wind_speed}`;
    precipitationEl.innerHTML = `${precipitation !== null && precipitation !== void 0 ? precipitation : '-'} ${unitsDict.precipitation}`;
}
function renderDailyForecast(dailyData) {
    var _a;
    (_a = document.getElementById('daily_forecast')) === null || _a === void 0 ? void 0 : _a.classList.remove('loading');
    let dailyForecastContainers = document.querySelectorAll(`.daily_forecast .body .forecast-card`);
    dailyForecastContainers.forEach((container) => {
        let containerIndex = Number(container.getAttribute('data-index'));
        let html = `
            <h5 class="title">${getWeekday(dailyData.time[containerIndex], true)}</h5>
            <img class="forecast-icon" src="${getForecastIconUrl(dailyData.weather_code[containerIndex])}" alt="forecast-icon">
            <div id="daily_temperature_range_container"  class="temperature-range-container">
                <span id="max_daily_temperature">${dailyData.temperature_2m_max[containerIndex]}º</span>
                <span id="min_daily_temperature">${dailyData.temperature_2m_min[containerIndex]}º</span>
            </div>
        `;
        container.innerHTML = html;
    });
}
function renderDayOptions(weekdays) {
    const daysOptionsContainer = document.getElementById('days_options_container');
    if (!daysOptionsContainer)
        return;
    let html = '';
    weekdays.forEach((date) => {
        html += `
            <div class="option day-option ${getWeekday(selectedDate) == getWeekday(date) ? "selected" : ""}" 
            data-date="${date}"
           >
                <span>${getWeekday(date, false)}</span>
            </div>
        `;
    });
    daysOptionsContainer.innerHTML = html;
    let selectedDayEl = document.getElementById('selected_day');
    selectedDayEl.innerHTML = getWeekday(selectedDate, false);
}
function renderHourlyForecast(date = selectedDate) {
    var _a;
    if (typeof (date) === 'string')
        date = new Date(date).toISOString().split("T")[0]; //correct format
    let selectedDayEl = document.getElementById('selected_day');
    let currentDateHour = new Date(new Date().setHours(new Date().getHours(), 0, 0, 0));
    (_a = document.getElementById('hourly_forecast')) === null || _a === void 0 ? void 0 : _a.classList.remove('loading');
    const hourlyForecastBody = document.querySelector(".hourly_forecast .body");
    if (!selectedDayEl || !hourlyForecastBody)
        return;
    selectedDayEl.innerHTML = getWeekday(date, false);
    let html = "";
    hourlyForecast.time.forEach((dateHour, i) => {
        if (dateHour.includes(String(date)) && !(currentDateHour > new Date(dateHour))) {
            html += `
                <div class="item">
                    <div class="hour_icon">
                    <img class="forecast-icon" src="${getForecastIconUrl(hourlyForecast.weather_code[i])}" alt="forecast-icon">
                    <span>${getHour(hourlyForecast.time[i])}</span>
                </div>
                <span>${hourlyForecast.temperature_2m[i]}º</span>
                </div>
            `;
        }
    });
    hourlyForecastBody.innerHTML = html;
}
function getHour(date) {
    if (typeof (date) === 'string')
        date = new Date(date);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true
    });
}
function getFullDate(date) {
    if (typeof (date) === 'string')
        date = new Date(date);
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
function getWeekday(date, getShortName = false) {
    if (typeof (date) === 'string')
        date = new Date(date);
    return date.toLocaleDateString("en-US", { weekday: getShortName ? "short" : "long" });
}
function getForecastIconUrl(weatherCode) {
    if (weatherCode == null)
        weatherCode = 9999;
    switch (weatherCode) {
        case 0:
        case 1:
        case 2:
        case 3:
            return `assets/images/icon-sunny.webp`;
        case 45:
        case 48:
            return `assets/images/icon-fog.webp`;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            return `assets/images/icon-drizzle.webp`;
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            return `assets/images/icon-rain.webp`;
        case 71:
        case 72:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return `assets/images/icon-snow.webp`;
        case 95:
            return `assets/images/icon-storm.webp`;
        default:
            return "assets/images/icon-error.svg";
    }
}
init();
// interface SimpleForecast{
//     date: Date;
//     temperature:string;
//     weatherCode:string;
// }
