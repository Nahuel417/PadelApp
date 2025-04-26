import { Formik, Form, Field } from 'formik';
import { validateLogin } from '../../helpers/validations';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUserActive } from '../../redux/reducer';
import axios from 'axios';
import { useEffect } from 'react';

const CajaFormLogin = () => {
    const userActive = useSelector((state) => state.userData.userActive);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const postFunctionLogin = async (formData) => {
        try {
            const response = await axios.post('http://localhost:3000/users/login', formData);
            const userData = response.data.user;

            if (response.data.login) {
                dispatch(addUserActive(userData));
                navigate('/mi-perfil');
            }
        } catch (error) {
            swal({
                title: '¡Error!',
                text: error.response.data.error,
                icon: 'error',
                button: 'Aceptar',
            });
        }
    };

    useEffect(() => {
        if (userActive !== null) {
            navigate('/mi-perfil');
        }
    }, [userActive, navigate]);

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                }}
                validate={validateLogin}
                onSubmit={(valores) => {
                    postFunctionLogin(valores);
                }}>
                {({ errors }) => (
                    <Form action="" id="form">
                        <div className="contendor-form" id="contendor-form">
                            <div className="caja-login" id="caja-login">
                                <Field type="text" name="email" id="inputEmail" required />
                                <span className="span-correo">Correo Electrónico</span>
                                <p className="feedback-negativo">{errors.email}</p>
                            </div>

                            <div className="caja-login" id="caja-login">
                                <Field type="password" name="password" id="inputContrasenia" required />
                                <span className="span-contrasenia">Contraseña</span>
                                <p className="feedback-negativo">{errors.password}</p>
                            </div>

                            <div className="cookie-recuerdame" id="cookie-recuerdame">
                                <div>
                                    <Field type="checkbox" name="cookie" id="inputCookie" />
                                    <label>Recuerdame</label>
                                </div>

                                <span>
                                    <a href="#">¿Olvidaste tu contraseña? </a>
                                </span>
                            </div>

                            <div className="caja-boton-login">
                                <button type="submit" className="boton-login">
                                    Ingresar
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default CajaFormLogin;
