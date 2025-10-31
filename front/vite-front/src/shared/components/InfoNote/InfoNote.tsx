import React from 'react';
import './InfoNote.css';

export interface InfoNoteProps {
    children: React.ReactNode;
    className?: string;
}

const InfoNote: React.FC<InfoNoteProps> = ({ children, className }) => {
    return <p className={className ? `info-note ${className}` : 'info-note'}>{children}</p>;
};

export default InfoNote;
