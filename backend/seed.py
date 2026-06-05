import logging
from datetime import date
from sqlmodel import Session, select
from database import engine
from models import Certificado, Evento, Usuario

logger = logging.getLogger("uvicorn")
def povoa_banco():
    with Session(engine) as session:
        usuario_existe = session.exec(select(Usuario)).first()
        if usuario_existe:
            logger.info("BANCO COM REGISTRO")
            return
        logger.info("BANCO ZERADO")

        usuario_teste = Usuario(nome = "ph", cpf= "696969696969")
        session.add(usuario_teste)
        evento_teste = Evento(titulo= "SAC PET", texto = "semana da computacao e etccccccccc cccc ccc", data_inicio= date(2001, 9, 11), data_fim= date(2026, 1, 1))
        session.add(evento_teste)
        session.commit()
        session.refresh(usuario_teste)
        session.refresh(evento_teste)

        certificado_teste = Certificado(carga_horaria= 20, id_usuario=usuario_teste.id, id_evento= evento_teste.id)
        session.add(certificado_teste)
        session.commit()
        logger.info("SUCESSO. BANCO POVOADO")
