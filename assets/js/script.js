// variables
var searchButton = $(".searchButton");
var apiKey = "b8ecb570e32c2e5042581abd004b71bb";

// for loop for adding data to HTML page

for (var i = 0; i < localStorage.length; i++) {

    var city = localStorage.getItem(i);
    
    var cityName = $(".list-group").addClass("list-group-item");

    cityName.append("<li>" + city + "</li>");

}
// key count for local storage
var keyCount = 0;
// search button click event
searchButton.click(function(){

    var searchInput = $(".searchInput").val();

    //Variable for current weather working
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
    // Variable for 5 dy forecast working
    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

    if (searchInput == ""){
        console.log(searchInput);
    }else{
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function(response){
            //list group append an li w/ set text
            //console.log (response.name)
            var cityName = $("list-group").addClass("list-group-item");
            cityName.append("<li>" + response.Name + "</li>");
            // local storage
            var local = localStorage.setItem(keyCount, response.name);
            keyCount = keyCount + 1;

            // Start current Weather Append
            var currentCard = $(".currentCard").append("<div>").addClass("card-body");
            currentCard.empty();
            var currentName = currentCard.append("<p>");
            // addClass("card-text")
            currentCard.append(currentName);

            // date adjust
            var timeUTC = new Date(response.dt *1000);
            currentName.append(response.name + " " + timeUTC.toLocaleDateString("en-US"));
            currentName.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">`);
            // Add temp
            var currentTemp = currentName.append("<p>");
            currentName.append(currentTemp);
            currentTemp.append("<p>" + "Temperature: " + response.main.temp + "<p>");
            // add humidity 
            currentTemp.append("<p>" + "Humidity: " + response.main.humidity + "%" + "<p>");
            // add wind speed
            currentTemp.append("<p>" + "Wind Speed: " + response.wind.speed + "<p>");

            // Uv Index URL
            var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${response.coord.lat}&lon=${response.coord.lon}`;


            // UV index
            $.ajax({
                url: urlUV,
                method: "GET"
            }).then(function(response){

                var currentUV = currentTemp.append("<span>" + "UV Index: " + response.value + "<span>").addClass("card-text");
                
                currentUV.addClass("UV");
                currentTemp.append(currentUV);

            });
        
        });
        

        // start call for 5 day forecast
        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function(response){
            // array for 5-days
            var day = [0, 8, 16, 24, 32];
            var fiveDayCard = $(".fiveDayCard").addClass("card-body")
            var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
            fiveDayDiv.empty();
            // For each for 5 Days
            day.forEach(function(i) {
                var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US");

                fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + response.list[i].main.temp + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "<p>" + "Wind Speed: " + response.list[i].wind.speed + "<p>" + "</div>");



            })
        });

    }


});