import { Variant, Variants } from "framer-motion";

export const siderVariants = (oldRoute: string | null): Variants => ({
    hidden: (function(): Variant {
        switch (oldRoute) {
            case '/about':
                return {

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
                    
                }
            default:
                return {
                    y: 0,
                    opacity: 1,
                    transition: {
                        duration: .3,
                        delay: .5,
                        staggerChildren: .3,
                        delayChildren: .3,
                    }
                }
        }
    })(),
    exit: (route) => {
        switch (route) {
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

export const siderChildrenVariants: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    }
}