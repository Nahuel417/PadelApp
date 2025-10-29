import React, { ChangeEvent } from 'react';
import './SearchInput.css';

export interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    ariaLabel?: string;
    iconClassName?: string;
    className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Buscar…', ariaLabel = 'Buscar', iconClassName = 'bi bi-search', className }) => {
    const containerClassName = className ? `search-input ${className}` : 'search-input';

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className={containerClassName}>
            <i className={iconClassName} aria-hidden="true"></i>
            <input type="text" value={value} onChange={handleChange} placeholder={placeholder} aria-label={ariaLabel} />
        </div>
    );
};

export default React.memo(SearchInput);
