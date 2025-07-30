import { useState } from 'react';
import { labels } from '../../helpers/inputsDatos';
import { useNavigate } from 'react-router-dom';
import { Form, Formik } from 'formik';
import { validateAlquilarCancha } from '../../helpers/validations';
import CajaInputsDatos from './CajaInputsDatos';
import CajaAsunto from './CajaAsunto';
import { useUserStore } from '../../store/userStore';
import { createReservation } from '../../services/reservation';
import { Reservation } from '../../interfaces/reservationInterface';

const InputsAlquilar = ({ user }) => {
    const [label, setLabel] = useState(labels);
    const navigate = useNavigate();
    const addUserReservation = useUserStore((state) => state.addUserReservation);

    const functionSchedule = async (formData) => {
        try {
            const reservationData: Omit<Reservation, 'id'> = {
                user_id: formData.userId,
                coach_id: null,
                court_id: 1,
                reservation_date: formData.fecha,
                start_time: formData.horario,
                end_time: formData.horario,
                total_amount: 10,
                status: 'pending',
                payment_status: 'pending',
                preference_id: null,
                notes: null,
                affair: formData.affair,
            };

            const newReservation = await createReservation(reservationData);
            if (!newReservation) {
                throw Error;
            }

            addUserReservation(newReservation);

            swal({
                title: '¡Exito!',
                text: '!Reserva realiza con exito!',
                icon: 'success',
                //@ts-ignore
                button: true,
            });

            navigate('/historial');
        } catch (error) {
            swal({
                title: '¡Error!',
                text: 'Hubo un problema al hacer tu reserva.',
                icon: 'error',
                //@ts-ignore
                button: 'Aceptar',
            });
        }
    };

    return (
        <>
            <Formik
                initialValues={{
                    affair: '',
                    fecha: '',
                    horario: '',
                    cancha: '',
                    entrenador: '',
                    userId: user?.id,
                }}
                validate={validateAlquilarCancha}
                onSubmit={(valores, { resetForm }) => {
                    resetForm();
                    functionSchedule(valores);
                }}>
                {({ errors, values, setFieldValue }) => (
                    <Form action="">
                        <div className="caja-inputs" id="caja-inputs">
                            <CajaAsunto error={errors.affair} />

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
