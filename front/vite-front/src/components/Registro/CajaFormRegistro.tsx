import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { labelsRegistro1, labelsRegistro2 } from '../../helpers/inputsDatos';
import { validateRegister } from '../../helpers/validations';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CajaLabelRegistro from './CajaLabelRegistro';
import { signUp } from '../../services/auth';
import { supabase } from '../../services/supabaseClient';
import { IRegisterForm } from '../../interfaces/authInterfaces';

const CajaFormRegistro = () => {
    const [labels1, setLabels1] = useState(labelsRegistro1);
    const [labels2, setLabels2] = useState(labelsRegistro2);

    const navigate = useNavigate();

    const postFunctionRegister = async (formData: IRegisterForm) => {
        try {
            const data = await signUp(formData.email, formData.password);

            const user = data.user;

            if (user) {
                console.log('entro');

                await supabase.from('users').insert([
                    {
                        id: user.id,
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        birthday: formData.birthday,
                        email: formData.email,
                    },
                ]);
            }

            swal({
                title: '¡Exito!',
                text: 'Fue registrado con exito!',
                icon: 'success',
                // @ts-ignore
                button: 'Continuar',
            });

            navigate('/login');
        } catch (error) {
            swal({
                title: '¡Error!',
                text: error.response.data.error,
                icon: 'error',
                // @ts-ignore
                button: 'Aceptar',
            });
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    first_name: '',
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
                                        const errorName = label === 'nombre' ? 'first_name' : label === 'contraseña' ? 'password' : label === 'Fecha de Nacimiento' ? 'birthday' : 'email';

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
