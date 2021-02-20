export const toCss = (...classNames: string[]): string => classNames.join(' ');

export const getIff = (condition: boolean, val: string): string => condition ? val : '';

// rewrite links to use https
export const toHttps = (link: string): string => link?.replace('http://', 'https://');

export const isMobile = () => typeof window !== 'undefined' && window?.matchMedia('(max-width: 768px)').matches;

export const accessViaDot = (obj: Object, path: string) => path.split('.').reduce((o, i) => o[i], obj);

// checks if expired
export const isValid = (timestamp: number) => timestamp >= new Date().getTime();

// check if touch is drag
export const isDrag = (touchStart: Touch, touchEnd: Touch, threshold: number = 25) => touchStart && touchEnd ? Math.sqrt(
    ( touchEnd.screenX - touchStart.screenX )**2 + ( touchEnd.screenY - touchStart.screenY )**2
) > threshold  :  false; 