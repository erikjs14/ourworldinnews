import React from 'react';
import Link from 'next/link';
import { Layout, Row, Col, Typography, Space } from 'antd';
import styles from '../styles/Layout.module.scss';
const { Title, Text } = Typography;

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
                    <Link href='/'>
                        <h1><a>Our World In News</a></h1>
                    </Link>
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
            <div className={`${styles.footer} ${styles.maxContainer}`} >
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

    return ({children}) => (
        <Layout>
            <Header />
            <Layout 
                hasSider={currentPage === 'home'} 
                className={contentInContainer ? `${styles.maxContainer} ${styles.contentPadding}` : ''}
            >
                    { children }
            </Layout>
            <Footer />
        </Layout>
    );
}