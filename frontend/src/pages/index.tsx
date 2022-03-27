import type { NextPage } from 'next';
import Head from 'next/head';
import LoginForm from '../components/loginForm';

const Login: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Open Summer of Code : Login page</title>
            </Head>
            <main className="m-4">
                <LoginForm />
            </main>
        </div>
    );
};

export default Login;
