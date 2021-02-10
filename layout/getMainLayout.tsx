import React from 'react';
import Link from 'next/link';
import { Layout, Row, Col } from 'antd';
import styles from '../styles/Layout.module.scss';

export default function MainLayout(
    currentPage: 'home' | 'about',
    showFooter: boolean,
    contentInContainer: boolean,
): React.ReactNode {

    const Header = () => (
        <Layout.Header
            className={styles.header}
        >
            <Row>
                <Col flex='none'>
                    <h1>Our World In News</h1>
                </Col>
                <Col flex='auto'>
                    <nav>
                        <Link href='/'>
                            <a>Home</a>
                        </Link>
                        <Link href='/about'>
                            <a>About</a>
                        </Link>
                    </nav>
                </Col>
            </Row>
        </Layout.Header>
    );

    const Footer = showFooter ? () => (
        <Layout.Footer>
            FOOTER
        </Layout.Footer>
    ) : () => null;

    return ({children}) => (
        <Layout>
            <Header />
            <Layout hasSider={currentPage === 'home'} className={contentInContainer ? styles.maxContainer : ''}>
                    { children }
            </Layout>
            <Footer />
        </Layout>
    );
}