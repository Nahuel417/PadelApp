import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { signOut } from '../../services/auth';
import { User } from '../../interfaces/userInterface';

const CajaInfoPerfil = ({ userActive }: { userActive: User }) => {
    const removeUserActive = useUserStore((state) => state.removeUserActive);

    const navigate = useNavigate();

    const handleOnClick = async () => {
        const confirmacion = await swal({
            title: '¿Desea Cerrar Sesión?',
            icon: 'warning',
            dangerMode: true,
            // @ts-ignore
            buttons: true,
        });

        if (confirmacion) {
            await signOut();

            swal({
                title: '¡Cierre de sesión exitoso!',
                icon: 'success',
            }).then(() => {
                navigate('/');
                removeUserActive();
            });
        }
    };

    return (
        <div className="caja-info">
            <h4 id="nombreCompleto-perfil">{`${userActive?.first_name} ${userActive?.last_name}`}</h4>
            <p id="email-perfil">{userActive?.email}</p>
            <p id="fecha-perfil">{userActive?.birthday}</p>

            <div className="caja-botones">
                <button type="submit" id="boton-cerrarSesion" onClick={handleOnClick}>
                    Cerrar Sesión
                </button>
                <button type="submit" id="boton-eliminar">
                    Eliminar Usuario
                </button>
            </div>
        </div>
    );
};

export default CajaInfoPerfil;
