import getMainLayout from "../layout/getMainLayout";
import { Layout, Typography, Collapse } from 'antd';
const { Title } = Typography;
const { Panel } = Collapse;
import Head from 'next/head';
import faq from '../config/faqConfig';
import styles from '../styles/About.module.scss';
import { motion } from 'framer-motion';
import { aboutVariants } from '../animation/about';
import { useContext, useEffect } from "react";
import RouteContext from "../lib/RouteContext";

interface AboutProps {

}

export default function About({ }) {

    const oldRoute = useContext(RouteContext);

    return (
        <>
            <Head>
                <title>OWIN - About</title>
            </Head>

            <Layout.Content
                className={styles.container}
            >
                <motion.div initial='hidden' animate='visible' exit='exit' variants={aboutVariants(oldRoute)}>
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
                </motion.div>
            </Layout.Content>
        </>
    );
}
About.Layout = getMainLayout('about', true, true);