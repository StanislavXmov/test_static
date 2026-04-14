from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from api.router_upload import router as router_upload

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://192.168.1.71:5173",
    "http://192.168.1.71:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of allowed origins
    allow_credentials=True,  # Allow cookies to be sent cross-origin
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)


app.mount("/static", StaticFiles(directory="static"), "static")

app.include_router(router_upload)
