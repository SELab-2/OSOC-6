import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Suggestion, SuggestionStrategy } from "../api/entities/SuggestionEntity";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import apiPaths from "../properties/apiPaths";
import { AxiosConf } from "../api/calls/baseCalls";
import { IUser } from "../api/entities/UserEntity";
import { getOwnUser } from "../api/calls/userCalls";

export function SuggestionModal(props: { suggestion: SuggestionStrategy; style: any; studentUrl: string }) {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    async function submitSuggestionHandler(values: { reason: string }) {
        // Get the logged in user
        const user: IUser = await getOwnUser();
        const suggestion = new Suggestion(
            props.suggestion,
            values.reason,
            user._links.self.href,
            props.studentUrl
        );

        await axios.post(apiPaths.suggestions, suggestion, AxiosConf);
        handleClose();
    }

    return (
        <>
            <Button
                variant="btn-outline"
                onClick={handleShow}
                style={props.style}
                data-testid="suggest-button"
            >
                Suggest {props.suggestion.toLowerCase()}
            </Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Suggest {props.suggestion}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>Reason for the suggestion: </div>
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
                                Confirm suggestion
                            </Button>
                        </Form>
                    </Formik>
                </Modal.Body>
            </Modal>
        </>
    );
}
