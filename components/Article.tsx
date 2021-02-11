import { TranslatableArticle } from './../types.d';
import styles from '../styles/Article.module.scss';
import moment from 'moment';

interface ArticleProps {
    data: TranslatableArticle;
    lang: string;
    countryName: string;
}

export default function Article({ data, lang, countryName }: ArticleProps) {

    return (
        <article className={styles.wrapper}>
            <div className={styles.header}>
                <img src={data.imgLink} alt='Article Image' />
                <h2>{data.titleTranslated[lang] || data.title}</h2>
            </div>
            <div className={styles.meta}>
                <div className={styles.country}>{countryName}</div>
                <div className={styles.time}>{moment(data.published).format('lll')}</div>
            </div>
            <div className={styles.teaser}>
                {data.teaserTranslated[lang] || data.teaser}
                <p><a href={data.originalSourceLink} target='_blank'>Read the full article..</a></p>
            </div>
            <p className={styles.source}>
                Originally published on {data.sourceDomain}
            </p>
        </article>
    );
}