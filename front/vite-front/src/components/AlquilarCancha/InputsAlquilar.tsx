import { Form, Formik } from 'formik';
import { validateAlquilarCancha } from '../../helpers/validations';
import CajaAsunto from './CajaAsunto';
import ReserveDetail from './ReserveDetails/ReserveDetails';
import { User } from '../../interfaces/userInterface';
import { useReservationStore } from '../../store/useReservationStore';
import { useEffect } from 'react';
import { getTodayAdjusted } from '../../utils/functions/getTodayAdjusted';

interface InputsAlquilarProps {
    user: User | null;
}

const InputsAlquilar = ({ user }: InputsAlquilarProps) => {
    const { courts, coaches, loading, fetchInitialData } = useReservationStore();

    useEffect(() => {
        fetchInitialData();
    }, []);

    return (
        <>
            <Formik
                initialValues={{
                    affair: '',
                    fecha: getTodayAdjusted(),
                    horario: [],
                    cancha: '',
                    entrenador: '',
                    courtPrice: 0,
                    surface_type: '',
                    userId: user?.id,
                }}
                validate={validateAlquilarCancha}
                onSubmit={({ resetForm }) => {
                    resetForm();
                }}>
                {({ errors, values, setFieldValue }) => (
                    <Form action="">
                        <div className="caja-inputs" id="caja-inputs">
                            <CajaAsunto error={errors.affair} />

                            <ReserveDetail affair={values.affair} setFieldValue={setFieldValue} values={values} userRole={user.role_id} coaches={coaches} courts={courts} loading={loading} />
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default InputsAlquilar;
