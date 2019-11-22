import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
interface Case {
    logo?: string;
    isAppLogo?: boolean;
    title: string;
    description: string;
    link?: string;
    image: string;
}
interface CasesProps {
    cases: Case[];
    style?: React.CSSProperties;
    className?: string;
}
declare const Cases: React.FC<CasesProps>;
export default Cases;
