import React, { useState } from 'react'
import './App.css'
import Header from './components/layout/Header'
import SideBar from './components/layout/SideBar'
import TelaEventos from './pages/TelaEventos'
import TelaParticipantes from './pages/TelaParticipantes'
import TelaCertificados from './pages/TelaCertificados'

function App() {
  const [activeTab, setActiveTab] = useState('Participantes')

  const renderContent = () => {
    switch (activeTab){
      case 'Participantes':
        return <TelaParticipantes/>;
      case 'Eventos':
        return <TelaEventos/>;
      case 'Certificados':
        return <TelaCertificados/>;
      default:
        return <TelaParticipantes/>;
    }
  }

  return (
    <>
      <div className="app-container">
        <Header/>
        <div className="body-container">
          <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderContent()} 
        </div>
      </div>
    </>
  )
}

export default App
