import { User } from '../../../interfaces/userInterface';

const EditarPerfil = ({ userActive, setEdit }: { userActive: User; setEdit }) => {
    return (
        <div>
            <h1>Editar Perfil</h1>

            <div>
                <button type="submit" onClick={() => setEdit(false)}>
                    Atrás
                </button>
                <button type="submit">Gurdar</button>
            </div>
        </div>
    );
};

export default EditarPerfil;
