var city = "Alameda";
$.getJSON(
  "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&APPID=2df45a75e1b2ded6721a5c074a1142c4&units=imperial",
  function(data){
    console.log(data);

    var icon =
      "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var temp = data.main.temp;
    var weather = data.weather[0].main + " (" + data.weather[0].description + ")";

    $(".icon").attr("src", icon);
    $(".weather").append(weather);
    $(".temp").append(temp)
  }
);
