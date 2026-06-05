from datetime import date
from sqlmodel import SQLModel
from pydantic import ValidationInfo, field_validator

class UsuarioSchema(SQLModel):
    cpf: str
    nome: str

    @field_validator("cpf")
    @classmethod
    def validar_cpf(cls, cpf_novo: str):
        cpf = cpf_novo.replace(".", "").replace("-", "")
        
        if not cpf.isdigit() or len(cpf) != 11:
            raise ValueError("ERRO NOS DADOS DO USUÁRIO. O CPF DEVE CONTER EXATAMENTE 11 NÚMEROS.")
        
        return cpf

class EventoSchema(SQLModel):
    texto: str
    titulo: str
    data_inicio: date
    data_fim: date

    @field_validator("data_fim")
    @classmethod
    def validar_carga_horaria(cls, data_fim: date, info: ValidationInfo):
        if data_fim < info.data['data_inicio']: 
            raise ValueError("ERRO NOS DADOS DO EVENTO. A DATA DE FIM NÃO PODE SER ANTERIOR A DATA DE INÍCIO.")

        return data_fim

class CertificadoSchema(SQLModel):
    carga_horaria: int
    id_usuario: int
    id_evento: int

    @field_validator("carga_horaria")
    @classmethod
    def validar_carga_horaria(cls, carga_horaria: int):
        if carga_horaria <= 0:
            raise ValueError("ERRO NOS DADOS DO CERTIFICADO. A CARGA HORÁRIA DEVE POSSUIR NO MÍNIMO 1 HORA.")

        return carga_horaria
