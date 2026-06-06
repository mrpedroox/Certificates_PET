import React, { useState } from 'react';
import Button from '../components/Button';
import ActionButton from '../components/ActionButton';
import Input from '../components/Input';
import Editar from '../assets/editar.svg';
import Lixeira from '../assets/lixeira.svg';

function TelaEventos() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');

    const HandleSalvar = (e) => {
        e.preventDefault();
        console.log("Salvando:", titulo, descricao);
        alert("Evento salvo com sucesso!");
        setTitulo('');
        setDescricao('');
        setIsModalOpen(false);
    }

    const HandleEditar = (id) => {
        alert("Abrindo edição do evento:", id);
    }

    const HandleApagar = (id) => {
        if (window.confirm("Tem certeza que deseja apagar esse evento?")) {
            alert("Apagando evento:", id);
        }
    }

    return (
        <div className="main-container">

            <div className="page-header">
                <h2 className="page-title">
                    Evento &gt; Controle de Atividades
                </h2>
                <Button
                    texto="+ Adicionar Novo Evento"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            <div className="page-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titulo do Evento</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>Semana Acadêmica da Computação</td>
                            <td>Evento anual com palestras, minicursos e networking.</td>
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
                        <h3 className="modal-title">+Cadastrar Novo Evento</h3>

                        <form onSubmit={HandleSalvar}>
                            <Input
                                label="Título do Evento"
                                placeholder="digite o título do evento..."
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                            />
                            <Input
                                label="Descrição/Texto explicativo"
                                placeholder="digite a descrição do evento..."
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
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

export default TelaEventos