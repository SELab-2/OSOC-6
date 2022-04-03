import type { NextPage } from 'next';
import Head from 'next/head';
import LoginForm, { submitHandler } from '../components/loginForm';

const Login: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Open Summer of Code : Login page</title>
            </Head>
            <main className="m-4">
                <h1 className="display-6 mb-3">Open Summer of Code</h1>
                <LoginForm submitHandler={submitHandler} />
            </main>
        </div>
    );
};

export default Login;
