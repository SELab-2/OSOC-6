import React, { useState } from "react";
import axios from "axios";
import { AxiosConf } from "../api/calls/baseCalls";
import { Button, Modal } from "react-bootstrap";
import { Status } from "../api/entities/StudentEntity";
import useTranslation from "next-translate/useTranslation";
import {capitalize} from "../utility/stringUtil";

export function StudentStatusModal(props: { status: Status; studentUrl: string }) {
    const { t } = useTranslation("common");
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
                {capitalize(t("confirm"))}
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{capitalize(t("change status title"))}</Modal.Title>
                </Modal.Header>
                <Modal.Body data-testid="change-status">{capitalize(t("change status"))} {props.status}?</Modal.Body>
                <Modal.Footer>
                    <Button onClick={changeStatus} data-testid="confirm-button-modal">
                        {capitalize(t("confirm"))}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
