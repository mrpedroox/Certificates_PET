function SideBar({ activeTab, setActiveTab }){
    const menuItems = ['Participantes', 'Eventos', 'Certificados']

    return(
        <div className="app-side-bar">
            <div className="side-bar-content">
                <ul className="side-bar-list">
                    {menuItems.map((item) => (
                        <li
                        key = {item}
                        className={activeTab === item ? 'active' : ''}
                        onClick={() => setActiveTab(item)} >
                        {item}    
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default SideBar