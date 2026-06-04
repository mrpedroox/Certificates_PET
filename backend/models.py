from datetime import date
from sqlmodel import Field, SQLModel, Relationship

class Usuario(SQLModel, table=True):
    __tablename__ = "usuario"
    id: int | None = Field(default= None, primary_key= True)
    cpf: str = Field(unique= True)
    nome: str
    certificados: list["Certificado"] = Relationship(back_populates= "usuario")

class Evento(SQLModel, table= True):
    __tablename__ = "evento"
    id: int | None = Field(default= None, primary_key= True)
    texto: str
    titulo: str
    data_inicio: date
    data_fim: date
    certificados: list["Certificado"] = Relationship(back_populates= "evento")

class Certificado(SQLModel, table = True):
    __tablename__ = "certificado"
    id: int | None = Field(default= None, primary_key= True)
    carga_horaria: int
    id_usuario: int = Field(foreign_key= "usuario.id")
    id_evento: int = Field(foreign_key= "evento.id")
    usuario: Usuario = Relationship(back_populates= "certificados")
    evento: Evento = Relationship(back_populates= "certificados")
