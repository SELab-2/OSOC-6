import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Suggestion, SuggestionStrategy } from "../../api/entities/SuggestionEntity";
import { Field, Form, Formik } from "formik";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { createNewSuggestion, getAllSuggestionsFromLinks } from "../../api/calls/suggestionCalls";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { IStudent } from "../../api/entities/StudentEntity";
import { useSwrForEntityList } from "../../hooks/utilHooks";

/**
 * Modal asking the reason for a certain suggestion
 * @param props properties needed to render this component
 */
export function SuggestionModal(props: {
    suggestion: SuggestionStrategy;
    colour: string;
    student: IStudent;
}) {
    const { t } = useTranslation("common");
    const [showModal, setShowModal] = useState(false);
    const [hover, setHover] = useState(false);

    const { user, error: userError } = useCurrentUser(true);

    const { data: receivedSuggestions, mutate } = useSwrForEntityList(
        props.student ? props.student._links.suggestions.href : null,
        getAllSuggestionsFromLinks
    );

    if (userError || !user) {
        if (userError) {
            console.log(userError);
        }
        return null;
    }

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    async function submitSuggestionHandler(values: { reason: string }) {
        const suggestion = new Suggestion(
            props.suggestion,
            values.reason,
            // function will never be executed if user is undefined
            user!._links.self.href,
            // Assume the student info is rendered when you press a button
            props.student._links.self.href
        );

        const newSuggestion = await createNewSuggestion(suggestion);
        if (receivedSuggestions) {
            mutate([newSuggestion, ...receivedSuggestions]).catch(console.log);
        }
        handleClose();
    }

    async function hoverHandler() {
        setHover(true);
    }

    async function endHoverHandler() {
        setHover(false);
    }

    let style: {};

    if (hover) {
        style = { borderColor: props.colour, width: 150, backgroundColor: props.colour, color: "black" };
    } else {
        style = { color: props.colour, borderColor: props.colour, width: 150 };
    }

    return (
        <>
            <Button
                variant="btn-outline"
                onClick={handleShow}
                style={style}
                data-testid="suggest-button"
                onMouseEnter={hoverHandler}
                onMouseLeave={endHoverHandler}
            >
                {capitalize(t("suggest"))} {props.suggestion.toLowerCase()}
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {capitalize(t("suggest"))} {props.suggestion}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>{capitalize(t("reason suggestion"))}: </div>
                    <Formik initialValues={{ reason: "" }} onSubmit={submitSuggestionHandler}>
                        <Form>
                            <Field
                                className="form-control mb-2"
                                type="text"
                                data-testid="suggestion-reason"
                                name="reason"
                                required
                            />
                            <Button
                                type="submit"
                                style={{ float: "right" }}
                                data-testid="suggestion-confirmation"
                            >
                                {capitalize(t("confirm suggestion"))}
                            </Button>
                        </Form>
                    </Formik>
                </Modal.Body>
            </Modal>
        </>
    );
}
