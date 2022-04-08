import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import '../i18n/config';
import { useTranslation } from 'react-i18next';

const Home: NextPage = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.container}>
            <Head>
                <title>{t('Home page title')}</title>
            </Head>
            <main className={styles.main}>
                <h1 className={styles.title}>{t('Tool name')}</h1>
            </main>
        </div>
    );
};

export default Home;