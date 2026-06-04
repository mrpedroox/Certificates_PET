from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
from database import engine

app = FastAPI(title= "teste pra ver se ta pegando")
app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],
    allow_credentials= True,
    allow_methods= ["*"],
    allow_headers= ["*"],
)

@app.on_event("startup")
def on_startup():
    import models
    SQLModel.metadata.create_all(engine)
@app.get("/")
def testar_conexao():
    return {
        "status": "Sucecso",
        "mensagem": "Valido"
    }