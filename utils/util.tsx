export const toCss = (...classNames: string[]): string => classNames.join(' ');

export const getIff = (condition: boolean, val: string): string => condition ? val : '';

// rewrite links to use https
export const toHttps = (link: string): string => link?.replace('http://', 'https://');