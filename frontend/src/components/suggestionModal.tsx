import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Suggestion, SuggestionStrategy } from "../api/entities/SuggestionEntity";
import { Field, Form, Formik } from "formik";
import axios, { AxiosResponse } from "axios";
import apiPaths from "../properties/apiPaths";
import { AxiosConf } from "../api/calls/baseCalls";
import { IUser } from "../api/entities/UserEntity";

export function CustomDialogContent(props: {
    suggestion: SuggestionStrategy;
    style: any;
    studentUrl: string;
}) {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    async function submitSuggestionHandler(values: { reason: string }) {
        // Get the logged in user
        const userResponse: AxiosResponse = await axios.get(apiPaths.ownUser, AxiosConf);
        const user: IUser = userResponse.data;
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
            <Button variant="btn-outline" onClick={handleShow} style={props.style}>
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
                            <button className="btn btn-primary" type="submit" style={{ float: "right" }}>
                                Confirm suggestion
                            </button>
                        </Form>
                    </Formik>
                </Modal.Body>
            </Modal>
        </>
    );
}
