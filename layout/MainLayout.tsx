import React, { PropsWithChildren, useMemo, useState } from 'react';
import Link from 'next/link';
import { Layout, Row, Col, Typography, Space } from 'antd';
import styles from '../styles/Layout.module.scss';
import { AnimatePresence } from 'framer-motion';
import { Router } from 'next/router';
const { Title, Text } = Typography;

interface MainLayoutProps {
    currentRoute: string;
    showFooter: boolean;
    contentInContainer: boolean;
    router: Router;
}
export default React.memo<PropsWithChildren<MainLayoutProps>>(function MainLayout({ currentRoute, showFooter, contentInContainer, router, children}: PropsWithChildren<MainLayoutProps>) {

    const [menuOpen, setMenuOpen] = useState(false);

    const Header = useMemo(() => (
        <Layout.Header
            className={styles.header}
        >
            <Row>
                <Col flex='none'>
                    <Link href='/' >
                        <h1><a onClick={e => (currentRoute === '/') && e.preventDefault()}>Our World In News</a></h1>
                    </Link>
                </Col>
                <Col flex='auto' className={styles.desktop}>
                    <nav>
                        <Link href='/'>
                            <a onClick={e => (currentRoute === '/') && e.preventDefault()}>Home</a>
                        </Link>
                        <Link href='/about'>
                            <a onClick={e => (currentRoute === '/about') && e.preventDefault()}>About</a>
                        </Link>
                    </nav>
                </Col>
                <Col flex='auto' className={styles.mobile + ' ' + styles.menu + ' ' + (menuOpen ? styles.open : '')}>
                    <div 
                        onClick={() => setMenuOpen(prev => !prev)}
                        className={styles.menuIcon}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <nav>
                        <Link href='/about'>
                            <a 
                                className={currentRoute === '/about' ? styles.disabled : ''}
                                onClick={(e) => {
                                    if (currentRoute === 'about') {
                                        e.preventDefault();
                                    }
                                    setMenuOpen(prev => !prev);
                                }}
                            >
                                About
                            </a>
                        </Link>
                        <Link href='/'>
                            <a 
                                className={currentRoute === '/' ? styles.disabled : ''}
                                onClick={(e) => {
                                    if (currentRoute === '/') {
                                        e.preventDefault();
                                    }
                                    setMenuOpen(prev => !prev);
                                }}
                            >
                                Home
                            </a>
                        </Link>
                    </nav>
                </Col>
            </Row>
        </Layout.Header>
    ), [currentRoute, menuOpen, setMenuOpen]);

    const Footer = showFooter ? () => (
        <Layout.Footer className={`${styles.footer}`}>
            <div className={`${styles.maxContainer}`} >
                <Row align='middle'>
                    <Col span={12}>      
                        <Title level={4}>Our World <br/>In News</Title>
                    </Col>
                    <Col span={6} offset={3}>
                        <Space direction='vertical' size='small'>
                            <Text><Link href='/'><a>Home</a></Link></Text>
                            <Text><Link href='/about'><a>About</a></Link></Text>
                            <Text><a href='https://github.com/erikjs14/ourworldinnews' target='_blank'>Github</a></Text>
                        </Space>
                    </Col>
                </Row>
            </div>
        </Layout.Footer>
    ) : () => null;

    return (
        <Layout>
            { Header }
            <AnimatePresence exitBeforeEnter custom={router.route} >
                <Layout 
                    key={router.route}
                    hasSider={currentRoute === '/' || /\/top\/[a-z]{2}$/.test(currentRoute)} 
                    className={contentInContainer ? `${styles.maxContainer} ${styles.contentPadding}` : ''}
                    style={{ minHeight: 'calc(100vh - 64px - 132px)', marginTop: '64px' }}
                >
                        { children }
                </Layout>
                <Footer />
            </AnimatePresence>
        </Layout>
    );
});