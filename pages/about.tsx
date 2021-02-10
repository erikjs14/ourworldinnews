import getMainLayout from "../layout/getMainLayout";
import { Layout, Typography, Collapse } from 'antd';
const { Title } = Typography;
const { Panel } = Collapse;
import Head from 'next/head';
import faq from '../config/faqConfig';
import styles from '../styles/About.module.scss';

interface AboutProps {

}

export default function About({ }) {

    return (
        <>
            <Head>
                <title>OWINN - About</title>
            </Head>

            <Layout.Content
                className={styles.container}
            >
                <Title level={1}>About</Title>

                <Collapse 
                    defaultActiveKey={Array.from(faq.keys())}
                >
                    { faq.map( ({ question, answer }, idx) => (
                        <Panel
                            key={idx}
                            className={styles.panel}
                            header={<Title level={3}>{question}</Title>}
                        >
                            { answer }
                        </Panel>
                    ))}
                </Collapse>

            </Layout.Content>
        </>
    );
}
About.Layout = getMainLayout('about', true, true);