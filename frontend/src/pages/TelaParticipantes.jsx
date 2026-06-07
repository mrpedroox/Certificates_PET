import React, { useState } from 'react';
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

    const AbrirModalCadastroNovo = () =>{
        setNome('')
        setCpf('')
        setIsEditandoId(null)
        setIsModalOpen(true)
    }

    const HandleSalvar = (e) => {
        e.preventDefault();
        if(EditandoId){

           setParticipantes(participantes.map(p => 
                p.id === EditandoId ? { ...p, nome: nome, cpf: cpf } : p
            ));
            alert("Participante editado com sucesso!");

        } else {
            const novoId = participantes.length > 0 ? participantes[participantes.length - 1].id + 1 : 1;
            const novoParticipante = {id: novoId, nome:nome, cpf:cpf}
            setParticipantes([...participantes, novoParticipante])
            alert("Participante salvo com sucesso!");
        }
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
            setParticipantes(participantes.filter(p => p.id !== id)); 
            alert("Participante apagado com sucesso!");
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