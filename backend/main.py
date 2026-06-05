from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from database import engine, get_session
from contextlib import asynccontextmanager
from models import Certificado, Evento, Usuario
from routes import usuarios, eventos, certificados
from seed import povoa_banco

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    povoa_banco()
    yield

app = FastAPI(title="Sistema de Certificados", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],
    allow_credentials= True,
    allow_methods= ["*"],
    allow_headers= ["*"],
)

app.include_router(usuarios.router)
app.include_router(eventos.router)
app.include_router(certificados.router)
