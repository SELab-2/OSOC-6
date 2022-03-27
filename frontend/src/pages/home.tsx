import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Open Summer of Code : Logged in</title>
            </Head>
            <main className="m-4">
                <h1>User is logged in</h1>
            </main>
        </div>
    );
};

export default Home;
