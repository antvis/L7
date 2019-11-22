import React from 'react';
interface Company {
    name: string;
    img: string;
}
interface CompaniesProps {
    title: string;
    companies: Company[];
    className?: string;
    style?: React.CSSProperties;
}
declare const Companies: React.FC<CompaniesProps>;
export default Companies;
