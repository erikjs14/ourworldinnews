import { Variant, Variants } from "framer-motion"

export const aboutVariants = (oldRoute: string | null): Variants => ({
    hidden: (function(): Variant {
        switch (oldRoute) {
            case '/':
                return {
                    y: '100%',
                };
            default:
                return {
                    y: -10,
                    opacity: 0,
                }
        }
    })(),
    visible: (function(): Variant {
        switch (oldRoute) {
            case '/':
                return {
                    y: 0,
                    transition: {
                        ease: 'easeOut',
                        duration: .2,
                    }
                }
            default:
                return {
                    y: 0,
                    opacity: 1,
                }
        }
    })(),
    exit: (route) => {
        switch (route) {
            case '/':
                return {
                    y: '100%',
                    transition: {
                        duration: .2,
                        ease: 'easeIn',
                    }
                };
            default: 
                return {
                    opacity: 0,
                    transition: {
                        duration: .1,
                    }
                }
        }
    }
});