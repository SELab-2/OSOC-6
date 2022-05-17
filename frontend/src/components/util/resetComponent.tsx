import { Button, Container, Form, FormControl, Toast, ToastContainer } from "react-bootstrap";
import useTranslation from "next-translate/useTranslation";
import styles from "../../styles/resetComponent.module.css";
import { useState } from "react";
import applicationPaths from "../../properties/applicationPaths";
import { useRouter } from "next/router";
import { capitalize } from "../../utility/stringUtil";
import { StatusCodes } from "http-status-codes";
import { AxiosResponse } from "axios";
import timers from "../../properties/timers";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { emptyUser } from "../../api/entities/UserEntity";

interface ResetComponentProps {
    name: string;
    handler: (url: string, email: string) => Promise<AxiosResponse>;
}

/**
 * Component able to edit field using a handler.
 */
export function ResetComponent({ handler, name }: ResetComponentProps) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    let { user: userResponse, error } = useCurrentUser();
    const [firstEntry, setFirstEntry] = useState<string>("");
    const [secondEntry, setSecondEntry] = useState<string>("");
    const [showDanger, setShowDanger] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const user = userResponse || emptyUser;

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
        } else if (user) {
            const response: AxiosResponse = await handler(user._links.self.href, firstEntry);
            if (response.status == StatusCodes.OK) {
                setShowSuccess(true);
                setTimeout(function () {
                    router.push(transformer("/" + applicationPaths.home));
                }, timers.redirect);
            }
        }
    }

    return (
        <Container className={styles.reset_component} data-testid="reset-component">
            <h4>{capitalize(t("reset " + name))}</h4>
            <Form.Label>{capitalize(t("new " + name))}</Form.Label>
            <FormControl id="" data-testid="reset-input-1" type={name} onChange={onChangeFirstEntry} />
            <Form.Label>{capitalize(t("repeat new " + name))}</Form.Label>
            <FormControl id="" data-testid="reset-input-2" type={name} onChange={onChangeSecondEntry} />
            <Button data-testid="confirm-reset" onClick={onConfirm}>
                {capitalize(t("confirm button"))}
            </Button>
            <ToastContainer position="bottom-end">
                <Toast
                    bg="danger"
                    onClose={() => setShowDanger(false)}
                    show={showDanger}
                    delay={timers.toast}
                    autohide
                >
                    <Toast.Body>{capitalize(t(name + " identical"))}</Toast.Body>
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
}
