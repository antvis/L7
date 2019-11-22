import React from 'react';
export interface Nav {
    slug: string;
    order: number;
    title: {
        [key: string]: string;
    };
    target?: '_blank';
}
interface NavMenuItemsProps {
    navs: Nav[];
    path: string;
}
declare const NavMenuItems: React.FC<NavMenuItemsProps>;
export default NavMenuItems;
