import React from 'react';
interface ProductProps {
    name?: string;
    icon?: string;
    slogan?: string;
    description?: string;
    url?: string;
    links?: Array<{
        title: React.ReactNode;
        url?: string;
        icon?: React.ReactNode;
        openExternal?: boolean;
    }>;
    style?: React.CSSProperties;
    language?: string;
}
declare const Product: React.FC<ProductProps>;
export default Product;
