
/* Get Geolocation of Browser */

$(document).ready(function(){

    $.ajax({
        url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyARTr-Vc9311XXIL2eZ5qq2OGZ7d72uZGE",
        type: "POST",
        dataType: 'json',
        success: function(geolocation){
          var current = geolocation.location;
          console.log(current);
          getWeather(current);
        }
    }
  );

  $("#map").hide();
  //$("#map").fadeIn(2000);

});


// Takes location input and formats location based off of input location coordinates

var getReadableLocation = function(latitude, longitude) {

    $.ajax({
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyARTr-Vc9311XXIL2eZ5qq2OGZ7d72uZGE`,

        success: function(data) {
            //console.log(data);
            var formatOptions = data.results.length;
            var readableLocation = null;
            var index = null;
            for(var i = 0; i<formatOptions; i++) {

                var typesSize = data.results[i].types.length;

                for (var j = 0; j<typesSize; j++) {
                    if (data.results[i].types[j] == "locality"){
                        index = i;
                    }
                }
            }

            if(index == null){
                readableLocation = "Cannot Find Location";
            }
            else {
                readableLocation = data.results[index].formatted_address;
                //getPlaceInformation(readableLocation);
            }

            $("h2.location-title").html(readableLocation);
            $(".title h1").html(readableLocation);
        }
    })
};

/*var getPlaceInformation = function(location){

    $.ajax({
        url: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${location}&key=AIzaSyARTr-Vc9311XXIL2eZ5qq2OGZ7d72uZGE`,
        type: "POST",
        dataType: "json",
        success: function(information){
            console.log(information);
        }
    });
};*/

/* Get geolocation of input location */

var getCoordinateLocation = function(location) {

        $.ajax({
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyARTr-Vc9311XXIL2eZ5qq2OGZ7d72uZGE`,
                success: function(data){
                getWeather(data.results[0].geometry.location);
                getReadableLocation(data.results[0].geometry.location);
            }
        }
      );
    };

/* Get weather information for location */

var getWeather = function(coordinates) {

   $.ajax({
    url: `https://api.darksky.net/forecast/c669d304655adea052bb7351ba477af0/${coordinates.lat},${coordinates.lng}`,
    jsonp: "callback",
    dataType: "jsonp",
    success: function(data){
        console.log(data);
        getReadableLocation(data.latitude, data.longitude);
        locationInfo(data.currently.time, data.timezone);
        getTime(data.currently.time, data.timezone);
        displayUpdatedDayNames(data.currently.time, data.timezone);
        getWeatherDescription(data);
        weatherInfo(data);
        weatherInfo_Week(data.daily.data);
        getWeatherIcon(data);
        displayWeekIcons(data);
    }
  }
);
};

/* Obtains date + time at current / request location */

var getTime = function(unixTimestamp, timezone) {

    var time = moment.tz(timezone).format("LT");
    var currentTime = new Date(unixTimestamp*1000);
    var numWeekday = currentTime.getDay(); // Numeric day in the week [0, 1, 2, ... , 6]
    var numMonthday = currentTime.getDate(); // Numeric day in the month [1, 2, 3, ... 30 / 31]
    var numMonth = currentTime.getMonth(); // Numeric month [0, 1, 2, 3, ... , 11 ]
    var monthName = getMonthName(numMonth) // Name of the month [January, February, ... ]
    var formattedTime = [time, numWeekday, numMonthday, monthName];
    return formattedTime;
}


/* Receives numeric month and returns month name */

var getMonthName = function(numMonth) {

    var currentMonth = null;

    switch(numMonth) {
        case 0:
            currentMonth = "January";
            break;
        case 1:
            currentMonth = "February";
            break;
        case 2:
            currentMonth = "March";
            break;
        case 3:
            currentMonth = "April";
            break;
        case 4:
            currentMonth = "May";
            break;
        case 5:
            currentMonth = "June";
            break;
        case 6:
            currentMonth = "July";
            break;
        case 7:
            currentMonth = "August";
            break;
        case 8:
            currentMonth = "September";
            break;
        case 9:
            currentMonth = "October";
            break;
        case 10:
            currentMonth = "November";
            break;
        case 11:
            currentMonth = "December";
            break;
        default:
            currentMonth = "Month";
            break;
    }
    return currentMonth;
}


/* Insert updated day names into display */

var displayUpdatedDayNames = function(unixTimestamp, timezone){

    var formattedTime = getTime(unixTimestamp, timezone);
    var date = formattedTime[2];
    var month = formattedTime[3];
    var otherdaysNames = otherDays(formattedTime[1]); // Array of updated day names beginning with today

    for(var i = 0; i<7; i++){

        var numDay = i+1;
        var stringDay = numDay.toString();
        var day = "#day" + stringDay;

        if(numDay === 1){ // Check if today in order to put current day in location-info
            $(".location-date h2").replaceWith("<h2></h2>").addClass("location-date");
            $(".location-date h2").append(otherdaysNames[i] + ", " + month + " " + date);
        }
        else{
            $(day + " h3").replaceWith("<h3></h3>");
            $(day + " h3").append(otherdaysNames[i]);
        }
    }
}

/* Converts day number to day name */

var currentDayName = function(day){

    var today = null;

    switch(day){
        case 1:
            today = "Monday";
            break;
        case 2:
            today = "Tuesday";
            break;
        case 3:
            today = "Wednesday";
            break;
        case 4:
            today = "Thursday";
            break;
        case 5:
            today = "Friday";
            break;
        case 6:
            today = "Saturday";
            break;
        case 0:
            today = "Sunday";
            break;
        //default
    }
    return today;
}

/* Obtains day names for the week */

var otherDays = function(today){

    var tomorrow = today+1;
    var day1 = currentDayName(today);
    var day2 = getNextDayName(tomorrow);
    var day3 = getNextDayName(day2[1]);
    var day4 = getNextDayName(day3[1]);
    var day5 = getNextDayName(day4[1]);
    var day6 = getNextDayName(day5[1]);
    var day7 = getNextDayName(day6[1]);
    var dayNames = [day1, day2[0], day3[0], day4[0], day5[0], day6[0], day7[0]];
    return dayNames;

}

/* Obtains day name of the inputted numeric day of the week */

var getNextDayName = function(index){

        var temp = index;
        var day = null;
        var next = null;

        // if((temp-6)<=0){
        //     if(temp===1){
        //         next = "Mon";
        //     }
        //     else if(temp === 2){
        //         next = "Tue";
        //     }
        //     else if(temp === 3){
        //         next = "Wed";
        //     }
        //     else if(temp === 4){
        //         next = "Thu";
        //     }
        //     else if(temp === 5){
        //         next = "Fri";
        //     }
        //     else if(temp === 6){
        //         next = "Sat";
        //     }
        // }
        // else{
        //     next = "Sun";
        //     temp = 0;
        // }
        // temp++;
        // var day = [next, temp];
        // return day;

        if(index>6) {
            next="Sun";
            index=0;
        }
        else if(index===1) {
            next = "Mon";
        }
        else if(index === 2) {
            next = "Tue";
        }
        else if(index === 3) {
            next = "Wed";
        }
        else if(index === 4) {
            next = "Thu";
        }
        else if(index === 5) {
            next = "Fri";
        }
        else if(index === 6) {
            next = "Sat";
        }
        index++;
        var day = [next, index];
        return day;
    }

var locationInfo = function(unixTimestamp, timezone) {
    var time = getTime(unixTimestamp, timezone);
    $(".location-time h2").html(time[0]);
};

var weatherInfo = function(weather) {
    var actualTemperature = Math.round(weather.currently.temperature);
    var feltTemperature = Math.round(weather.currently.apparentTemperature);
    var highTemp = Math.round(weather.daily.data[0].temperatureMax);
    var lowTemp = Math.round(weather.daily.data[0].temperatureMin);

    $(".actual").html("").append(actualTemperature).append('&#176;');
    $(".felt").html("Feels like:   ").append(feltTemperature).append('&#176;' + " F").css({"color": "#D3D3D3", "font-size":"12px"});
    $(".high").html("High:   ").append(highTemp).append("&#176;" + " F").css({"color": "#D3D3D3", "font-size":"12px"});
    $(".low").html("Low:   ").append(lowTemp).append("&#176;" + " F").css({"color": "#D3D3D3", "font-size":"12px"});
}

var weatherInfo_Week = function(weeklyData) {

    for(var i = 0; i<6; i++){
        var tempMax = weeklyData[i+1].temperatureMax;
        var tempMin = weeklyData[i+1].temperatureMin;

        var numDay = i+2;

        var stringNumDay = numDay.toString()
        var specificDay = "#day" + stringNumDay;
        $(specificDay + " .max-temp h4:first").replaceWith("<h4></h4>");
        $(specificDay + " .max-temp h4:first").append(Math.round(tempMax));
        $(specificDay + " .min-temp h4:first").replaceWith("<h4></h4>");
        $(specificDay + " .min-temp h4:first").append(Math.round(tempMin));
    }
}

/* Obtains weather conditions for the day */

var displayWeekIcons = function(data){

    var currentIcon = data.currently.icon;

    for(var i = 0; i<7; i++){
        var numDay = i+1;
        var stringDay = numDay.toString();
        var day = "#day" + stringDay + " .weather-icon i";

        var icon = data.daily.data[i].icon;

        if(numDay === 1){
            $(".today .weather-icon i").replaceWith("<i></i>");
            $(".today .weather-icon i").addClass(getWeatherIcon(currentIcon));;
        }
        else {
            $(day).replaceWith("<i></i>");
            $(day).addClass(getWeatherIcon(icon));
        }
    }
}

/* Associates weather conditions with weather icons */

var getWeatherIcon = function(icon) {

    var answer = null;
    switch(icon){
        case "clear-day":
            answer = "wi wi-day-sunny";
            break;
        case "clear-night":
            answer = "wi wi-night-clear";
            break;
        case "rain":
            answer = "wi wi-showers";
            break;
        case "snow":
            answer = "wi wi-snow";
            break;
        case "sleet":
            answer = "wi wi-sleet";
            break;
        case "wind":
            answer = "wi wi-strong-wind";
            break;
        case "fog":
            answer = "wi wi-fog";
            break;
        case "cloudy":
            answer = "wi wi-cloudy";
            break;
        case "partly-cloudy-day":
            answer = "wi wi-day-cloudy";
            break;
        case "partly-cloudy-night":
            answer = "wi wi-night-cloudy";
            break;
    }
    return answer;
}

var getWeatherDescription= function(data) {
    var weatherDescription = data.currently.summary;
    $(".weather-description").html(weatherDescription);
}

// Get User Input from Search Bar

$("#search-bar").keypress(function(event) {

    if(event.which == 13)  {
        var location = document.getElementById("search-bar").value;
        getCoordinateLocation(location);
    }
});


// $("#map-button").click(function(){
//     {
//         var uluru = {lat: -25.363, lng: 131.044};
//         var map = new google.maps.Map(document.getElementById('map'), {
//           zoom: 4,
//           center: uluru
//         });
//         var marker = new google.maps.Marker({
//           position: uluru,
//           map: map
//         });
//       }
// })



   // function initMap()
