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
import { IUser } from "../../api/entities/UserEntity";

/**
 * The props needed for the ResetComponent.
 */
interface ResetComponentProps {
    name: string;
    handler: (url: string, newValue: string) => Promise<AxiosResponse>;
    user: IUser;
    token?: string;
}

/**
 * Component used to change a single value with a second input to check whether inputs are equal.
 * @param handler the handler to submit the value to
 * @param name the name of the component (used for title)
 * @param user the user to reset the value of, emptyUser if token is provided
 * @param token the token used for the query parameter of the reset password request
 */
export function ResetComponent({ handler, name, user, token }: ResetComponentProps) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    const [firstEntry, setFirstEntry] = useState<string>("");
    const [secondEntry, setSecondEntry] = useState<string>("");
    const [showDanger, setShowDanger] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

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
        } else if (token) {
            const response: AxiosResponse = await handler(token, firstEntry);
            if (response.status == StatusCodes.OK) {
                setShowSuccess(true);
                setTimeout(function () {
                    router.push(transformer("/" + applicationPaths.login)).catch(console.log);
                }, timers.redirect);
            }
        } else if (user) {
            const response: AxiosResponse = await handler(user._links.self.href, firstEntry);
            if (response.status == StatusCodes.OK) {
                setShowSuccess(true);
                setTimeout(function () {
                    router.push(transformer("/" + applicationPaths.home)).catch(console.log);
                }, timers.redirect);
            }
        }
    }

    return (
        <Container className={styles.reset_component} data-testid="reset-component">
            {!token && <h4>{capitalize(t("reset " + name))}</h4>}
            <Form.Label>{capitalize(t("new " + name))}</Form.Label>
            <FormControl id="" data-testid="reset-input-1" type={name} onChange={onChangeFirstEntry} />
            <Form.Label className="mt-2">{capitalize(t("repeat new " + name))}</Form.Label>
            <FormControl id="" data-testid="reset-input-2" type={name} onChange={onChangeSecondEntry} />
            <Button data-testid="confirm-reset" onClick={onConfirm} className="mt-3">
                {capitalize(t("confirm"))}
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
