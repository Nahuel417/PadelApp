import './ErrorMessage.css';

interface ErrorProps {
    message: string;
    icon?: string;
    width?: string;
}

const ErrorMessage = ({ message, icon = 'bi bi-exclamation-triangle', width }: ErrorProps) => {
    return (
        <div className="error-msg" style={width ? { width } : {}}>
            <i className={icon}></i>
            <span>{message}</span>
        </div>
    );
};

export default ErrorMessage;
