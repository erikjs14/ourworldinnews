export const toCss = (...classNames: string[]): string => classNames.join(' ');

export const getIff = (condition: boolean, val: string): string => condition ? val : '';