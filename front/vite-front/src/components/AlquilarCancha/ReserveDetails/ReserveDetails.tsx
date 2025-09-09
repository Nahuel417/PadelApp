import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { itemVariants, listVariants } from '../../Animations/listVariants';
import ModalHorarios from '../ModalHorarios/ModalHorarios';
import Skeleton from '../../Skeletons/SkeletonButonns/Skeleton';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import './ReserveDetails.css';

const ReserveDetail = ({ affair, setFieldValue, values, userRole, coaches, loading, courts }) => {
    const [modalKey, setModalKey] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [shouldOpenModal, setShouldOpenModal] = useState(false);

    const openModal = () => {
        setModalKey((prev) => prev + 1);
        setShowModal(true);
    };

    useEffect(() => {
        if ((affair === 'Jugar' && values.cancha && shouldOpenModal) || (affair === 'Entrenar' && values.cancha && values.entrenador && shouldOpenModal)) {
            openModal();
            setShouldOpenModal(false); // resetea el flag
        }
    }, [affair, values.cancha, values.entrenador, shouldOpenModal]);

    return (
        <>
            <div className="contenedor-detalles-reserva">
                <div className="caja-select-cancha">
                    <label>Canchas</label>
                    <motion.div variants={listVariants} initial="hidden" animate="visible" exit="exit" className="listas-canchas">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} width="120px" height="40px" variants={itemVariants} />)
                        ) : courts.length > 0 ? (
                            courts.map((c) => (
                                <motion.button
                                    type="button"
                                    key={c.id}
                                    className={`opcion-cancha ${values.cancha === c.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setFieldValue('cancha', c.id);
                                        setFieldValue('courtPrice', c.price_per_hour);
                                        setFieldValue('surface_type', c.surface_type);
                                        setShouldOpenModal(true);
                                    }}
                                    variants={itemVariants}
                                    animate={!values.affair || (values.affair === 'Entrenar' && coaches.length === 0) ? 'disabled' : 'visible'}
                                    disabled={!values.affair || (values.affair === 'Entrenar' && coaches.length === 0)}
                                    //   whileHover={{ scale: 1.05 }}
                                    //   whileTap={{ scale: 0.95 }}
                                >
                                    {c.name}
                                </motion.button>
                            ))
                        ) : (
                            <ErrorMessage message={'No hay canchas habilitadas por el momento. Intenta más tarde.'} width={'100%'} />
                        )}
                    </motion.div>
                </div>

                <div className="caja-select-entrenador">
                    <label>Entrenadores</label>
                    <motion.div variants={listVariants} initial="hidden" animate="visible" exit="exit" className="lista-entrenadores">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} width="150px" height="60px" variants={itemVariants} />)
                        ) : coaches.length > 0 ? (
                            coaches.map((e) => {
                                const isSelected = values.entrenador === e.id;
                                return (
                                    <motion.button
                                        type="button"
                                        key={e.id}
                                        className={`entrenador-btn ${isSelected ? 'selected' : ''}`}
                                        onClick={() => {
                                            setFieldValue('entrenador', e.id);
                                            setShouldOpenModal(true);
                                        }}
                                        variants={itemVariants}
                                        animate={!values.affair || values.affair !== 'Entrenar' || courts.length === 0 ? 'disabled' : 'visible'}
                                        disabled={!values.affair || values.affair !== 'Entrenar' || courts.length === 0}>
                                        <div className="entrenador-nombre">
                                            <p>
                                                {e.user.first_name} {e.user.last_name}
                                            </p>
                                            <a
                                                href={`/perfil/${e.id}`}
                                                target="_blank"
                                                title="Ver perfil"
                                                rel="noopener noreferrer"
                                                className={!values.affair || values.affair !== 'Entrenar' || courts.length === 0 ? 'perfil-icon disabled' : 'perfil-icon'}
                                                onClick={(ev) => ev.stopPropagation()}>
                                                <i className="bi bi-person-lines-fill"></i>
                                            </a>
                                        </div>
                                        <div className="entrenador-tarifa">${e.hourly_rate}.00 /hora</div>
                                    </motion.button>
                                );
                            })
                        ) : (
                            <ErrorMessage message={'De momento no hay entrenadores disponibles. Intenta más tarde.'} width={'100%'} />
                        )}
                    </motion.div>
                </div>
            </div>

            <AnimatePresence>{showModal && <ModalHorarios key={modalKey} values={values} setFieldValue={setFieldValue} setShowModal={setShowModal} userRole={userRole} />}</AnimatePresence>
        </>
    );
};

export default ReserveDetail;
