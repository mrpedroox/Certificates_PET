import logoPet from '../../assets/logo-pet-branca.png'

function Header() {

    return(
        <header className="app-header">
            <div className="header-content">

                <img 
                src={logoPet} 
                alt="Logo do PET Computação" 
                className="header-logo-img"
                />

                <div className="header-text">
                    <h1>SISTEMA DE GERAÇÃO DE CERTIFICADOS PET</h1>
                </div>
            </div>
            
        </header>
    )
}

export default Header