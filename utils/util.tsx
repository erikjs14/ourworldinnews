export const toCss = (...classNames: string[]): string => classNames.join(' ');

export const getIff = (condition: boolean, val: string): string => condition ? val : '';

// rewrite links to use https
export const toHttps = (link: string): string => link?.replace('http://', 'https://');

export const isMobile = () => typeof window !== 'undefined' && window?.matchMedia('(max-width: 768px)').matches;

export const accessViaDot = (obj: Object, path: string) => path.split('.').reduce((o, i) => o[i], obj);