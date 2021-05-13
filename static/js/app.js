// await function
function oneSecond() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}

d3.selectAll("#selSeason").on("change", populateSeasonTeams);
d3.selectAll("#selTeam").on("change", populateSeasonTeamPlayers);
d3.selectAll("#selPlayer").on("change", populatePlayerInfo);
d3.select("#myselect").property("value", "20192020");

async function init() {
  populateDabbler();
  populateSeasons();
  populateSeasonTeams();
  populateStatsInfo();

  // Wait for the dabbler to load before running clusterInit
  while (!d3.select(".axis-text")._groups[0][0]) {
    await oneSecond();
  }
  // From cluster.js
  clusterInit();
}

// Initialize script
init();
