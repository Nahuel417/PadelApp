import { ErrorMessage, Field } from 'formik';

const CajaLabelRegistro = ({ label, errores }) => {
    return (
        <div className="caja-registro" id="caja-registro">
            <div>
                <label> {label} *</label>
            </div>

            {label === 'Confirmar Contraseña' ? (
                <>
                    <Field type="password" name="confirmPassword" className="confirmPassword" placeholder="Ingrese su contraseña nuevamente" />

                    {JSON.stringify(errores) === undefined ? (
                        <p className="feedback-negativo" id="feedback-negativo"></p>
                    ) : (
                        <ErrorMessage
                            name="confirmPassword"
                            component={() => (
                                <p className="feedback-negativo" id="feedback-negativo">
                                    {errores}
                                </p>
                            )}
                        />
                    )}
                </>
            ) : label === 'Fecha de Nacimiento' ? (
                <>
                    <div className="caja-fecha">
                        <Field type="date" name="birthday" className="fecha" />

                        {JSON.stringify(errores) === undefined ? (
                            <p className="feedback-negativo" id="feedback-negativo"></p>
                        ) : (
                            <ErrorMessage
                                name="birthday"
                                component={() => (
                                    <p className="feedback-negativo" id="feedback-negativo">
                                        {errores}
                                    </p>
                                )}
                            />
                        )}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-caret-down-square-fill" viewBox="0 0 16 16">
                            <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4 4a.5.5 0 0 0-.374.832l4 4.5a.5.5 0 0 0 .748 0l4-4.5A.5.5 0 0 0 12 6z" />
                        </svg>
                    </div>
                </>
            ) : (
                <>
                    <Field
                        type={label === 'contraseña' ? 'password' : 'text'}
                        name={label === 'nombre' ? 'name' : label === 'apellido' ? 'last_name' : label === 'contraseña' ? 'password' : 'email'}
                        className={label}
                        placeholder={`Ingrese su ${label}`}
                    />

                    {JSON.stringify(errores) === undefined ? (
                        <p className="feedback-negativo" id="feedback-negativo"></p>
                    ) : (
                        <ErrorMessage
                            name={label === 'nombre' ? 'name' : label === 'apellido' ? 'last_name' : label === 'contraseña' ? 'password' : 'email'}
                            component={() => (
                                <p className="feedback-negativo" id="feedback-negativo">
                                    {errores}
                                </p>
                            )}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CajaLabelRegistro;
