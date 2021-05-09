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

var svgWidth = 1200;
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
  };  

function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
   
    return xAxis;
  };
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
      .duration(1000)
      .call(leftAxis);

    return yAxis;
  };      

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
        .attr("fill","white")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(function (d) {
            return d.Position })
        .attr("text-anchor", "middle")
        .attr("font-size", 12);

    return circleLabels;
}

let dabblerData = getDabblerData();

function getDabblerData() {
  const url = "api/aggplayerstats/null"

  var data = d3.json(url).then(function(response, err) {  
    if (err) throw err;            
    return response;
  });
  return data
}


function populateDabbler() {
  console.log("loading data...")  
  
  // Use D3 to select the dropdown menu
  //var CB_Year = d3.select("#selYear");
  // Assign the value of the dropdown menu option to a variable
  //var year = CB_Year.node().value;

  // season = "20192020"
  // console.log(season);

  /* data route */
  // Retrieve data from the json api and execute everything below


  // d3.json(url).then(function(response, err) {  
  //   if (err) throw err;    
  if (!dabblerData) {
    getDabblerData()

  }
  dabblerData.then(function(data) {
    //console.log(data);
    //console.log([data]);

    xAxisLabels = ["shots","goals","assists","takeaways","giveaways","hits","blocked","penaltyMinutes"]
    yAxisLabels = ["timeOnIce","evenTimeOnIce","shortHandedTimeOnIce","powerPlayTimeOnIce"]

    // parse data
    data.forEach(function(d) {
      
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
      data.timeOnIce= +d.timeOnIce
      data.evenTimeOnIce= +d.evenTimeOnIce
      data.shortHandedTimeOnIce= +d.shortHandedTimeOnIce
      data.powerPlayTimeOnIce= +d.powerPlayTimeOnIce
       
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
        return [75, -d.PlayerName.length-60];
      })
      .html(function(d) {
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
        .attr("fill","white")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .text(function (d) {
            return d.abbr })
        .attr("text-anchor", "middle")
        .attr("font-size", 12);

    //Create group for two x-axis labels

    var xLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    var xLabelSpacer = 25;        

    xLabels = []
    xLabelIndex = 1

    xAxisLabels.forEach(x => {
      cssclass = "inactive"
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




    // var shotsxLabel = xLabelsGroup.append("text")
      // .attr("value", "shots") // value to grab for event listener
      // .classed("axis-text", true)
      // .classed("active", true)
      // .text("Total Shots Taken")
      // .attr("y", xLabelSpacer)
  
    // var hitsxLabel = xLabelsGroup.append("text")
      // .attr("value", "hits") // value to grab for event listener
      // .classed("inactive", true)
      // .text("Total Hits")
      // .attr("y", xLabelSpacer * 2)
    
    // var shortHandedTimeOnIcexLabel = xLabelsGroup.append("text")
      // .attr("value", "shortHandedTimeOnIce") // value to grab for event listener
      // .classed("inactive", true)
      // .text("Total Short Handed Time On Ice (min)")
      // .attr("y", xLabelSpacer * 3)  

    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(-15, ${height /2}), rotate(-90)`)
      .attr("text-anchor", "middle");

    // append y axis
    var yLabelSpacer = 25;
    yLabels = []
    yLabelIndex = 1;
    yAxisLabels.forEach(y => {
      cssclass = "inactive"
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

    // var goalsyLabel = yLabelsGroup.append("text")
    // .attr("value", "goals") // value to grab for event listener
    // .attr("y", 0 - 30 - yLabelSpacer)
    // .attr("dy", "1em")
    // .classed("active", true)
    // .classed("axis-text", true)
    // .text("Total Goals Scored");          

    // var timeOnIceyLabel = yLabelsGroup.append("text")
    //   .attr("value", "timeOnIce") // value to grab for event listener
    //   .attr("y", 0 - 30 - yLabelSpacer*2)
    //   .attr("dy", "1em")
    //   .classed("inactive", true)
    //   .classed("axis-text", true)
    //   .text("Total Time on Ice (min)");


    // var penaltyMinutesyLabel = yLabelsGroup.append("text")
    //   .attr("value", "penaltyMinutes") // value to grab for event listener
    //   .attr("y", 0 - 30 - yLabelSpacer*3)
    //   .attr("dy", "1em")
    //   .classed("inactive", true)
    //   .classed("axis-text", true)
    //   .text("Total Penalty Minutes");           

    //x axis labels event listener
    xLabelsGroup.selectAll("text")
      .on("click", function() {
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
          labelsGroup = updateText(circleLabels,xLinearScale,yLinearScale,chosenXAxis, chosenYAxis);
          
          xLabels.forEach(x => {
            var selectedxLabel = x;
            selectedxLabel.classed("active", false)
             .classed("inactive", true);
          });

          var value = d3.select(this)
              .classed("active", true)
              .classed("inactive", false);
          
          updateCluster();
       }
     });

     yLabelsGroup.selectAll("text")
     .on("click", function() {
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
         labelsGroup = updateText(circleLabels, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
 
         yLabels.forEach(x => {
          var selectedyLabel = x;
          selectedyLabel.classed("active", false)
           .classed("inactive", true);
        });

        var value = d3.select(this)
            .classed("active", true)
            .classed("inactive", false);

        updateCluster();
      }
    });  
  });
}

function populateSeasons() {
  d3.select("#selSeason").html("");
  url_seasons = "api/seasons";
  d3.json(url_seasons).then(function(response) {
    var season = response.list
    // select inputs 
    var inputSelectSeason = d3.select("#selSeason").attr('class','select');

    // auto populate available filter days and add blank option to search without date filter
    season.forEach(s => {
      inputSelectSeason.append('option').text(s);
    });
  });
};
function populateSeasonTeams() {
  d3.select("#selTeam").html("");
  d3.select("#selTeam").append('option').text("Select Team").property('value', '');           
  var selectedSeason = d3.select("#selSeason").node().value;   
  if (selectedSeason === "") {
    selectedSeason = "20192020"
  }
  url_seasonTeams = "api/seasonTeams/" + selectedSeason;
  d3.json(url_seasonTeams).then(function(response) {
    var team = response

    // select inputs 
    var inputSelectTeam = d3.select("#selTeam").attr('class','select');

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
};


function populateSeasonTeamPlayers(){
  d3.select("#selPlayer").html("");
  var selectedSeason = d3.select("#selSeason").node().value;    
  var selectedTeam = d3.select("#selTeam").node().value;
  
  if ((selectedSeason) && (selectedTeam)) {
    url_seasonTeamPlayers = "api/seasonTeamPlayers/" + selectedSeason + "/" + selectedTeam;
    d3.json(url_seasonTeamPlayers).then(function(response) {
      var seasonTeamPlayers = response

      // select inputs 
      var inputSelectPlayer = d3.select("#selPlayer").attr('class','select');
      
      seasonTeamPlayers.forEach(p => {
        inputSelectPlayer.append('option').text(p.PlayerName).property('value', p.player_id);           
      });    
    });
    d3.select("#player_headshot").html("")  
    d3.select("#player_action").html("")  
    populatePlayerInfo();
  }
};


function populatePlayerInfo() {
  
    // Use D3 to select the dropdown menu
    var inputSelectPlayer = d3.select("#selPlayer");
    d3.select("#selPlayer").append('option').text("Select Player").property('value', '');           

    player_id = inputSelectPlayer.node().value;
    if (player_id) {

      img_url = "https://cms.nhl.bamgrid.com/images/headshots/current/168x168/" + player_id + ".jpg"
      img_url_action = "https://cms.nhl.bamgrid.com/images/actionshots/" + player_id + ".jpg"     

      imageExists(img_url, function(exists) {

        if (exists) {
          player_headshot_imageurl = "<img src='" + img_url + "' class='img-fluid'  style='width:100%;' alt='Player Name'>";        
          d3.select("#player_headshot").html(player_headshot_imageurl)  
        }
        else {
          d3.select("#player_headshot").html("<img src='https://raw.githubusercontent.com/romimo-93/Final-Project/main/static/img/player_placeholder.jpg' class='img-fluid'  style='width:100%;' alt='Player Name'>")  
        };
      });
           
      imageExists(img_url_action, function(exists) {

        if (exists) {
          player_action_imageurl = "<img src='" + img_url_action + "' class='img-fluid' style='width:100%;height:300px%' alt='Player Name'>";        
          d3.select("#player_action").html(player_action_imageurl)  
        };
  
      });
    }
  }

function imageExists(url, callback) {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
}


async function init() {  
  populateDabbler();  
  populateSeasons();   
  populateSeasonTeams();
  
  // Wait for the dabbler to load before running clusterInit
  while (!d3.select(".axis-text")._groups[0][0]){
    await oneSecond();
  }
  // From cluster.js
  clusterInit();
};

// Initialize script
init();
