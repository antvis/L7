import React from 'react';
interface ProductsProps {
    show: boolean;
    rootDomain: string;
    language?: 'zh' | 'en';
    className?: string;
}
declare const Products: React.FC<ProductsProps>;
export default Products;
