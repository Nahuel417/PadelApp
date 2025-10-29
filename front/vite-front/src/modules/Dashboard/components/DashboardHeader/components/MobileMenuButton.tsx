import React from 'react';
import { MobileMenuButtonProps } from '../types/types';

export const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick }) => {
    return (
        <button className="mobile-menu-button" onClick={onClick} aria-label="Toggle menu">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
    );
};
