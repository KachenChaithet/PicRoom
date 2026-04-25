import numpy as np
from sklearn.cluster import DBSCAN

def cluster_embeddings(faces: list[dict]) -> list[int]:
    if not faces:
        return []

    embeddings = np.array([f["embedding"] for f in faces])

    labels = DBSCAN(
        eps=0.4,
        min_samples=1,
        metric="cosine"
    ).fit_predict(embeddings)

    return labels.tolist()