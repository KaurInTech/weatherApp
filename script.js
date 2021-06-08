
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


function convertingF(event){
    event.preventDefault();
    let temp = document.querySelector("#temp");
    temp.innerHTML=64;
}

function convertingC(event){
    event.preventDefault();
    let temp = document.querySelector("#temp");
    temp.innerHTML= 14;
}

function displayWeatherCondition(response) {
    document.querySelector("#city").innerHTML = response.data.name; 
    document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
    document.querySelector("#description").innerHTML = response.data.weather[0].description;
    document.querySelector("#humidity").innerHTML = response.data.main.humidity;
    document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
    document.querySelector("#icon").setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
    document.querySelector("#icon").setAttribute("alt",response.data.weather[0].description);
    console.log(response.data.wind.speed);
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

let form = document.querySelector("#search-form");
form.addEventListener("submit",handleSubmit);
let button = document.querySelector("#current");
button.addEventListener("click",getCurrentPosition);


let fahrenheitLink = document.querySelector("#fahrenheit-link");//LINKINKG TO HTML TO GET ACCESS
fahrenheitLink.addEventListener("click",convertingF);//PERFORM THIS FUNCTION AFTER CLICKING

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click",convertingC);