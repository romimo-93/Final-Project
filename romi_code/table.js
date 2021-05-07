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

  //    Next, loop through each object in the data
  //   and append a row and cells for each value in the row
  //   data.forEach((dataRow) => {
  //   Append a row to the table body

  //   console.log(filteredData[0].teamName);
  //   cell.text(val);
}

// //   // Finally, rebuild the table using the filtered Data
// buildTable(filteredData);

// // // // Attach an event to listen for changes to each filter
// d3.selectAll(".filter").on("change", updateFilters);
