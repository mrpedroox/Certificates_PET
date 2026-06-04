from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from database import engine, get_session
from models import Certificado

app = FastAPI(title= "Sistema Certificados")
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
@app.get("/certificados/", response_model= list[Certificado])
def listar_certificados(session: Session= Depends(get_session)):
    certificados = session.exec(select(Certificado)).all()
    return certificados

@app.post("/certificados/", response_model= Certificado, status_code= status.HTTP_201_CREATED)
def criar_certificado(certificado: Certificado, session: Session = Depends(get_session)):
    try:
        session.add(certificado)
        session.commit()
        session.refresh(certificado)
        return certificado
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code= 400, detail = f"ERRO PRA CRIAR CERTIFICADO. VERIFIQUE SE O USUÁRIO E O EVENTO EXISTEM. Mais sobre o problema: {str(e)}")

@app.delete("/certificados/{certificado_id}")
def deletar_certificado(certificado_id: int, session: Session= Depends(get_session)):
    db_certificado = session.get(Certificado, certificado_id)
    if not db_certificado:
        raise HTTPException(status_code=404, detail= "CERTIFICADO NAO ENCONTRADO")
    
    session.delete(db_certificado)
    session.commit()
    return {"message": "DELETADO COM SUCESSO"}

@app.get("/certificados/{certificado_id}", response_model= Certificado)
def buscar_certificado_por_id(certificado_id: int, session: Session=Depends(get_session)):
    certificado = session.get(Certificado, certificado_id)
    if not certificado:
        raise HTTPException(status_code= 404, detail= "CERTIFICADO NAO ENCONTRADO")
    return certificado

@app.put("/certificados/{certificado_id}", response_model= Certificado)
def atualizar_certificado(certificado_id: int, certificado_atualizado: Certificado, session: Session= Depends(get_session)):
    db_certificado = session.get(Certificado, certificado_id)
    if not db_certificado:
        raise HTTPException(status_code=404, detail="CERTIFICADO NAO ENCONTRADO")
    
    dados_novos= certificado_atualizado.dict(exclude_unset= True)
    for chave, valor in dados_novos.items():
        setattr(db_certificado, chave, valor)
    
    try:
        session.add(db_certificado)
        session.commit()
        session.refresh(db_certificado)
        return db_certificado
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=400, detail= f"ERRO NA ATUALIZACAO. VERIFIQUE SE O USUÁRIO E O EVENTO EXISTEM. Mais sobre o problema: {str(e)}")
    
