function populateSeasons() {
  d3.select("#selSeason").html("");
  var url_seasons = "api/seasons";
  d3.json(url_seasons).then(async function (response) {
    var season = response.list;
    // select inputs
    var inputSelectSeason = d3.select("#selSeason").attr("class", "select");

    // auto populate available filter days and add blank option to search without date filter
    season.forEach((s) => {
      inputSelectSeason.append("option").text(s);
    });
  });
}

function populateSeasonTeams() {
  d3.select("#selTeam").html("");
  d3.select("#selTeam")
    .append("option")
    .text("Select Team")
    .property("value", "");
  var selectedSeason = d3.select("#selSeason").node().value;
  if (selectedSeason === "") {
    selectedSeason = "20192020";
  }
  var url_seasonTeams = "api/seasonTeams/" + selectedSeason;
  d3.json(url_seasonTeams).then(function (response) {
    var team = response;

    // select inputs
    var inputSelectTeam = d3.select("#selTeam").attr("class", "select");

    var len = team.length;
    for (var i = 0; i < len; i++) {
      if (team[i].teamName) {
        inputSelectTeam
          .append("option")
          .text(team[i].teamName)
          .property("value", team[i].team_id);
      }
    }
  });
  d3.select("#player_headshot").html("");
  d3.select("#player_action").html("");
  populateSeasonTeamPlayers();
}

function populateSeasonTeamPlayers() {
  d3.select("#selPlayer").html("");
  var selectedSeason = d3.select("#selSeason").node().value;
  var selectedTeam = d3.select("#selTeam").node().value;

  if (selectedSeason && selectedTeam) {
    var url_seasonTeamPlayers =
      "api/seasonTeamPlayers/" + selectedSeason + "/" + selectedTeam;
    d3.json(url_seasonTeamPlayers).then(function (response) {
      var seasonTeamPlayers = response;

      // select inputs
      var inputSelectPlayer = d3.select("#selPlayer").attr("class", "select");

      seasonTeamPlayers.forEach((p) => {
        console.log(p);
        inputSelectPlayer
          .append("option")
          .text(p.playername)
          .property("value", p.player_id);
      });
    });
    d3.select("#player_headshot").html("");
    d3.select("#player_action").html("");
    populatePlayerInfo();
  }
}

function imageExists(url, callback) {
  var img = new Image();
  img.onload = function () {
    callback(true);
  };
  img.onerror = function () {
    callback(false);
  };
  img.src = url;
}

function populatePlayerInfo() {
  // Use D3 to select the dropdown menu
  var inputSelectPlayer = d3.select("#selPlayer");
  d3.select("#selPlayer")
    .append("option")
    .text("Select Player")
    .property("value", "");

  var player_id = inputSelectPlayer.node().value;
  if (player_id) {
    var img_url =
      "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/" +
      player_id +
      ".jpg";
    var img_url_action =
      "https://cms.nhl.bamgrid.com/images/actionshots/" + player_id + ".jpg";

    imageExists(img_url, function (exists) {
      if (exists) {
        var player_headshot_imageurl =
          "<img src='" +
          img_url +
          "' class='img-fluid'  style='width:100%;border-radius:100%;' alt='Player Name'>";
        d3.select("#player_headshot").html(player_headshot_imageurl);
      } else {
        d3.select("#player_headshot").html(
          "<img src='https://raw.githubusercontent.com/romimo-93/Final-Project/main/static/img/player_placeholder.jpg' style='border-radius: 100%;' class='img-fluid'  style='width:100%;' alt='Player Name'>"
        );
      }
    });

    imageExists(img_url_action, function (exists) {
      if (exists) {
        //player_action_html = "<img src='" + img_url_action + "' class='img-fluid' style='width:100%;height:300px;z-index:-1000000000;opacity:0.15; di' alt='Player Name'>";
        var player_action_html =
          "<img src='" +
          img_url_action +
          "' style='  opacity: 0.08;position: absolute;left: 0;top: 0;width: 100%;height: auto;' alt='Player Name'>";
        d3.select("#player-action").html(player_action_html);
      }
    });

    var url_playerInfo = "/api/playerinfo/" + player_id;
    console.log(url_playerInfo);

    if (player_id) {
      d3.json(url_playerInfo).then(function (player_details) {
        // console.log("playerInfo " + response);

        var playerInfo = player_details;
        console.log(playerInfo);

        //   // Then, select the unordered list element by class name
        var list = d3.select("#player_info");
        list.html("");
        playerInfo.forEach((player, i) => {
          var item = list.append("ul");
          item
            .append("li")
            .text("Birth Date: " + player.birthDate.split(" ")[0]);
          item.append("li").text("Birth City: " + player.birthCity);
          item.append("li").text("Height: " + player.height + '"');
          item.append("li").text("Weight: " + player.weight + "lb.");
          item.append("li").text("Primary Position: " + player.primaryPosition);
          item
            .append("li")
            .text(
              "Projected GridSearchCV Position: " +
                player.predictedposition_grid
            );
          item
            .append("li")
            .text(
              "Projected Neural Network Position: " +
                player.predictedposition_grid
            );
        });
        var player_name = d3.select("#player_name");
        player_name.html("");
        playerInfo.forEach((player, i) => {
          var name = player_name.append("h3");
          name
            .append("h3")
            .text(
              "Player Name:" + " " + player.firstName + " " + player.lastName
            );
        });
      });
    }

    populatePlayerStatsTable(player_id);
  }
}

// Complete the event handler function for the form
function populatePlayerStatsTable(player_id) {
  // Select the input element and get the raw HTML node for SEASONS
  var SeasoninputElement = d3.select("#selSeason");
  // Get the value property of the input element
  var SeasoninputValue = SeasoninputElement.property("value");
  // console.log(`This is ${inputValue} times easier!`);
  // console.log(`This is input value ${SeasoninputValue}`);

  // Select the input element and get the raw HTML node for TEAMS
  var teaminputElement = d3.select("#selTeam");
  // Get the value property of the input element
  var teaminputValue = teaminputElement.property("value");
  // console.log(`This is ${inputValue} times easier!`);
  // console.log(`This is input value ${teaminputValue}`);

  var url_playerAllStats =
    "/api/playerstats/" +
    SeasoninputValue +
    "!" +
    player_id +
    "!" +
    teaminputValue;
  console.log(url_playerAllStats);

  d3.json(url_playerAllStats).then(function (response) {
    //   console.log("playerAllStats " + response);
    var playerAllStats = response;

    // Then, select the unordered list element by class name
    var thead = d3.select("thead");
    thead.html("");

    var row = thead.append("tr");
    row.append("th").text("Date");
    row.append("th").text("Home vs Away");
    row.append("th").text("Shots");
    row.append("th").text("Assists");
    row.append("th").text("Goals");
    row.append("th").text("Blocked");
    row.append("th").text("PlusMinus");
    row.append("th").text("Takeaways");
    row.append("th").text("Giveaways");
    row.append("th").text("FaceOffWins");
    row.append("th").text("PenaltyMin");

    // First, clear out any existing data
    var tbody = d3.select("tbody");
    tbody.html("");
    playerAllStats.forEach((playerstat, i) => {
      console.log(playerstat);
      var row = tbody.append("tr");
      row.append("td").text(playerstat.date);
      row.append("td").text(playerstat.Teams);
      row.append("td").text(playerstat.shots);
      row.append("td").text(playerstat.assists);
      row.append("td").text(playerstat.goals);
      row.append("td").text(playerstat.blocked);
      row.append("td").text(playerstat.plusMinus);
      row.append("td").text(playerstat.takeaways);
      row.append("td").text(playerstat.giveaways);
      row.append("td").text(playerstat.faceOffWins);
      row.append("td").text(playerstat.penaltyMinutes);
    });
  });
}

function populateStatsInfo(player_id) {
  var playerInput = d3.select("#selPlayer");
  // Get the value property of the input element
  var playerInputValue = playerInput.property("value");

  var url_playerStats = "/api/aggplayerstats/" + playerInputValue + player_id;
  console.log(url_playerStats);

  d3.json(url_playerStats).then(function (sumStats) {
    var summaryStats = sumStats;
    var sumHead = d3.select("#player_summary_head");
    sumHead.html("");
    var Sumrow = sumHead.append("tr");
    Sumrow.append("th").text("Total Goals");
    Sumrow.append("th").text("Total Assists");
    Sumrow.append("th").text("Total Shots");
    Sumrow.append("th").text("Total Blocks");
    Sumrow.append("th").text("Total Face Off Wins");

    var Sumbody = d3.select("#player_summary_body");
    Sumbody.html("");
    summaryStats.forEach((stat, i) => {
      console.log(stat);
      var Bodyrow = Sumbody.append("tr");
      Bodyrow.append("td").text(stat.goals);
      Bodyrow.append("td").text(stat.assists);
      Bodyrow.append("td").text(stat.shots);
      Bodyrow.append("td").text(stat.blocks);
      Bodyrow.append("td").text(stat.faceOffWins);
    });
  });
}

//     // Use D3 to select the dropdown menu
//     var inputPlayer = d3.select("#selPlayer");
//     d3.select("#selPlayer")
//       .append("option")
//       .text("Select Player")
//       .property("value", "");

//     var player_id = inputPlayer.node().value;
//     if (player_id) {

// var url_playerSummary = url_playerAllStats.map();
// var url_playerSumStats = “/api/aggplayerstats/” + player_id;
// if (player_id) {
//   d3.json(url_playerSumStats).then(function (sumStats) {
//     var summaryStats = sumStats;
//     var stats = d3.select(“.summary_stats”);
//     stats.html(“”);
//     summaryStats.forEach((stat_item, i) => {
//       var stat = stats.append(“ul”);
//       stat.append(“li”).text(“Total Assists:” + ” ” + stat_item.assists);
//       stat.append(“li”).text(“Total Goals:” + ” ” + stat_item.goals);
//       stat.append(“li”).text(“Total Shots:” + ” ” + stat_item.shots);
//       stat.append(“li”).text(“Total Blocks:” + ” ” + stat_item.blocks);
//       stat.append(“li”).text(“Total Face Off Wins:” + ” ” + stat_item.faceOffWins);
