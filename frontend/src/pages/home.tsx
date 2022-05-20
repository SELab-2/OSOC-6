import type { NextPage } from 'next';
import useTranslation from 'next-translate/useTranslation';
import styles from '../styles/Home.module.css';
import { dataInjectionHandler } from '../handlers/dataInjectionHandler';
import NavBar from '../components/util/navBar';

const Home: NextPage = () => {
    const { t } = useTranslation("common");
    return (
        <div>
            <NavBar />
            <main className={styles.main}>
                <div className="capitalize">
                    <h1 className={styles.title}>{t("tool name")}</h1>
                </div>
            </main>
            <button onClick={dataInjectionHandler}>Inject!</button>
        </div>
    );
};

export default Home;
