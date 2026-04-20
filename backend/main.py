from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
import numpy as np
import cv2
from typing import List
import gc

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# CONFIG
# ---------------------------
THRESHOLD = 0.4
IMG_SIZE = 640

# ---------------------------
# UTILS
# ---------------------------
def resize_keep_ratio(img):
    h, w = img.shape[:2]
    scale = IMG_SIZE / max(h, w)
    return cv2.resize(img, (int(w * scale), int(h * scale)))

def is_valid_face(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(gray, cv2.CV_64F).var() > 80

def normalize(v):
    v = np.array(v, dtype="float32")
    return v / np.linalg.norm(v)

def cosine_distance_fast(a, b):
    return 1 - np.dot(a, b)  # normalized แล้ว

def get_min_distance(desc, group_descs):
    return min(cosine_distance_fast(desc, g) for g in group_descs)

# ---------------------------
# CLUSTER (logic เดิม แต่ optimize)
# ---------------------------
def cluster_faces(all_faces: list) -> list:
    groups = []

    for face in all_faces:
        best_dist = float("inf")
        best_group = None

        for group in groups:
            dist = get_min_distance(face["descriptor"], group["descriptors"])
            if dist < best_dist:
                best_dist = dist
                best_group = group

        if best_dist < THRESHOLD and best_group is not None:
            best_group["descriptors"].append(face["descriptor"])
            best_group["photo_ids"].add(face["photo_id"])
        else:
            groups.append({
                "descriptors": [face["descriptor"]],
                "photo_ids": set([face["photo_id"]])
            })

    # merge group
    merged = True
    while merged:
        merged = False
        for i in range(len(groups)):
            for j in range(i + 1, len(groups)):
                rep_i = np.mean(groups[i]["descriptors"], axis=0)
                dist = get_min_distance(rep_i, groups[j]["descriptors"])

                if dist < THRESHOLD:
                    groups[i]["descriptors"].extend(groups[j]["descriptors"])
                    groups[i]["photo_ids"].update(groups[j]["photo_ids"])
                    groups.pop(j)
                    merged = True
                    break
            if merged:
                break

    return [{
        "descriptor_rep": np.mean(g["descriptors"], axis=0).tolist(),
        "photo_ids": list(g["photo_ids"])
    } for g in groups]

# ---------------------------
# API
# ---------------------------
@app.post("/detect")
async def detect(files: List[UploadFile] = File(...)):
    all_faces = []

    for file in files:
        contents = await file.read()

        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            continue

        img = resize_keep_ratio(img)

        if not is_valid_face(img):
            del img, nparr
            continue

        try:
            result = DeepFace.represent(
                img_path=img,
                model_name="Facenet512",
                enforce_detection=False,
                detector_backend="ssd"  # 🔥 ลด RAM หนัก ๆ
            )
        except:
            del img, nparr
            continue

        print(f"{file.filename} → {len(result)} faces")

        for r in result:
            emb = normalize(r["embedding"])  # float32
            all_faces.append({
                "photo_id": file.filename,
                "descriptor": emb
            })

        # 🔥 เคลียร์ memory ทันที
        del img, nparr, result
        gc.collect()

    groups = cluster_faces(all_faces)

    return {
        "total_faces": len(all_faces),
        "groups": groups
    }