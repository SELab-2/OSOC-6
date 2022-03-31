import type { NextPage } from 'next';
import Head from 'next/head';
import LoginForm from '../components/loginForm';
import { Card } from 'react-bootstrap';

const LoginError: NextPage = () => {
    return (
        <div>
            <Head>
                <title>OSOC : Login page</title>
            </Head>
            <h1 className="display-6 mb-3">Open Summer of Code</h1>
            <main className="m-4">
                <Card>
                    <Card.Body>
                        <Card.Text>Invalid username and/or password.</Card.Text>
                    </Card.Body>
                </Card>
                <LoginForm />
            </main>
        </div>
    );
};

export default LoginError;
