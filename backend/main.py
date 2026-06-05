from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from database import engine, get_session
from contextlib import asynccontextmanager
from models import Certificado, Evento, Usuario


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(title="Sistema de Certificados", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins= ["*"],
    allow_credentials= True,
    allow_methods= ["*"],
    allow_headers= ["*"],
)


'''
            Certificados
'''
# retorna uma lista com todos os certificados
@app.get("/certificados/", response_model= list[Certificado])
def listar_certificados(session: Session= Depends(get_session)):
    certificados = session.exec(select(Certificado)).all()
    return certificados

# cria um certificado
@app.post("/certificados/", response_model= Certificado, status_code= status.HTTP_201_CREATED)
def criar_certificado(certificado: Certificado, session: Session = Depends(get_session)):
    try:
        session.add(certificado)
        session.commit()
        session.refresh(certificado)
        return certificado
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail = f"ERRO PRA CRIAR CERTIFICADO. VERIFIQUE SE O USUÁRIO E O EVENTO EXISTEM.\n Mais sobre o problema: {str(e)}")

# deleta um certificado pelo id
@app.delete("/certificados/{certificado_id}")
def deletar_certificado(certificado_id: int, session: Session= Depends(get_session)):
    db_certificado = session.get(Certificado, certificado_id)
    if not db_certificado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "CERTIFICADO NÃO ENCONTRADO")
    
    session.delete(db_certificado)
    session.commit()
    return {"message": "CERTIFICADO DELETADO COM SUCESSO"}

# retorna um certificado especifico pelo id
@app.get("/certificados/{certificado_id}", response_model= Certificado)
def buscar_certificado_por_id(certificado_id: int, session: Session=Depends(get_session)):
    certificado = session.get(Certificado, certificado_id)
    if not certificado:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= "CERTIFICADO NÃO ENCONTRADO")
    return certificado

# edita um certificado especifico pelo id
@app.put("/certificados/{certificado_id}", response_model= Certificado)
def atualizar_certificado(certificado_id: int, certificado_atualizado: Certificado, session: Session= Depends(get_session)):
    db_certificado = session.get(Certificado, certificado_id)
    if not db_certificado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="CERTIFICADO NÃO ENCONTRADO")
    
    dados_novos= certificado_atualizado.model_dump(exclude_unset= True)
    for chave, valor in dados_novos.items():
        setattr(db_certificado, chave, valor)
    
    try:
        session.add(db_certificado)
        session.commit()
        session.refresh(db_certificado)
        return db_certificado
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail= f"ERRO NA ATUALIZAÇÃO DE CERTIFICADO. VERIFIQUE SE O USUÁRIO E O EVENTO EXISTEM. \n Mais sobre o problema: {str(e)}")


'''
            Eventos
'''
# retorna uma lista com todos os eventos
@app.get("/eventos/", response_model= list[Evento])
def listar_eventos(session: Session= Depends(get_session)):
    eventos = session.exec(select(Evento)).all()
    return eventos

# cria um evento
@app.post("/eventos/", response_model= Evento, status_code= status.HTTP_201_CREATED)
def criar_evento(evento: Evento, session: Session = Depends(get_session)):
    if evento.data_fim < evento.data_inicio:
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail= f"ERRO PARA CRIAR EVENTO. DATA DE INICIO NÃO PODE SER DEPOIS DA DATA DE FIM.")

    try:
        session.add(evento)
        session.commit()
        session.refresh(evento)
        return evento
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail = f"ERRO PRA CRIAR EVENTO.\n Mais sobre o problema: {str(e)}")

# deleta um evento pelo id
@app.delete("/eventos/{evento_id}")
def deletar_evento(evento_id: int, session: Session= Depends(get_session)):
    db_evento = session.get(Evento, evento_id)
    if not db_evento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "EVENTO NÃO ENCONTRADO")
    
    session.delete(db_evento)
    session.commit()
    return {"message": "EVENTO DELETADO COM SUCESSO"}

# retorna um evento especifico pelo id
@app.get("/eventos/{evento_id}", response_model= Evento)
def buscar_evento_por_id(evento_id: int, session: Session=Depends(get_session)):
    evento = session.get(Evento, evento_id)
    if not evento:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= "EVENTO NÃO ENCONTRADO")
    return evento

# edita um evento especifico pelo id
@app.put("/eventos/{evento_id}", response_model= Evento)
def atualizar_evento(evento_id: int, evento_atualizado: Evento, session: Session= Depends(get_session)):
    db_evento = session.get(Evento, evento_id)
    if not db_evento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="EVENTO NÃO ENCONTRADO")
    
    if evento_atualizado.data_fim < evento_atualizado.data_inicio:
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail= f"ERRO NA ATUALIZAÇÃO DE EVENTO. DATA DE INICIO NÃO PODE SER DEPOIS DA DATA DE FIM.")

    dados_novos= evento_atualizado.model_dump(exclude_unset= True)
    for chave, valor in dados_novos.items():
        setattr(db_evento, chave, valor)
    
    try:
        session.add(db_evento)
        session.commit()
        session.refresh(db_evento)
        return db_evento
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail= f"ERRO NA ATUALIZAÇÃO DE EVENTO. \n Mais sobre o problema: {str(e)}")


'''
            Usuarios
'''
# retorna uma lista com todos os usuarios
@app.get("/usuarios/", response_model= list[Usuario])
def listar_usuarios(session: Session= Depends(get_session)):
    usuarios = session.exec(select(Usuario)).all()
    return usuarios

# cria um usuario
@app.post("/usuarios/", response_model= Usuario, status_code= status.HTTP_201_CREATED)
def criar_usuario(usuario: Usuario, session: Session = Depends(get_session)):
    try:
        session.add(usuario)
        session.commit()
        session.refresh(usuario)
        return usuario
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail = f"ERRO PRA CRIAR USUÁRIO. VERIFIQUE SE O USUÁRIO JÁ EXISTE.\n Mais sobre o problema: {str(e)}")

# deleta um usuario pelo id
@app.delete("/usuarios/{usuario_id}")
def deletar_usuario(usuario_id: int, session: Session= Depends(get_session)):
    db_usuario = session.get(Usuario, usuario_id)
    if not db_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "USUÁRIO NÃO ENCONTRADO")
    
    session.delete(db_usuario)
    session.commit()
    return {"message": "USUÁRIO DELETADO COM SUCESSO"}

# retorna um usuario especifico pelo id
@app.get("/usuarios/{usuario_id}", response_model= Usuario)
def buscar_usuario_por_id(usuario_id: int, session: Session=Depends(get_session)):
    usuario = session.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= "USUÁRIO NÃO ENCONTRADO")
    return usuario

# edita um usuario especifico pelo id
@app.put("/usuarios/{usuario_id}", response_model= Usuario)
def atualizar_usuario(usuario_id: int, usuario_atualizado: Usuario, session: Session= Depends(get_session)):
    db_usuario = session.get(Usuario, usuario_id)
    if not db_usuario:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail="USUÁRIO NÃO ENCONTRADO")
    
    dados_novos= usuario_atualizado.model_dump(exclude_unset= True)
    for chave, valor in dados_novos.items():
        setattr(db_usuario, chave, valor)
    
    try:
        session.add(db_usuario)
        session.commit()
        session.refresh(db_usuario)
        return db_usuario
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail= f"ERRO NA ATUALIZAÇÃO DE USUÁRIO.\n Mais sobre o problema: {str(e)}")
