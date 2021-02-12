import { Variant, Variants } from "framer-motion"

const variants = (oldRoute: string | null): Variants => ({
    hidden: (function(): Variant {
        switch (oldRoute) {
            default:
                return {
                    y: 0,
                    opacity: 0,
                }
        }
    })(),
    visible: (function(): Variant {
        switch (oldRoute) {
            default:
                return {
                    y: 0,
                    opacity: 1,
                    animationDuration: '1s',
                    animationTimingFunction: 'ease-out',
                }
        }
    })(),
    exit: (route) => {
        switch (route) {
            case '/about':
                return {
                    y: 0,
                    opacity: 0,
                };
        }
    }
});

export default variants;