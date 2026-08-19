import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import ActionButton from '../components/ActionButton';
import Input from '../components/Input';
import Editar from '../assets/editar.svg';
import Lixeira from '../assets/lixeira.svg';

function TelaCertificados() {

    const [certificados, setCertificados] = useState([]);
    const [listaParticipantes, setListaParticipantes] = useState([]);
    const [listaEventos, setListaEventos] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Onde os IDs e carga horária dos formulários são guardadas
    const [participanteId, setParticipanteId] = useState('');
    const [eventoId, setEventoId] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    
    const [EditandoId, setIsEditandoId] = useState(null);

    const carregarDados = () => {
        //Faz a busca de certificados no back
        fetch("http://127.0.0.1:8000/certificados/")
            .then(res => res.json())
            .then(data => setCertificados(data))
            .catch(err => console.error("Erro ao buscar certificados:", err));

        // Faz a busca de usuários no back
        fetch("http://127.0.0.1:8000/usuarios/")
            .then(res => res.json())
            .then(data => setListaParticipantes(data))
            .catch(err => console.error("Erro ao buscar usuários:", err));

        // Faz a busca de eventos no back
        fetch("http://127.0.0.1:8000/eventos/")
            .then(res => res.json())
            .then(data => setListaEventos(data))
            .catch(err => console.error("Erro ao buscar eventos:", err));
    };

    useEffect(() => { //Carrega as informações assim que a tela abre
        carregarDados();
    }, []);

    const AbrirModalNovaEmissao = () => {
        setParticipanteId('');
        setEventoId('');
        setCargaHoraria('');
        setIsEditandoId(null);
        setIsModalOpen(true);
    }

    const HandleSalvar = (e) => { //Função para salvar ou editar
        e.preventDefault(); 

        // Montagem do objeto com os dados necessários
        const dadosCertificado = {
            id_usuario: parseInt(participanteId),
            id_evento: parseInt(eventoId),
            carga_horaria: parseInt(cargaHoraria)
        };

        if (EditandoId) {
            // PUT para atualizar certificados
            fetch(`http://127.0.0.1:8000/certificados/${EditandoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosCertificado)
            })
            .then(async response => {
                if (!response.ok) throw new Error(await response.text());
                alert("Certificado editado com sucesso!");
                carregarDados(); // Atualiza a tabela
                setIsModalOpen(false);
            })
            .catch(err => alert("Erro ao editar: " + err.message));

        } 
        else {
            // POST para adicionar certificados
            fetch("http://127.0.0.1:8000/certificados/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosCertificado)
            })
            .then(async response => {
                if (!response.ok) throw new Error(await response.text());
                alert("Certificado emitido com sucesso!");
                carregarDados(); // Atualiza a tabela
                setIsModalOpen(false);
            })
            .catch(err => alert("Erro ao emitir: " + err.message));
        }
    };

    const HandleApagar = (id) => {
        if (window.confirm("Tem certeza que deseja apagar esse certificado?")) {
           fetch(`http://127.0.0.1:8000/certificados/${id}`, {
               method: "DELETE"
           })
           .then(response => {
               if (response.ok) {
                   alert("Certificado apagado com sucesso!");
                   carregarDados(); // Atualiza a tela
               } else {
                   alert("Erro ao apagar certificado.");
               }
           })
           .catch(err => console.error("Erro no delete:", err));
        }
    };

    const HandleEditar = (certificado) => {
        setParticipanteId(String(certificado.id_usuario));
        setEventoId(String(certificado.id_evento));
        setCargaHoraria(String(certificado.carga_horaria));
        setIsEditandoId(certificado.id);
        setIsModalOpen(true);
    }

    const getNomeParticipante = (id) => {
        const participante = listaParticipantes.find(p => p.id == id);
        return participante ? participante.nome : `ID ${id} (Excluído/Não encontrado)`;
    };

    const getTituloEvento = (id) => {
        const evento = listaEventos.find(ev => ev.id == id);
        return evento ? evento.titulo : `ID ${id} (Excluído/Não encontrado)`;
    };


    return (
        <div className="main-container">
            <div className="page-header">
                <h2 className="page-title">
                    Certificados &gt; Emissão e Histórico
                </h2>
                <Button 
                    texto="+ Emitir Novo Certificado" 
                    onClick={AbrirModalNovaEmissao} 
                />
            </div>

            <div className="page-table">
                <table>
                    <thead>
                        <tr>
                            <th>Participante</th>
                            <th>Evento</th>
                            <th>Carga Horária</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificados.map((c) => (
                            <tr key={c.id}>
                                <td>{getNomeParticipante(c.id_usuario)}</td>
                                <td>{getTituloEvento(c.id_evento)}</td>
                                <td>{c.carga_horaria}h</td>
                                <td className="action-buttons">
                                    <ActionButton 
                                    icon={Editar}
                                    onClick={() => {HandleEditar(c)}} />
                                    <ActionButton
                                    icon={Lixeira} 
                                    onClick={() => {HandleApagar(c.id)}} />
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
                            {EditandoId ? 'Editar Certificado' : 'Emitir Novo Certificado'}</h3>
                        <form onSubmit={HandleSalvar}>
                            <div className="input-group">
                                <label>Participante</label>
                                <select 
                                    className="custom-select"
                                    value={participanteId} 
                                    onChange={(e) => setParticipanteId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecione um participante</option>
                                    {listaParticipantes.map(p => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Evento</label>
                                <select 
                                    className="custom-select"
                                    value={eventoId} 
                                    onChange={(e) => setEventoId(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecione um evento</option>
                                    {listaEventos.map(ev => (
                                        <option key={ev.id} value={ev.id}>{ev.titulo}</option>
                                    ))}
                                </select>
                            </div>
                            <Input 
                                label="Carga Horária" 
                                value={cargaHoraria} 
                                onChange={(e) => setCargaHoraria(e.target.value)} 
                                type="number" 
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
                                    onClick={() => setIsModalOpen(false)} 
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TelaCertificados;
