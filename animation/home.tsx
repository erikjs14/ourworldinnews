import { Variant, Variants } from "framer-motion";

export const homeVariants = (oldRoute: string | null): Variants => ({
    hidden: (function(): Variant {
        switch (oldRoute) {
            case '/about':
                return {
                    y: '-100%',
                }
            default:
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
        }
    }
});