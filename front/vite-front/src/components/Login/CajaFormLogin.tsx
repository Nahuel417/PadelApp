import { Formik, Form, Field } from 'formik';
import { validateLogin } from '../../helpers/validations';
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert';
import { signIn } from '../../services/auth';
import { supabase } from '../../services/supabaseClient';
import { useUserStore } from '../../store/userStore';

const CajaFormLogin = () => {
    const addUserActive = useUserStore((state) => state.addUserActive);
    const navigate = useNavigate();

    const postFunctionLogin = async (formData: { email: string; password: string; rememberMe: boolean }) => {
        try {
            const data = await signIn(formData.email, formData.password);
            const { data: userData, error } = await supabase.from('users').select('*').eq('id', data.user.id).maybeSingle();

            if (error || !userData) {
                throw new Error(error?.message || 'Usuario no encontrado');
            }

            // Guardar en localStorage o sessionStorage según checkbox
            const storage = formData.rememberMe ? localStorage : sessionStorage;
            storage.setItem('userActive', JSON.stringify(userData));

            addUserActive(userData);
            swal({
                title: '¡Bienvenido!',
                text: 'Has iniciado sesión correctamente.',
                icon: 'success',
                // @ts-ignore
                button: 'Continuar',
            });

            navigate('/mi-perfil');
        } catch (error: any) {
            const supabaseErrorMessage =
                error?.message === 'Invalid login credentials' || error?.code === 'invalid_credentials' ? 'Credenciales invalidas.' : error?.message || 'Ocurrió un error inesperado.';

            swal({
                title: '¡Error!',
                text: supabaseErrorMessage,
                icon: 'error',
                // @ts-ignore
                button: 'Aceptar',
            });
        }
    };

    return (
        <>
            <Formik<{ email: string; password: string; rememberMe: boolean }>
                initialValues={{
                    email: '',
                    password: '',
                    rememberMe: false,
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
                                    <Field type="checkbox" name="rememberMe" id="inputRememberMe" />
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
