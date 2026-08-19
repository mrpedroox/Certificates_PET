from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session, select, col
from database import get_session
from models import Usuario
from schemas import UsuarioSchema
from routes.database_errors import commit_or_raise

router = APIRouter(prefix="/usuarios", tags=["Usuários"])

'''
            Usuarios
'''
# retorna uma lista com todos os usuarios
@router.get("/", response_model= list[Usuario])
def listar_usuarios(session: Session= Depends(get_session)):
    usuarios = session.exec(select(Usuario)).all()
    return usuarios

# cria um usuario
@router.post("/", response_model= Usuario, status_code= status.HTTP_201_CREATED)
def criar_usuario(usuario_novo: UsuarioSchema, session: Session = Depends(get_session)):
    usuario = Usuario.model_validate(usuario_novo)
    session.add(usuario)
    commit_or_raise(session, "JÁ EXISTE UM USUÁRIO COM ESTE CPF")
    session.refresh(usuario)
    return usuario

# deleta um usuario pelo id
@router.delete("/{usuario_id}")
def deletar_usuario(usuario_id: int, session: Session= Depends(get_session)):
    db_usuario = session.get(Usuario, usuario_id)
    if not db_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= "USUÁRIO NÃO ENCONTRADO")
    
    session.delete(db_usuario)
    session.commit()
    return {"message": "USUÁRIO DELETADO COM SUCESSO"}

# retorna uma lista com todos os usuarios com um nome especifico
@router.get("/buscar")
def buscar_usuario_por_nome(nome: str, session: Session = Depends(get_session)):
    usuarios = session.exec( select(Usuario).where(col(Usuario.nome).ilike(f"%{nome}%")) ).all()
    
    if not usuarios:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="NENHUM USUÁRIO ENCONTRADO COM ESTE NOME")
    
    return usuarios

# retorna um usuario especifico pelo id
@router.get("/{usuario_id}", response_model= Usuario)
def buscar_usuario_por_id(usuario_id: int, session: Session=Depends(get_session)):
    usuario = session.get(Usuario, usuario_id)
    if not usuario:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail= "USUÁRIO NÃO ENCONTRADO")
    return usuario

# edita um usuario especifico pelo id
@router.put("/{usuario_id}", response_model= Usuario)
def atualizar_usuario(usuario_id: int, usuario_atualizado: UsuarioSchema, session: Session= Depends(get_session)):
    db_usuario = session.get(Usuario, usuario_id)
    if not db_usuario:
        raise HTTPException(status_code= status.HTTP_404_NOT_FOUND, detail="USUÁRIO NÃO ENCONTRADO")
    
    dados_novos= usuario_atualizado.model_dump(exclude_unset= True)
    for chave, valor in dados_novos.items():
        setattr(db_usuario, chave, valor)
    
    session.add(db_usuario)
    commit_or_raise(session, "JÁ EXISTE UM USUÁRIO COM ESTE CPF")
    session.refresh(db_usuario)
    return db_usuario
