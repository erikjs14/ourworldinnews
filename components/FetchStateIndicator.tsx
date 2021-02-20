import { message } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState } from 'react';
import countries from 'i18n-iso-countries';

interface Props {
    loading: boolean;
    error: boolean;
    success: boolean;
}

let hideFct = null;
export default function FetchStateIndicator({ loading, error, success }: Props): JSX.Element {

    useEffect(() => {
        if (loading) {
            message.config({
                top: 72,
            });
            hideFct = message.loading(
                <RotatingSentences />, 
                0
            );
        } else if (success && hideFct) {
            hideFct();
            hideFct = null;
        } else if (error) {
            if (hideFct) hideFct();
            message.error('Something went wrong.');
        }
    }, [loading, error, success]);

    return null;
}

function RotatingSentences() {

    const [curIdx, setCurIdx] = useState(0);

    useEffect(() => {
        const intvl = setInterval(() => setCurIdx(prev => (prev + 1) % sentences.length), 2000);
        return () => clearInterval(intvl);
    }, []);

    const sentences = useMemo(() => [
        'Reading Newspapers',
        'Waiting for Colombia',
        'Slapping Photons',
        'Waiting for the Philippines',
        'Gathering the News',
    ], []);

    return (
        <AnimatePresence exitBeforeEnter>
            <motion.div 
                key={sentences[curIdx]} 
                style={{
                    display: 'inline-block',
                    minWidth: '25rem',
                    padding: '0 1rem',
                    textAlign: 'center',
                }}
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2  }}
            >
                {sentences[curIdx]}
            </motion.div>
        </AnimatePresence>
    );
}