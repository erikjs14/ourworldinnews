import { motion } from "framer-motion";
import getMainLayout from "../layout/getMainLayout";

export default function Owin404() {
    return (
        <motion.h1 
            initial={{
                y: -5,
                opacity: 0,
            }}
            animate={{
                y: 0,
                opacity: 1,
            }}
            style={{ fontSize: '4rem' }}
        >
            404 - Page Not Found
        </motion.h1>
    );
}
Owin404.Layout = getMainLayout('irrelevant', true, true);