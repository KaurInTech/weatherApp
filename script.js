
function formatDate(timestamp){
    let date = new Date(timestamp);
    let days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday","Friday","Saturday"];
    let day = days[date.getDay()];
    let hour = date.getHours();
    if (hour<10){
        hour = `0${hour}`;
    }
    let minutes = date.getMinutes();
    if (minutes<10){
        minutes = `0${minutes}`;
    }
    let ampm =  hour >= 12 ? 'p.m.' : 'a.m.';
    return `${day},${hour}:${minutes} ${ampm}`
}
function formatDay(timestamp){
    let date = new Date(timestamp*1000);
    let day = date.getDay();
    let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return days[day];

}
function formatHours(timestamp){
    let date = new Date(timestamp*1000);
    let hour = date.getHours();
    let ampm =  hour >= 12 ? ` p.m.` : ` a.m.`;
    if(hour>12){
        hour=hour%12;
    }
    if(hour==0){hour=12;}
    return `${hour}${ampm}`;

}

function displayHourlyForecast(type){
    let forecastHourlyHTML = `<div class="row">                        `;
    let forecastHourlyElement = document.querySelector("#types");
    
    for(let i=0; i<hourlyTemp.length;i++){
        if(i%3==0 && i<18){
          
                if(type=="temp"){
                     forecastHourlyHTML  =
                         forecastHourlyHTML + 
                             `<div class="col-2" >
                                     <div id="hourlyTemp${i}">
                             ${Math.round(hourlyTemp[i])}°`
                }else if(type=="wind"){
                     forecastHourlyHTML  =
                         forecastHourlyHTML + 
                             `<div class="col-2">
                                     <div>
                             ${Math.round(hourlyWind[i])}m/s`
                }else {
                     forecastHourlyHTML  =
                         forecastHourlyHTML + 
                             `<div class="col-2">
                                     <div>
                             ${Math.round(hourlyPrecipitation[i])}°`
                }
            forecastHourlyHTML  = forecastHourlyHTML + 
            `
                </div>
                 <div>
                    |
                </div>
                <div>
                ${formatHours(time[i])}
                </div>
              </div>`
        }
    }
    forecastHourlyHTML  =  forecastHourlyHTML + `</div>`;
    forecastHourlyElement.innerHTML = forecastHourlyHTML;
}

function hourlyForecast(response){
    let forecastHourly = response.data.hourly;
    
     forecastHourly.forEach(function(forecastHour,index){
        hourlyWind.push((forecastHourly[index].wind_speed));
        hourlyTemp.push((forecastHourly[index].temp));
        time.push((forecastHourly[index].dt));
        console.log(formatHours(time[index]));
    })
    displayHourlyForecast("temp");
}

function displayForecast(response){
    console.log(response.data);
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div class="row">`;
    forecast.forEach(function(forecastDay,index){
        if(index<6){
        forecastHTML =
            forecastHTML +          
             `
                <div class="col-2">
                    <button class="forecast-Buttons">
                    <div class="weather-forecast-date">
                      ${formatDay(forecastDay.dt)}
                    </div>
                 
                    <img 
                    src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
                    alt=""
                    width="48"
                    />
                    <div class = "weather-forecast-temperature">
                        <span class="weather-forecast-temperature-max" id="maxTemp${index}">
                            ${Math.round(forecastDay.temp.max)}
                        </span>°
                        <span class="weather-forecast-temperature-min" id="minTemp${index}">
                            ${Math.round(forecastDay.temp.min)}
                        </span>°
                
                    </div>
                    </button>
                </div>`;
                forecastTempMin.push (forecastDay.temp.min);
                forecastTempMax.push(forecastDay.temp.max);
        }
            })
       forecastHTML = forecastHTML + `</div>`;
       forecastElement.innerHTML = forecastHTML;
       hourlyForecast(response);
}


function FahrenheitConverter(event){
    event.preventDefault();
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    document.querySelector("#temperature").innerHTML= Math.round((temperature * 9/5) + 32);
    for(let i=0;i<6;i++){
    document.querySelector("#maxTemp"+i).innerHTML= Math.round((forecastTempMax[i] *9/5)+32);
    document.querySelector("#minTemp"+i).innerHTML= Math.round((forecastTempMin[i]*9/5)+32);
    }
    for(let i=0;i<hourlyTemp.length;i++){
                if(i%3==0 && i<18){
            document.querySelector("#hourlyTemp"+i).innerHTML= Math.round((hourlyTemp[i] *9/5)+32)+`°`;
        }
    }
}

function CelsiusConverter(event){
    event.preventDefault();
    fahrenheitLink.classList.remove("active");
    celsiusLink.classList.add("active");
    for(let i=0;i<6;i++){
    document.querySelector("#temperature").innerHTML= Math.round(temperature);
    document.querySelector("#maxTemp"+i).innerHTML= Math.round(forecastTempMax[i]);
    document.querySelector("#minTemp"+i).innerHTML= Math.round(forecastTempMin[i]);
    }
     for(let i=0;i<hourlyTemp.length;i++){
                if(i%3==0 && i<18){
            document.querySelector("#hourlyTemp"+i).innerHTML= Math.round(hourlyTemp[i])+`°`;
        }
    }

}

function temperatureInfo(event){
    event.preventDefault();
    windButton.classList.remove("active");
    temperatureButton.classList.add("active");
    displayHourlyForecast("temp");

}
function windInfo(event){
    event.preventDefault();
    temperatureButton.classList.remove("active");
    windButton.classList.add("active");
    displayHourlyForecast("wind");
}

function precipitationInfo(){

}

function getForecast(coordinates){
    let apiKey = "c911bf11699711a19a083229ee0112ca";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    console.log(apiUrl);
    axios.get(apiUrl).then(displayForecast);
}



function displayWeatherCondition(response) {
    console.log(response.data);
    document.querySelector("#city").innerHTML = response.data.name; 
    document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
    temperature = response.data.main.temp;
    document.querySelector("#description").innerHTML = response.data.weather[0].description;
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
    document.querySelector("#icon").setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
    document.querySelector("#icon").setAttribute("alt",response.data.weather[0].description);
    document.querySelector("#time-format").innerHTML = formatDate(response.data.dt * 1000);
    console.log(response.data.coord.lat);
    getForecast(response.data.coord);
}

function search(city){
    let apiKey = "c911bf11699711a19a083229ee0112ca";
    let units = "metric";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event){
    event.preventDefault();//preventing from refreshing
    let city = document.querySelector("#search-text-input").value;
    search(city);   
    document.querySelector("#search-text-input").value = "";
}

function showPosition(position){ 
    let apiKey = "c911bf11699711a19a083229ee0112ca";
    let city = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
    axios.get(city).then(displayWeatherCondition);
}

function getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(showPosition);
}


let temperature = null;
let forecastTempMin = [];
let forecastTempMax = [];
let hourlyWind =[];
let hourlyTemp=[];
let hourlyPrecipitation = [];
let time = [];

let form = document.querySelector("#search-form");
form.addEventListener("submit",handleSubmit);
let button = document.querySelector("#current");
button.addEventListener("click",getCurrentPosition);


let fahrenheitLink = document.querySelector("#fahrenheit-link");//LINKINKG TO HTML TO GET ACCESS
fahrenheitLink.addEventListener("click",FahrenheitConverter);//PERFORM THIS FUNCTION AFTER CLICKING

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click",CelsiusConverter);

let temperatureButton = document.querySelector("#temperature-button");
temperatureButton.addEventListener("click",temperatureInfo);

let precipitationButton = document.querySelector("#precipitation-button");
precipitationButton.addEventListener("click",precipitationInfo);

let windButton = document.querySelector("#wind-button");
windButton.addEventListener("click",windInfo);
search("Surrey");