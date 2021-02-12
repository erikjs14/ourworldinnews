import { Layout } from "antd";
import { ReactNode, useEffect, useState } from "react";
import Link from 'next/link';
import LangPicker from './LangPicker';
import styles from '../styles/Sider.module.scss';
import { TRANSLATE_TO } from "../config/consts";
import { siderVariants, siderChildrenVariants } from './../animation/sider';
import { motion } from "framer-motion";
import { useRouter } from 'next/router';
import { isMobile } from "../utils/util";

interface SiderProps {
    collapsed: boolean;
    setCollapsed(val: boolean): void;
    slideInIfBig?: boolean;
    newsLang: string;
    setNewsLang(lang: string): void;
    children?: (siderCollapsed: boolean) => ReactNode;
    oldRoute: string;
}
export default function Sider({ oldRoute, collapsed, setCollapsed, slideInIfBig, newsLang, setNewsLang, children }: SiderProps) {

    const router = useRouter();

    const [siderWidth, setSiderWidth] = useState(300);

    // if big screen, show after timeout (if enabled)
    useEffect(() => {
        if (collapsed && slideInIfBig)
            setTimeout(() => setCollapsed(isMobile()), 500);
    }, []);

    useEffect(() => {
        setSiderWidth(isMobile() ? 250 : 300);
    }, []);

    return (
        <Layout.Sider 
            width={siderWidth}
            className={styles.sider}
            collapsedWidth={0}
            collapsible
            collapsed={collapsed}
            onCollapse={(collapsed) => setCollapsed(collapsed)}
            zeroWidthTriggerStyle={{
                backgroundColor: 'var(--color-primary)',
            }}
        >
            <motion.div
                initial='hidden' animate='visible' exit='exit' variants={siderVariants(oldRoute)}
                className={styles.wrapper}
            >

                {/* Mobile Menu */}
                <motion.div variants={siderChildrenVariants}>
                    <nav>
                        <Link href='/'>
                            <a onClick={(e) => {
                                setCollapsed(true);
                                if (router.route === '/') e.preventDefault();
                            }}>Home</a>
                        </Link>
                        <Link href='/about'>
                            <a onClick={(e) => {
                                setCollapsed(true);
                                if (router.route === '/about') e.preventDefault();
                            }}>About</a>
                        </Link>
                    </nav>
                </motion.div>

                <motion.div variants={siderChildrenVariants}>
                    {children(collapsed)}
                </motion.div>

                <motion.div variants={siderChildrenVariants} layoutId='iddd'>
                    <LangPicker
                        className={styles.langCard + (collapsed ? ' '+styles.hidden : '')}
                        langs={TRANSLATE_TO.map(iso => ({
                            value: iso,
                            label: iso.toUpperCase(),
                        }))}
                        value={newsLang}
                        onChange={setNewsLang}
                    />
                </motion.div>
            </motion.div>
        </Layout.Sider>
    );
}