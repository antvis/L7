
/** 数学运算 根据计算表达式进行数学运算
 * * * Math operators:
 * `['*', value1, value2]` multiplies `value1` by `value2`
 * `['/', value1, value2]` divides `value1` by `value2`
 * `['+', value1, value2]` adds `value1` and `value2`
 * `['-', value1, value2]` subtracts `value2` from `value1`
 * `['%', value1, value2]` returns the result of `value1 % value2` (modulo)
 * `['^', value1, value2]` returns the value of `value1` raised to the `value2` power
 * `['abs', value1]` returns the absolute value of `value1`
 * `['floor', value1]` returns the nearest integer less than or equal to `value1`
 * `['round', value1]` returns the nearest integer to `value1`
 * `['ceil', value1]` returns the nearest integer greater than or equal to `value1`
 * `['sin', value1]` returns the sine of `value1`
 * `['cos', value1]` returns the cosine of `value1`
 * `['atan', value1, value2]` returns `atan2(value1, value2)`. If `value2` is not provided, returns `atan(value1)`
 */
 export function mathematical(symbol: string, n1: number, n2: number) {    
    switch(symbol) {
        case '+': return n1 + n2;
        case '-': return n1 - n2;
        case '*': return n1 * n2;
        case '/': return n1 / n2;
        case '%': return n1 % n2;

        case '^': return Math.pow(n1, n2);
        case 'abs': return Math.abs(n1);
        case 'floor': return Math.floor(n1);
        case 'round': return Math.round(n1);
        case 'ceil': return Math.ceil(n1);
        case 'sin': return Math.sin(n1);
        case 'cos': return Math.cos(n1);
        case 'atan': return (n2 === -1) ? Math.atan(n1): Math.atan2(n1, n2);

        default:
            console.warn('Calculate symbol err! Return default 0');
            return 0;
    }
}