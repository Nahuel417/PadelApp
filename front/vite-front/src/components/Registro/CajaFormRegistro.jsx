import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { labelsRegistro1, labelsRegistro2 } from '../../helpers/inputsDatos';
import { validateRegister } from '../../helpers/validations';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CajaLabelRegistro from './CajaLabelRegistro';
import axios from 'axios';

const CajaFormRegistro = () => {
    const [labels1, setLabels1] = useState(labelsRegistro1);
    const [labels2, setLabels2] = useState(labelsRegistro2);

    const navigate = useNavigate();

    const postFunctionRegister = async (formData) => {
        try {
            await axios.post('http://localhost:3000/users/register', formData);

            swal({
                title: '¡Exito!',
                text: 'Fue registrado con exito!',
                icon: 'success',
                button: 'Continuar',
            });

            navigate('/login');
        } catch (error) {
            swal({
                title: '¡Error!',
                text: error.response.data.error,
                icon: 'error',
                button: 'Aceptar',
            });
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    birthday: '',
                }}
                validate={validateRegister}
                onSubmit={(valores) => {
                    postFunctionRegister(valores);
                }}>
                {({ errors }) => (
                    <Form action="" id="form">
                        <div className="form-registro">
                            <div className="contendor-form-registro" id="contendor-form-registro">
                                <div className="caja-inputs-1" id="caja-inputs-1">
                                    {labels1.map((label, index) => {
                                        const errorName =
                                            label === 'nombre' ? 'name' : label === 'contraseña' ? 'password' : label === 'Fecha de Nacimiento' ? 'birthday' : 'email';

                                        return <CajaLabelRegistro key={index} label={label} errores={errors[errorName]} />;
                                    })}
                                </div>

                                <div className="caja-inputs-2" id="caja-inputs-2">
                                    {labels2.map((label, index) => {
                                        const errorName = label === 'apellido' ? 'last_name' : label === 'Confirmar Contraseña' ? 'confirmPassword' : 'email';

                                        return <CajaLabelRegistro key={index} label={label} errores={errors[errorName]} />;
                                    })}
                                </div>
                            </div>
                            <p className="campos-obligatorios">* Todos los cambios son obligatorios</p>

                            <div className="caja-boton-registro">
                                <button type="submit" className="boton-registro">
                                    Registrarme
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default CajaFormRegistro;
