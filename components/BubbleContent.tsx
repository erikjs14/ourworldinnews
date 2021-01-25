interface BubbleContentProps {
    countryName: string;
    title: string;
}
export default function BubbleContent({ countryName, title }: BubbleContentProps) {
    return (
        <>
            <span style={{display: 'block'}}>{countryName}</span>
            <p>{title}</p>
        </>
    );
}