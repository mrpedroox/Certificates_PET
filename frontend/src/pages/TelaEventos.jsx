import React, { useState } from 'react';
import Button from '../components/Button';
import ActionButton from '../components/ActionButton';
import Input from '../components/Input';
import Editar from '../assets/editar.svg';
import Lixeira from '../assets/lixeira.svg';

function TelaEventos() {

    const [eventos, setEventos] = useState([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    const[EditandoId, setIsEditandoId] = useState(null);

    const AbrirModalCadastroNovo = () =>{
        setTitulo('')
        setDescricao('')
        setDataInicio('')
        setDataFim('')
        setIsEditandoId(null)
        setIsModalOpen(true)
    }

    const HandleSalvar = (e) => {
        e.preventDefault();

        if(EditandoId){

            setEventos(eventos.map(e => 
                e.id === EditandoId ? { ...e, titulo: titulo, descricao: descricao, data_inicio: dataInicio, data_fim: dataFim } : e
            ));
            alert("Evento editado com sucesso!");

        } else {
            const novoId = eventos.length > 0 ? eventos[eventos.length - 1].id + 1 : 1;
            const novoEvento = {id: novoId, titulo:titulo, descricao:descricao, data_inicio: dataInicio, data_fim: dataFim} 
            setEventos([...eventos, novoEvento])
            alert("Evento salvo com sucesso!");
        }

        alert("Evento salvo com sucesso!");
        setTitulo('');
        setDescricao('');
        setDataInicio('');
        setDataFim('');
        setIsModalOpen(false);
    }

    const HandleEditar = (evento) => {
       setTitulo(evento.titulo)
       setDescricao(evento.descricao)
       setDataInicio(evento.data_inicio)
       setDataFim(evento.data_fim)
       setIsEditandoId(evento.id)
       setIsModalOpen(true)

    }

    const HandleApagar = (id) => {
        if (window.confirm("Tem certeza que deseja apagar esse evento?")) {
           setEventos(eventos.filter(p => p.id !== id));
           alert("Evento apagado com sucesso!") 
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
                    onClick={AbrirModalCadastroNovo}
                />
            </div>

            <div className="page-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título do Evento</th>
                            <th>Descrição</th>
                            <th>Data de Início</th>
                            <th>Data de Fim</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {eventos.map((evento) => (
                            <tr key={evento.id}>
                                <td>{evento.id}</td>
                                <td>{evento.titulo}</td>
                                <td>{evento.descricao}</td>
                                <td>{evento.data_inicio}</td>
                                <td>{evento.data_fim}</td>
                                <td className="action-buttons">
                                    <ActionButton
                                    icon={Editar}
                                    tooltip="Editar"
                                    altText="Icone de Editar"
                                    onClick={() => HandleEditar(evento)}
                                    />
                                    <ActionButton
                                    icon={Lixeira}
                                    tooltip="Apagar"
                                    altText="Icone de Apagar"
                                    onClick={() => HandleApagar(evento.id)}
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

                        <h3 className="modal-title">{
                        EditandoId ? "Editar Evento" : "+ Cadastrar Novo Evento"}
                        </h3>

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
                            <div className="form-row">
                                <div className="input-container">
                                    <label className="input-label">Data de Início</label>
                                    <input 
                                        type="date" 
                                        className="input-field date-field" 
                                        value={dataInicio} 
                                        onChange={(e) => setDataInicio(e.target.value)} 
                                        required
                                    />
                                </div>
                                <div className="input-container">
                                    <label className="input-label">Data de Fim</label>
                                    <input 
                                        type="date" 
                                        className="input-field date-field" 
                                        value={dataFim} 
                                        onChange={(e) => setDataFim(e.target.value)} 
                                        required
                                    />
                                </div>
                            </div>
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

export default TelaEventos