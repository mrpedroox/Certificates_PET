from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session, select
from database import get_session
from models import Usuario

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

'''
            Usuarios
'''
# retorna uma lista com todos os usuarios
@router.get("/usuarios/", response_model= list[Usuario])
def listar_usuarios(session: Session= Depends(get_session)):
    usuarios = session.exec(select(Usuario)).all()
    return usuarios

# cria um usuario
@router.post("/usuarios/", response_model= Usuario, status_code= status.HTTP_201_CREATED)
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
@router.delete("/usuarios/{usuario_id}")
def deletar_usuario(usuario_id: int, session: Session= Depends(get_session)):
    db_usuario = session.get(Usuario, usuario_id)
    if not db_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "USUÁRIO NÃO ENCONTRADO")
    
    session.delete(db_usuario)
    session.commit()
    return {"message": "USUÁRIO DELETADO COM SUCESSO"}

# retorna um usuario especifico pelo id
@router.get("/usuarios/{usuario_id}", response_model= Usuario)
def buscar_usuario_por_id(usuario_id: int, session: Session=Depends(get_session)):
    usuario = session.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= "USUÁRIO NÃO ENCONTRADO")
    return usuario

# edita um usuario especifico pelo id
@router.put("/usuarios/{usuario_id}", response_model= Usuario)
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
