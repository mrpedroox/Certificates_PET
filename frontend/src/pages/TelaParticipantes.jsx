import React, { useState } from 'react';
import Button from '../components/Button';
import ActionButton from '../components/ActionButton';
import Input from '../components/Input';
import Editar from '../assets/editar.svg';
import Lixeira from '../assets/lixeira.svg';

function TelaParticipantes() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');

    const HandleSalvar = (e) => {
        e.preventDefault();
        console.log("Salvando:", nome, cpf);
        alert("Participante salvo com sucesso!");
        setNome('');
        setCpf('');
        setIsModalOpen(false);
    }

    const HandleEditar = (id) => {
        alert("Abrindo edição do participante:", id);
    }

    const HandleApagar = (id) => {
        if (window.confirm("Tem certeza que deseja apagar esse participante?")) {
            alert("Apagando participante:", id);
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
                    onClick={() => setIsModalOpen(true)}
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
                        <tr>
                            <td>1</td>
                            <td>Maria Eduarda Ferreira</td>
                            <td>123.456.789-01</td>
                            <td className="action-buttons">
                                {/*ID exemplo*/}
                                <ActionButton
                                    icon={Editar}
                                    tooltip="Editar"
                                    altText="Icone de Editar"
                                    onClick={() => HandleEditar(1)}
                                />
                                <ActionButton
                                    icon={Lixeira}
                                    tooltip="Apagar"
                                    altText="Icone de Apagar"
                                    onClick={() => HandleApagar(1)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">+Cadastrar Novo Participante</h3>

                        <form onSubmit={HandleSalvar}>
                            <Input
                                label="Nome Completo"
                                placeholder="digite seu nome completo..."
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                            <Input
                                label="CPF"
                                placeholder="digite seu cpf(000.000.000-00)..."
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                            />
                            <div className="modal-actions">
                                <Button
                                    texto="Salvar"
                                    type="submit"
                                    className="btn-primary"
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