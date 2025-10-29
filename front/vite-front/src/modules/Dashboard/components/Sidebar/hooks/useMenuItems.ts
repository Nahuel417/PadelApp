import { useMemo } from 'react';
import { UserRole, MenuItem } from '../types/types';
import { COMMON_MENU_ITEMS, COACH_MENU_ITEMS, ADMIN_MENU_ITEMS, SUPER_ADMIN_MENU_ITEMS, SETTINGS_ITEM } from '../constants/constants';

export const useMenuItems = (userRole: UserRole = 'admin'): MenuItem[] => {
    return useMemo(() => {
        switch (userRole) {
            case 'coach':
                return [...COMMON_MENU_ITEMS, ...COACH_MENU_ITEMS];
            case 'superadmin':
                return [...COMMON_MENU_ITEMS, ...SUPER_ADMIN_MENU_ITEMS];
            case 'admin':
            default:
                return [...COMMON_MENU_ITEMS, ...ADMIN_MENU_ITEMS, SETTINGS_ITEM];
        }
    }, [userRole]);
};
