import '../styles/globals.scss';
import React from 'react';

function OurWorlInNews({ Component, pageProps }) {

    const Layout = Component.Layout ? Component.Layout : React.Fragment;

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default OurWorlInNews
