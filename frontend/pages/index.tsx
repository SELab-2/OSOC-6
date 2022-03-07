import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>OSOC-6</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Open Summer of Code Tool</h1>
            </main>
        </div>
    )
}

export default Home
