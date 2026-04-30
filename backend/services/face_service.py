import insightface
import cv2
import numpy as np

app = insightface.app.FaceAnalysis(name="buffalo_l")
app.prepare(ctx_id=-1)

def extract_faces(image_bytes: bytes) -> list[dict]:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        return []

    faces = app.get(img)

    return [
        {
            "embedding": face.embedding.tolist(),
            "bbox": face.bbox.tolist(),
            "det_score": float(face.det_score),
        }
        for face in faces
        if face.det_score > 0.5
    ]