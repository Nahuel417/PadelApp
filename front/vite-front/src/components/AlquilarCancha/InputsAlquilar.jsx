import { useState } from 'react';
import { labels } from '../../helpers/inputsDatos';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { validateAlquilarCancha } from '../../helpers/validations';
import { useDispatch } from 'react-redux';
import { addUserAppointments } from '../../redux/reducer';
import CajaInputsDatos from './CajaInputsDatos';
import CajaAsunto from './CajaAsunto';
import axios from 'axios';

const InputsAlquilar = ({ user }) => {
    const [label, setLabel] = useState(labels);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const functionSchedule = async (formData) => {
        try {
            const response = await axios.post('http://localhost:3000/appointments/schedule', formData);
            const appointmentData = response.data;
            dispatch(addUserAppointments(appointmentData));
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
                    asunto: '',
                    fecha: '',
                    horario: '',
                    cancha: '',
                    entrenador: '',
                    userId: user.id,
                }}
                validate={validateAlquilarCancha}
                onSubmit={(valores, { resetForm }) => {
                    resetForm();
                    functionSchedule(valores);
                    swal({
                        title: '¡Exito!',
                        text: 'Cancha Alquilada con exito!',
                        icon: 'success',
                        button: 'Continuar',
                    });
                    navigate('/historial');
                }}>
                {({ errors, values, setFieldValue }) => (
                    <Form action="">
                        <div className="caja-inputs" id="caja-inputs">
                            <CajaAsunto error={errors.asunto} />

                            <div className="caja-datos" id="caja-datos">
                                {label.map((label, index) => {
                                    const errorName = label === 'Dia' ? 'fecha' : label === 'Horario' ? 'horario' : label === 'Cancha' ? 'cancha' : 'entrenador';

                                    return <CajaInputsDatos key={index} label={label} errores={errors[errorName]} valores={values} setFieldValue={setFieldValue} />;
                                })}
                            </div>

                            <div className="caja-boton" id="caja-boton">
                                <button type="submit">Alquilar Cancha</button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default InputsAlquilar;
