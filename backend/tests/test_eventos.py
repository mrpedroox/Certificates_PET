def test_criar_e_consultar_evento(client, evento_payload):
    resposta_criacao = client.post("/eventos/", json=evento_payload)

    assert resposta_criacao.status_code == 201
    evento = resposta_criacao.json()
    assert evento["titulo"] == evento_payload["titulo"]
    assert evento["data_inicio"] == evento_payload["data_inicio"]
    assert evento["id"] is not None

    resposta_consulta = client.get(f"/eventos/{evento['id']}")

    assert resposta_consulta.status_code == 200
    assert resposta_consulta.json() == evento


def test_listar_e_buscar_evento_por_titulo(client, evento_payload):
    client.post("/eventos/", json=evento_payload)

    resposta_lista = client.get("/eventos/")
    resposta_busca = client.get("/eventos/buscar", params={"nome": "teste"})

    assert resposta_lista.status_code == 200
    assert len(resposta_lista.json()) == 1
    assert resposta_busca.status_code == 200
    assert resposta_busca.json()[0]["titulo"] == evento_payload["titulo"]


def test_atualizar_evento(client, evento_payload):
    evento_id = client.post("/eventos/", json=evento_payload).json()["id"]
    dados_atualizados = {
        **evento_payload,
        "titulo": "Evento Atualizado",
        "data_fim": "2026-08-22",
    }

    resposta = client.put(f"/eventos/{evento_id}", json=dados_atualizados)

    assert resposta.status_code == 200
    assert resposta.json()["titulo"] == "Evento Atualizado"
    assert resposta.json()["data_fim"] == "2026-08-22"


def test_rejeitar_evento_com_data_final_anterior(client, evento_payload):
    dados_invalidos = {
        **evento_payload,
        "data_inicio": "2026-08-21",
        "data_fim": "2026-08-20",
    }

    resposta = client.post("/eventos/", json=dados_invalidos)

    assert resposta.status_code == 422
    assert "DATA DE FIM" in resposta.text


def test_retornar_404_para_evento_inexistente(client):
    resposta = client.get("/eventos/999")

    assert resposta.status_code == 404
    assert resposta.json()["detail"] == "EVENTO NÃO ENCONTRADO"


def test_excluir_evento_e_seus_certificados(client, usuario_payload, evento_payload):
    usuario_id = client.post("/usuarios/", json=usuario_payload).json()["id"]
    evento_id = client.post("/eventos/", json=evento_payload).json()["id"]
    client.post(
        "/certificados/",
        json={"id_usuario": usuario_id, "id_evento": evento_id, "carga_horaria": 8},
    )

    resposta = client.delete(f"/eventos/{evento_id}")

    assert resposta.status_code == 200
    assert resposta.json()["certificados_removidos"] == 1
    assert client.get("/certificados/").json() == []
