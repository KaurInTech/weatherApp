
function currentTime(){
    let date = new Date();
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
function displayForecast(response){
    let forecast = response.data.daily;
    let forecastElement = document.querySelector("#forecast");
    let forecastHTML = `<div class="row">`;
    forecast.forEach(function(forecastDay,index){
        if(index<6){
        forecastHTML =
            forecastHTML +          
             `
                <div class="col-2">
                    <div class="weather-forecast-date">
                      ${formatDay(forecastDay.dt)}
                    </div>
                 
                    <img 
                    src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
                    alt=""
                    width="48"
                    />
                    <div class = "weather-forecast-temperature">
                        <span class="weather-forecast-temperature-max">
                            ${Math.round(forecastDay.temp.max)}°
                        </span>
                        <span class="weather-forecast-temperature-min">
                            ${Math.round(forecastDay.temp.min)}°
                        </span>
                
                    </div>
                </div>`;
        }
            })
       forecastHTML = forecastHTML + `</div>`;
       forecastElement.innerHTML = forecastHTML;
}
function FahrenheitConverter(event){
    event.preventDefault();
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
    document.querySelector("#temperature").innerHTML= Math.round((temperature * 9/5) + 32);
 
}

function CelsiusConverter(event){
    event.preventDefault();
    fahrenheitLink.classList.remove("active");
    celsiusLink.classList.add("active");
    document.querySelector("#temperature").innerHTML= Math.round(temperature);
}



function getForecast(coordinates){
    let apiKey = "c911bf11699711a19a083229ee0112ca";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    console.log(apiUrl);
    axios.get(apiUrl).then(displayForecast);
}



function displayWeatherCondition(response) {
    document.querySelector("#city").innerHTML = response.data.name; 
    document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
    temperature = response.data.main.temp;
    document.querySelector("#description").innerHTML = response.data.weather[0].description;
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
    document.querySelector("#icon").setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
    document.querySelector("#icon").setAttribute("alt",response.data.weather[0].description);
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
}

function showPosition(position){ 
    let apiKey = "c911bf11699711a19a083229ee0112ca";
    let city = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
    axios.get(city).then(displayWeatherCondition);
}

function getCurrentPosition(){
    navigator.geolocation.getCurrentPosition(showPosition);
}

document.querySelector("#time-format").innerHTML = currentTime();
getCurrentPosition();

let temperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit",handleSubmit);
let button = document.querySelector("#current");
button.addEventListener("click",getCurrentPosition);


let fahrenheitLink = document.querySelector("#fahrenheit-link");//LINKINKG TO HTML TO GET ACCESS
fahrenheitLink.addEventListener("click",FahrenheitConverter);//PERFORM THIS FUNCTION AFTER CLICKING

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click",CelsiusConverter);