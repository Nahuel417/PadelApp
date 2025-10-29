import React from 'react';
import { UserAvatarProps } from '../types/types';

export const UserAvatar: React.FC<UserAvatarProps> = ({ initials }) => {
    return <div className="user-avatar">{initials}</div>;
};
