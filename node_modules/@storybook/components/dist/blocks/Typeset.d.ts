import React from 'react';
export interface TypesetProps {
    fontSizes: number[];
    fontWeight?: number;
    sampleText?: string;
}
/**
 * Convenient tyleguide documentation showing examples of type
 * with different sizes and weights and configurable sample text.
 */
export declare const Typeset: React.FunctionComponent<TypesetProps>;
