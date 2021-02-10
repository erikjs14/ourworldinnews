import { Layout } from "antd";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import Link from 'next/link';
import LangPicker from './LangPicker';
import styles from '../styles/Sider.module.scss';
import { TRANSLATE_TO } from "../config/consts";

interface SiderProps {
    initiallyCollapsed: boolean;
    showSiderFor: number;
    newsLang: string;
    setNewsLang(lang: string): void;
    children?: (siderCollapsed: boolean) => ReactNode;
}

export default function Sider({ initiallyCollapsed, showSiderFor, newsLang, setNewsLang, children }: SiderProps) {

    const [siderCollapsed, setSiderCollapsed] = useState(initiallyCollapsed);
    const [siderWidth, setSiderWidth] = useState(300);

    // if small screen, show sider briefly, then hide (if enabled)
    useEffect(() => {
        if (showSiderFor > 0)
            setTimeout(() => setSiderCollapsed(window.matchMedia('(max-width: 768px)').matches), showSiderFor);
    }, []);

    useEffect(() => {
        setTimeout(() => setSiderWidth(window.matchMedia('(max-width: 768px)').matches ? 250 : 300), showSiderFor);
    }, []);

    return (
        <Layout.Sider 
            width={siderWidth}
            className={styles.sider}
            collapsedWidth={0}
            collapsible
            collapsed={siderCollapsed}
            onCollapse={(collapsed) => setSiderCollapsed(collapsed)}
            zeroWidthTriggerStyle={{
                backgroundColor: 'var(--color-primary)',
            }}
        >
            <div className={styles.wrapper}>

                {/* Mobile Menu */}
                <nav>
                    <a onClick={() => setSiderCollapsed(true)}>Home</a>
                    <Link href='/about'>
                        <a>About</a>
                    </Link>
                </nav>

                {children(siderCollapsed)}

                <LangPicker
                    className={styles.langCard + (siderCollapsed ? ' '+styles.hidden : '')}
                    langs={TRANSLATE_TO.map(iso => ({
                        value: iso,
                        label: iso.toUpperCase(),
                    }))}
                    value={newsLang}
                    onChange={setNewsLang}
                />
            </div>
        </Layout.Sider>
    );
}