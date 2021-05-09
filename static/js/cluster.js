// Store Cluster Image element
var clusterImg = document.getElementById("cluster-img");
console.log(clusterImg);

function updateCluster() {
    // Get active axes
    activeList = {};
    const _actives = d3.selectAll(".axis-text.active")._groups[0];
    activeList["x"] = _actives[0].textContent;
    activeList["y"] = _actives[1].textContent.split(" ")[0]; // gets the y axis without the units

    // Update Cluster Image element with corresponding image based on active Dabbler axes
    console.log(`/static/img/clusters/${activeList["x"]}-${activeList["y"]}.png`);
    clusterImg.src = `/static/img/clusters/${activeList["x"]}-${activeList["y"]}.png`;
}

// Initialize Cluster
function clusterInit() {
    updateCluster()
}

