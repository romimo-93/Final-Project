# Import dependencies
import matplotlib.pyplot as plt
import mpld3
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
    
    fig, ax = plt.subplots()
    ax.scatter(X[:,0], X[:,1], c=predicted_clusters, s=5, cmap="viridis")
    ax.set_title(f"Average per Game - {xaxis} vs. {yaxis}")
    ax.set_xlabel(xaxis)
    ax.set_ylabel(yaxis)
    fig_html = mpld3.fig_to_html(fig)

    print(fig_html)

    return fig_html