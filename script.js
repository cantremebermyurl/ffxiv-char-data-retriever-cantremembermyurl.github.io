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
var tempObj;
function search(){
  var e = document.getElementById("serverList");
  serverName = e.options[e.selectedIndex].value;
    $(".searchingText").text("Searching");
  characterName = document.getElementById("searchField").value;
  try {
    $.getJSON("https://xivapi.com/character/search?name="+ characterName+"&server="+serverName)
    .success(function(data){
      try {
          $(".searchingText").append(".");
        tempObj = data.Results[0];
        charID = tempObj.ID;
        getCharData(charID);
      } catch (e) {
        $(".searchingText").text("Search failed! Did you put in the correct Character Name and Server?");
      }
    })
    .error(function() {
      $(".searchingText").text("Search failed! XIVAPI Service Error");
    })
  } catch (e) {
    console.log("!!! something went wrong: "+e);
  }
}

var charID = 0;
//xivapi /Character data
function getCharData(ID){
  var currentJobID = 0;
  var url = "https://xivapi.com/Character/" + ID;
  $.getJSON(url)
    .then(function(data){
      try {
        var name = data.Character.Name;
          $(".searchingText").append(".");
        var portrait = data.Character.Portrait;

        var server = data.Character.Server;
        currentJobID += data.Character.ActiveClassJob.JobID;
        var currentLvl = data.Character.ActiveClassJob.Level;

        $(".portraitImg").attr("src", portrait);
        var lodestone = "https://na.finalfantasyxiv.com/lodestone/character/" + ID + "/";
        $(".portraitURL").attr("href", lodestone);
        $(".name").text(name);
        $(".server").text(server);
        $(".lvl").text("Lv. "+currentLvl);
        getJobData(currentJobID);
        getEquipment(url);
      } catch (e) {
        $(".searchingText").text("Something went wrong! Please try again.");
      }
    })

}

//xivapi /ClassJob using data from /Character
function getJobData(jobData){
  $.getJSON(
    "https://xivapi.com/ClassJob/" + jobData)
    .then(function(data){
        $(".searchingText").append(".");
      var jobEN = data.NameEnglish;
      var job = data.Name;
      $(".job").text(" "+jobEN);
      $(".jobIcon").attr("src", "https://xivapi.com/cj/companion/"+ job +".png");
        $(".searchingText").text("");
    })
}

function populateServerList(){
  //populate dropdown menu with xivapi.com/servers json list
  //https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json <= base code
  $("#serverList").append("<option selected=\"true\" disabled>Choose server</option>");
  $("#serverList").prop("selectedIndex", 0);
  var url = "https://xivapi.com/servers/dc";
  // Populate dropdown with list of datacenters and servers
  $.getJSON(url, function (data) {
    $.each(data, function (key, entry) {
      $("#serverList").append($("<option></option>").attr("value", "").text("---"+key+" Datacenter---"));
      $.each(entry, function (key, server){
        $("#serverList").append($("<option></option>").attr("value", server).text(server));
      })
    })
  });
}

//populate #equipment list
function getEquipment(url){
  $(".leftEquipment").empty();
  $(".leftItemIcon").empty();
  $(".rightEquipment").empty();
  $(".rightItemIcon").empty();
  var obj;
  $.getJSON(url,
  function (data) {
    obj = data.Character.GearSet.Gear;
    var n = 1;
    $.each(obj, function (key, entry) {
      setTimeout(function (){
        $.getJSON("https://xivapi.com/item/"+entry.ID,
        function(item){
          gearName = item.Name;
          gearIcon = item.Icon;
          gearUI_PNG = item.ItemUICategory.Icon;
          gearUI_Name = item.ItemUICategory.Name;
          gearUI_ID = item.ItemUICategory.ID;
          n += gearUI_ID;
          try {
            if (0 < gearUI_ID && gearUI_ID < 11 || 33 < gearUI_ID && gearUI_ID < 40) {
              $(".leftEquipment").append($("<p class=\"equipmentL"+gearUI_ID+"\">"+gearName+" <img src=\"https://xivapi.com"+gearIcon+"\" alt=\""+gearName+"\" style=\"width:32px;height:32px;\"></p>"));
              $(".leftItemIcon").append("<p class =\"itemIconL"+gearUI_ID+"\">"+gearUI_Name+" <img src=https://xivapi.com"+gearUI_PNG+">"+gearUI_ID+"</p>");
            }else {
              $(".rightEquipment").append($("<p class=\"equipmentR"+gearUI_ID+"\"><img src=\"https://xivapi.com"+gearIcon+"\" alt=\""+gearName+"\" style=\"width:32px;height:32px;\"> "+gearName+"</p>"));
              $(".rightItemIcon").append("<p class =\"itemIconR"+gearUI_ID+"\">"+gearUI_ID+"<img src=https://xivapi.com"+gearUI_PNG+"> "+gearUI_Name+"</p>");
            }
          } catch (e) {
            if (n % 2 == 1) {
              $(".leftEquipment").append($("<p class=\"equipmentL\">API call failed     <img src=\"https://xivapi.com/img-misc/lodestone/status.png\" style=\"width:32px;height:32px;\"></p>"));
            }else {
              $(".rightEquipment").append($("<p class=\"equipmentR\"><img src=\"https://xivapi.com/img-misc/lodestone/status.png\" style=\"width:32px;height:32px;\">     API call failed</p>"));
            }
          }
        });
      }, 500*n);
      n++;
    })
  });
}
