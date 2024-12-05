import './style.css'
import {getHighLowTemp, getHumidity, getApiResponse, getCityName, getCurrentTemperature, getForecast, getWeatherCondition, getWeatherIcon, getWindSpeed} from './apiwrapper.js';

let data;

document.getElementById('searchButton').addEventListener('click', async function() {
    let input = document.getElementById('input').value;
    let data = await getApiResponse(input);
    let imgSrc = getWeatherIcon(data);
    let cityName = getCityName(data);
    let currTemp = getCurrentTemperature(data);
    let tempRange = getHighLowTemp(data);
    let lowTemp = tempRange[0];
    let highTemp = tempRange[1];
    let weatherCondition = getWeatherCondition(data);
    let windSpeed = getWindSpeed(data);
    document.getElementById("temp").innerText = `${currTemp}°`;
    document.getElementById("location").innerText = cityName;
    document.getElementById("condition").innerText = weatherCondition;
    document.getElementById("icon").setAttribute("src", imgSrc);
    document.getElementById("hl").innerText = `H:${highTemp}° L:${lowTemp}°`;
    console.log(data);
    console.log(input);
    //let data = await getApiResponse()
    const mainCard = document.getElementById('mainCard');
    mainCard.classList.remove('hidden'); // Show the result card
});



