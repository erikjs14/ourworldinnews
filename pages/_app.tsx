import '../styles/antd-custom.less';
import '../styles/globals.scss';
import React from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { RouteContextProvider } from '../lib/RouteContext';

function OurWorlInNews({ Component, pageProps, router }) {

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
