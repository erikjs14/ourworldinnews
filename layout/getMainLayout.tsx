import React from 'react';
import Link from 'next/link';
import { Layout, Row, Col } from 'antd';

export default function MainLayout(
    currentPage: 'home' | 'about',
    showFooter: boolean
): React.ReactNode {

    const Header = () => (
        <Layout.Header
            style={{ boxShadow: '0 5px 3px 0 rgba(0, 0, 0, .25)', zIndex: 100000 }}
        >
            <Row>
                <Col flex='none'>
                    <h1 style={{ color: '#fff', fontSize: '32px' }}>Our World In News</h1>
                </Col>
                <Col flex='auto'>
                    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                        <Link href='/'>
                            <a style={{ color: '#fff', marginLeft: '24px' }}>Home</a>
                        </Link>
                        <Link href='/about'>
                            <a style={{ color: '#fff', marginLeft: '24px' }}>About</a>
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
            <Layout>
                {children}
            </Layout>
            <Footer />
        </Layout>
    );
}