import { Variant, Variants } from "framer-motion"

export const topVariants = (oldRoute: string | null): Variants => ({
    hidden: (function(): Variant {
        switch (oldRoute) {
            default:
                return {
                    opacity: 0,
                }
        }
    })(),
    visible: (function(): Variant {
        switch (oldRoute) {
            default:
                return {
                    opacity: 1,
                    transition: {
                        staggerChildren: .2,
                    }
                }
        }
    })(),
    exit: (route) => {
        switch (route) {
            default: 
            return {

            }
        }
    }
});

export const topChildrenVariants = {
    hidden: {
        y: -5,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
    }
}