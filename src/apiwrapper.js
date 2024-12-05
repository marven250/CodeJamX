import axios from 'axios';
import {format} from 'date-fns';

async function getApiResponse(city) {
    const options = {
        method: 'GET',
        url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
        params: {
          q: city,
          days: '5'
        },
        headers: {
          'x-rapidapi-key': 'db10c21a4emsh648509239c77f8dp17137ajsn730c3e7254c2',
          'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          return response.data;
          //console.log(response.data);
      } catch (error) {
          console.error(error);
      }
}

function getHumidity(response) {
    return response.current.humidity;
}

function getWindSpeed(response) {
    return response.current.wind_mph;
}

function getWeatherCondition(response) {
    return response.current.condition.text;
}

function getCurrentTemperature(response) {
    return response.current.temp_f;
}

function getCityName(response) {
    return response.location.name;
}

function getWeatherIcon(response) {
    return response.current.condition.icon;
}

function getHighLowTemp(response) {
    let day =  response.forecast.forecastday[0].day;
    return [day.mintemp_f, day.maxtemp_f];
}

function getForecast(response) {
    let mp = {};
    let byHourForecast = response.forecast.forecastday[0].hour;
    for (let i = 0; i < 24; i++) {
        mp[i] = [byHourForecast[i].time, byHourForecast[i].temp_f, byHourForecast[i].condition.icon] 
    }
    return mp;
}

function getLocalTime(response) {
    return response.location.localtime;
}

function getFiveDayForecast(response) {
    let mp = {};
    const timeZone = 'America/New_York'
    let forecastDay = response.forecast.forecastday;
    for (let i = 0; i < 5; i++) {
        const date = new Date(`${forecastDay[i].date}T12:00:00`); // Noon to avoid timezone shift
        const dayOfWeek = format(date, 'EEEE');
        mp[i] = [dayOfWeek, forecastDay[i].day.mintemp_f, forecastDay[i].day.maxtemp_f, forecastDay[i].day.condition.icon];
    }
    return mp;
}

//humidity, wind speed, weather condition, temperature, city name, weather icon

export {getFiveDayForecast, getLocalTime, getApiResponse, getHumidity, getWindSpeed, getWeatherCondition, getCurrentTemperature, getCityName, getWeatherIcon, getForecast, getHighLowTemp};