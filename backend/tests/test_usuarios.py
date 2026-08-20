def test_criar_e_consultar_usuario(client, usuario_payload):
    resposta_criacao = client.post("/usuarios/", json=usuario_payload)

    assert resposta_criacao.status_code == 201
    usuario = resposta_criacao.json()
    assert usuario["nome"] == usuario_payload["nome"]
    assert usuario["cpf"] == "12345678901"
    assert usuario["id"] is not None

    resposta_consulta = client.get(f"/usuarios/{usuario['id']}")

    assert resposta_consulta.status_code == 200
    assert resposta_consulta.json() == usuario


def test_listar_e_buscar_usuario_por_nome(client, usuario_payload):
    client.post("/usuarios/", json=usuario_payload)

    resposta_lista = client.get("/usuarios/")
    resposta_busca = client.get("/usuarios/buscar", params={"nome": "pessoa"})

    assert resposta_lista.status_code == 200
    assert len(resposta_lista.json()) == 1
    assert resposta_busca.status_code == 200
    assert resposta_busca.json()[0]["nome"] == usuario_payload["nome"]


def test_atualizar_usuario(client, usuario_payload):
    usuario_id = client.post("/usuarios/", json=usuario_payload).json()["id"]
    dados_atualizados = {"nome": "Nome Atualizado", "cpf": "98765432100"}

    resposta = client.put(f"/usuarios/{usuario_id}", json=dados_atualizados)

    assert resposta.status_code == 200
    assert resposta.json()["nome"] == "Nome Atualizado"
    assert resposta.json()["cpf"] == "98765432100"


def test_rejeitar_cpf_invalido(client):
    resposta = client.post(
        "/usuarios/",
        json={"nome": "Pessoa Teste", "cpf": "123"},
    )

    assert resposta.status_code == 422
    assert "CPF inválido" in resposta.text


def test_rejeitar_cpf_duplicado(client, usuario_payload):
    primeira_resposta = client.post("/usuarios/", json=usuario_payload)
    segunda_resposta = client.post("/usuarios/", json=usuario_payload)

    assert primeira_resposta.status_code == 201
    assert segunda_resposta.status_code == 409
    assert segunda_resposta.json()["detail"] == "JÁ EXISTE UM USUÁRIO COM ESTE CPF"


def test_retornar_404_para_usuario_inexistente(client):
    resposta = client.get("/usuarios/999")

    assert resposta.status_code == 404
    assert resposta.json()["detail"] == "USUÁRIO NÃO ENCONTRADO"


def test_excluir_usuario_e_seus_certificados(client, usuario_payload, evento_payload):
    usuario_id = client.post("/usuarios/", json=usuario_payload).json()["id"]
    evento_id = client.post("/eventos/", json=evento_payload).json()["id"]
    client.post(
        "/certificados/",
        json={"id_usuario": usuario_id, "id_evento": evento_id, "carga_horaria": 8},
    )

    resposta = client.delete(f"/usuarios/{usuario_id}")

    assert resposta.status_code == 200
    assert resposta.json()["certificados_removidos"] == 1
    assert client.get("/certificados/").json() == []
