import React, { useState, useEffect } from 'react';
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

    const carregarEventos = () => { // Função para carregar os eventos do banco de dados
        fetch("http://127.0.0.1:8000/eventos/")
            .then(response => {
                if (!response.ok) throw new Error("Erro ao buscar eventos");
                return response.json();
            })
            .then(data => {
                setEventos(data);
            })
            .catch(error => {
                console.error("Erro ao buscar eventos:", error);
            });

    };

    useEffect(() => { //useEffect usa a função e carrega a lista ao abrir a página
        carregarEventos();
    }, []);

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

        const dadosEvento = {
            titulo: titulo,
            texto: descricao, 
            data_inicio: dataInicio, 
            data_fim: dataFim
        };

        if (EditandoId) {
            fetch(`http://127.0.0.1:8000/eventos/${EditandoId}/`, { // Requisição PUT para editar o evento existente
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosEvento),
            })
            .then(response => {
                if (!response.ok) throw new Error("Erro ao editar evento");
                return response.json();
            })
            .then(() => {
                alert("Evento editado com sucesso!");
                carregarEventos(); 
                fecharModal();
            })
            .catch(error => {
                console.error("Erro:", error);
                alert("Não foi possível editar o evento.");
            });

        } else {
            fetch("http://127.0.0.1:8000/eventos/", { // Requisição POST para criar um novo evento
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dadosEvento),
            })
            .then(async response => {
                if (!response.ok) {
                    const dadosErro = await response.json().catch(() => ({}));
                    console.error("DETALHES DO ERRO DO BACKEND:", dadosErro);
                    throw new Error(`Erro do servidor: Status ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                alert("Evento salvo com sucesso!");
                carregarEventos(); 
                fecharModal();
            })
            .catch(error => {
                console.error("Erro:", error);
                alert("Não foi possível salvar o evento. Verifique o console.");
            });
        }
    };

    const fecharModal = () => {
        setTitulo('');
        setDescricao('');
        setDataInicio('');
        setDataFim('');
        setIsModalOpen(false);
    };

    const HandleEditar = (evento) => {
       setTitulo(evento.titulo)
       setDescricao(evento.texto)
       setDataInicio(evento.data_inicio)
       setDataFim(evento.data_fim)
       setIsEditandoId(evento.id)
       setIsModalOpen(true)

    }

    const HandleApagar = (id) => { // Requisição DELETE para deletar um evento
        if (window.confirm("Tem certeza que deseja apagar esse evento?")) {
            fetch(`http://127.0.0.1:8000/eventos/${id}/`, {
                method: "DELETE",
            })
            .then(response => {
                if (response.ok) {
                    alert("Evento apagado com sucesso!");
                    carregarEventos(); 
                } else {
                    alert("Erro ao apagar o evento.");
                }
            })
            .catch(error => console.error("Erro ao apagar:", error));
        }
    };

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
                                <td>{evento.texto}</td>
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