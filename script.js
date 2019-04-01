//openweathermap api
var city = "Alameda";
$.getJSON(
  "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&APPID=2df45a75e1b2ded6721a5c074a1142c4&units=imperial",
  function(data){
    /*console.log(data);*/

    var icon =
      "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
    var temp = data.main.temp;
    var weather = data.weather[0].main + " (" + data.weather[0].description + ")";

    $(".icon").attr("src", icon);
    $(".weather").append(weather);
    $(".temp").append(temp)
  }
);

var baseURL = "https://xivapi.com";
//xivapi /Character data
var currentJobID = -1;
var charID = 21374013;
$.getJSON(
  "https://xivapi.com/Character/" + charID,
  function(data){
    /*console.log(data);*/

    var portrait = data.Character.Portrait;
    var name = data.Character.Name;
    var server = data.Character.Server;
    currentJobID += data.Character.ActiveClassJob.ClassID;
    //console.log(currentJobID);
    var currentLvl = data.Character.ActiveClassJob.Level;

    $(".portrait").attr("src", portrait);
    var lodestone = "https://na.finalfantasyxiv.com/lodestone/character/" + charID + "/";
    $(".portraitURL").attr("href", lodestone);
    $(".name").append(name);
    $(".server").append(server);
    $(".lvl").append(currentLvl);

  }
);
//xivapi /ClassJob using data from /Character
$.getJSON(
  "https://xivapi.com/ClassJob",
  function(data){
    var obj = data.Results[currentJobID]
    //console.log(obj.Name);
    //console.log(baseURL + obj.Icon);
    var job = obj.Name;
    var jobIcoURL = baseURL + obj.Icon;
    //console.log(job);
    //console.log(jobIcoURL);
    $(".job").append(job);
    $(".jobIcon").attr("src", jobIcoURL);
  }
);
