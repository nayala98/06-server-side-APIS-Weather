var currentCity = '';
var citySearchInput = document.getElementById('city-input');
var inputButton = document.getElementById("search-button");

var getWeather = function() {
    var apiKey = "eb848b2179be8e550ab0dfce863a3308";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ currentCity +"&appid=" + apiKey + "&units=imperial";
    
    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            
            var coords = data.coord;
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&exclude=hourly,minutely,alerts&appid=${apiKey}&units=imperial`)
            .then(function(response) {
                return response.json();
            }).then(function(uvData) {
                console.log(uvData);

                var today = new Date(data.dt * 1000).toLocaleDateString('en-US');
                
                // Set City Title
                document.getElementById('cityTitle').textContent = currentCity + " " + today;
                document.getElementById('weatherIcon').src = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

                // Set Temp/Wind/Humidity
                document.getElementById("temp").textContent = "Temp: " + Math.round(data.main["temp"]) + "°F";
                document.getElementById("wind").textContent = "Wind: " + Math.round(data.wind.speed) + " MPH";
                document.getElementById("humidity").textContent = "Humidity: " + Math.round(data.main.humidity) + " %";
                
                // Set UV index
                var uvi = uvData.current.uvi;
                document.getElementById("uv").textContent = "UV Index: ";
                document.getElementById("uv-icon").textContent = uvi;
                // get uvi type
                var uviClass = '';
                if (uvi <= 2) {
                    uviClass = 'favorable-uvi';
                } else if (uvi > 2 && uvi <= 7) {
                    uviClass = 'moderate-uvi';
                } else {
                    uviClass = 'severe-uvi';
                }
                
                document.getElementById("uv-icon").setAttribute('class', "badge "+ uviClass);

                fiveDayWeather(uvData);
            });

            
        });
}

var fiveDayWeather = function(data) {
    console.log('daily weather: ', data);
    console.log('five day weather: ', data.daily);
    var days = data.daily;

    var list = document.getElementById("5-day-forecast");
        if (list.hasChildNodes()) {
            const list = document.getElementById('5-day-forecast');
            list.innerHTML = '';
        }

    for(var i = 1; i < 6; i++) {
        
        var daysDate = new Date(days[i].dt * 1000).toLocaleDateString('en-US');
        var dayObject = {
            date: daysDate,
            icon: days[i].weather[0].icon,
            temp: days[i].temp.day,
            wind: days[i].wind_speed,
            humidity: days[i].humidity
        };
        console.log(dayObject);

        // display day
        var dayDivElement = document.createElement('div');
        dayDivElement.setAttribute('class', 'card day-card col');

        var dateDiv = document.createElement('div');
        dateDiv.setAttribute('class', 'date');
        var iconDiv = document.createElement('div');
        var iconImg = document.createElement('img');
        var tempDiv = document.createElement('div');
        tempDiv.setAttribute('class', 'card-div');
        var windDiv = document.createElement('div');
        windDiv.setAttribute('class', 'card-div');
        var humidityDiv = document.createElement('div');
        humidityDiv.setAttribute('class', 'card-div');

        // divs for Day Div info
        dateDiv.textContent = dayObject.date;
        iconImg.src = "http://openweathermap.org/img/w/" + dayObject.icon + ".png";
        tempDiv.textContent = "Temp: " + Math.round(JSON.stringify(dayObject.temp)) + "°F";
        windDiv.textContent = "Wind: " + JSON.stringify(dayObject.wind) + " MPH";
        humidityDiv.textContent = "Humidity: " + JSON.stringify(dayObject.humidity) + "%";

        // append divs to day div
        dayDivElement.appendChild(dateDiv);
        dayDivElement.appendChild(iconDiv);
        iconDiv.appendChild(iconImg);
        dayDivElement.appendChild(tempDiv);
        dayDivElement.appendChild(windDiv);
        dayDivElement.appendChild(humidityDiv);

        // parentDiv.appendChild(dayDivElement);
        list.appendChild(dayDivElement);
    }
}

var onSearch = function() {
    currentCity = citySearchInput.value;
    console.log('city ', currentCity);

    getWeather();
    addCityToHistory();
}

var previousSearch = function(event) {
    console.log('previous serach: ', event);
    console.log('event target', event.target.textContent);
    currentCity = event.target.textContent;
    getWeather();
}


var addCityToHistory = function() {
    var historyList = [];
    var valueString = localStorage.getItem('name');
    if (valueString !== null) {
        historyList = JSON.parse(localStorage.getItem('name'));
    }
    historyList.push(currentCity);
    localStorage.setItem('name', JSON.stringify(historyList));

    var cityUl = document.getElementById('history-list');
    var cityListLi = document.createElement('li');
    cityListLi.textContent = currentCity;
    cityListLi.setAttribute('class', 'history-list-li');
    cityListLi.setAttribute('id', currentCity);
    cityListLi.onclick = function(event) {
        previousSearch(event);
    }
    cityUl.appendChild(cityListLi);
}

var callCityHistory = function() {
    var cityList = JSON.parse(localStorage.getItem('name'));
    var cityUl = document.getElementById('history-list');
    console.log('new log', cityList);

    if (cityList !== null) {
        for (var i = 0; i <cityList.length; i++) {
            var cityListLi = document.createElement('li');
            cityListLi.textContent = cityList[i];
            cityListLi.setAttribute('class', 'history-list-li');
            cityListLi.onclick = function(event) {
                previousSearch(event);
            }

            cityUl.appendChild(cityListLi);
        }
    }
    }


inputButton.onclick = onSearch;
callCityHistory();