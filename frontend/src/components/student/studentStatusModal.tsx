import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Status } from "../../api/entities/StudentEntity";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { patchStudentStatus } from "../../api/calls/studentCalls";

/**
 * Modal to confirm change of student status
 * @param props properties needed to render this component
 */
export function StudentStatusModal(props: { status: Status; studentUrl: string }) {
    const { t } = useTranslation("common");
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    async function changeStatus() {
        await patchStudentStatus(props.studentUrl, props.status);
        handleClose();
    }

    return (
        <>
            <Button variant="outline-primary" onClick={handleShow} data-testid="confirm-button">
                {capitalize(t("confirm"))}
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{capitalize(t("change status title"))}</Modal.Title>
                </Modal.Header>
                <Modal.Body data-testid="change-status">
                    {capitalize(t("change status"))} {props.status}?
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={changeStatus} data-testid="confirm-button-modal">
                        {capitalize(t("confirm"))}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
