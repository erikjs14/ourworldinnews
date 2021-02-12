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
                        duration: .5,
                        delay: 1,
                        staggerChildren: .5,
                        delayChildren: .5,
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
                        duration: .2,
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