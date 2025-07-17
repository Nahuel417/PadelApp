import CajaList from './CajaList';
import CajaLogo from './CajaLogo';
import CajaSesion from './CajaSesion';
import './Header.css';

const Header = () => {
    return (
        <>
            <header>
                <div className="contenedor-header">
                    <CajaLogo />

                    <CajaList />

                    <CajaSesion />
                </div>
            </header>
        </>
    );
};

export default Header;
