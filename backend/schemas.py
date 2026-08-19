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
            raise ValueError("CPF inválido. Informe exatamente 11 números.")
        
        return cpf

    @field_validator("nome")
    @classmethod
    def validar_nome(cls, nome_novo: str):
        if not nome_novo.strip():
            raise ValueError("ERRO NOS DADOS DO USUÁRIO. O NOME NÃO PODE SER VAZIO.")
        
        return nome_novo

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

    @field_validator("texto")
    @classmethod
    def validar_texto(cls, texto_novo: str):
        if not texto_novo.strip():
            raise ValueError("ERRO NOS DADOS DO EVENTO. O TEXTO NÃO PODE SER VAZIO.")
        
        return texto_novo

    @field_validator("titulo")
    @classmethod
    def validar_titulo(cls, titulo_novo: str):
        if not titulo_novo.strip():
            raise ValueError("ERRO NOS DADOS DO EVENTO. O TÍTULO NÃO PODE SER VAZIO.")
        
        return titulo_novo

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
