import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUserActive } from '../../redux/reducer';
import { useNavigate } from 'react-router-dom';

const CajaInfoPerfil = () => {
    const userActive = useSelector((state) => state.userData.userActive);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOnClick = () => {
        swal({
            title: '¿Desea Cerrar Sesion?',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((sesionCerrada) => {
            if (sesionCerrada) {
                dispatch(removeUserActive());
                swal({
                    title: '¡Cierre de sesión exitoso!',
                    icon: 'success',
                });
                navigate('/');
            }
        });
    };

    // useEffect para la peticion al back
    useEffect(() => {
        if (userActive == null) {
            swal({
                title: '¡Error de autenticación!',
                text: 'Debe iniciar sesión para continuar',
                icon: 'warning',
            });
            navigate('/login');
        }
    }, [userActive, navigate]);
    console.log(userActive);

    return (
        <div className="caja-info">
            <h4 id="nombreCompleto-perfil">{`${userActive?.user.name} ${userActive?.user.last_name}`}</h4>
            <p id="email-perfil">{userActive?.email}</p>
            <p id="fecha-perfil">{userActive?.user.birthday}</p>

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
