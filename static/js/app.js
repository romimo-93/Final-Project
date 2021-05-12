// await function
function oneSecond() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

d3.selectAll("#selSeason").on("change", populateSeasonTeams);
d3.selectAll("#selTeam").on("change", populateSeasonTeamPlayers);
d3.selectAll("#selPlayer").on("change", populatePlayerInfo);
d3.select('#myselect').property('value', '20192020');

var svgWidth = d3.select('#scatter').style('width').slice(0, -2)
// var svgWidth = 1200;
var svgHeight = 800;

var margin = {
  top: 50,
  right: 50,
  bottom: 350,
  left: 160
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "shots";
var chosenYAxis = "timeOnIce";

var xvalueDescription = "<b>Shots</b>: A shot in ice hockey is an attempt by a player to score a goal by striking or snapping the puck with their stick in the direction of the net."
var yvalueDescription = "<b>Time on Ice</b>: The aggregation of the overall time a player is on the ice.";

d3.select("#x-axis-description").html("<b>X-axis Description - </b>" + xvalueDescription)
d3.select("#y-axis-description").html("<b>Y-axis Description - </b>" + yvalueDescription)


function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => +d[chosenXAxis]) * 1,
    d3.max(data, d => +d[chosenXAxis]) * 1
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => +d[chosenYAxis]) * 1,
    d3.max(data, d => +d[chosenYAxis]) * 1
    ])
    .range([height, 0]);

  return yLinearScale;
}

function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function updateText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  textGroup.transition()
    .duration(1500)
    .attr("x", d => newXScale(d[chosenXAxis]))
    .attr("y", d => newYScale(d[chosenYAxis]));

  var circleLabels = chartGroup.selectAll("null")
    .enter()
    .append("text")
    .attr("fill", "white")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .text(function (d) {
      return d.Position
    })
    .attr("text-anchor", "middle")
    .attr("font-size", 12);

  return circleLabels;
}

let dabblerData = getDabblerData();

function getDabblerData() {
  const url = "api/aggplayerstats/null"

  var data = d3.json(url).then(function (response, err) {
    if (err) throw err;
    return response;
  });
  return data
}


function populateDabbler() {
  console.log("Populating dabbler...")

  if (!dabblerData) {
    getDabblerData()
  }
  dabblerData.then(function (data) {

    var xAxisLabels = ["shots", "goals", "assists", "takeaways", "giveaways", "hits", "blocked", "penaltyMinutes"]
    var yAxisLabels = ["timeOnIce", "evenTimeOnIce", "shortHandedTimeOnIce", "powerPlayTimeOnIce"]

    // parse data
    data.forEach(function (d) {

      // X-Axis Values
      data.shots = +d.shots;
      data.goals = +d.goals;
      data.assists = +d.assists
      data.takeaways = +d.takeaways;
      data.giveaways = +d.takeaways;
      data.hits = +d.hits;
      data.blocked = +d.blocked;
      data.penaltyMinutes = +d.penaltyMinutes;

      // Y-Axis Values
      data.timeOnIce = +d.timeOnIce
      data.evenTimeOnIce = +d.evenTimeOnIce
      data.shortHandedTimeOnIce = +d.shortHandedTimeOnIce
      data.powerPlayTimeOnIce = +d.powerPlayTimeOnIce

    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);

    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset(function (d) {
        return [75, -d.PlayerName.length - 60];
      })
      .html(function (d) {
        return (`${d.PlayerName}<br>
            ${chosenXAxis}: ${d[chosenXAxis]}<br>
            ${chosenYAxis}: ${d[chosenYAxis]}<br>
            `);
      })
    chartGroup.call(toolTip);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 5)
      .attr("fill", "green")
      .attr("opacity", ".5")
      .on('mouseover', toolTip.show)
      .on('mouseout', toolTip.hide);

    var circleLabels = chartGroup.selectAll("null")
      .data(data)
      .enter()
      .append("text")
      .attr("fill", "white")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .text(function (d) {
        return d.abbr
      })
      .attr("text-anchor", "middle")
      .attr("font-size", 12);

    //Create group for two x-axis labels

    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var xLabelSpacer = 25;

    var xLabels = []
    var xLabelIndex = 1

    xAxisLabels.forEach(x => {
      var cssclass = "inactive"
      if (xLabelIndex === 1) {
        cssclass = "active"
      }
      var xLabel = xLabelsGroup.append("text")
        .attr("value", x) // value to grab for event listener
        .classed("axis-text", true)
        .classed(cssclass, true)
        .text(x)
        .attr("y", xLabelSpacer * xLabelIndex)
      xLabels.push(xLabel)

      xLabelIndex += 1;
    });

    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(-15, ${height / 2}), rotate(-90)`)
      .attr("text-anchor", "middle");

    // append y axis
    var yLabelSpacer = 25;
    var yLabels = []
    var yLabelIndex = 1;
    yAxisLabels.forEach(y => {
      var cssclass = "inactive"
      if (yLabelIndex === 1) {
        cssclass = "active"
      }
      var yLabel = yLabelsGroup.append("text")
        .attr("value", y) // value to grab for event listener
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed(cssclass, true)
        .text(y + " (min)")
        .attr("y", 0 - 30 - yLabelSpacer * yLabelIndex)
      yLabels.push(yLabel)
      yLabelIndex += 1;
    });

    //x axis labels event listener
    xLabelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          //updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);

          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);

          //updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          // updates tooltips with new info
          var labelsGroup = updateText(circleLabels, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          xLabels.forEach(x => {
            var selectedxLabel = x;
            selectedxLabel.classed("active", false)
              .classed("inactive", true);
          });

          d3.select(this)
            .classed("active", true)
            .classed("inactive", false);

          updateDabblerDescriptions("x", value);
          updateCluster();
        }
      });

    yLabelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

          // replaces chosenXAxis with value
          chosenYAxis = value;

          // updates x scale for new data
          yLinearScale = yScale(data, chosenYAxis);

          // updates x axis with transition
          yAxis = renderYAxes(yLinearScale, yAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          // updates tooltips with new info
          var labelsGroup = updateText(circleLabels, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

          yLabels.forEach(x => {
            var selectedyLabel = x;
            selectedyLabel.classed("active", false)
              .classed("inactive", true);
          });

          d3.select(this)
            .classed("active", true)
            .classed("inactive", false);

          updateDabblerDescriptions("y", value);
          updateCluster();
        }
      });
  });

  console.log("Dabbler populated.")

}

function updateDabblerDescriptions(axis, value) {

  var valueDescription = "";

  if (axis === "x") {
    if (value === "shots") {
      valueDescription = "<b>Shots</b>: A shot in ice hockey is an attempt by a player to score a goal by striking or snapping the puck with their stick in the direction of the net."
    } else if (value === "goals") {
      valueDescription = "<b>Goals</b>: A goal is scored when the puck entirely crosses the goal line between the two goal posts and below the goal crossbar."
    } else if (value === "assists") {
      valueDescription = "<b>Assists</b>: An assist is attributed to up to two players of the scoring team who shot, passed or deflected the puck towards the scoring teammate, or touched it in any other way which enabled the goal"
    } else if (value === "takeaways") {
      valueDescription = "<b>Takeaways</b>: A takeaway is a forced action taken by a defensive player to regain possession of the puck for his team."
    } else if (value === "giveaways") {
      valueDescription = "<b>Giveaways</b>: A giveaway is when a players own actions result in a loss of possession to the opposing team."
    } else if (value === "hits") {
      valueDescription = "<b>hits</b>: For a valid 'Hit' to be registered on the stat sheet, the player to be credited with the hit must a) intentionally initiate physical contact with the player possessing the puck, and b) the player sustaining the contact must lose possession of the puck as a result of the contact."
    } else if (value === "blocked") {
      valueDescription = "<b>Blocked</b>: A shot that is deflected wide or blocked by an opponent does not count as a shot on goal; it is recorded as a blocked shot. The player who blocks the shot is credited with a 'blocked shot', and the player who shoots the puck is credited with an 'attempt blocked'."
    } else if (value === "penaltyMinutes") {
      valueDescription = "<b>Penalty Minutes</b>: The cumulative total of time that a player has spent in the penalty box due to on ice infractions and is calculated by game and by season. "
    }

    d3.select("#x-axis-description").html("<b>X-axis Description - </b>" + valueDescription)
  }

  if (axis === "y") {
    if (value === "timeOnIce") {
      valueDescription = "<b>Time on Ice</b>: The aggregation of the overall time a player is on the ice.";
    } else if (value === "evenTimeOnIce") {
      valueDescription = "<b>Even time on ice</b>: Total time on ice while both teams have even number of players (no penalties).";
    } else if (value === "shortHandedTimeOnIce") {
      valueDescription = "<b>Short-handed time on ice</b>: Time on ice while at least on player on player's team is serving a penalty and the opposing team has numerical advantage on the ice";
    } else if (value === "powerPlayTimeOnIce") {
      valueDescription = "<b>Powerplay time on ice</b>: Time on ice while at least one opposing team's player is serving a penalty, and the team has a numerical advantage on the ice";
    }

    d3.select("#y-axis-description").html("<b>Y-axis Description - </b>" + valueDescription)
  }

}

function populateSeasons() {
  d3.select("#selSeason").html("");
  var url_seasons = "api/seasons";
  d3.json(url_seasons).then(async function (response) {
    let success = false;
    let retry = 1;
    while (!success && retry <= 10) {
      try {
        var season = response.list
        // select inputs 
        var inputSelectSeason = d3.select("#selSeason").attr('class', 'select');

        // auto populate available filter days and add blank option to search without date filter
        season.forEach(s => {
          inputSelectSeason.append('option').text(s);
        });
        console.log("First Try!");
        success = true;
      } catch (TypeError) {
        await oneSecond();
        console.log("try again");
        retry+=1;
      }
    }
    !success ? console.log("I give up. I'm done trying") : 1;
  });
}

function populateSeasonTeams() {
  d3.select("#selTeam").html("");
  d3.select("#selTeam").append('option').text("Select Team").property('value', '');
  var selectedSeason = d3.select("#selSeason").node().value;
  if (selectedSeason === "") {
    selectedSeason = "20192020"
  }
  var url_seasonTeams = "api/seasonTeams/" + selectedSeason;
  d3.json(url_seasonTeams).then(function (response) {
    var team = response

    // select inputs 
    var inputSelectTeam = d3.select("#selTeam").attr('class', 'select');

    var len = team.length;
    for (var i = 0; i < len; i++) {
      if (team[i].teamName) {
        inputSelectTeam.append('option').text(team[i].teamName).property('value', team[i].team_id);
      }
    }
  });
  d3.select("#player_headshot").html("")
  d3.select("#player_action").html("")
  populateSeasonTeamPlayers();
}


function populateSeasonTeamPlayers() {
  d3.select("#selPlayer").html("");
  var selectedSeason = d3.select("#selSeason").node().value;
  var selectedTeam = d3.select("#selTeam").node().value;

  if ((selectedSeason) && (selectedTeam)) {
    var url_seasonTeamPlayers = "api/seasonTeamPlayers/" + selectedSeason + "/" + selectedTeam;
    d3.json(url_seasonTeamPlayers).then(function (response) {
      var seasonTeamPlayers = response

      // select inputs 
      var inputSelectPlayer = d3.select("#selPlayer").attr('class', 'select');

      seasonTeamPlayers.forEach(p => {
        console.log(p);
        inputSelectPlayer.append('option').text(p.playername).property('value', p.player_id);
      });
    });
    d3.select("#player_headshot").html("")
    d3.select("#player_action").html("")
    populatePlayerInfo();
  }
}


function imageExists(url, callback) {
  var img = new Image();
  img.onload = function () { callback(true); };
  img.onerror = function () { callback(false); };
  img.src = url;
}

function populatePlayerInfo() {

  // Use D3 to select the dropdown menu
  var inputSelectPlayer = d3.select("#selPlayer");
  d3.select("#selPlayer").append('option').text("Select Player").property('value', '');

  var player_id = inputSelectPlayer.node().value;
  if (player_id) {

    var img_url = "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/" + player_id + ".jpg"
    var img_url_action = "https://cms.nhl.bamgrid.com/images/actionshots/" + player_id + ".jpg"

    imageExists(img_url, function (exists) {

      if (exists) {
        var player_headshot_imageurl = "<img src='" + img_url + "' class='img-fluid'  style='width:100%;border-radius:100%;' alt='Player Name'>";
        d3.select("#player_headshot").html(player_headshot_imageurl)
      }
      else {
        d3.select("#player_headshot").html("<img src='https://raw.githubusercontent.com/romimo-93/Final-Project/main/static/img/player_placeholder.jpg' style='border-radius: 100%;' class='img-fluid'  style='width:100%;' alt='Player Name'>")
      };
    });

    imageExists(img_url_action, function (exists) {

      if (exists) {
        //player_action_html = "<img src='" + img_url_action + "' class='img-fluid' style='width:100%;height:300px;z-index:-1000000000;opacity:0.15; di' alt='Player Name'>";        
        var player_action_html = "<img src='" + img_url_action + "' style='  opacity: 0.08;position: absolute;left: 0;top: 0;width: 100%;height: auto;' alt='Player Name'>";
        d3.select("#player-action").html(player_action_html)
      }
    });

    populatePlayerStatsTable(player_id);
  }
}

// // Complete the event handler function for the form
function populatePlayerStatsTable(player_id) {
  // Select the input element and get the raw HTML node for SEASONS
  var SeasoninputElement = d3.select("#selSeason");
  //   // Get the value property of the input element
  var SeasoninputValue = SeasoninputElement.property("value");
  // console.log(`This is ${inputValue} times easier!`);
  console.log(`This is input value ${SeasoninputValue}`);

  // Select the input element and get the raw HTML node for TEAMS
  var teaminputElement = d3.select("#selTeam");
  // Get the value property of the input element
  var teaminputValue = teaminputElement.property("value");
  // console.log(`This is ${inputValue} times easier!`);
  console.log(`This is input value ${teaminputValue}`);

  // url_playerAggStats = "api/aggplayerstats/" + player_id;
  // d3.json(url_playerAggStats).then(function(response) {
  //   var playerAggStats = response
  //   console.log("playerAggStats " + playerAggStats);
  // });    

  var url_playerAllStats = "/api/playerstats/" + SeasoninputValue + "!" + player_id + "!" + teaminputValue;
  console.log(url_playerAllStats)

  d3.json(url_playerAllStats).then(function (response) {
    console.log("playerAllStats " + response);
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
      console.log(playerstat)
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
    }
    );
  });
}


async function init() {
  populateDabbler();
  populateSeasons();
  populateSeasonTeams();

  // Wait for the dabbler to load before running clusterInit
  while (!d3.select(".axis-text")._groups[0][0]) {
    await oneSecond();
  }
  // From cluster.js
  clusterInit();
}

// Initialize script
init();
