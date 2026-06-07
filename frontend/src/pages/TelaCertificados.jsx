import React, { useState } from 'react';
import Button from '../components/Button';
import ActionButton from '../components/ActionButton';
import Input from '../components/Input';
import Editar from '../assets/editar.svg';
import Lixeira from '../assets/lixeira.svg';

function TelaCertificados() {
    const [certificados, setCertificados] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [participante, setParticipante] = useState('');
    const [evento, setEvento] = useState('');
    const [cargaHoraria, setCargaHoraria] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    
    const [EditandoId, setIsEditandoId] = useState(null);

    const AbrirModalNovaEmissao = () => {
        setParticipante('');
        setEvento('');
        setCargaHoraria('');
        setDataInicio('');
        setDataFim('');
        setIsEditandoId(null);
        setIsModalOpen(true);
    }

    const HandleSalvar = (e) => {
        e.preventDefault(); 

        const dadosCertificado = {
            participante,
            evento,
            carga_horaria: cargaHoraria,
            data_inicio: dataInicio,
            data_fim: dataFim
        };

        if(EditandoId){
            setCertificados(certificados.map(c => 
                c.id === EditandoId ? { ...c, ...dadosCertificado } : c
            ));
        } else {
            const novoId = certificados.length > 0 ? certificados[certificados.length - 1].id + 1 : 1;
            setCertificados([...certificados, { id: novoId, ...dadosCertificado }]); 
        }

        setParticipante('');
        setEvento('');
        setCargaHoraria('');
        setDataInicio('');
        setDataFim('');
        setIsEditandoId(null);
        setIsModalOpen(false);
    }

    const HandleApagar = (id) => {
        if (window.confirm("Tem certeza que deseja apagar esse evento?")) {
           setCertificados(certificados.filter(c => c.id !== id));
           alert("Certificado apagado com sucesso!") 
        }
    }

    const HandleEditar = (certificado) => {
        setParticipante(certificado.participante);
        setEvento(certificado.evento);
        setCargaHoraria(certificado.carga_horaria);
        setDataInicio(certificado.data_inicio);
        setDataFim(certificado.data_fim);
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
                            <th>Início</th>
                            <th>Fim</th>
                            <th>Carga Horária</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {certificados.map((c) => (
                            <tr key={c.id}>
                                <td>{c.participante}</td>
                                <td>{c.evento}</td>
                                <td>{c.data_inicio}</td>
                                <td>{c.data_fim}</td>
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
                            <Input 
                                label="Participante" 
                                value={participante} 
                                onChange={(e) => setParticipante(e.target.value)}
                            />
                            <Input 
                                label="Evento" 
                                value={evento} 
                                onChange={(e) => setEvento(e.target.value)} 
                            />
                            
                            <div className="form-row">
                                <Input 
                                    label="Data Início" 
                                    value={dataInicio} 
                                    onChange={(e) => setDataInicio(e.target.value)} 
                                    type="date" 
                                />
                                <Input 
                                    label="Data Fim" 
                                    value={dataFim} 
                                    onChange={(e) => setDataFim(e.target.value)} 
                                    type="date" 
                                />
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