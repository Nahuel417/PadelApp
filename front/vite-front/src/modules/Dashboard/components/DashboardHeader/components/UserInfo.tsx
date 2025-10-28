import React, { useMemo } from 'react';
import { UserInfoProps } from '../types/types';
import { getInitials, getRoleLabel } from '../utils/userUtils';
import { UserAvatar } from './UserAvatar';

export const UserInfo: React.FC<UserInfoProps> = ({ userName, userRole }) => {
    const initials = useMemo(() => getInitials(userName), [userName]);
    const roleLabel = useMemo(() => getRoleLabel(userRole), [userRole]);

    return (
        <div className="header-user">
            <UserAvatar initials={initials} />
            <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">{roleLabel}</span>
            </div>
        </div>
    );
};
