# Sistema de Certificados PET

Sistema web para gerenciamento de certificados do PET Computacao da UFC, permitindo o cadastro e controle de eventos, participantes e certificados de forma simples e centralizada.

---

## Equipe

- Pedro Henrique
- Misael Lemos
- Isabella Lelis
- Diego Lugano

---

## Tecnologias utilizadas

**Backend**
- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLModel](https://sqlmodel.tiangolo.com/)
- [PostgreSQL](https://www.postgresql.org/)

**Frontend**
- [React](https://react.dev/)
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

---

## Funcionalidades

- Listar, adicionar, editar e remover **eventos**
- Listar, adicionar, editar e remover **participantes**
- Listar, adicionar, editar e remover **certificados**
- Banco de dados populado automaticamente com dados de exemplo ao subir o servidor

---

## Como rodar o projeto

### Pre-requisitos

- Python 3.10+
- Node.js
- PostgreSQL instalado e rodando

---

### 1. Clone o repositorio

```bash
git clone https://github.com/mrpedroox/Certificates_PET.git
cd Certificates_PET
```

---

### 2. Configure o banco de dados

Abra o pgAdmin ou o terminal do PostgreSQL e crie um banco de dados chamado `certificados_db`. Em seguida, execute o seguinte script para criar as tabelas:

```sql
CREATE TABLE public.certificado (
    id integer NOT NULL,
    carga_horaria integer NOT NULL,
    id_usuario integer NOT NULL,
    id_evento integer NOT NULL
);

CREATE SEQUENCE public.certificado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.certificado_id_seq OWNED BY public.certificado.id;

CREATE TABLE public.evento (
    id integer NOT NULL,
    texto character varying NOT NULL,
    titulo character varying NOT NULL,
    data_inicio date NOT NULL,
    data_fim date NOT NULL
);

CREATE SEQUENCE public.evento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.evento_id_seq OWNED BY public.evento.id;

CREATE TABLE public.usuario (
    id integer NOT NULL,
    cpf character varying NOT NULL,
    nome character varying NOT NULL
);

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;

ALTER TABLE ONLY public.certificado ALTER COLUMN id SET DEFAULT nextval('public.certificado_id_seq'::regclass);
ALTER TABLE ONLY public.evento ALTER COLUMN id SET DEFAULT nextval('public.evento_id_seq'::regclass);
ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);

ALTER TABLE ONLY public.certificado
    ADD CONSTRAINT certificado_pkey PRIMARY KEY (id, id_usuario, id_evento);

ALTER TABLE ONLY public.evento
    ADD CONSTRAINT evento_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT unique_cpf UNIQUE (cpf);

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.certificado
    ADD CONSTRAINT fk_certificado_evento FOREIGN KEY (id_evento) REFERENCES public.evento(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE ONLY public.certificado
    ADD CONSTRAINT fk_certificado_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id) ON UPDATE CASCADE ON DELETE RESTRICT;
```

---

### 3. Suba o backend

```bash
cd backend
python -m venv venv
```

Ative a virtual environment:

- **Windows:** `venv\Scripts\activate`
- **Linux/Mac:** `source venv/bin/activate`

Instale as dependencias:

```bash
pip install -r requirements.txt
```

Crie um arquivo `.env` dentro da pasta `backend/` com o seguinte conteudo, substituindo `SUA_SENHA` pela senha definida na instalacao do PostgreSQL:

```
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/certificados_db
```

Rode o servidor:

```bash
uvicorn main:app --reload
```

O backend estara disponivel em `http://127.0.0.1:8000`.
A documentacao interativa da API pode ser acessada em `http://127.0.0.1:8000/docs`.

---

### 4. Suba o frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

O frontend estara disponivel em `http://localhost:5173`.

---

## Estrutura do projeto

```
Certificates_PET/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   └── package.json
│
├── backend/
│   ├── routers/
│   │   ├── usuarios.py
│   │   ├── eventos.py
│   │   └── certificados.py
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── schemas.py
│   ├── seed.py
│   └── requirements.txt
│
├── docs/
└── README.md
```

---

## Documentacao da equipe

O roteiro de desenvolvimento e a documentacao de participacao da equipe pode ser acessado no link abaixo:

[Colab da equipe](https://colab.research.google.com/drive/1K_JnxnNCrvy5tus75_Uk6onSugyZQX4E?usp=sharing#scrollTo=SIifcNTnqaPI)
