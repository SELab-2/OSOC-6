import styles from "../../styles/background.module.css";

export function Background() {
    return (
        <div style={{ zIndex: -1 }}>
            <div className={styles.circle1} />
            <div className={styles.circle2} />
            <div className={styles.circle3} />
        </div>
    );
}
