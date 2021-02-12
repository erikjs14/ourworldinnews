import { Variant, Variants } from "framer-motion";

export const mapVariants = (oldRoute: string | null): Variants => ({
    hidden: (function(): Variant {
        switch (oldRoute) {
            case '/about':
                return {
                    y: '-100%',
                }
            default:
                return {

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

export const siderVariants = (oldRoute: string | null): Variants => ({
    hidden: (function(): Variant {
        switch (oldRoute) {
            default:
                return {

                }
        }
    })(),
    visible: (function(): Variant {
        switch (oldRoute) {
            default:
                return {

                }
        }
    })(),
    exit: (route) => {
        switch (route) {
            case '/about':
                return {
                    x: '-100%',
                    opacity: 0,
                };
        }
    }
});