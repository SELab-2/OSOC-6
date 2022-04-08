import type { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
    const { t } = useTranslation('translations');
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
