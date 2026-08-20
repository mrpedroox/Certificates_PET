def criar_usuario_e_evento(client, usuario_payload, evento_payload):
    usuario_id = client.post("/usuarios/", json=usuario_payload).json()["id"]
    evento_id = client.post("/eventos/", json=evento_payload).json()["id"]
    return usuario_id, evento_id


def test_criar_e_consultar_certificado(client, usuario_payload, evento_payload):
    usuario_id, evento_id = criar_usuario_e_evento(
        client,
        usuario_payload,
        evento_payload,
    )

    resposta_criacao = client.post(
        "/certificados/",
        json={"id_usuario": usuario_id, "id_evento": evento_id, "carga_horaria": 20},
    )

    assert resposta_criacao.status_code == 201
    certificado = resposta_criacao.json()
    assert certificado["id_usuario"] == usuario_id
    assert certificado["id_evento"] == evento_id
    assert certificado["carga_horaria"] == 20

    resposta_consulta = client.get(f"/certificados/{certificado['id']}")

    assert resposta_consulta.status_code == 200
    assert resposta_consulta.json() == certificado


def test_listar_certificados(client, usuario_payload, evento_payload):
    usuario_id, evento_id = criar_usuario_e_evento(
        client,
        usuario_payload,
        evento_payload,
    )
    client.post(
        "/certificados/",
        json={"id_usuario": usuario_id, "id_evento": evento_id, "carga_horaria": 12},
    )

    resposta = client.get("/certificados/")

    assert resposta.status_code == 200
    assert len(resposta.json()) == 1


def test_atualizar_certificado(client, usuario_payload, evento_payload):
    usuario_id, evento_id = criar_usuario_e_evento(
        client,
        usuario_payload,
        evento_payload,
    )
    certificado = client.post(
        "/certificados/",
        json={"id_usuario": usuario_id, "id_evento": evento_id, "carga_horaria": 10},
    ).json()

    resposta = client.put(
        f"/certificados/{certificado['id']}",
        json={"id_usuario": usuario_id, "id_evento": evento_id, "carga_horaria": 30},
    )

    assert resposta.status_code == 200
    assert resposta.json()["carga_horaria"] == 30


def test_rejeitar_carga_horaria_invalida(client, usuario_payload, evento_payload):
    usuario_id, evento_id = criar_usuario_e_evento(
        client,
        usuario_payload,
        evento_payload,
    )

    resposta = client.post(
        "/certificados/",
        json={"id_usuario": usuario_id, "id_evento": evento_id, "carga_horaria": 0},
    )

    assert resposta.status_code == 422
    assert "CARGA HORÁRIA" in resposta.text


def test_rejeitar_certificado_com_relacionamento_inexistente(
    client,
    usuario_payload,
    evento_payload,
):
    usuario_id, _evento_id = criar_usuario_e_evento(
        client,
        usuario_payload,
        evento_payload,
    )

    resposta = client.post(
        "/certificados/",
        json={"id_usuario": usuario_id, "id_evento": 999, "carga_horaria": 10},
    )

    assert resposta.status_code == 409
    assert resposta.json()["detail"] == "USUÁRIO OU EVENTO INFORMADO NÃO EXISTE"


def test_excluir_certificado(client, usuario_payload, evento_payload):
    usuario_id, evento_id = criar_usuario_e_evento(
        client,
        usuario_payload,
        evento_payload,
    )
    certificado_id = client.post(
        "/certificados/",
        json={"id_usuario": usuario_id, "id_evento": evento_id, "carga_horaria": 10},
    ).json()["id"]

    resposta = client.delete(f"/certificados/{certificado_id}")

    assert resposta.status_code == 200
    assert client.get(f"/certificados/{certificado_id}").status_code == 404


def test_retornar_404_para_certificado_inexistente(client):
    resposta = client.get("/certificados/999")

    assert resposta.status_code == 404
    assert resposta.json()["detail"] == "CERTIFICADO NÃO ENCONTRADO"
