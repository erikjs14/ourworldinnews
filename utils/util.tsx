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

export const minMaxAdd = (start: number, toAdd: number, min: number, max: number) => {
    const val = start + toAdd;
    if (val < min) {
        return min;
    } else if (val > max) {
        return max;
    } else {
        return val;
    }
}

// randomly lighten or darken color
export const randomBrightnessChange = (r: number, g: number, b: number, maxAmount: number): string => {
    const amount = Math.round(Math.random() * maxAmount);
    const col = [
        minMaxAdd(r, amount, 0, 255),
        minMaxAdd(g, amount, 0, 255),
        minMaxAdd(b, amount, 0, 255),
    ];
    return `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
}