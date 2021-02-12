import { Variant, Variants } from "framer-motion";

export const homeVariants = (oldRoute: string | null): Variants => ({
    hidden: (function(): Variant {
        switch (oldRoute) {
            case '/about':
                return {
                    y: '-100%',
                }
            default:
                if (/\/top\/[a-z]{2}$/.test(oldRoute)) {
                    return undefined;
                }
                return {
                    y: -10,
                    opacity: 0,
                }
        }
    })(),
    visible: (function(): Variant {
        switch (oldRoute) {
            case '/about':
                return {
                    y: 0,
                    transition: {
                        duration: .3,
                        ease: 'easeOut',
                    }
                }
            default:
                if (/\/top\/[a-z]{2}$/.test(oldRoute)) {
                    return undefined;
                }
                return {
                    y: 0,
                    opacity: 1,
                    transition: {
                        delay: .8,
                    }
                }
        }
    })(),
    exit: (route) => {
        switch (route) {
            case '/about':
                return {
                    y: '-100%',
                    transition: {
                        duration: .3,
                        ease: 'easeIn',
                    }
                };
            default: return undefined;
        }
    }
});

export const mapVariants = (oldRoute: string | null): Variants => ({
    hidden: (function(): Variant {
        switch (oldRoute) {
            default: 
                if (/\/top\/[a-z]{2}$/.test(oldRoute)) {
                    return {
                        opacity: 0,
                        y: -10,
                    };
                }
                return undefined;
        }
    })(),
    visible: (function(): Variant {
        switch (oldRoute) {
            default:  
            if (/\/top\/[a-z]{2}$/.test(oldRoute)) {
                return {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: .2,
                    }
                };
            }
            return undefined;
        }
    })(),
    exit: (route) => {
        switch (route) {
            case '/top/[isoA2]':
                return {
                    opacity: 0,
                    transition: {
                        duration: .2,
                    }
                }
            default: return undefined;
        }
    }
});