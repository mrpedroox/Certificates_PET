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

        # 1. Criação dos Usuários
        usuario_teste = Usuario(nome="Ph", cpf="69696969696")
        usuario_misael = Usuario(nome="Misael", cpf="12345678901")
        usuario_i = Usuario(nome="Isabella", cpf="10987654321")
        usuario_d = Usuario(nome="Diego", cpf="11223344556")
        
        session.add_all([usuario_teste, usuario_misael, usuario_i, usuario_d])

        # 2. Criação dos Eventos
        evento_teste = Evento(titulo="SAC PET", texto="semana da computacao e etccccccccc cccc ccc", data_inicio=date(2001, 9, 11), data_fim=date(2026, 1, 1))
        evento_include = Evento(titulo="Include 2026", texto="Evento de tecnologia e inclusão", data_inicio=date(2026, 5, 10), data_fim=date(2026, 5, 12))
        evento_ca = Evento(titulo="Posse Centro Acadêmico", texto="Cerimônia de posse da nova diretoria", data_inicio=date(2026, 6, 1), data_fim=date(2026, 6, 1))
        
        session.add_all([evento_teste, evento_include, evento_ca])
        
        # Commit para gerar os IDs no banco
        session.commit()
        
        # Atualiza os objetos com os IDs gerados pelo banco
        session.refresh(usuario_teste)
        session.refresh(usuario_misael)
        session.refresh(usuario_i)
        session.refresh(usuario_d)
        session.refresh(evento_teste)
        session.refresh(evento_include)
        session.refresh(evento_ca)

        # 3. Criação dos Certificados relacionando os usuários aos eventos
        certificado_teste = Certificado(carga_horaria=20, id_usuario=usuario_teste.id, id_evento=evento_teste.id)
        certificado_misael = Certificado(carga_horaria=30, id_usuario=usuario_misael.id, id_evento=evento_include.id)
        certificado_mario = Certificado(carga_horaria=15, id_usuario=usuario_i.id, id_evento=evento_ca.id)
        certificado_aniel = Certificado(carga_horaria=10, id_usuario=usuario_d.id, id_evento=evento_teste.id)
        
        session.add_all([certificado_teste, certificado_misael, certificado_mario, certificado_aniel])
        
        # Commit final para salvar os certificados
        session.commit()
