import { useState } from 'react';
import { asuntos } from '../../helpers/inputsDatos';
import { ErrorMessage, Field } from 'formik';
import { motion } from 'framer-motion';
import { itemVariants } from '../Animations/listVariants';

const CajaAsunto = ({ error }) => {
    const [misAsuntos] = useState(asuntos);

    return (
        <motion.div className="caja-asunto" variants={itemVariants} initial="hidden" animate="visible" exit="exit">
            <div className="caja-label">
                <label>Asunto</label>
            </div>
            <div className="caja-select">
                <Field
                    as={motion.select} // Animamos el select directamente
                    name="affair"
                    id="select-asunto"
                    initial="hidden"
                    animate="visible"
                    exit="exit">
                    <option value="" disabled>
                        Seleccione un Asunto
                    </option>

                    {misAsuntos.map((asunto, index) => (
                        <option value={asunto} key={index}>
                            {asunto}
                        </option>
                    ))}
                </Field>
            </div>

            {error === undefined ? (
                <p className="feedback-negativo" id="feedback-negativo"></p>
            ) : (
                <ErrorMessage
                    name="affair"
                    component={() => (
                        <p className="feedback-negativo" id="feedback-negativo">
                            {error}
                        </p>
                    )}
                />
            )}
        </motion.div>
    );
};

export default CajaAsunto;
