import React, { useState } from 'react';
import Button from '../components/Button';
import ActionButton from '../components/ActionButton';
import Input from '../components/Input';
import Editar from '../assets/editar.svg';
import Lixeira from '../assets/lixeira.svg';

function TelaCertificados() {

    const [certificados, setCertificados] = useState([]);

    //Dados simulados para testar (substituir pelos dados do banco)
    const listaParticipantes = [
        { id: 1, nome: 'João Pedro Silva' },
        { id: 2, nome: 'Maria Eduarda Oliveira' },
    ];
    
    const listaEventos = [
        { id: 1, titulo: 'Semana Acadêmica da Computação' },
        { id: 2, titulo: 'Include 2026' },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [participanteId, setParticipanteId] = useState('');
    const [eventoId, setEventoId] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    
    const [EditandoId, setIsEditandoId] = useState(null);

    const AbrirModalNovaEmissao = () => {
        setParticipanteId('');
        setEventoId('');
        setCargaHoraria('');
        setIsEditandoId(null);
        setIsModalOpen(true);
    }

    const HandleSalvar = (e) => {
        e.preventDefault(); 

        const participanteSelecionado = listaParticipantes.find(p => p.id === parseInt(participanteId));
        const eventoSelecionado = listaEventos.find(ev => ev.id === parseInt(eventoId));

        const dadosCertificado = {
            participanteId: parseInt(participanteId),
            eventoId: parseInt(eventoId),
            nomeParticipante: participanteSelecionado?.nome || 'Desconhecido',
            nomeEvento: eventoSelecionado?.titulo || 'Desconhecido',
            carga_horaria: cargaHoraria,
        };

        if(EditandoId){
            setCertificados(certificados.map(c => 
                c.id === EditandoId ? { ...c, ...dadosCertificado } : c
            ));
        } else {
            const novoId = certificados.length > 0 ? certificados[certificados.length - 1].id + 1 : 1;
            setCertificados([...certificados, { id: novoId, ...dadosCertificado }]); 
        }

        setParticipanteId('');
        setEventoId('');
        setCargaHoraria('');
        setIsEditandoId(null);
        setIsModalOpen(false);
    }

    const HandleApagar = (id) => {
        if (window.confirm("Tem certeza que deseja apagar esse certificado?")) {
           setCertificados(certificados.filter(c => c.id !== id));
           alert("Certificado apagado com sucesso!") 
        }
    }

    const HandleEditar = (certificado) => {
        setParticipanteId(certificado.participanteId);
        setEventoId(certificado.eventoId);
        setCargaHoraria(certificado.carga_horaria);
        setIsEditandoId(certificado.id);
        setIsModalOpen(true);
    }


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
                                <td>{c.nomeParticipante}</td>
                                <td>{c.nomeEvento}</td>
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