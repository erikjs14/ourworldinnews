import { Variant, Variants } from "framer-motion";

export const mapVariants = (oldRoute: string | null): Variants => ({
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
                    y: '-100%',
                    transition: {
                        duration: .5,
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