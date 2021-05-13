//################### Start new section #################################

// Assign the data from `data.js` to a descriptive variable

var people = data;
console.log(people);

// Select button for SEASON
var seasonbutton = d3.select("#seasonbutton");
// // Select the form
var seasonform = d3.select("#seasonform");
// // Create event handlers
seasonbutton.on("click", runEnter);
seasonform.on("submit", runEnter);

// Select button for TEAM
var teambutton = d3.select("#teambutton");
// // Select the form
var teamform = d3.select("#teamform");
// // Create event handlers
teambutton.on("click", runEnter);
teamform.on("submit", runEnter);

// Select button for PLAYERS
var playerbutton = d3.select("#playerbutton");
// // Select the form
var playerform = d3.select("#playerform");
// // Create event handlers
playerbutton.on("click", runEnter);
playerform.on("submit", runEnter);

// // Complete the event handler function for the form
function runEnter() {
  //   // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node for SEASONS
  var SeasoninputElement = d3.select("#season-form-input");
  //   // Get the value property of the input element
  var SeasoninputValue = SeasoninputElement.property("value");
  // console.log(`This is ${inputValue} times easier!`);
  console.log(`This is input value ${SeasoninputValue}`);
  console.log(people);
  var seasonfilteredData = people.filter(
    (person) => person.season === SeasoninputValue
  );

  // Select the input element and get the raw HTML node for TEAMS
  var teaminputElement = d3.select("#team-form-input");
  // Get the value property of the input element
  var teaminputValue = teaminputElement.property("value");
  // console.log(`This is ${inputValue} times easier!`);
  console.log(`This is input value ${teaminputValue}`);
  console.log(people);
  var teamfilteredData = people.filter(
    (person) => person.teamName === teaminputValue
  );

  // Select the input element and get the raw HTML node for PLAYERS
  var playerinputElement = d3.select("#player-form-input");
  // Get the value property of the input element for PLAYERS
  var playerinputValue = playerinputElement.property("value");
  // console.log(`This is ${inputValue} times easier!`);
  console.log(`This is input value ${playerinputValue}`);
  console.log(people);
  var playerfilteredData = teamfilteredData.filter(
    (person) => person.Full_Name === playerinputValue
  );

  //   console.log(filteredData);

  // BONUS: Calculate summary statistics for the age field of the filtered data
  //   var teams = filteredData.map((person) => person.teamName);
  //   console.log(teams);
  //   // Then, select the unordered list element by class name
  var tbody = d3.select("tbody");

  // function buildTable(data) {
  //   //     //   // First, clear out any existing data
  tbody.html("");

  //   for loop for SEASONS
  for (const f of seasonfilteredData) {
    var row = tbody.append("tr");

    //      Loop through each field in the dataRow and add
    //      each value as a table cell (td)
    // Object.values(dataRow).forEach((val) => {
    row.append("td").text(f.season);
    row.append("td").text(f.assists);
    row.append("td").text(f.goals);
    row.append("td").text(f.hits);
    row.append("td").text(f.teamName);
    row.append("td").text(f.Full_Name);
  }
  d3.selectAll(".filter").on("change", seasonfilteredData);

  //   for loop for TEAMS
  for (const f of teamfilteredData) {
    var row = tbody.append("tr");

    //      Loop through each field in the dataRow and add
    //      each value as a table cell (td)
    // Object.values(dataRow).forEach((val) => {
    row.append("td").text(f.season);
    row.append("td").text(f.assists);
    row.append("td").text(f.goals);
    row.append("td").text(f.hits);
    row.append("td").text(f.teamName);
    row.append("td").text(f.Full_Name);
  }
  d3.selectAll(".filter").on("change", teamfilteredData);

  //   for loop for PLAYERS
  for (const f of playerfilteredData) {
    var row = tbody.append("tr");

    //      Loop through each field in the dataRow and add
    //      each value as a table cell (td)
    // Object.values(dataRow).forEach((val) => {
    row.append("td").text(f.season);
    row.append("td").text(f.assists);
    row.append("td").text(f.goals);
    row.append("td").text(f.hits);
    row.append("td").text(f.teamName);
    row.append("td").text(f.Full_Name);
  }
  d3.selectAll(".filter").on("change", playerfilteredData);
}
//    Next, loop through each object in the data
//   and append a row and cells for each value in the row
//   data.forEach((dataRow) => {
//   Append a row to the table body

//   console.log(filteredData[0].teamName);
//   cell.text(val);
// populatePlayerStatsTable();

//   function populatePlayerStatsTable(player_id) {
//     d3.csv("player_info.csv", function (data) {
//       var inputSelectPlayer = d3.select("#selPlayer");
//       d3.select("#player-form-input")
//         .append("option")
//         .text("Select Player")
//         .property("value", "");

//       player_id = inputSelectPlayer.node().value;
//       var playerElement = d3.select("#selPlayer");
//       var playerData = data.filter(
//         (player) => player.player_id === playerElement
//       );
//       for (const f of playerData) {
//         var list = d3.select(".player_summary");

//         //      Loop through each field in the dataRow and add
//         //      each value as a table cell (td)
//         // Object.values(dataRow).forEach((val) => {
//         list.append("li").text(f.firstName);
//         list.append("li").text(f.lastName);
//         list.append("li").text(f.birthCity);
//         list.append("li").text(f.birthDate);
//         list.append("li").text(f.height);
//         list.append("li").text(f.weight);
//         list.append("li").text(f.primaryPosition);
//         list.append("li").text(f.projectedPosition);
//       }
//     });
//   }
// }
// //   // Finally, rebuild the table using the filtered Data
// buildTable(filteredData);

// // // // Attach an event to listen for changes to each filter
// d3.selectAll(".filter").on("change", updateFilters);

// ##### NEW SECTION #####

// var url_playerSummary = url_playerAllStats.map();
// var url_playerSumStats = "/api/aggplayerstats/" + player_id;
// if (player_id) {
//   d3.json(url_playerSumStats).then(function (sumStats) {
//     var summaryStats = sumStats;
//     var stats = d3.select(".summary_stats");
//     stats.html("");
//     summaryStats.forEach((stat_item, i) => {
//       var stat = stats.append("ul");
//       stat.append("li").text("Total Assists:" + " " + stat_item.assists);
//       // console.log(summaryStats);
//     });
//   });
// }

// d3.json(url_playerSumStats).then(function (sumStats) {
//   console.log("playerAllStats " + sumStats);
//   var summaryStats = sumStats;
//   var total_blocked = summaryStats.map((block) => block.blocked);
//   console.log("nsflksFnsflkjnksnliN" + total_blocked);
//   var sum_blocks = math.sum(total_blocked);
//   console.log(sum_blocks);
// });
// var total_shots = playerAllStats.map((shots) => shots.shots);
// var total_goals = playerAllStats.map((goals) => goals.goals);
// var total_assists = playerAllStats.map((assists) => assists.assists);
// var total_FOW = playerAllStats.map((FOW) => FOW.faceOffWins);

// var sum_blocks = math.sum(total_blocked);
// var sum_shots = math.sum(total_shots);
// var sum_goals = math.sum(total_goals);
// var sum_assists = math.sum(total_assists);
// var sum_FOW = math.sum(total_FOW);

//     var stats_body = d3.select(".summary_stats");
//     stats_body.html("");
//     playerAllStats.forEach((player, i) => {
//       var stat = stats_body.append("ul");
//       stat.append("li").text("Total Blocks:" + " " + sum_blocks);
//       stat.append("li").text("Total Shots:" + " " + sum_shots);
//       stat.append("li").text("Total Goals:" + " " + sum_goals);
//       stat.append("li").text("Total Assists:" + " " + sum_assists);
//       stat.append("li").text("Total Face Off Wins:" + " " + sum_FOW);
// });
