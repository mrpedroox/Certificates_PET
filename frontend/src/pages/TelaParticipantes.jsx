import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import ActionButton from '../components/ActionButton';
import Input from '../components/Input';
import Editar from '../assets/editar.svg';
import Lixeira from '../assets/lixeira.svg';

function TelaParticipantes() {

    const [participantes, setParticipantes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [EditandoId, setIsEditandoId] = useState(null);

    const carregarParticipantes = () => {
        fetch("http://127.0.0.1:8000/usuarios/")
            .then(response => response.json())
            .then(data => {
                setParticipantes(data);
            })
            .catch(error => {
                console.error("Erro ao buscar participantes:", error);
            });
    };

    useEffect(() => {
        carregarParticipantes();
    }, []);

    const AbrirModalCadastroNovo = () =>{
        setNome('')
        setCpf('')
        setIsEditandoId(null)
        setIsModalOpen(true)
    }

    const HandleSalvar = async (e) => {
        e.preventDefault();

        if (EditandoId) {
            // Requisição PUT para editar
            fetch(`http://127.0.0.1:8000/usuarios/${EditandoId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    cpf: cpf,
                }),
            })
            .then(response => {
                if (!response.ok) throw new Error("Erro ao editar");
                return response.json();
            })
            .then(data => {
                alert("Participante editado com sucesso!");
                carregarParticipantes(); // Atualiza a tabela com os dados do banco com a função definida inicialmente
            })
            .catch(error => console.error("Erro:", error));

        } 
        else {
            // Requisição POST para criar
            fetch("http://127.0.0.1:8000/usuarios/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome,
                    cpf: cpf,
                }),
            })
            .then(response => {
                if (!response.ok) throw new Error("Erro ao salvar");
                return response.json();
            })
            .then(data => {
                alert("Participante salvo com sucesso!");
                carregarParticipantes(); // Atualiza a tabela
            })
            .catch(error => console.error("Erro:", error));
        }

        // Limpa os campos e fecha o modal
        setNome('');
        setCpf('');
        setIsModalOpen(false);
    }

    const HandleEditar = (participante) => {
        setNome(participante.nome)
        setCpf(participante.cpf)
        setIsEditandoId(participante.id)
        setIsModalOpen(true)
    }

    const HandleApagar = (id) => {
        if (window.confirm("Tem certeza que deseja apagar esse participante?")) {
            // Requisição DELETE para apagar
            fetch(`http://127.0.0.1:8000/usuarios/${id}/`, {
                method: "DELETE",
            })
            .then(response => {
                if (response.ok) {
                    alert("Participante apagado com sucesso!");
                    carregarParticipantes(); // Atualiza a tabela
                } else {
                    alert("Erro ao apagar o participante.");
                }
            })
            .catch(error => console.error("Erro:", error));
        }
    }

    return (
        <div className="main-container">

            <div className="page-header">
                <h2 className="page-title">
                    Participantes &gt; Listagem Geral
                </h2>
                <Button
                    texto="+ Adicionar Novo Participante"
                    onClick={AbrirModalCadastroNovo}
                />
            </div>

            <div className="page-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participantes.map((participante) => (
                            <tr key={participante.id}>
                                <td>{participante.id}</td>
                                <td>{participante.nome}</td>
                                <td>{participante.cpf}</td>
                                <td className="action-buttons">
                                    <ActionButton
                                    icon={Editar}
                                    tooltip="Editar"
                                    altText="Icone de Editar"
                                    onClick={() => HandleEditar(participante)}
                                    />
                                    <ActionButton
                                    icon={Lixeira}
                                    tooltip="Apagar"
                                    altText="Icone de Apagar"
                                    onClick={() => HandleApagar(participante.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">
                            {EditandoId ? "Editar Participante" : "+ Cadastrar Novo Participante"}
                        </h3>

                        <form onSubmit={HandleSalvar}>
                            <Input
                                label="Nome Completo"
                                placeholder="digite seu nome completo..."
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                            <Input
                                label="CPF"
                                placeholder="digite seu cpf (000.000.000-00)..."
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                            />
                            <div className="modal-actions">
                                <Button
                                    texto="Salvar"
                                    type="submit"
                                    className="btn-primary"
                                />
                                <Button
                                    texto="Cancelar"
                                    type="button"
                                    onClick={()=> setIsModalOpen(false)}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    )
}

export default TelaParticipantes