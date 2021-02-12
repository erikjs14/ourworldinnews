import '../styles/antd-custom.less';
import '../styles/globals.scss';
import React, { ComponentType, useEffect } from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { RouteContextProvider } from '../lib/RouteContext';
import globalState from '../lib/GlobalState';
import { AppProps } from 'next/dist/next-server/lib/router/router';
const { useGlobalState } = globalState;

interface CustomAppProps extends AppProps {
    Component: any; // ToDo
}
function OurWorlInNews({ Component, pageProps, router }: CustomAppProps) {

    const setClientRouted = useGlobalState('clientRouted')[1];
    useEffect(() => {
        const handler = () => setClientRouted(true);
        router.events.on('routeChangeComplete', handler);
        () => router.events.off('routeChangeComplete', handler);
    }, []);

    const Layout = Component.Layout ? Component.Layout : React.Fragment;

    return (
        <>
            <Head>
                <link rel="preload" href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap" as="style" /> 
                <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400&display=swap" rel="stylesheet" /> 
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>
            <RouteContextProvider>
                <AnimatePresence exitBeforeEnter custom={router.route} >
                    <Layout key={router.route}>
                        <Component {...pageProps} />
                    </Layout>
                </AnimatePresence>
            </RouteContextProvider>            
        </>
    );
}

export default OurWorlInNews
