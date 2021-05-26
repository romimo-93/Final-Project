function populateSeasons() {
  d3.select("#selSeason").html("");
  var url_seasons = "api/seasons";
  d3.json(url_seasons).then(function (response) {
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
  clearStatsInfo();
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
  clearStatsInfo();
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
  
  // clear player headshot and player action image
  d3.select("#player-action").html("")
  d3.select("#player_headshot").html("");
  
  var player_id = inputSelectPlayer.node().value;
  if (player_id) {
    var img_url = "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/" + player_id + ".jpg";
    var img_url_action = "https://cms.nhl.bamgrid.com/images/actionshots/" + player_id + ".jpg";

    imageExists(img_url, function (exists) {
      if (exists) {
        var player_headshot_imageurl = "<img src='" + img_url + "' class='img-fluid'  style='width:100%;border-radius:100%;' alt='Player Name'>";
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
        var player_action_html = "<img src='" + img_url_action + "' style='  opacity: 0.08;position: absolute;left: 0;top: 0;width: 100%;height: auto;' alt='Player Name'>";
        d3.select("#player-action").html(player_action_html);
      }      
    });

    var url_playerInfo = "/api/playerinfo/" + player_id;

    if (player_id) {
      d3.json(url_playerInfo).then(function (player_details) {

        var playerInfo = player_details;

        // Then, select the unordered list element by class name
        var list = d3.select("#player_info");
        list.html("");
        playerInfo.forEach((player, i) => {
          var item = list.append("ul");
          item.append("li").text("Age: " + player.age.split(" ")[0]);
          //item.append("li").text("Birth Date: " + player.birthDate.split(" ")[0]);
          item.append("li").text("Birthplace: " + player.birthCity + ", " + player.nationality);          
          item.append("li").text("Height: " + player.height + '"');
          item.append("li").text("Weight: " + player.weight + "lb.");
          
          item.append("li").text("Primary Position: " + player.primaryPosition);
          item.append("li").html("<strong>Support Vector Classification Position: " + player.predictedposition_grid + "</strong>");
          item.append("li").html("<strong>Neural Network Position: " + player.predictedposition_nn + "</strong>");
        });
        var player_name = d3.select("#player_name");
        player_name.html("");
        playerInfo.forEach((player, i) => {
          var name = player_name.append("h3");
          name.append("h3").text(player.firstName + " " + player.lastName + " (" + player.primaryPosition + ")");
        });
      });
    }

    populatePlayerStatsTable(player_id);
    populateStatsInfo(player_id);
  }
}

// Complete the event handler function for the form
function populatePlayerStatsTable(player_id) {
  d3.select("#stats-table").style("visibility","visible")
  d3.select("#table-container").style("height","440px")
  d3.select("#table-container").style("overflow","auto")

  // Select the input element and get the raw HTML node for SEASONS
  var SeasoninputElement = d3.select("#selSeason");
  // Get the value property of the input element
  var SeasoninputValue = SeasoninputElement.property("value");

  // Select the input element and get the raw HTML node for TEAMS
  var teaminputElement = d3.select("#selTeam");
  // Get the value property of the input element
  var teaminputValue = teaminputElement.property("value");

  var url_playerAllStats = "/api/playerstats/" + SeasoninputValue + "!" + player_id + "!" + teaminputValue;

  d3.json(url_playerAllStats).then(function (response) {
    var playerAllStats = response;

    // Then, select the unordered list element by class name
    var thead = d3.select("thead");
    thead.html("");

    // Headers
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

    // Stat Counters
    let shot_counter = 0
    let assist_counter = 0
    let goals_counter = 0
    let blocked_counter = 0
    let pm_counter = 0
    let take_counter = 0
    let give_counter = 0
    let foWin_counter = 0
    let pim_counter = 0

    // First, clear out any existing data
    var tbody = d3.select("tbody");
    tbody.html("");
    
    // Reverse game stats so they are in chronological order, top to bottom
    playerAllStats.reverse();
    playerAllStats.forEach((playerstat, i) => {
      
      // Increment stat counters
      shot_counter += playerstat.shots;
      assist_counter += playerstat.assists;
      goals_counter += playerstat.goals;
      blocked_counter += playerstat.blocked;
      pm_counter += playerstat.plusMinus;
      take_counter += playerstat.takeaways;
      give_counter += playerstat.giveaways;
      foWin_counter += playerstat.faceOffWins;
      pim_counter += playerstat.penaltyMinutes;

      // Create Stat Table
      let row = tbody.append("tr");
      row.append("td").text(playerstat.date.split(" 00")[0]);
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
    let rowTotals = tbody.append("tr");
    rowTotals.append("td");
    rowTotals.append("td").html("<strong>Season Totals:</strong>").classed("text-right", true);
        
    // Create Totals Row
    rowTotals.append("td").text(shot_counter);
    rowTotals.append("td").text(assist_counter);
    rowTotals.append("td").text(goals_counter);
    rowTotals.append("td").text(blocked_counter);
    rowTotals.append("td").text(pm_counter);
    rowTotals.append("td").text(take_counter);
    rowTotals.append("td").text(give_counter);
    rowTotals.append("td").text(foWin_counter);
    rowTotals.append("td").text(pim_counter);
  });
}

function populateStatsInfo(player_id) {
  var url_playerStats = "/api/aggplayerstats/" + player_id;

  d3.json(url_playerStats).then(function (sumStats) {
    var sumHead = d3.select("#player_sum_stats");
    sumHead.html("");
    sumHead.append("h5").text("Totals from Available Seasons (2000-2020)")
    sumHead.append("p").text("*including regulation, playoff and championship game statistics")
    sumStats.forEach((stat, i) => {
      var sumRow = sumHead.append("ul");
      stat.goals ? sumRow.append("li").text("Total Goals: " + stat.goals) : null;
      stat.assists ? sumRow.append("li").text("Total Assists: " + stat.assists) : null;
      stat.shots ? sumRow.append("li").text("Total Shots: " + stat.shots) : null;
      stat.blocks ? sumRow.append("li").text("Total Blocks: " + stat.blocks) : null;
      stat.faceOffWins ? sumRow.append("li").text("Total Face Off Wins: " + stat.faceOffWins) : null;
    });
  });
}

function clearStatsInfo() {
  d3.select("#player-action").html("")
  d3.select("#player_headshot").html("");
  d3.select("#player_name").html("")
  d3.select("thead").html("")
  d3.select("tbody").html("")
  d3.select("#player_info").html("")
  d3.select("#player_sum_stats").html("")
  d3.select("#stats-table").style("visibility","hidden")
  d3.select("#table-container").style("height","0px")
};

