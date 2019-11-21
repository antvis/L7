import React from 'react';
interface Card {
    icon: string;
    title: string;
    description: string;
}
interface FeaturesProps {
    title?: string;
    features: Card[];
    className?: string;
    style?: React.CSSProperties;
    id?: string;
}
declare const Features: React.FC<FeaturesProps>;
export default Features;
