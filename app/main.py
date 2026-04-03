from fastapi import FastAPI
from app.routes import upload, query   # 👈 import routes
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev (later restrict)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
app.include_router(upload.router)
app.include_router(query.router)

@app.get("/")
def test():
    return {"message": "Backend running"}