import { TranslatableArticle } from './../types.d';
import styles from '../styles/Article.module.scss';
import moment from 'moment';
import { motion, Variants } from 'framer-motion';

interface ArticleProps {
    data: TranslatableArticle;
    lang: string;
    countryName: string;
    variants: Variants;
    childrenVariants: Variants;
}

export default function Article({ data, lang, countryName, variants, childrenVariants }: ArticleProps) {

    return (
        <motion.article 
            initial='hidden' animate='visible' exit='exit' variants={variants}
            className={styles.wrapper}
        >
            <motion.div className={styles.header} variants={childrenVariants}>
                <img src={data.imgLink} alt='Article Image' />
                <h2>{data.titleTranslated[lang] || data.title}</h2>
            </motion.div>
            <motion.div className={styles.meta} variants={childrenVariants}>
                <div className={styles.country}>{countryName}</div>
                <div className={styles.time}>{moment(data.published).format('lll')}</div>
            </motion.div>
            <motion.div className={styles.teaser} variants={childrenVariants}>
                {data.teaserTranslated[lang] || data.teaser}
                <p><a href={data.originalSourceLink} target='_blank'>Read the full article..</a></p>
            </motion.div>
            <motion.p className={styles.source} variants={childrenVariants}>
                Originally published on {data.sourceDomain}
            </motion.p>
        </motion.article>
    );
}