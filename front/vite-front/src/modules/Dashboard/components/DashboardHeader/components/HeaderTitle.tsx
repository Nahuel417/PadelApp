import React from 'react';
import { HeaderTitleProps } from '../types/types';

export const HeaderTitle: React.FC<HeaderTitleProps> = ({ title }) => {
    return <h1 className="dashboard-header-title">{title}</h1>;
};
