from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone, timedelta
import jwt, uuid, os, asyncio, logging, re, time, html as htmllib
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger("truecreds")

app = FastAPI(title="TrueCreds API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

MONGO_URL          = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME            = os.getenv("DB_NAME", "truecreds")
JWT_SECRET         = os.getenv("JWT_SECRET", "truecreds-super-secret-32chars-change-me!")
ADMIN_USERNAME     = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD     = os.getenv("ADMIN_PASSWORD", "truecreds@2026")
RESEND_API_KEY     = os.getenv("RESEND_API_KEY", "")
SENDER_EMAIL       = os.getenv("SENDER_EMAIL", "onboarding@resend.dev")
ADMIN_NOTIFY_EMAIL = os.getenv("ADMIN_NOTIFY_EMAIL", "")
WP_BASE_URL        = os.getenv("WP_BASE_URL", "")
WP_ACTIVE          = os.getenv("WP_ACTIVE", "false").lower() == "true"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
security = HTTPBearer(auto_error=False)

# ─── MODELS ───────────────────────────────────────────────────────────────────

class LeadCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    full_name: str
    mobile: str
    email: Optional[str] = None
    loan_amount: float
    employment_type: Optional[str] = None
    city: Optional[str] = None
    monthly_income: Optional[float] = None

class ContactCreate(BaseModel):
    name: str
    email: str
    message: str

class LoginRequest(BaseModel):
    username: str
    password: str

class WpConfigUpdate(BaseModel):
    base_url: Optional[str] = None
    active: Optional[bool] = None
    wp_username: Optional[str] = None
    wp_app_password: Optional[str] = None

class WpTestRequest(BaseModel):
    base_url: Optional[str] = None

class LeadStatusUpdate(BaseModel):
    status: str

class WpPostCreate(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    status: Optional[str] = "publish"
    categories: Optional[List[int]] = None
    tags: Optional[List[int]] = None

# ─── AUTH ─────────────────────────────────────────────────────────────────────

def create_token(username: str) -> str:
    return jwt.encode(
        {"sub": username, "exp": datetime.now(timezone.utc) + timedelta(hours=12)},
        JWT_SECRET,
        algorithm="HS256"
    )

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        return jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])["sub"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ─── SEED DATA ────────────────────────────────────────────────────────────────

SEED_LOANS = [
    {"id": str(uuid.uuid4()), "name": "Navi", "tagline": "Instant personal loans, zero paperwork", "logo_emoji": "🚀", "interest_rate_min": 9.9, "interest_rate_max": 19.5, "loan_amount_min": 10000, "loan_amount_max": 2000000, "tenure_min_months": 3, "tenure_max_months": 84, "approval_time": "5 min", "min_cibil": 650, "rating": 4.5, "review_count": 12800, "apply_url": "https://navi.com", "categories": ["personal", "instant"], "locations": ["delhi", "mumbai", "noida", "jaipur"], "best_for": "Salaried professionals", "is_featured": True},
    {"id": str(uuid.uuid4()), "name": "KreditBee", "tagline": "Loans for low CIBIL & first-timers", "logo_emoji": "🐝", "interest_rate_min": 17.0, "interest_rate_max": 29.95, "loan_amount_min": 1000, "loan_amount_max": 400000, "tenure_min_months": 3, "tenure_max_months": 24, "approval_time": "10 min", "min_cibil": 0, "rating": 4.2, "review_count": 9400, "apply_url": "https://kreditbee.in", "categories": ["personal", "no-cibil", "instant"], "locations": ["delhi", "mumbai", "noida", "jaipur"], "best_for": "Low CIBIL / New to credit", "is_featured": True},
    {"id": str(uuid.uuid4()), "name": "MoneyTap", "tagline": "India's first credit line app", "logo_emoji": "💧", "interest_rate_min": 13.0, "interest_rate_max": 24.0, "loan_amount_min": 3000, "loan_amount_max": 500000, "tenure_min_months": 2, "tenure_max_months": 36, "approval_time": "15 min", "min_cibil": 600, "rating": 4.1, "review_count": 7200, "apply_url": "https://moneytap.com", "categories": ["personal", "instant"], "locations": ["delhi", "mumbai", "noida"], "best_for": "Flexible credit line users", "is_featured": False},
    {"id": str(uuid.uuid4()), "name": "PaySense", "tagline": "Higher loan amounts, easy EMIs", "logo_emoji": "💼", "interest_rate_min": 14.0, "interest_rate_max": 36.0, "loan_amount_min": 5000, "loan_amount_max": 500000, "tenure_min_months": 3, "tenure_max_months": 60, "approval_time": "2 hrs", "min_cibil": 620, "rating": 4.0, "review_count": 5600, "apply_url": "https://gopaysense.com", "categories": ["personal", "business"], "locations": ["delhi", "mumbai", "jaipur"], "best_for": "Higher loan amounts", "is_featured": False},
    {"id": str(uuid.uuid4()), "name": "CASHe", "tagline": "Salary-based short-term loans", "logo_emoji": "💸", "interest_rate_min": 18.0, "interest_rate_max": 33.0, "loan_amount_min": 5000, "loan_amount_max": 400000, "tenure_min_months": 3, "tenure_max_months": 18, "approval_time": "8 min", "min_cibil": 580, "rating": 3.9, "review_count": 4100, "apply_url": "https://cashe.co.in", "categories": ["personal", "instant"], "locations": ["delhi", "mumbai"], "best_for": "Salaried with urgent needs", "is_featured": False},
    {"id": str(uuid.uuid4()), "name": "LazyPay", "tagline": "Buy now, pay later — instant credit", "logo_emoji": "⏱️", "interest_rate_min": 16.0, "interest_rate_max": 32.0, "loan_amount_min": 1000, "loan_amount_max": 100000, "tenure_min_months": 1, "tenure_max_months": 24, "approval_time": "Instant", "min_cibil": 0, "rating": 4.0, "review_count": 6300, "apply_url": "https://lazypay.in", "categories": ["personal", "instant", "no-cibil"], "locations": ["delhi", "mumbai", "noida", "jaipur"], "best_for": "BNPL & small ticket loans", "is_featured": False},
    {"id": str(uuid.uuid4()), "name": "Bajaj Finserv", "tagline": "Premium NBFC — highest loan amounts", "logo_emoji": "🏛️", "interest_rate_min": 11.0, "interest_rate_max": 18.0, "loan_amount_min": 100000, "loan_amount_max": 4000000, "tenure_min_months": 12, "tenure_max_months": 84, "approval_time": "30 min", "min_cibil": 720, "rating": 4.6, "review_count": 21000, "apply_url": "https://bajajfinserv.in", "categories": ["personal", "business"], "locations": ["delhi", "mumbai", "noida", "jaipur"], "best_for": "High-value borrowers", "is_featured": True},
    {"id": str(uuid.uuid4()), "name": "mPokket", "tagline": "Loans for students & freshers", "logo_emoji": "🎓", "interest_rate_min": 24.0, "interest_rate_max": 48.0, "loan_amount_min": 500, "loan_amount_max": 30000, "tenure_min_months": 1, "tenure_max_months": 4, "approval_time": "5 min", "min_cibil": 0, "rating": 4.1, "review_count": 8900, "apply_url": "https://mpokket.com", "categories": ["student", "no-cibil", "instant"], "locations": ["delhi", "mumbai", "noida", "jaipur"], "best_for": "College students & freshers", "is_featured": False},
    {"id": str(uuid.uuid4()), "name": "Credila", "tagline": "Education loans — HDFC subsidiary", "logo_emoji": "📚", "interest_rate_min": 10.5, "interest_rate_max": 14.0, "loan_amount_min": 50000, "loan_amount_max": 7500000, "tenure_min_months": 12, "tenure_max_months": 120, "approval_time": "3 days", "min_cibil": 680, "rating": 4.3, "review_count": 3200, "apply_url": "https://credila.com", "categories": ["student"], "locations": ["delhi", "mumbai", "jaipur"], "best_for": "Higher education financing", "is_featured": False},
    {"id": str(uuid.uuid4()), "name": "FlexiLoans", "tagline": "SME working capital loans", "logo_emoji": "🧾", "interest_rate_min": 14.0, "interest_rate_max": 28.0, "loan_amount_min": 100000, "loan_amount_max": 5000000, "tenure_min_months": 3, "tenure_max_months": 36, "approval_time": "48 hrs", "min_cibil": 650, "rating": 4.0, "review_count": 2100, "apply_url": "https://flexiloans.com", "categories": ["business"], "locations": ["delhi", "mumbai", "noida"], "best_for": "Small business owners", "is_featured": False},
]

NOW_ISO = datetime.now(timezone.utc).isoformat()
SEED_BLOGS = [
    {"id": str(uuid.uuid4()), "slug": "best-loan-apps-india-2026", "title": "Best Instant Loan Apps in India 2026", "excerpt": "We compared 12+ lenders on rate, speed, CIBIL requirements and disbursal time.", "content": "## Best Instant Loan Apps in India 2026\n\nWith hundreds of lending apps, choosing the right one is overwhelming. We have compared 12+ RBI-registered lenders.\n\n### Our Top Picks\n\n**Navi** leads for salaried professionals with rates from 9.9%. **KreditBee** tops for low/no CIBIL. **Bajaj Finserv** wins for high-value borrowers.\n\n### How We Rank\n\nInterest rate (40%) + Approval speed (25%) + CIBIL flexibility (20%) + User ratings (15%).", "category": "Guides", "read_time": "6 min", "cover_image": "", "published_at": NOW_ISO, "source": "local"},
    {"id": str(uuid.uuid4()), "slug": "loan-with-low-cibil", "title": "How to Get a Personal Loan with Low CIBIL Score", "excerpt": "A low CIBIL score does not have to mean rejection. Here is what actually works.", "content": "## Getting a Loan with Low CIBIL\n\nA CIBIL below 650 can feel like a dead end. But fintechs like KreditBee, LazyPay and mPokket accept scores as low as 0.\n\n### Tips\n\n1. Show consistent salary credits\n2. Reduce credit utilization below 30%\n3. Avoid multiple simultaneous applications\n4. Start with smaller loan amounts to build history", "category": "Tips", "read_time": "4 min", "cover_image": "", "published_at": NOW_ISO, "source": "local"},
    {"id": str(uuid.uuid4()), "slug": "hidden-charges-loan-apps", "title": "Hidden Charges in Loan Apps You Must Know", "excerpt": "Processing fees, prepayment penalties, bounce charges — the fine print decoded.", "content": "## Hidden Charges in Loan Apps\n\n### Processing Fee\n1 to 3% upfront. On 1 lakh = 1000 to 3000 gone before you see the money.\n\n### Prepayment Charges\n2 to 5% of outstanding principal for early repayment.\n\n### Bounce Charges\n500 to 1500 per missed EMI plus penal interest.\n\n### GST\n18% GST applies on all fees — not on interest, but it adds up.", "category": "Guide", "read_time": "5 min", "cover_image": "", "published_at": NOW_ISO, "source": "local"},
    {"id": str(uuid.uuid4()), "slug": "student-loan-tips-india", "title": "Student Loan Tips: Getting Funds Without a Job", "excerpt": "Studying and need cash? Here is how students can access loans in India.", "content": "## Student Loan Tips\n\n**mPokket** is purpose-built for students — borrow from 500 with just your college ID.\n\n**Credila** (HDFC subsidiary) offers up to 75 lakhs for higher studies.\n\n### Documents Required\n- College ID or admission letter\n- Parent income proof\n- Bank account 6-month statement\n- Aadhaar and PAN", "category": "Students", "read_time": "4 min", "cover_image": "", "published_at": NOW_ISO, "source": "local"},
    {"id": str(uuid.uuid4()), "slug": "aadhaar-loan-explained", "title": "Aadhaar-Based Loans: How They Work in 2026", "excerpt": "Get a loan using just your Aadhaar card. The complete eKYC process explained.", "content": "## Aadhaar-Based Loans Explained\n\nAadhaar eKYC has revolutionized loan disbursal. Many NBFCs now offer instant loans using just your 12-digit Aadhaar number.\n\n### Process\n1. Enter your Aadhaar number in the app\n2. OTP sent to your Aadhaar-linked mobile\n3. Lender fetches KYC directly from UIDAI\n4. No physical documents needed\n\nRates range from 12 to 36% depending on profile.", "category": "Guide", "read_time": "3 min", "cover_image": "", "published_at": NOW_ISO, "source": "local"},
]

@app.on_event("startup")
async def startup():
    if await db.loan_apps.count_documents({}) == 0:
        await db.loan_apps.insert_many(SEED_LOANS)
        logger.info(f"Seeded {len(SEED_LOANS)} loan apps")
    if await db.blog_posts.count_documents({}) == 0:
        await db.blog_posts.insert_many(SEED_BLOGS)
        logger.info(f"Seeded {len(SEED_BLOGS)} blog posts")
    if WP_BASE_URL:
        await db.wp_config.update_one(
            {},
            {"$setOnInsert": {"base_url": WP_BASE_URL, "active": WP_ACTIVE, "wp_username": "", "wp_app_password": ""}},
            upsert=True
        )

# ─── WORDPRESS HELPERS ────────────────────────────────────────────────────────

def _build_wp_headers(cfg: dict) -> dict:
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if cfg.get("wp_username") and cfg.get("wp_app_password"):
        import base64
        creds = base64.b64encode(f"{cfg['wp_username']}:{cfg['wp_app_password']}".encode()).decode()
        headers["Authorization"] = f"Basic {creds}"
    return headers

def _get_wp_api_url(base_url: str) -> str:
    """Return correct API URL for both WordPress.com and self-hosted."""
    if "wordpress.com" in base_url:
        site = base_url.replace("https://", "").replace("http://", "").rstrip("/")
        return f"https://public-api.wordpress.com/wp/v2/sites/{site}/posts"
    return f"{base_url.rstrip('/')}/wp-json/wp/v2/posts"

def _normalize_wp_post(p: dict) -> dict:
    """Convert a WP API post object to our schema."""
    img = ""
    try:
        img = p["_embedded"]["wp:featuredmedia"][0]["source_url"]
    except Exception:
        pass
    excerpt = htmllib.unescape(re.sub(r"<[^>]+>", "", p.get("excerpt", {}).get("rendered", ""))).strip()
    title = htmllib.unescape(p.get("title", {}).get("rendered", ""))
    content = p.get("content", {}).get("rendered", "")
    word_count = len(re.findall(r"\w+", content))
    read_time = f"{max(1, word_count // 200)} min"
    return {
        "id": str(p["id"]),
        "slug": p["slug"],
        "title": title,
        "excerpt": excerpt[:200] + ("…" if len(excerpt) > 200 else ""),
        "content": content,
        "category": "Guide",
        "read_time": read_time,
        "cover_image": img,
        "published_at": p.get("date", ""),
        "source": "wordpress",
        "wp_id": p["id"],
        "wp_link": p.get("link", ""),
    }

def _fetch_wp_posts_sync(cfg: dict, per_page: int = 12, page: int = 1) -> List[dict]:
    import requests
    base = cfg["base_url"].rstrip("/")
    url = _get_wp_api_url(base)
    params = {"_embed": 1, "per_page": per_page, "page": page}
    if "wordpress.com" not in base:
        params["status"] = "publish"
    headers = _build_wp_headers(cfg)
    r = requests.get(url, params=params, headers=headers, timeout=10)
    r.raise_for_status()
    return [_normalize_wp_post(p) for p in r.json()]

async def _fetch_wp_posts(cfg: dict, per_page: int = 12, page: int = 1) -> List[dict]:
    return await asyncio.to_thread(_fetch_wp_posts_sync, cfg, per_page, page)

# ─── EMAIL ────────────────────────────────────────────────────────────────────

async def send_lead_notification(lead: dict):
    if not RESEND_API_KEY or not ADMIN_NOTIFY_EMAIL:
        return
    try:
        import resend
        resend.api_key = RESEND_API_KEY
        amt = lead.get("loan_amount", 0)
        body_html = f"""
        <div style="background:#070F1E;color:#fff;font-family:sans-serif;padding:32px;border-radius:12px;max-width:560px">
          <div style="border-left:3px solid #00FF9D;padding-left:16px;margin-bottom:24px">
            <h2 style="color:#00FF9D;margin:0;font-size:20px">New TrueCreds Lead</h2>
            <p style="color:#64748B;margin:4px 0 0;font-size:12px">{lead.get('created_at', '')}</p>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#94A3B8;width:40%">Name</td><td style="padding:8px 0;color:#fff;font-weight:600">{lead.get('full_name', '')}</td></tr>
            <tr><td style="padding:8px 0;color:#94A3B8">Mobile</td><td style="padding:8px 0;color:#fff;font-family:monospace">{lead.get('mobile', '')}</td></tr>
            <tr><td style="padding:8px 0;color:#94A3B8">Email</td><td style="padding:8px 0;color:#fff">{lead.get('email') or 'not provided'}</td></tr>
            <tr><td style="padding:8px 0;color:#94A3B8">Loan Amount</td><td style="padding:8px 0;color:#00FF9D;font-family:monospace;font-weight:700">Rs {amt:,.0f}</td></tr>
            <tr><td style="padding:8px 0;color:#94A3B8">Employment</td><td style="padding:8px 0;color:#fff">{lead.get('employment_type') or 'not provided'}</td></tr>
            <tr><td style="padding:8px 0;color:#94A3B8">City</td><td style="padding:8px 0;color:#fff">{lead.get('city') or 'not provided'}</td></tr>
          </table>
        </div>"""
        await asyncio.to_thread(resend.Emails.send, {
            "from": SENDER_EMAIL,
            "to": [ADMIN_NOTIFY_EMAIL],
            "subject": f"New Lead: {lead.get('full_name', '')} — Rs {amt:,.0f}",
            "html": body_html,
        })
        logger.info(f"Email sent for {lead.get('full_name', '')}")
    except Exception as e:
        logger.error(f"Email failed: {e}")

# ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────

@app.get("/api/")
async def health():
    return {"status": "ok", "service": "TrueCreds API", "version": "2.0.0"}

@app.get("/api/loan-apps")
async def get_loan_apps(
    category: Optional[str] = None,
    location: Optional[str] = None,
    min_amount: Optional[int] = None,
    max_rate: Optional[float] = None,
    min_cibil: Optional[int] = None,
    sort: Optional[str] = "rating",
):
    q = {}
    if category:
        q["categories"] = category
    if location:
        q["locations"] = location
    if min_amount:
        q["loan_amount_max"] = {"$gte": min_amount}
    if max_rate:
        q["interest_rate_min"] = {"$lte": max_rate}
    if min_cibil:
        q["min_cibil"] = {"$lte": min_cibil}
    sort_field = {"rate": ("interest_rate_min", 1), "amount": ("loan_amount_max", -1)}.get(sort, ("rating", -1))
    return await db.loan_apps.find(q, {"_id": 0}).sort(*sort_field).to_list(100)

@app.get("/api/loan-apps/{loan_id}")
async def get_loan_app(loan_id: str):
    loan = await db.loan_apps.find_one({"id": loan_id}, {"_id": 0})
    if not loan:
        raise HTTPException(404, "Not found")
    return loan

@app.post("/api/leads")
async def create_lead(lead: LeadCreate, background_tasks: BackgroundTasks):
    if not re.match(r"^[6-9]\d{9}$", lead.mobile):
        raise HTTPException(422, "Invalid Indian mobile number")
    d = lead.model_dump(exclude_none=True)
    d.update({
        "id": str(uuid.uuid4()),
        "source": "website",
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.leads.insert_one(d)
    background_tasks.add_task(send_lead_notification, d)
    return {"success": True, "id": d["id"]}

@app.post("/api/contact")
async def create_contact(contact: ContactCreate):
    d = contact.model_dump()
    d["id"] = str(uuid.uuid4())
    d["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contacts.insert_one(d)
    return {"success": True}

@app.get("/api/blog/posts")
async def get_blog_posts(page: int = 1, per_page: int = 12, source: Optional[str] = None):
    cfg = await db.wp_config.find_one({}, {"_id": 0})
    if not source and cfg and cfg.get("active") and cfg.get("base_url"):
        try:
            wp_posts = await _fetch_wp_posts(cfg, per_page, page)
            if wp_posts:
                return {"posts": wp_posts, "source": "wordpress", "total": len(wp_posts)}
        except Exception as e:
            logger.warning(f"WP fetch failed, using local: {e}")
    posts = await db.blog_posts.find({}, {"_id": 0}).sort("published_at", -1).skip((page - 1) * per_page).to_list(per_page)
    total = await db.blog_posts.count_documents({})
    return {"posts": posts, "source": "local", "total": total}

@app.get("/api/blog/posts/{slug}")
async def get_blog_post(slug: str):
    cfg = await db.wp_config.find_one({}, {"_id": 0})
    if cfg and cfg.get("active") and cfg.get("base_url"):
        try:
            import requests
            base = cfg["base_url"].rstrip("/")
            if "wordpress.com" in base:
                site = base.replace("https://", "").replace("http://", "")
                url = f"https://public-api.wordpress.com/wp/v2/sites/{site}/posts"
            else:
                url = f"{base}/wp-json/wp/v2/posts"
            r = requests.get(url, params={"slug": slug, "_embed": 1}, headers=_build_wp_headers(cfg), timeout=8)
            if r.ok and r.json():
                return _normalize_wp_post(r.json()[0])
        except Exception as e:
            logger.warning(f"WP single post failed: {e}")
    post = await db.blog_posts.find_one({"slug": slug}, {"_id": 0})
    if not post:
        raise HTTPException(404, "Post not found")
    return post

# ─── AUTH ROUTES ──────────────────────────────────────────────────────────────

@app.post("/api/auth/login")
async def login(body: LoginRequest):
    if body.username != ADMIN_USERNAME or body.password != ADMIN_PASSWORD:
        raise HTTPException(401, "Invalid credentials")
    return {"access_token": create_token(body.username), "token_type": "bearer"}

@app.get("/api/auth/me")
async def me(u: str = Depends(verify_token)):
    return {"username": u}

# ─── ADMIN: LEADS ─────────────────────────────────────────────────────────────

@app.get("/api/leads")
async def get_leads(q: Optional[str] = None, status_filter: Optional[str] = None, u: str = Depends(verify_token)):
    query = {}
    if q:
        query["$or"] = [
            {"full_name": {"$regex": q, "$options": "i"}},
            {"mobile": {"$regex": q}},
            {"city": {"$regex": q, "$options": "i"}},
        ]
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    return await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)

@app.delete("/api/leads/{lead_id}")
async def delete_lead(lead_id: str, u: str = Depends(verify_token)):
    r = await db.leads.delete_one({"id": lead_id})
    if r.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"success": True}

@app.patch("/api/leads/{lead_id}")
async def update_lead(lead_id: str, body: LeadStatusUpdate, u: str = Depends(verify_token)):
    await db.leads.update_one({"id": lead_id}, {"$set": {"status": body.status}})
    return {"success": True}

@app.get("/api/contact")
async def get_contacts(u: str = Depends(verify_token)):
    return await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)

# ─── ADMIN: WORDPRESS ────────────────────────────────────────────────────────

@app.get("/api/wp/config")
async def get_wp_config(u: str = Depends(verify_token)):
    cfg = await db.wp_config.find_one({}, {"_id": 0})
    return cfg or {"base_url": "", "active": False, "wp_username": "", "wp_app_password": ""}

@app.post("/api/wp/config")
async def save_wp_config(body: WpConfigUpdate, u: str = Depends(verify_token)):
    upd = {k: v for k, v in body.model_dump().items() if v is not None}
    await db.wp_config.update_one({}, {"$set": upd}, upsert=True)
    return {"success": True}

@app.post("/api/wp/test")
async def test_wp(body: WpTestRequest, u: str = Depends(verify_token)):
    cfg = await db.wp_config.find_one({}, {"_id": 0}) or {}
    base_url = (body.base_url or cfg.get("base_url", "")).rstrip("/")
    if not base_url:
        return {"ok": False, "logs": ["No URL provided"], "post_count": 0, "latency_ms": 0}

    import requests
    start = time.time()
    logs = []

    try:
        is_wpcom = "wordpress.com" in base_url
        if is_wpcom:
            site = base_url.replace("https://", "").replace("http://", "")
            api_url = f"https://public-api.wordpress.com/wp/v2/sites/{site}/posts"
            logs.append(f"Detected WordPress.com site: {site}")
        else:
            api_url = f"{base_url}/wp-json/wp/v2/posts"
            logs.append(f"Self-hosted WordPress: {base_url}")

        r = requests.get(api_url, params={"per_page": 5}, timeout=10)
        lat = int((time.time() - start) * 1000)
        logs.append(f"HTTP {r.status_code} — {lat}ms")
        logs.append(f"CORS: {r.headers.get('Access-Control-Allow-Origin', 'not set')}")

        if r.ok:
            posts = r.json()
            pc = len(posts)
            logs.append(f"Posts fetched: {pc}")
            if pc > 0:
                title = posts[0].get("title", {}).get("rendered", "")[:60]
                logs.append(f"Latest post: {title}")
            else:
                logs.append("No posts yet — publish a post on WordPress first")

            await db.wp_config.update_one(
                {},
                {"$set": {"last_tested": datetime.now(timezone.utc).isoformat(), "last_status": "ok", "last_post_count": pc, "last_error": ""}},
                upsert=True,
            )
            logs.append("Connection successful!")
            return {"ok": True, "logs": logs, "post_count": pc, "latency_ms": lat}
        else:
            logs.append(f"Failed with status {r.status_code}: {r.text[:150]}")
            return {"ok": False, "logs": logs, "post_count": 0, "latency_ms": lat}

    except requests.Timeout:
        lat = int((time.time() - start) * 1000)
        logs.append(f"Connection timed out after {lat}ms")
        return {"ok": False, "logs": logs, "post_count": 0, "latency_ms": lat}
    except Exception as e:
        lat = int((time.time() - start) * 1000)
        logs.append(f"Error: {str(e)}")
        return {"ok": False, "logs": logs, "post_count": 0, "latency_ms": lat}

@app.post("/api/wp/sync")
async def sync_wp_posts(u: str = Depends(verify_token)):
    cfg = await db.wp_config.find_one({}, {"_id": 0})
    if not cfg or not cfg.get("base_url"):
        raise HTTPException(400, "WordPress not configured")
    try:
        posts = await _fetch_wp_posts(cfg, 100, 1)
        synced = 0
        for p in posts:
            existing = await db.blog_posts.find_one({"slug": p["slug"]})
            if not existing:
                p["id"] = str(uuid.uuid4())
                await db.blog_posts.insert_one(p)
                synced += 1
            else:
                await db.blog_posts.update_one({"slug": p["slug"]}, {"$set": p})
        return {"success": True, "synced": synced, "total": len(posts)}
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/api/wp/posts")
async def create_wp_post(body: WpPostCreate, u: str = Depends(verify_token)):
    cfg = await db.wp_config.find_one({}, {"_id": 0})
    if not cfg or not cfg.get("base_url"):
        raise HTTPException(400, "WordPress not configured")
    if not cfg.get("wp_username") or not cfg.get("wp_app_password"):
        raise HTTPException(400, "WordPress auth not configured")
    import requests
    payload = {"title": body.title, "content": body.content, "status": body.status or "publish"}
    if body.excerpt:
        payload["excerpt"] = body.excerpt
    r = requests.post(
        f"{cfg['base_url'].rstrip('/')}/wp-json/wp/v2/posts",
        json=payload,
        headers=_build_wp_headers(cfg),
        timeout=15,
    )
    if not r.ok:
        raise HTTPException(r.status_code, r.text[:200])
    return r.json()

@app.get("/api/wp/categories")
async def get_wp_categories(u: str = Depends(verify_token)):
    cfg = await db.wp_config.find_one({}, {"_id": 0})
    if not cfg or not cfg.get("base_url"):
        return []
    import requests
    try:
        r = requests.get(
            f"{cfg['base_url'].rstrip('/')}/wp-json/wp/v2/categories",
            params={"per_page": 100},
            headers=_build_wp_headers(cfg),
            timeout=8,
        )
        return r.json() if r.ok else []
    except Exception:
        return []

# ─── ADMIN: EMAIL + STATUS ────────────────────────────────────────────────────

@app.post("/api/admin/test-email")
async def test_email(u: str = Depends(verify_token)):
    if not RESEND_API_KEY:
        return {"ok": False, "error": "RESEND_API_KEY not set in .env"}
    await send_lead_notification({
        "full_name": "Test User",
        "mobile": "9999999999",
        "email": "test@truecreds.in",
        "loan_amount": 250000,
        "employment_type": "Salaried",
        "city": "Mumbai",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source": "test",
        "status": "new",
    })
    return {"ok": True, "message": f"Test email sent to {ADMIN_NOTIFY_EMAIL}"}

@app.get("/api/status/system")
async def system_status(u: str = Depends(verify_token)):
    try:
        await db.command("ping")
        db_ok = True
    except Exception:
        db_ok = False
    wp = await db.wp_config.find_one({}, {"_id": 0}) or {}
    return {
        "database": {
            "connected": db_ok,
            "name": DB_NAME,
            "host": MONGO_URL.split("@")[-1][:30] if "@" in MONGO_URL else "localhost",
        },
        "wordpress": {
            "active": wp.get("active", False),
            "base_url": wp.get("base_url", ""),
            "last_status": wp.get("last_status", ""),
            "last_tested": wp.get("last_tested", ""),
            "post_count": wp.get("last_post_count", 0),
            "has_auth": bool(wp.get("wp_username")),
        },
        "email": {
            "configured": bool(RESEND_API_KEY),
            "from": SENDER_EMAIL,
            "to": ADMIN_NOTIFY_EMAIL,
        },
        "counters": {
            "total_leads": await db.leads.count_documents({}),
            "loan_apps": await db.loan_apps.count_documents({}),
            "blog_posts": await db.blog_posts.count_documents({}),
            "contacts": await db.contacts.count_documents({}),
            "version": "2.0.0",
            "service": "running",
        },
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

# ─── DYNAMIC PAGES ────────────────────────────────────────────────────────────

class PageSection(BaseModel):
    type: str  # hero | text | cards | cta | faq | stats
    data: dict

class DynamicPageCreate(BaseModel):
    title: str
    slug: str
    meta_description: Optional[str] = None
    status: Optional[str] = "published"  # published | draft
    sections: Optional[List[PageSection]] = []

class DynamicPageUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    meta_description: Optional[str] = None
    status: Optional[str] = None
    sections: Optional[List[PageSection]] = None

# PUBLIC: get a published page by slug
@app.get("/api/pages/{slug}")
async def get_page(slug: str):
    page = await db.dynamic_pages.find_one({"slug": slug, "status": "published"}, {"_id": 0})
    if not page:
        raise HTTPException(404, "Page not found")
    return page

# PUBLIC: list all published pages (for sitemap/nav)
@app.get("/api/pages")
async def list_pages_public():
    pages = await db.dynamic_pages.find({"status": "published"}, {"_id": 0, "sections": 0}).sort("created_at", -1).to_list(100)
    return pages

# ADMIN: list all pages including drafts
@app.get("/api/admin/pages")
async def list_pages(u: str = Depends(verify_token)):
    pages = await db.dynamic_pages.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return pages

# ADMIN: create page
@app.post("/api/admin/pages")
async def create_page(body: DynamicPageCreate, u: str = Depends(verify_token)):
    existing = await db.dynamic_pages.find_one({"slug": body.slug})
    if existing:
        raise HTTPException(400, f"Slug '{body.slug}' already exists")
    page = body.model_dump()
    page["id"] = str(uuid.uuid4())
    page["created_at"] = datetime.now(timezone.utc).isoformat()
    page["updated_at"] = datetime.now(timezone.utc).isoformat()
    page["views"] = 0
    await db.dynamic_pages.insert_one(page)
    return {"success": True, "id": page["id"], "slug": page["slug"]}

# ADMIN: update page
@app.put("/api/admin/pages/{page_id}")
async def update_page(page_id: str, body: DynamicPageUpdate, u: str = Depends(verify_token)):
    upd = {k: v for k, v in body.model_dump().items() if v is not None}
    upd["updated_at"] = datetime.now(timezone.utc).isoformat()
    if "sections" in body.model_dump() and body.sections is not None:
        upd["sections"] = [s.model_dump() for s in body.sections]
    result = await db.dynamic_pages.update_one({"id": page_id}, {"$set": upd})
    if result.matched_count == 0:
        raise HTTPException(404, "Page not found")
    return {"success": True}

# ADMIN: delete page
@app.delete("/api/admin/pages/{page_id}")
async def delete_page(page_id: str, u: str = Depends(verify_token)):
    result = await db.dynamic_pages.delete_one({"id": page_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Page not found")
    return {"success": True}

# ADMIN: toggle publish/draft
@app.patch("/api/admin/pages/{page_id}/status")
async def toggle_page_status(page_id: str, u: str = Depends(verify_token)):
    page = await db.dynamic_pages.find_one({"id": page_id})
    if not page:
        raise HTTPException(404, "Page not found")
    new_status = "draft" if page.get("status") == "published" else "published"
    await db.dynamic_pages.update_one({"id": page_id}, {"$set": {"status": new_status, "updated_at": datetime.now(timezone.utc).isoformat()}})
    return {"success": True, "status": new_status}
