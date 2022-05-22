import { Modal, ModalBody, ModalHeader, ModalTitle } from "react-bootstrap";
import { capitalize } from "../../utility/stringUtil";
import { Field, Form, Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { Dispatch, useState } from "react";
import { addAssignment, getValidAssignmentsUrlForProjectSkill } from "../../api/calls/AssignmentCalls";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import SkillBadge from "../util/skillBadge";
import { useSWRConfig } from "swr";
import useValidAssignmentsFromProjectSkillList from "../../hooks/useValidAssignmentsFromProjectSkillList";
import apiPaths from "../../properties/apiPaths";

export type ModalSkillInfo = { skillName: string; skillUrl: string };
export type ModalInfo = {
    studentName: string;
    studentUrl: string;
    projectName: string;
} & ModalSkillInfo;
type ModalProps = ModalInfo & { showModal: boolean; setter: Dispatch<boolean> };

function AssignmentModal({
    showModal: propsShow,
    setter,
    studentUrl,
    studentName,
    skillUrl,
    projectName,
    skillName,
}: ModalProps) {
    const { t } = useTranslation("common");
    const [showModal, setShowModal] = useState<boolean>();
    const { user } = useCurrentUser(true);
    const { mutate: globalMutate } = useSWRConfig();

    if (showModal !== propsShow) {
        setShowModal(propsShow);
    }

    const { data: assignments, mutate } = useValidAssignmentsFromProjectSkillList(skillUrl);

    async function dropStudent(values: { studentUrl: string; skillUrl: string; reason: string }) {
        const newAssignment = await addAssignment(values.studentUrl, values.skillUrl, values.reason, user!);
        // We don't know how to change the value here since it depents on the skillUrl and we don
        if (newAssignment && assignments) {
            await Promise.all([
                mutate([...assignments, newAssignment]),
                globalMutate(apiPaths.studentConflict),
            ]);
        }
        handleClose();
    }

    const handleClose = () => {
        setShowModal(false);
        setter(false);
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <ModalHeader>
                <ModalTitle>{capitalize(t("assignment modal title"))}</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <p>
                    {capitalize(t("suggesting"))}
                    {studentName} {capitalize(t("to project"))}
                    <i>{projectName}</i> {capitalize(t("for role"))}
                    <SkillBadge skill={skillName} />
                </p>
                <div>{capitalize(t("assignment reason"))}</div>
                <Formik
                    initialValues={{
                        studentUrl: studentUrl,
                        skillUrl: skillUrl,
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
