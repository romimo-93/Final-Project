var svgWidth = 1200;
var svgHeight = 600;

var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 100
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
var chosenXAxis = "goals";
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
  const url = "api/avgplayerstats/"
  console.log(url);

  d3.json(url).then(function(response, err) {  
    if (err) throw err;    
    const data = response;
    console.log(data[0]);
    console.log([data].length);

    //console.log(data);
    //console.log([data]);

   
    // // parse data
    data.forEach(function(d) {
      data.goals = +d.goals;
      data.timeOnIce = +d.timeOnIce;
      data.evenTimeOnIce = +d.evenTimeOnIce;
      data.shortHandedTimeOnIce = +d.shortHandedTimeOnIce;
      data.powerPlayTimeOnIce = +d.powerPlayTimeOnIce;     
      data.penaltyMinutes = +d.penaltyMinutes;     
       
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
      .offset([60, -60])
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
    var goalsxLabel = xLabelsGroup.append("text")
      .attr("value", "goals") // value to grab for event listener
      .classed("axis-text", true)
      .classed("active", true)
      .text("Goals Scored")
      .attr("y", xLabelSpacer)
  
    var evenTimeOnIcexLabel = xLabelsGroup.append("text")
      .attr("value", "evenTimeOnIce") // value to grab for event listener
      .classed("inactive", true)
      .text("Even Time on Ice (min)")
      .attr("y", xLabelSpacer * 2)
    
    var shortHandedTimeOnIcexLabel = xLabelsGroup.append("text")
      .attr("value", "shortHandedTimeOnIce") // value to grab for event listener
      .classed("inactive", true)
      .text("Short Handed Time On Ice (min)")
      .attr("y", xLabelSpacer * 3)  

     var yLabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(0, ${height /2}), rotate(-90)`)
      .attr("text-anchor", "middle");

    // append y axis
    var yLabelSpacer = 25;
    var timeOnIceyLabel = yLabelsGroup.append("text")
      .attr("value", "timeOnIce") // value to grab for event listener
      .attr("y", 0 - 30 - yLabelSpacer)
      // .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("active", true)
      .classed("axis-text", true)
      .text("Time on Ice (min)");

    var powerPlayTimeOnIceyLabel = yLabelsGroup.append("text")
      .attr("value", "powerPlayTimeOnIce") // value to grab for event listener
      .attr("y", 0 - 30 - yLabelSpacer*2)
      // .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("inactive", true)
      .classed("axis-text", true)
      .text("Power Play Time On Ice (min)");          

    var penaltyMinutesyLabel = yLabelsGroup.append("text")
      .attr("value", "penaltyMinutes") // value to grab for event listener
      .attr("y", 0 - 30 - yLabelSpacer*3)
      // .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("inactive", true)
      .classed("axis-text", true)
      .text("Penalty Minutes");           

    //x axis labels event listener
    xLabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          console.log(chosenXAxis)
  
          //updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
  
          //updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
  
          // updates tooltips with new info
          labelsGroup = updateText(circleLabels,xLinearScale,yLinearScale,chosenXAxis, chosenYAxis);
  
          goalsxLabel
            .classed("active", false)
            .classed("inactive", true);
          evenTimeOnIcexLabel
            .classed("active", false)
            .classed("inactive", true);
          shortHandedTimeOnIcexLabel
            .classed("active", false)
            .classed("inactive", true);
              
          // changes classes to change bold text
          if (chosenXAxis === "goals") {
            goalsxLabel
              .classed("active", true)
              .classed("inactive", false);
          }
          else if (chosenXAxis === "evenTimeOnIce") {
            evenTimeOnIcexLabel
              .classed("active", true)
              .classed("inactive", false);
          }       
          else if (chosenXAxis === "shortHandedTimeOnIce") {
            shortHandedTimeOnIcexLabel
              .classed("active", true)
              .classed("inactive", false);
          }      
       }
     });

     yLabelsGroup.selectAll("text")
     .on("click", function() {
       console.log("yLabelsGroup Clicked"); 
       // get value of selection
       var value = d3.select(this).attr("value");
       if (value !== chosenYAxis) {
 
         // replaces chosenXAxis with value
         chosenYAxis = value;
 
         console.log(chosenYAxis)
 
         // updates x scale for new data
         yLinearScale = yScale(data, chosenYAxis);
 
         // updates x axis with transition
         yAxis = renderYAxes(yLinearScale, yAxis);
 
         // updates circles with new x values
         circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
 
         // updates tooltips with new info
         labelsGroup = updateText(circleLabels, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
 
         powerPlayTimeOnIceyLabel
           .classed("active", false)
           .classed("inactive", true);
         timeOnIceyLabel
           .classed("active", false)
           .classed("inactive", true);
         penaltyMinutesyLabel
           .classed("active", false)
           .classed("inactive", true);

         // changes classes to change bold text
         if (chosenYAxis === "powerPlayTimeOnIce") {
          powerPlayTimeOnIceyLabel
             .classed("active", true)
             .classed("inactive", false);
         }
         else if (chosenYAxis === "timeOnIce") {
          timeOnIceyLabel
             .classed("active", true)
             .classed("inactive", false);
         }       
         else if (chosenYAxis === "penaltyMinutes") {
          penaltyMinutesyLabel
             .classed("active", true)
             .classed("inactive", false);
         }         
      }
    });     
  }).catch(function(error) {
    console.log(error);
  });    

}

function init() {
  populateDabbler();
}

init();


