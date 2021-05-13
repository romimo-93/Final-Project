var svgWidth = d3.select("#scatter").style("width").slice(0, -2);
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
var chartGroup = svg
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "shots";
var chosenYAxis = "timeOnIce";

var xvalueDescription = "<b>Shots</b>: A shot in ice hockey is an attempt by a player to score a goal by striking or snapping the puck with their stick in the direction of the net."
var yvalueDescription = "<b>Time on Ice</b>: The aggregation of the overall time a player is on the ice.";

d3.select("#x-axis-description").html("<b>X-axis Description - </b>" + xvalueDescription)
d3.select("#y-axis-description").html("<b>Y-axis Description - </b>" + yvalueDescription)

var xvalueDescription =
  "<b>Shots</b>: A shot in ice hockey is an attempt by a player to score a goal by striking or snapping the puck with their stick in the direction of the net.";
var yvalueDescription =
  "<b>Time on Ice</b>: The aggregation of the overall time a player is on the ice.";

d3.select("#x-axis-description").html(
  "<b>X-axis Description - </b>" + xvalueDescription
);
d3.select("#y-axis-description").html(
  "<b>Y-axis Description - </b>" + yvalueDescription
);

function xScale(data, chosenXAxis) {
  // create scales
  var xLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => +d[chosenXAxis]) * 1,
      d3.max(data, (d) => +d[chosenXAxis]) * 1,
    ])
    .range([0, width]);

  return xLinearScale;
}

function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (d) => +d[chosenYAxis]) * 1,
      d3.max(data, (d) => +d[chosenYAxis]) * 1,
    ])
    .range([height, 0]);

  return yLinearScale;
}

function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition().duration(1000).call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition().duration(1000).call(leftAxis);

  return yAxis;
}

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  circlesGroup
    .transition()
    .duration(1000)
    .attr("cx", (d) => newXScale(d[chosenXAxis]))
    .attr("cy", (d) => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function updateText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
  textGroup
    .transition()
    .duration(1500)
    .attr("x", (d) => newXScale(d[chosenXAxis]))
    .attr("y", (d) => newYScale(d[chosenYAxis]));

  var circleLabels = chartGroup
    .selectAll("null")
    .enter()
    .append("text")
    .attr("fill", "white")
    .attr("x", (d) => xLinearScale(d[chosenXAxis]))
    .attr("y", (d) => yLinearScale(d[chosenYAxis]))
    .text(function (d) {
      return d.Position;
    })
    .attr("text-anchor", "middle")
    .attr("font-size", 12);

  return circleLabels;
}

let dabblerData = getDabblerData();

function getDabblerData() {
  const url = "api/aggplayerstats/null";

  var data = d3.json(url).then(function (response, err) {
    if (err) throw err;
    return response;
  });
  return data;
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
      data.timeOnIce = +d.timeOnIce;
      data.evenTimeOnIce = +d.evenTimeOnIce;
      data.shortHandedTimeOnIce = +d.shortHandedTimeOnIce;
      data.powerPlayTimeOnIce = +d.powerPlayTimeOnIce;
    });

    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup
      .append("g")
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
        return `${d.PlayerName}<br>
            ${chosenXAxis}: ${d[chosenXAxis]}<br>
            ${chosenYAxis}: ${d[chosenYAxis]}<br>
            `;
      });
    chartGroup.call(toolTip);

    var colorByPos = {
      "D": "green",
      "C": "blue",
      "W": "blue"
    }
    // append initial circles
    var circlesGroup = chartGroup
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xLinearScale(d[chosenXAxis]))
      .attr("cy", (d) => yLinearScale(d[chosenYAxis]))
      .attr("r", 5)
      .attr("fill", d => colorByPos[d.PlayerName.slice(-2,-1)])
      .attr("opacity", ".5")
      .on("mouseover", toolTip.show)
      .on("mouseout", toolTip.hide);

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

    var xLabelsGroup = chartGroup
      .append("g")
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
        .attr("y", xLabelSpacer * xLabelIndex);
      xLabels.push(xLabel);

      xLabelIndex += 1;
    });

    var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(-15, ${height / 2}), rotate(-90)`)
      .attr("text-anchor", "middle");

    // append y axis
    var yLabelSpacer = 25;
    var yLabels = [];
    var yLabelIndex = 1;
    yAxisLabels.forEach((y) => {
      var cssclass = "inactive";
      if (yLabelIndex === 1) {
        cssclass = "active";
      }
      var yLabel = yLabelsGroup
        .append("text")
        .attr("value", y) // value to grab for event listener
        .attr("dy", "1em")
        .classed("axis-text", true)
        .classed(cssclass, true)
        .text(y + " (min)")
        .attr("y", 0 - 30 - yLabelSpacer * yLabelIndex);
      yLabels.push(yLabel);
      yLabelIndex += 1;
    });

    //x axis labels event listener
    xLabelsGroup.selectAll("text").on("click", function () {
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
        circlesGroup = renderCircles(
          circlesGroup,
          xLinearScale,
          yLinearScale,
          chosenXAxis,
          chosenYAxis
        );

        // updates tooltips with new info
        var labelsGroup = updateText(
          circleLabels,
          xLinearScale,
          yLinearScale,
          chosenXAxis,
          chosenYAxis
        );

        xLabels.forEach((x) => {
          var selectedxLabel = x;
          selectedxLabel.classed("active", false).classed("inactive", true);
        });

        d3.select(this).classed("active", true).classed("inactive", false);

        updateDabblerDescriptions("x", value);
        updateCluster();
      }
    });

    yLabelsGroup.selectAll("text").on("click", function () {
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
        circlesGroup = renderCircles(
          circlesGroup,
          xLinearScale,
          yLinearScale,
          chosenXAxis,
          chosenYAxis
        );

        // updates tooltips with new info
        var labelsGroup = updateText(
          circleLabels,
          xLinearScale,
          yLinearScale,
          chosenXAxis,
          chosenYAxis
        );

        yLabels.forEach((x) => {
          var selectedyLabel = x;
          selectedyLabel.classed("active", false).classed("inactive", true);
        });

        d3.select(this).classed("active", true).classed("inactive", false);

        updateDabblerDescriptions("y", value);
        updateCluster();
      }
    });
  });

  console.log("Dabbler populated.");
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