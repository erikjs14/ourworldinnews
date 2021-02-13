import { useEffect, useState } from "react";
import styles from '../styles/DarkModeToggle.module.scss';

type Theme = 'light'|'dark';
interface DarkModeToggleProps {
    className?: string;
}
export default function DarkModeToggle({ className }: DarkModeToggleProps) {

    const [mode, setModeRaw] = useState<Theme>(undefined);

    useEffect(() => {
        const root = document.documentElement;
        const mode = root.getAttribute('data-theme') as Theme;
        setModeRaw(mode);
    }, []);

    const toggle = () => {
        setModeRaw(prev => {
            const newMode = prev === 'light' ? 'dark' : 'light';
            const root = document.documentElement;
            root.setAttribute('data-theme', newMode);
            localStorage.setItem('color-mode', newMode);
            return newMode;
        });
    }

    return (
        <div 
            onClick={toggle}
            className={className + ' ' + styles.wrapper + ' ' + styles[mode]}
        >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );

}