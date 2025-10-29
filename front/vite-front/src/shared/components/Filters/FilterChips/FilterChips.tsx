import React from 'react';
import './FilterChips.css';

export interface FilterChipOption {
    value: string;
    label: string;
}

export interface FilterChipsProps {
    selectedValue: string;
    onChange: (value: string) => void;
    options?: FilterChipOption[];
    className?: string;
}

const DEFAULT_OPTIONS: FilterChipOption[] = [
    { value: '', label: 'All' },
];

const FilterChips: React.FC<FilterChipsProps> = ({ selectedValue, onChange, options = DEFAULT_OPTIONS, className }) => {
    const containerClassName = className ? `filter-chips ${className}` : 'filter-chips';

    return (
        <div className={containerClassName} role="tablist" aria-label="Filter options">
            {options.map((option) => (
                <button
                    key={option.value ?? 'all'}
                    type="button"
                    className={`filter-chip ${selectedValue === option.value ? 'active' : ''}`}
                    onClick={() => onChange(option.value)}
                    role="tab"
                    aria-selected={selectedValue === option.value}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default React.memo(FilterChips);
