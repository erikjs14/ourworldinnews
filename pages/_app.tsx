import '../styles/globals.scss';
import React from 'react';
import Head from 'next/head';

function OurWorlInNews({ Component, pageProps }) {

    const Layout = Component.Layout ? Component.Layout : React.Fragment;

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Head>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </>
    );
}

export default OurWorlInNews
