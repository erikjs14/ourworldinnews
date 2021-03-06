import { Typography } from 'antd';
const { Paragraph } = Typography;

export default [
    {
        question: "What is this?",
        answer: <Paragraph>This website tries to visualize what's going on around the world. <br /> You can hover or click the countries on the map to see a preview of one of the country's top articles. Then click again to get to see the article full screen.</Paragraph>,
    },
    {
        question: "Why does it exist?",
        answer: <Paragraph>We are all living in a bubble. Be it our friends and family circle, twitter or our country's society as a whole.<br /> Some time ago I was wondering what other countries in the world are worrying about right now. What is their public debate? Do they have the same problems or totally different ones?<br /> From this, the idea emerged to fetch and visualize news articles from different countries.</Paragraph>,
    },
    {
        question: "How often are news updated?",
        answer: <Paragraph>Currently, once a day.</Paragraph>,
    },
    {
        question: "What are the sources?",
        answer: <Paragraph>The news are fetched once a day by querying the API from <a href="https://thenewsapi.com" target='_blank'>thenewsapi.com</a> and <a href="https://newsapi.org" target='_blank'>newsapi.org</a>.<br /> Top stories are selected by them and exposed via the API. They offer differing amounts of news sites where data is fetched from for more than 70 countries they offer together.</Paragraph>,
    },
    {
        question: "How are the countries selected that are included?",
        answer: <Paragraph>News are fetched from the APIs of <a href="https://thenewsapi.com" target='_blank'>thenewsapi.com</a> and <a href="https://newsapi.org" target='_blank'>newsapi.org</a>. Both together currently include more than 70 countries countries.</Paragraph>,
    },
    {
        question: "How is the text translated?",
        answer: <Paragraph>Microsoft Translator was selected as it excells in translation and request speed, translation accuracy, as well as the amount of languages offered.</Paragraph>,
    },
    {
        question: "Why are some news not directly related to the country they are associated with?",
        answer: <Paragraph>The selection of the one top story currently solely relies on the top result provided by <a href="https://thenewsapi.com" target='_blank'>thenewsapi.com</a> and <a href="https://newsapi.org" target='_blank'>newsapi.org</a>.<br /> This may later be enhanced using semantic interpretation.</Paragraph>,
    },
    {
        question: "Why is not the entire article text shown and translated?",
        answer: <Paragraph>Unfortunately, the APIs only include a snippet of the first few sentences for each article. That's all I got currently.</Paragraph>,
    },
    {
        question: "How does this work?",
        answer: <Paragraph>The website is built with <a href="https://nextjs.org" target='_blank'>Next.js</a> and <a href="https://ant.design" target='_blank'>ant.design</a> elements. Icons from <a href="https://iconmonstr.com" target='_blank'>Iconmonstr</a> and by <a href="https://www.flaticon.com/authors/pixel-perfect" target="_blank" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">www.flaticon.com</a>. Translations are performed by <a href="https://azure.microsoft.com/services/cognitive-services/translator/" target="_blank">Microsoft Azure Translator</a>. <a href="https://firebase.google.com/" target="_blank">Google Cloud Firebase</a> is used for caching the API responses. Check out the <a href="https://github.com/erikjs14/ourworldinnews" target='_blank'>Github repo</a>.</Paragraph>,
    },
]