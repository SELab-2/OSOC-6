import { Form, FormControl, Container, Button, ToastContainer, Toast } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import styles from "../styles/resetComponent.module.css";
import { useState } from "react";
import useSWR from "swr";
import apiPaths from "../properties/apiPaths";
import applicationPaths from "../properties/applicationPaths";
import Router from "next/router";
import { capitalize } from "../utility/stringUtil";
import { StatusCodes } from "http-status-codes";
import { AxiosResponse } from "axios";
import timers from "../properties/timers";
import { getEmtpyUser, getUserInfo } from "../api/entities/UserEntity";

export const ResetComponent = (props: any) => {
    const { t } = useTranslation("common");
    let { data, error } = useSWR(apiPaths.ownUser, getUserInfo);
    const [firstEntry, setFirstEntry] = useState<string>("");
    const [secondEntry, setSecondEntry] = useState<string>("");
    const [showDanger, setShowDanger] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    data = data || getEmtpyUser();

    if (error) {
        console.log(error);
        return null;
    }

    function onChangeFirstEntry(event: any) {
        event.preventDefault();
        setFirstEntry(event.target.value);
    }

    function onChangeSecondEntry(event: any) {
        event.preventDefault();
        setSecondEntry(event.target.value);
    }

    async function onConfirm() {
        if (firstEntry !== secondEntry) {
            setShowDanger(true);
        } else if (data) {
            const response: AxiosResponse = await props.handler(data._links.self.href, firstEntry);
            if (response.status == StatusCodes.OK) {
                setShowSuccess(true);
                setTimeout(function () {
                    Router.push(applicationPaths.home);
                }, timers.redirect);
            }
        }
    }

    return (
        <Container className={styles.reset_component} data-testid="reset-component">
            <h4>{capitalize(t("reset " + props.name))}</h4>
            <Form.Label>New {props.name}</Form.Label>
            <FormControl id="" data-testid="reset-input-1" type={props.name} onChange={onChangeFirstEntry} />
            <Form.Label>Repeat New {props.name}</Form.Label>
            <FormControl id="" data-testid="reset-input-2" type={props.name} onChange={onChangeSecondEntry} />
            <Button data-testid="confirm-reset" onClick={onConfirm}>
                {capitalize(t("confirm button"))}
            </Button>
            <ToastContainer position="bottom-end">
                <Toast
                    bg="danger"
                    onClose={() => setShowDanger(false)}
                    show={showDanger}
                    delay={3000}
                    autohide
                >
                    <Toast.Body>{capitalize(t(props.name + " identical"))}</Toast.Body>
                </Toast>
            </ToastContainer>
            <ToastContainer position="bottom-end" data-testid="toast-reset">
                <Toast
                    bg="success"
                    onClose={() => setShowSuccess(false)}
                    show={showSuccess}
                    delay={timers.toast}
                    autohide
                >
                    <Toast.Body>{capitalize(t("changed succesfully"))}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};
