import './style.css'
import {getFiveDayForecast, getLocalTime, getHighLowTemp, getHumidity, getApiResponse, getCityName, getCurrentTemperature, getForecast, getWeatherCondition, getWeatherIcon, getWindSpeed} from './apiwrapper.js';
let data;
function formatTimeToAmPm(time) {
    const date = new Date(time); // Convert to Date object
    let hours = date.getHours(); // Extract hours
    const suffix = hours >= 12 ? "pm" : "am"; // Determine AM/PM
  
    // Convert to 12-hour format
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
  
    return [`${hours}${suffix}`, date.getHours()];
}

function createFiveDayForecastCard(fiveDayForecastMp) {
    const fdContainer = document.getElementById('fd-container-id');
    fdContainer.innerHTML = ''; // Clear previous content if needed

    for (const day in fiveDayForecastMp) {
        // Create a single row for each forecast
        const row = document.createElement('div');
        row.className = 'row fd-row'; // Custom CSS class for layout

        // Set up row content
        row.innerHTML = `
            <div class="col">${fiveDayForecastMp[day][0]}</div>
            <div class="col">
                <img src="${fiveDayForecastMp[day][3]}" alt="Weather icon" style="max-width: 50px;">
            </div>
            <div class="col">Low: ${fiveDayForecastMp[day][1]}°</div>
            <div class="col">High: ${fiveDayForecastMp[day][2]}°</div>
        `;

        // Append the row to the container
        fdContainer.appendChild(row);
    }
}


function createForecastCard(forecastMp, currTime) {
  const weatherContainer = document.getElementById('forecast-container');
  // Dynamically generate cards
  for (let i = currTime; i < 24; i++) {
      let legitTime = formatTimeToAmPm(forecastMp[i][0]);
      const card = document.createElement('div');
      card.innerHTML = `
          <div class="card forecast-card">
              <div class="card-body">
                  <h5 class="card-title text-center">${legitTime[0]}</h5>
                  <div class="weather-icon text-center">
                      <img src="${forecastMp[i][2]}" class="img-fluid" alt="Weather Icon">
                  </div>
                  <p class="card-text text-center">${forecastMp[i][1]}°</p>
              </div>
          </div>
      `;
      weatherContainer.appendChild(card);
  }
}

// Function to determine if it's day or night
function isDaytime(time) {
  const date = new Date(time); // Convert to Date object
  let hours = date.getHours(); // Extract hours

  // Daytime is between 6:00 (6 AM) and 18:00 (6 PM)
  return hours >= 6 && hours < 18;
 }

 // Function to determine the background gradient based on temperature and time of day
 function getBackgroundGradient(tempF, isDay) {
  if (isDay) {
    if (tempF <= 32) { // Cold day: <= 32°F (Freezing point)
      return "linear-gradient(to top, #3b4371, #2c5364)";
    } else if (tempF <= 59) { // Cool day: 33°F to 59°F
      return "linear-gradient(to top, #56ccf2, #2f80ed)";
    } else if (tempF <= 77) { // Warm day: 60°F to 77°F
      return "linear-gradient(to top, #f2c94c, #f2994a)";
    } else { // Hot day: > 77°F
      return "linear-gradient(to top, #eb5757, #f2994a)";
    }
  } else {
    if (tempF <= 32) { // Cold night: <= 32°F
      return "linear-gradient(to top, #3d60a0, #2a5298)";
    } else if (tempF <= 59) { // Cool night: 33°F to 59°F
      return "linear-gradient(to top, #4b6cb7, #182848)";
    } else if (tempF <= 77) { // Warm night: 60°F to 77°F
      return "linear-gradient(to top, #ff758c, #ff7eb3)";
    } else { // Hot night: > 77°F
      return "linear-gradient(to top, #4e54c8, #8f94fb)";
    }
  }
}


document.getElementById('searchButton').addEventListener('click', async function() {
    let input = document.getElementById('input').value;
    let data = await getApiResponse(input); // NEED INPUT VALIDATION
    console.log(data);
    let imgSrc = getWeatherIcon(data);
    console.log(imgSrc);
    let cityName = getCityName(data);
    let currTemp = getCurrentTemperature(data);
    let tempRange = getHighLowTemp(data);
    let lowTemp = tempRange[0];
    let highTemp = tempRange[1];
    let weatherCondition = getWeatherCondition(data);
    // let windSpeed = getWindSpeed(data); --- unused, commented out
    // let humidity = getHumidity(data);
    let forecastMp = getForecast(data);
    let fdForecastMp = getFiveDayForecast(data);
    
    //console.log(getLocalTime(data));
    let localTime = Math.floor(formatTimeToAmPm(getLocalTime(data))[1]);
    //console.log(localTime);
    let daytime = isDaytime(getLocalTime(data));
    createForecastCard(forecastMp, localTime);
    document.getElementById("temp").innerText = `${currTemp}°`;
    document.getElementById("location").innerText = cityName;
    document.getElementById("condition").innerText = weatherCondition;
    document.getElementById("icon").setAttribute("src", imgSrc);
    document.getElementById("hl").innerText = `H:${highTemp}° L:${lowTemp}°`;
    const mainContainer = document.getElementById('cur-day-forecast');
    mainContainer.classList.remove('hidden');

    createFiveDayForecastCard(fdForecastMp);
    
    //let data = await getApiResponse()
    
    // // Apply the gradient to the body
    document.body.style.background = getBackgroundGradient(currTemp, daytime); //I do like the gradient!
});



