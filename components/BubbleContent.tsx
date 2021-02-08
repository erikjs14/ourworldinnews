import styles from '../styles/Home.module.scss';

interface BubbleContentProps {
    countryName: string;
    title: string;
    time: moment.Moment;
    sourceDomain: string;
    imgUrl: string;
}
export default function BubbleContent({ countryName, title, time, sourceDomain, imgUrl }: BubbleContentProps) {
    return (
        <>
            <img 
                src={imgUrl}
                alt='News Article Image'
            />
            <span className={styles.time}>{time.format('LT')}</span>
            <span className={styles.countryName}>{countryName}</span>
            <p className={styles.title}>{title}</p>
            <span className={styles.sourceDomain}>{sourceDomain}</span>
        </>
    );
}