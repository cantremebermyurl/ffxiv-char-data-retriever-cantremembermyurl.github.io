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
var loading = false;
var count = 3;
var wait = 0;
var queue = false;
function waitAnimation(){
  setTimeout(function(){
    if (loading) {
      if (count < 3) {
        $(".searchingText").append(".");
        count++;
      }
      else {
        $(".searchingText").text("loading");
        count = 0;
        if (wait == 0) {
          wait = 1000;
        }
      }
      waitAnimation();
    } else {
      $(".searchingText").text("");
      count = 3;
      wait = 0;
    }
  }, wait);
}
var characterName;
var serverName;
function startSearch(){
  if (!queue) {
    serverName = document.getElementById("serverList");
    serverName = serverName.options[serverName.selectedIndex].value;
    characterName = document.getElementById("searchField").value;
    queueSearch();
    $(".loadingGif").attr("style", "visibility:visible");
    $("#searchButton").attr("value", "Your search is queued please wait!");
    queue = true;
  }
  else if (queue) {
    $(".errorText").text("Please do not spam the search button!");
  }
}
function queueSearch(){
  if (!loading) {
    loading = true;
    search();
  }
  else {
    setTimeout(function (){
      queueSearch();
    },100);
  }
}
function search(){
  setTimeout(function (){
    queue = false;
    $("#searchButton").attr("value", "Search");
    $(".errorText").text("");
    waitAnimation();
  },250);
  try {
    $.getJSON("https://xivapi.com/character/search?name="+ characterName+"&server="+serverName)
    .success(function(data){
      try {
        tempObj = data.Results[0];
        var charID = tempObj.ID;
        getCharData(charID);
      } catch (e) {
        loading = false;
        $(".errorText").text("Search failed! Did you put in the correct Character Name and Server?");
        $(".loadingGif").attr("style", "visibility:hidden");
        $("#searchButton").attr("value", "Search");
      }
    })
    .error(function() {
      loading = false;
      $(".errorText").text("Search failed! XIVAPI Service Error");
      $(".loadingGif").attr("style", "visibility:hidden");
      $("#searchButton").attr("value", "Search");
    })
  } catch (e) {
    console.log("!!! something went wrong: "+e);
  }
}

//xivapi /Character data
function getCharData(ID){
  if (!loading) {
    loading = true;
    waitAnimation();
  }
  var currentJobID = 0;
  var url = "https://xivapi.com/Character/" + ID;
  $.getJSON(url)
    .then(function(data){
      try {
        var name = data.Character.Name;
        var portrait = data.Character.Portrait;
        var server = data.Character.Server;
        currentJobID += data.Character.ActiveClassJob.JobID;
        var currentLvl = data.Character.ActiveClassJob.Level;
        var fcID = data.Character.FreeCompanyId;
        $(".portraitImg").attr("src", portrait);
        var lodestone = "https://na.finalfantasyxiv.com/lodestone/character/" + ID + "/";
        $(".portraitURL").attr("href", lodestone);
        $(".name").text(name);
        $(".server").text(server);
        $(".lvl").text("Lv. "+currentLvl);
        getJobData(currentJobID);
        getEquipment(url);
        getFC(fcID);
      } catch (e) {
        $(".searchingText").text("Something went wrong! Please try again.");
      }
    }).done(function() {
    });
}

function getFC(id){
  $.getJSON("https://xivapi.com/freecompany/"+id)
    .then(function(data){
      try {
        var fcTag = data.FreeCompany.Tag;
        $(".FCtag").text("«"+fcTag+"»");
      } catch (e) {
        $(".FCtag").text("");
      }
    })
}

//xivapi /ClassJob using data from /Character
function getJobData(jobData){
  $.getJSON(
    "https://xivapi.com/ClassJob/" + jobData)
    .then(function(data){
      var jobEN = data.NameEnglish;
      var job = data.Name;
      job = job.replace(/\s/g,""); /*remove whitespace from job name*/
      $(".job").text(" "+jobEN);
      $(".jobIcon").attr("src", "https://xivapi.com/cj/companion/"+ job +".png");
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
  $.getJSON(url,
  function (data) {
    var obj = data.Character.GearSet.Gear;
    var n = 1;
    var done = 0;
    $.each(obj, function (key, entry) {
      setTimeout(function (){
        $.getJSON("https://xivapi.com/item/"+entry.ID,
        function(item){
          gearName = item.Name;
          gearIcon = item.Icon;
          gearUI_PNG = item.ItemUICategory.Icon;
          gearUI_Name = item.ItemUICategory.Name;
          gearUI_ID = item.ItemUICategory.ID;
          try {
            if (33 < gearUI_ID && gearUI_ID < 40) /*if armor piece*/{
              $(".leftEquipment").append($("<p class=\"equipmentL"+gearUI_ID+"\">"+gearName+" <img src=\"https://xivapi.com"+gearIcon+"\" alt=\""+gearName+"\" style=\"width:32px;height:32px;\"></p>"));
              $(".leftItemIcon").append("<p class =\"itemIconL"+gearUI_ID+"\">"+gearUI_Name+" <img src=https://xivapi.com"+gearUI_PNG+"></p>");
            }
            else if (0 < gearUI_ID && gearUI_ID < 11) /*if weapon slot*/{
              $(".leftEquipment").append($("<p class=\"equipmentL"+gearUI_ID+"\">"+gearName+" <img src=\"https://xivapi.com"+gearIcon+"\" alt=\""+gearName+"\" style=\"width:32px;height:32px;\"></p>"));
              $(".leftItemIcon").append("<p class =\"itemIconL"+gearUI_ID+"\">Main Hand <img src=https://xivapi.com"+gearUI_PNG+"></p>");
            }else {
              $(".rightEquipment").append($("<p class=\"equipmentR"+gearUI_ID+"\"><img src=\"https://xivapi.com"+gearIcon+"\" alt=\""+gearName+"\" style=\"width:32px;height:32px;\"> "+gearName+"</p>"));
              $(".rightItemIcon").append("<p class =\"itemIconR"+gearUI_ID+"\"><img src=https://xivapi.com"+gearUI_PNG+"> "+gearUI_Name+"</p>");
            }
          } catch (e) {
            if (n % 2 == 1) {
              $(".leftEquipment").append($("<p class=\"equipmentL\">API call failed     <img src=\"https://xivapi.com/img-misc/lodestone/status.png\" style=\"width:32px;height:32px;\"></p>"));
            }else {
              $(".rightEquipment").append($("<p class=\"equipmentR\"><img src=\"https://xivapi.com/img-misc/lodestone/status.png\" style=\"width:32px;height:32px;\">     API call failed</p>"));
            }
          }
        }).done(function() {
          done--;
          if(done == 0){
            loading = false;
            queue = false;
            $(".loadingGif").attr("style", "visibility:hidden");
            $("#searchButton").attr("value", "Search");
          }
        });
      }, 300*n);
      n++;
      done++;
    })
  });
}
