import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {

    render() {
        return (
            <Html>
                <Head />
                <body>
                    {/* Load dark mode before render */}
                    <script dangerouslySetInnerHTML={{__html: `
                        
                        (function() {
                            function getInitialColorMode() {
                                const persistedColorPreference = window.localStorage.getItem('color-mode');
                                const hasPersistedPreference = typeof persistedColorPreference === 'string';
                                if (hasPersistedPreference) {
                                    return persistedColorPreference;
                                }
                                const mql = window.matchMedia('(prefers-color-scheme: dark)');
                                const hasMediaQueryPreference = typeof mql.matches === 'boolean';
                                if (hasMediaQueryPreference) {
                                    return mql.matches ? 'dark' : 'light';
                                }
                                return 'light';
                            }

                            const colorMode = getInitialColorMode();
                            const root = document.documentElement;
                            root.setAttribute('data-theme', colorMode);

                        })()

                    `}} />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
