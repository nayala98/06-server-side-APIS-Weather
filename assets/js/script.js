var cityList =$("#city-list");
var cities = [];
console.log(cities);

//Calling function init();
init();

//Function init(), get stored cities from localStorage, parsing the JSON string to an object
function init(){
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCities !== null) {
        cities = storedCities;
    }
    // Render cities to the DOM
    renderCities();
}

//Function StoreCities(), Stringify and set "cities" key in localStorage to cities array
function storeCities(){
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(localStorage);
}

//Function renderCities()
function renderCities() {
    // Clear cityList element
    cityList.empty();
    // Render a new li for each city
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var li = $("<li>").text(city);
        li.attr("id","listC");
        li.attr("data-city", city);
        li.attr("class", "list-group-item");
        console.log(li);
        cityList.append(li);
    }
}

//When form is submitted it will grab the city from the input box then add city-input to city array
$("#add-city").on("click", function(event){
    event.preventDefault();
    var city = $("#city-input").val().trim();
    // Return from function early if submitted city is blank
    if (city === "") {
        return;
    }
    cities.push(city);
    console.log(cities);
    console.log(city);
    // Store updated cities in localStorage, re-render the list
    storeCities();
    renderCities();
});