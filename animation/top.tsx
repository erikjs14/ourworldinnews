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
                        staggerChildren: .1,
                    }
                }
        }
    })(),
    exit: (route) => {
        switch (route) {
            case '/about':
                return {
                    opacity: 0,
                    transition: {
                        duration: .1,
                    }
                }
            default: return undefined;
        }
    }
});

export const topChildrenVariants: Variants = {
    hidden: {
        y: -5,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
    },
    exit: {
        opacity: 0,
        transition: {
            duration: .1,
        }
    }
}