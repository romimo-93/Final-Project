// Store Cluster Image element
var clusterImgs = document.getElementsByClassName("cluster-img");

function updateCluster() {
    // Get active axes
    activeList = {};
    const _actives = d3.selectAll(".axis-text.active")._groups[0];
    activeList["x"] = _actives[0].textContent;
    activeList["y"] = _actives[1].textContent.split(" ")[0]; // gets the y axis without the units

    // Update Cluster Image element with corresponding image based on active Dabbler axes
    clusterImgs[0].src = `/static/img/clusters/${activeList["x"]}-${activeList["y"]}.png`;
    clusterImgs[1].src = `/static/img/clusters/${activeList["x"]}-${activeList["y"]}.png`;
}

// Initialize Cluster and un-hide image elements
function clusterInit() {
    updateCluster()
    clusterImgs[0].classList.remove("hidden");
    clusterImgs[1].classList.remove("hidden");
}

