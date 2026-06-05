from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Evento
from schemas import EventoSchema

router = APIRouter(prefix="/eventos", tags=["Eventos"])

'''
            Eventos
'''
# retorna uma lista com todos os eventos
@router.get("/", response_model= list[Evento])
def listar_eventos(session: Session= Depends(get_session)):
    eventos = session.exec(select(Evento)).all()
    return eventos

# cria um evento
@router.post("/", response_model= Evento, status_code= status.HTTP_201_CREATED)
def criar_evento(evento_novo: EventoSchema, session: Session = Depends(get_session)):
    evento = Evento.model_validate(evento_novo)

    try:
        session.add(evento)
        session.commit()
        session.refresh(evento)
        return evento
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code= status.HTTP_400_BAD_REQUEST, detail = f"ERRO PRA CRIAR EVENTO.\n Mais sobre o problema: {str(e)}")

# deleta um evento pelo id
@router.delete("/{evento_id}")
def deletar_evento(evento_id: int, session: Session= Depends(get_session)):
    db_evento = session.get(Evento, evento_id)
    if not db_evento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "EVENTO NÃO ENCONTRADO")
    
    session.delete(db_evento)
    session.commit()
    return {"message": "EVENTO DELETADO COM SUCESSO"}

# retorna um evento especifico pelo id
@router.get("/{evento_id}", response_model= Evento)
def buscar_evento_por_id(evento_id: int, session: Session=Depends(get_session)):
    evento = session.get(Evento, evento_id)
    if not evento:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= "EVENTO NÃO ENCONTRADO")
    return evento

# edita um evento especifico pelo id
@router.put("/{evento_id}", response_model= Evento)
def atualizar_evento(evento_id: int, evento_atualizado: EventoSchema, session: Session= Depends(get_session)):
    db_evento = session.get(Evento, evento_id)
    if not db_evento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="EVENTO NÃO ENCONTRADO")
    
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

