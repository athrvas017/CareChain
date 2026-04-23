from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# DB
from app.database import Base, engine

# Models
from app.models import user, campaign, donation

# Routers
from app.routers import auth_router, user_router, campaign_router, donation_router, admin_router, ml_router, request_router, verification_router

# 🚀 Initialize app
app = FastAPI(title="ChainCare API")

# 🌐 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🗄️ Create database tables
Base.metadata.create_all(bind=engine)

# 🛠️ Exception Handler for debugging
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    print(f"❌ HTTP Error {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# 🔗 Include routers
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(campaign_router.router)
app.include_router(donation_router.router)
app.include_router(admin_router.router)
app.include_router(ml_router.router)
app.include_router(request_router.router)
app.include_router(verification_router.router)

# 🏠 Root endpoint
@app.get("/")
def root():
    return {"message": "ChainCare Backend Running 🚀"}