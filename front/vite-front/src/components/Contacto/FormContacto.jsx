import { Formik, Form, Field } from 'formik';
import { validateContact, validateLogin } from '../../helpers/validations';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUserActive } from '../../redux/reducer';
import axios from 'axios';

const FormContacto = () => {
    // const dispatch = useDispatch();
    // const navigate = useNavigate();

    // const postFunctionLogin = async (formData) => {
    //     try {
    //         const response = await axios.post('http://localhost:3000/users/login', formData);
    //         const userData = response.data.user;

    //         if (response.data.login) {
    //             dispatch(addUserActive(userData));
    //             navigate('/mi-perfil');
    //         }
    //     } catch (error) {
    //         alert(error.response.data.error);
    //     }
    // };

    return (
        <>
            <Formik
                initialValues={{
                    email: '',
                    message: '',
                }}
                validate={validateContact}
                onSubmit={(valores, { resetForm }) => {
                    // postFunctionLogin(valores);
                    resetForm();
                }}>
                {({ errors }) => (
                    <Form action="" id="form">
                        <div className="contendor-form" id="contendor-form">
                            <div className="caja-contacto" id="caja-contacto">
                                <Field type="text" name="email" id="inputEmail" required />
                                <span className="span-correo">Correo Electrónico</span>
                                <p className="feedback-negativo">{errors.email}</p>
                            </div>

                            <div className="caja-contacto" id="caja-contacto">
                                <Field name="message" as="textarea" required />
                                <span className="span-mensaje">Mensaje</span>
                                <p className="feedback-negativo">{errors.message}</p>
                            </div>

                            <div className="caja-boton-contacto">
                                <button type="submit" className="boton-contacto">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default FormContacto;
