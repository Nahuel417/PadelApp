import EditarAvatar from './EditarAvatar';
import userDatos from '../../helpers/userDatos';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CajaAvatarPerfil = () => {
    const [user, setUser] = useState(userDatos[0]);
    const [editAvatar, setEditAvatar] = useState(false);

    const handleOnClick = (e) => {
        setEditAvatar(true);
    };

    const handleOnClose = () => {
        setEditAvatar(false);
    };

    return (
        <div className="caja-avatar" id="caja-avatar">
            <div className="card">
                <Link onClick={handleOnClick}>
                    <img src={user.avatar} alt={`${user.name} ${user.last_name}`} />
                    <div className="card-img-overlay caja-botonEditar">
                        <p>Editar Foto de Perfil</p>
                    </div>
                </Link>
            </div>

            {editAvatar && <EditarAvatar handleOnClose={handleOnClose} />}
        </div>
    );
};

export default CajaAvatarPerfil;
