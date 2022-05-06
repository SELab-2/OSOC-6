import React, { useState } from "react";
import axios from "axios";
import { AxiosConf } from "../api/calls/baseCalls";
import { Button, Modal } from "react-bootstrap";
import { Status } from "../api/entities/StudentEntity";

export function StudentStatusModal(props: { status: Status; studentUrl: string }) {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    async function changeStatus() {
        await axios.patch(props.studentUrl, { status: props.status }, AxiosConf);
        handleClose();
    }

    return (
        <>
            <Button
                variant="btn-outline"
                onClick={handleShow}
                style={{ color: "#0a0839", borderColor: "#0a0839", width: 110 }}
                data-testid="confirm-button"
            >
                Confirm
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Change status</Modal.Title>
                </Modal.Header>
                <Modal.Body>Would you like to change the status to {props.status}?</Modal.Body>
                <Modal.Footer>
                    <Button onClick={changeStatus} data-testid="confirm-button-modal">Confirm</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
