from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session, select, col
from database import get_session
from models import Certificado, Evento
from schemas import EventoSchema
from routes.database_errors import commit_or_raise

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

    session.add(evento)
    commit_or_raise(session, "NÃO FOI POSSÍVEL CRIAR O EVENTO COM OS DADOS INFORMADOS")
    session.refresh(evento)
    return evento

# deleta um evento pelo id
@router.delete("/{evento_id}")
def deletar_evento(evento_id: int, session: Session= Depends(get_session)):
    db_evento = session.get(Evento, evento_id)
    if not db_evento:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "EVENTO NÃO ENCONTRADO")
    
    certificados = session.exec(
        select(Certificado).where(Certificado.id_evento == evento_id)
    ).all()
    for certificado in certificados:
        session.delete(certificado)

    session.delete(db_evento)
    commit_or_raise(
        session,
        "NÃO FOI POSSÍVEL EXCLUIR O EVENTO",
    )
    return {
        "message": "EVENTO DELETADO COM SUCESSO",
        "certificados_removidos": len(certificados),
    }

# retorna uma lista com todos os eventos com um titulo especifico
@router.get("/buscar")
def buscar_evento_por_titulo(nome: str, session: Session = Depends(get_session)):
    eventos = session.exec( select(Evento).where(col(Evento.titulo).ilike(f"%{nome}%")) ).all()
    
    if not eventos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="NENHUM EVENTO ENCONTRADO COM ESTE TITULO")
    
    return eventos

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
    
    session.add(db_evento)
    commit_or_raise(session, "NÃO FOI POSSÍVEL ATUALIZAR O EVENTO COM OS DADOS INFORMADOS")
    session.refresh(db_evento)
    return db_evento
