import React, { useState } from 'react';
import Link from 'next/link';
import { Layout, Row, Col, Typography, Space } from 'antd';
import styles from '../styles/Layout.module.scss';
const { Title, Text } = Typography;

export default function MainLayout(
    currentPage: 'home' | 'about' | 'irrelevant',
    showFooter: boolean,
    contentInContainer: boolean,
): React.ReactNode {

    const Header = ({ menuOpen, setMenuOpen }) => (
        <Layout.Header
            className={styles.header}
        >
            <Row>
                <Col flex='none'>
                    <Link href='/' >
                        <h1><a onClick={e => (currentPage === 'home') && e.preventDefault()}>Our World In News</a></h1>
                    </Link>
                </Col>
                <Col flex='auto' className={styles.desktop}>
                    <nav>
                        <Link href='/'>
                            <a onClick={e => (currentPage === 'home') && e.preventDefault()}>Home</a>
                        </Link>
                        <Link href='/about'>
                            <a onClick={e => (currentPage === 'about') && e.preventDefault()}>About</a>
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
                                className={currentPage === 'about' ? styles.disabled : ''}
                                onClick={(e) => {
                                    if (currentPage === 'about') {
                                        e.preventDefault();
                                        setMenuOpen(prev => !prev);
                                    }
                                }}
                            >
                                About
                            </a>
                        </Link>
                        <Link href='/'>
                            <a 
                                className={currentPage === 'home' ? styles.disabled : ''}
                                onClick={(e) => {
                                    if (currentPage === 'home') {
                                        e.preventDefault();
                                        setMenuOpen(prev => !prev);
                                    }
                                }}
                            >
                                Home
                            </a>
                        </Link>
                    </nav>
                </Col>
            </Row>
        </Layout.Header>
    );

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

    return ({children}) => {

        const [menuOpen, setMenuOpen] = useState(false);

        return (
            <Layout>
                <Header 
                    menuOpen={menuOpen}
                    setMenuOpen={setMenuOpen}
                />
                <Layout 
                    hasSider={currentPage === 'home'} 
                    className={contentInContainer ? `${styles.maxContainer} ${styles.contentPadding}` : ''}
                    style={{ minHeight: 'calc(100vh - 64px - 132px)', marginTop: '64px' }}
                >
                        { children }
                </Layout>
                <Footer />
            </Layout>
        );
    }
}