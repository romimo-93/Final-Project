# Import dependencies
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def cluster(data, xaxis, yaxis):
    # Establish X
    X = np.array(data)

    # Standardize the columns
    scaler = StandardScaler().fit(X)
    X_scaled = scaler.transform(X)
    
    # Create kmeans model
    kmeans = KMeans(n_clusters=4)
    kmeans.fit(X_scaled)
    predicted_clusters = kmeans.predict(X_scaled)
    
    # Clear plt and generate new plot
    plt.clf()
    plt.scatter(X[:,0], X[:,1], c=predicted_clusters, s=5, cmap="viridis")
    plt.title(f"Average per Game - {xaxis} vs. {yaxis}")
    plt.xlabel(xaxis)
    plt.ylabel(yaxis)
    plt.savefig(f"static/img/clusters/{xaxis}-{yaxis}.png")
