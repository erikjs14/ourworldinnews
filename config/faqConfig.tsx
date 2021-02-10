import { Typography } from 'antd';
const { Paragraph } = Typography;

export default [
    {
        question: "What is this?",
        answer: <Paragraph>This website tries to visualize what's going on around the world. You can hover or click the countries on the map to see a preview of one top article from or about this country. Then click again to get to see the article full screen.</Paragraph>,
    },
    {
        question: "Why does it exist?",
        answer: <Paragraph>We are all living in a bubble. Be it our friends and family circle, twitter or our country's society as a whole. Some time ago I was wondering what other countries in the world are worrying about right now. What is their public debate? Do they have the same problems or totally different ones? From this the idea emerged to fetch and visualize news articles from different countries.</Paragraph>,
    },
    {
        question: "How often are news updated?",
        answer: <Paragraph>Currently, once a day.</Paragraph>,
    },
    {
        question: "What are the sources?",
        answer: <Paragraph>The news are fetched once a day by querying the API from <a href="https://thenewsapi.com" target='_blank'>thenewsapi.com</a>. Top stories are selected by them and exposed via the API. They offer differing amounts of news sites where data is fetched from for all 55 countries they offer.</Paragraph>,
    },
    {
        question: "How are the countries selected that are included?",
        answer: <Paragraph>News are fetched from the API of <a href="https://thenewsapi.com" target='_blank'>thenewsapi.com</a>. It currently includes 55 countries.</Paragraph>,
    },
    {
        question: "How is the text translated?",
        answer: <Paragraph>Google Translate was selected as it excells in translation and request speed, translation accuracy, as well as the amount of languages offered.</Paragraph>,
    },
    {
        question: "Why are some news not directly related to the country they are associated with?",
        answer: <Paragraph>The selection of the one top story currently solely relies on the top result provided by <a href="https://thenewsapi.com" target='_blank'>thenewsapi.com</a>. This may later be enhanced using semantic interpretation.</Paragraph>,
    },
    {
        question: "Why is not the entire article text shown and translated?",
        answer: <Paragraph>Unfortunately, folks over at <a href="https://thenewsapi.com" target='_blank'>thenewsapi.com</a> only include a snippet of the first 60 characters for each article.</Paragraph>,
    },
    {
        question: "How does this work?",
        answer: <Paragraph>The website is built with <a href="https://nextjs.org" target='_blank'>Next.js</a> and <a href="https://ant.design" target='_blank'>ant.design</a> elements. Icons from <a href="https://iconmonstr.com" target='_blank'>Iconmonstr</a>. Check out the <a href="https://github.com/erikjs14/ourworldinnews" target='_blank'>Github repo</a>.</Paragraph>,
    },
]