from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Certificado
from schemas import CertificadoSchema

router = APIRouter(prefix="/certificados", tags=["Certificados"])

'''
            Certificados
'''
# retorna uma lista com todos os certificados
@router.get("/", response_model= list[Certificado])
def listar_certificados(session: Session= Depends(get_session)):
    certificados = session.exec(select(Certificado)).all()
    return certificados

# cria um certificado
@router.post("/", response_model= Certificado, status_code= status.HTTP_201_CREATED)
def criar_certificado(certificado_novo: CertificadoSchema, session: Session = Depends(get_session)):

    certificado = Certificado.model_validate(certificado_novo)
    try:
        session.add(certificado)
        session.commit()
        session.refresh(certificado)
        return certificado
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail = f"ERRO PRA CRIAR CERTIFICADO. VERIFIQUE SE O USUÁRIO E O EVENTO EXISTEM.\n Mais sobre o problema: {str(e)}")

# deleta um certificado pelo id
@router.delete("/{certificado_id}")
def deletar_certificado(certificado_id: int, session: Session= Depends(get_session)):
    db_certificado = session.get(Certificado, certificado_id)
    if not db_certificado:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "CERTIFICADO NÃO ENCONTRADO")
    
    session.delete(db_certificado)
    session.commit()
    return {"message": "CERTIFICADO DELETADO COM SUCESSO"}

# retorna um certificado especifico pelo id
@router.get("/{certificado_id}", response_model= Certificado)
def buscar_certificado_por_id(certificado_id: int, session: Session=Depends(get_session)):
    certificado = session.get(Certificado, certificado_id)
    if not certificado:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= "CERTIFICADO NÃO ENCONTRADO")
    return certificado

# edita um certificado especifico pelo id
@router.put("/{certificado_id}", response_model= Certificado)
def atualizar_certificado(certificado_id: int, certificado_atualizado: CertificadoSchema, session: Session= Depends(get_session)):
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


