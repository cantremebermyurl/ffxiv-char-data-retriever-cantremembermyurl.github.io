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

//xivapi lodestone search
var serverName = "Coeurl";
var tempObj;
function search(){
  characterName = document.getElementById("searchField").value;
  console.log("=> grab char name("+characterName+") from searchField successful");
  lodestoneSearch();
}
function lodestoneSearch(){
  console.log("=> running lodestoneSearch()");
  $.getJSON(
    "https://xivapi.com/character/search?name=Bread Mage"+ characterName,
    function(data){
      console.log("=> search successful: "+data);
      tempObj = data.Results[0];
      console.log(tempObj.ID);
      charID = tempObj.ID;
    })
    console.log("=> lodestoneSearch() calling loadXIV()");
    loadXIV();
}

function loadXIV(){
console.log("=> running loadXIV()");
//xivapi /Character data
var currentJobID = -1;
var charID = 21374012;
$.getJSON(
  "https://xivapi.com/Character/" + charID,
  function(data){

    var portrait = data.Character.Portrait;
    var name = data.Character.Name;
    var server = data.Character.Server;
    currentJobID += data.Character.ActiveClassJob.ClassID;
    console.log("=> currentJobID get"+currentJobID);
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
var obj;
$.getJSON(
  "https://xivapi.com/ClassJob",
  function(data){
    console.log("=> data.results[] get"+data.Results[currentJobID]);
    console.log("=> obj.Name get"+obj.Name);
    var obj = data.Results[currentJobID]
    var job = obj.Name;
    var jobIcoURL = "https://xivapi.com" + obj.Icon;
    $(".job").append(job);
    $(".jobIcon").attr("src", jobIcoURL);
  }
);
}
