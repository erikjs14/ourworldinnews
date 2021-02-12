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
                        duration: .3,
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
                        duration: .3,
                        ease: 'easeIn',
                    }
                };
        }
    }
});