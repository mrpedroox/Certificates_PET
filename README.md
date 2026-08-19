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

**Infraestrutura**
- [Docker](https://www.docker.com/)

---

## Funcionalidades

- Listar, adicionar, editar e remover **eventos**
- Listar, adicionar, editar e remover **participantes**
- Listar, adicionar, editar e remover **certificados**
- Banco de dados populado automaticamente com dados de exemplo ao subir o servidor

---

## Como rodar o projeto

### Pre-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado e rodando

---

### 1. Clone o repositorio

```bash
git clone https://github.com/mrpedroox/Certificates_PET.git
cd Certificates_PET
```

---

### 2. Suba os containers

```bash
docker compose up --build
```

Aguarde todos os servicos subirem. O backend so inicia apos o banco estar pronto.

---

### 3. Acesse o sistema

- **Frontend:** http://localhost
- **Backend/API docs:** http://localhost:8000/docs

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
│   ├── Dockerfile
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
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml
├── docs/
└── README.md
```

---

## Documentacao da equipe

O roteiro de desenvolvimento e a documentacao de participacao da equipe pode ser acessado no link abaixo:

[Colab da equipe](https://colab.research.google.com/drive/1K_JnxnNCrvy5tus75_Uk6onSugyZQX4E?usp=sharing#scrollTo=SIifcNTnqaPI)