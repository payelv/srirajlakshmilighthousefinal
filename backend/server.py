from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header, UploadFile, File, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import jwt
from datetime import datetime, timedelta, timezone
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import Any, Dict, List, Optional

from default_content import DEFAULT_CONTENT

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# ---------------------------------------------------------------------------
# Config & DB
# ---------------------------------------------------------------------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "payelraj26@gmail.com").strip().lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "rajlaxmi@2025")
JWT_SECRET = os.environ.get("JWT_SECRET", "srl-jwt-secret")
JWT_ALG = "HS256"
JWT_TTL_DAYS = 7

SITE_DOC_ID = "singleton"

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg", ".avif"}

app = FastAPI(title="Sri Rajlaxmi Light House API")
api = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class LoginBody(BaseModel):
    email: str
    password: str


class EnquiryCreate(BaseModel):
    name: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    message: str


class Enquiry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str = ""
    phone: str = ""
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def create_token(subject: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + timedelta(days=JWT_TTL_DAYS),
        "role": "admin",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def require_admin(credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer)):
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Missing token")
    payload: Optional[Dict[str, Any]] = None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not an admin")
    return payload


async def get_or_seed_content() -> Dict[str, Any]:
    doc = await db.site_content.find_one({"_id": SITE_DOC_ID})
    if not doc:
        seed = {"_id": SITE_DOC_ID, **DEFAULT_CONTENT, "updated_at": datetime.now(timezone.utc).isoformat()}
        await db.site_content.insert_one(seed)
        doc = seed
    doc.pop("_id", None)
    return doc


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@api.get("/")
async def root():
    return {"message": "Sri Rajlaxmi Light House API is running."}


@api.get("/content")
async def get_content():
    return await get_or_seed_content()


@api.put("/content")
async def update_content(body: Dict[str, Any], _admin=Depends(require_admin)):
    # Ensure the doc exists
    await get_or_seed_content()

    # Only allow known top-level keys to prevent stray fields.
    allowed = {"business", "hero", "about", "categories", "products", "whyUs", "gallery", "faqs"}
    patch = {k: v for k, v in body.items() if k in allowed}
    if not patch:
        raise HTTPException(status_code=400, detail="No valid fields to update.")

    patch["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.site_content.update_one({"_id": SITE_DOC_ID}, {"$set": patch})
    return await get_or_seed_content()


@api.post("/admin/login")
async def admin_login(body: LoginBody):
    if body.email.strip().lower() != ADMIN_EMAIL or body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    token = create_token(ADMIN_EMAIL)
    return {"token": token, "expiresIn": JWT_TTL_DAYS * 24 * 3600, "email": ADMIN_EMAIL}


@api.get("/admin/verify")
async def verify(admin=Depends(require_admin)):
    return {"ok": True, "email": admin.get("sub")}


@api.post("/enquiries")
async def create_enquiry(body: EnquiryCreate):
    doc = Enquiry(**body.dict())
    payload = doc.dict()
    payload["created_at"] = payload["created_at"].isoformat()
    await db.enquiries.insert_one({**payload, "_id": doc.id})
    return {"id": doc.id}


@api.get("/enquiries")
async def list_enquiries(_admin=Depends(require_admin)):
    items: List[Dict[str, Any]] = []
    async for row in db.enquiries.find().sort("created_at", -1).limit(500):
        row.pop("_id", None)
        items.append(row)
    return items


@api.delete("/enquiries/{eid}")
async def delete_enquiry(eid: str, _admin=Depends(require_admin)):
    res = await db.enquiries.delete_one({"id": eid})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"ok": True}


@api.post("/upload")
async def upload_file(
    request: Request,
    file: UploadFile = File(...),
    _admin=Depends(require_admin),
):
    """Upload an image (or any binary asset) from the admin panel.

    Streams the file to disk in 1 MB chunks so we can handle large files without
    loading them entirely into memory. Returns an absolute URL that can be stored
    directly in the site content (e.g. product image).
    """
    original = file.filename or "upload.bin"
    ext = os.path.splitext(original)[1].lower()
    if ext not in ALLOWED_IMAGE_EXTS and file.content_type and not file.content_type.startswith("image/"):
        # allow common image extensions; also permit anything the browser flagged as image/*
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext or file.content_type}")
    if not ext:
        # fall back based on content-type
        ct = (file.content_type or "").lower()
        ext_map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/gif": ".gif",
            "image/svg+xml": ".svg",
            "image/avif": ".avif",
            "image/bmp": ".bmp",
        }
        ext = ext_map.get(ct, ".bin")

    fname = f"{uuid.uuid4().hex}{ext}"
    fpath = UPLOAD_DIR / fname

    total = 0
    try:
        with fpath.open("wb") as out:
            while True:
                chunk = await file.read(1024 * 1024)  # 1 MB chunks
                if not chunk:
                    break
                out.write(chunk)
                total += len(chunk)
    except Exception as e:
        # cleanup on failure
        try:
            fpath.unlink(missing_ok=True)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f"Upload failed: {e}") from e

    base = str(request.base_url).rstrip("/")
    return {
        "url": f"{base}/api/uploads/{fname}",
        "path": f"/api/uploads/{fname}",
        "filename": fname,
        "size": total,
        "contentType": file.content_type,
    }


# Mount router
app.include_router(api)

# Serve uploaded files (must be mounted after include_router to avoid path conflicts
# with the API prefix — StaticFiles handles GET only, so no clash with /api/upload POST)
app.mount("/api/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
