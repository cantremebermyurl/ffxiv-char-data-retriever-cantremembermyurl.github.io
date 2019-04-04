//openweathermap api
function getWeather(city){
  $.getJSON(
    "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",us&APPID=2df45a75e1b2ded6721a5c074a1142c4&units=imperial",
    function(data){
      var icon =
        "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
      var temp = data.main.temp;
      var weather = data.weather[0].main + " (" + data.weather[0].description + ")";

      $(".icon").attr("src", icon);
      $(".weather").append(weather);
      $(".temp").append(temp)
    }
  );
}
//xivapi lodestone search
var searchAPIFinished = false;
var tempObj;
var serverName = "Goblin";
function search(){
  var e = document.getElementById("serverList");
  serverName = e.options[e.selectedIndex].value;
    console.log("=> grab serverName("+serverName+") from serverList successful");
    $(".searchingText").text("Searching");
  characterName = document.getElementById("searchField").value;
    console.log("=> grab char name("+characterName+") from searchField successful");
  searchAPIFinished = false;
  $.getJSON(
    "https://xivapi.com/character/search?name="+ characterName+"&server="+serverName)
    .then(function(data){
      try {
        searchAPIFinished = true;
          $(".searchingText").append(".");
          console.log("=> search api came up with: "+data.Results[0].Name);
        tempObj = data.Results[0];
        charID = tempObj.ID;
          //console.log("=> charID is now: " + charID);
          console.log("=> search() calling getCharData("+charID+");");
        getCharData(charID);
      } catch (e) {
        $(".searchingText").text("Search failed! Did you put in the correct Character Name and Server?");
      }
    })
}

var charID = 0;
//xivapi /Character data
function getCharData(ID){
    //console.log("=> getCharData() loaded");
  var currentJobID = 0;
    //console.log("=> pulling character api for: " + ID);
  var url = "https://xivapi.com/Character/" + ID;
  $.getJSON(url)
    .then(function(data){
      try {
        var name = data.Character.Name;
          //console.log("=> char api successfully loaded: " + name);
          $(".searchingText").append(".");
        var portrait = data.Character.Portrait;

        var server = data.Character.Server;
        currentJobID += data.Character.ActiveClassJob.ClassID;
          //console.log("=> currentJobID("+currentJobID+")");
        var currentLvl = data.Character.ActiveClassJob.Level;

        $(".portrait").attr("src", portrait);
        var lodestone = "https://na.finalfantasyxiv.com/lodestone/character/" + ID + "/";
        $(".portraitURL").attr("href", lodestone);
        $(".name").text(name);
        $(".server").text(server);
        $(".lvl").text("Lv. "+currentLvl);
          console.log("=> getCharData() calling getJobData(), getEquipment()");
        getJobData(currentJobID);
        getEquipment(url);
      } catch (e) {
        $(".searchingText").text("Something went wrong! Please try again.");
      }
    })

}

//xivapi /ClassJob using data from /Character
function getJobData(jobData){
    //console.log("=> getJobData("+jobData+") loaded");
  $.getJSON(
    "https://xivapi.com/ClassJob/" + jobData)
    .then(function(data){
        $(".searchingText").append(".");
      var job = data.Name;
        //console.log("=> get API /ClassJob/"+jobData+" successful, job("+job+")");
      var jobIcoURL = "https://xivapi.com" + data.Icon;
      $(".job").text(" "+job);
      $(".jobIcon").attr("src", jobIcoURL);
        $(".searchingText").text("");
    })
}

function populateServerList(){
  //populate dropdown menu with xivapi.com/servers json list
  //https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json <= base code
  $("#serverList").append("<option selected=\"true\" disabled>Choose server</option>");
  $("#serverList").prop("selectedIndex", 0);
  var url = "https://xivapi.com/servers/dc";
  $("#serverList").append($("<option></option>").attr("value", "TestValue").text("TestText"));
  // Populate dropdown with list of provinces
  $.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
      $("#serverList").append($("<option></option>").attr("value", "").text("---"+key+"---"));
      $.each(entry, function (key, server){
        $("#serverList").append($("<option></option>").attr("value", server).text(server));
      })
    })
  });
  //set default server displayed to Goblin
  $("#serverList").attr("selected", "Goblin");
}

//populate #equipment list
function getEquipment(url){
  //console.log("=> getEquipment("+url+")");
  $(".leftColumn").empty();
  $(".rightColumn").empty();
  var obj;
  $.getJSON(url,
  function (data) {
    obj = data.Character.GearSet.Gear;
    //console.log(obj);
    var gearName;
    var gearIcon;
    var n = 0;
    $.each(obj, function (key, entry) {
      //console.log(entry.ID);
      $.getJSON("https://xivapi.com/item/"+entry.ID)
      .then(function(data){
        gearName = data.Name;
        //console.log("Name:"+gearName);
        gearIcon = data.Icon;
        //console.log("Icon:"+gearIcon);
        if (n < 7) {
          $(".leftColumn").append($("<p class=\"equipmentL\">"+gearName+"     <img src=\"https://xivapi.com"+gearIcon+"\" alt=\""+gearName+"\" style=\"width:32px;height:32px;\"></p>"));
          n++;
        }else {
          $(".rightColumn").append($("<p class=\"equipmentR\"><img src=\"https://xivapi.com"+gearIcon+"\" alt=\""+gearName+"\" style=\"width:32px;height:32px;\">     "+gearName+"</p>"));
        }
      });
    })
  });
}
