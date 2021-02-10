import getMainLayout from "../layout/getMainLayout";

export default function Owin404() {
    return (
        <h1 style={{ fontSize: '4rem' }}>404 - Page Not Found</h1>
    );
}
Owin404.Layout = getMainLayout('irrelevant', true, true);