import { Badge, Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { capitalize } from "../../utility/stringUtil";
import { Field, Form, Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { Dispatch, useState } from "react";
import { addAssignment } from "../../api/calls/AssignmentCalls";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SkillBadge from "../skillBadge";

export type ModalSkillInfo = { skillName: string; skillUrl: string };
export type ModalInfo = {
    studentName: string;
    studentUrl: string;
    projectName: string;
} & ModalSkillInfo;
type ModalProps = ModalInfo & { showModal: boolean; setter: Dispatch<boolean> };

function AssignmentModal(props: ModalProps) {
    const { t } = useTranslation("common");
    const [showModal, setShowModal] = useState<boolean>();
    const { user } = useCurrentUser(true);

    if (showModal != props.showModal) {
        setShowModal(props.showModal);
    }

    async function dropStudent(values: { studentUrl: string; skillUrl: string; reason: string }) {
        await addAssignment(values.studentUrl, values.skillUrl, values.reason, user!);
        handleClose();
    }

    const handleClose = () => {
        setShowModal(false);
        props.setter(false);
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <ModalHeader>
                <ModalTitle>{capitalize(t("assignment modal title"))}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <p>
                    {capitalize(t("suggesting"))}
                    {props.studentName} {capitalize(t("to project"))}
                    <i>{props.projectName}</i> {capitalize(t("for role"))}
                    <SkillBadge skill={props.skillName} />.
                </p>
                <div>{capitalize(t("assignment reason"))}</div>
                <Formik
                    initialValues={{
                        studentUrl: props.studentUrl,
                        skillUrl: props.skillUrl,
                        reason: "",
                    }}
                    onSubmit={dropStudent}
                >
                    <Form>
                        <Field
                            className="form-control mb-2"
                            type="text"
                            data-testid="suggestion-reason"
                            name="reason"
                            required
                        />
                        <button className="btn btn-primary" type="submit" style={{ float: "right" }}>
                            {capitalize(t("confirm assignment"))}
                        </button>
                    </Form>
                </Formik>
            </ModalBody>
        </Modal>
    );
}

export default AssignmentModal;
