import React, {useState, useEffect} from "react";
import * as ReactDOM from "react-dom";
import {inspect} from "util";
import styles from "../styles/suggestionModal.module.css"

export function CustomDialogContent() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <button onClick={() => setShowModal(true)} className="btn">
                Modal
            </button>
            <Modal show={showModal} onClose={() => setShowModal(false)}>Text in modal lorem.</Modal>
        </div>
    );
}

export function Modal({show, onClose, children}: any) {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true)
    }, []);

    const handleClose = (e: any) => {
        e.preventDefault();
        onClose();
    }

    const modalContent = show ? (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <a href="#" onClick={handleClose}>
                        <button className="btn">Close</button>
                    </a>
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>
    ) : (<div></div>);

    if (isBrowser) {
        const root = document.getElementById("modal-root")
        if (root != null) {
            return ReactDOM.createPortal(
                modalContent,
                root
            );
        }
    }
    return null;
}