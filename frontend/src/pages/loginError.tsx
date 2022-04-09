import type { NextPage } from 'next';
import Head from 'next/head';
import LoginForm from '../components/loginForm';
import { Card } from 'react-bootstrap';
import { loginSubmitHandler } from '../handlers/loginSubmitHandler';
import useTranslation from 'next-translate/useTranslation';

const LoginError: NextPage = () => {
    const { t } = useTranslation();
    return (
        <div>
            <Head>
                <title>{t('common:Login page title')}</title>
            </Head>
            <h1 className="display-6 mb-3">{t('common:Tool name')}</h1>
            <main className="m-4">
                <Card>
                    <Card.Body>
                        <Card.Text>
                            {t('errorMessages:invalid_credentials')}
                        </Card.Text>
                    </Card.Body>
                </Card>
                <LoginForm submitHandler={loginSubmitHandler} />
            </main>
        </div>
    );
};

export default LoginError;