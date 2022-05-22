import { Button, Container, FormControl, Toast, ToastContainer } from "react-bootstrap";
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
import { Field, Form, Formik } from "formik";

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
    const [showDanger, setShowDanger] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    async function onConfirm(values: { value: string; valueRepeat: string }) {
        if (values.value !== values.valueRepeat) {
            setShowDanger(true);
        } else if (token) {
            const response: AxiosResponse = await handler(token, values.value);
            if (response.status == StatusCodes.OK) {
                setShowSuccess(true);
                setTimeout(function () {
                    router.push(transformer("/" + applicationPaths.login)).catch(console.log);
                }, timers.redirect);
            }
        } else if (user) {
            const response: AxiosResponse = await handler(user._links.self.href, values.value);
            if (response.status == StatusCodes.OK) {
                setShowSuccess(true);
                setTimeout(function () {
                    router.push(transformer("/" + applicationPaths.assignStudents)).catch(console.log);
                }, timers.redirect);
            }
        }
    }

    return (
        <div className={styles.reset_component} data-testid="reset-component">
            <div className={styles.reset_box}>
                {!token && <h2>{capitalize(t("reset " + name))}</h2>}
                <Formik
                    initialValues={{
                        value: "",
                        valueRepeat: "",
                    }}
                    onSubmit={onConfirm}
                >
                    <Form>
                        <h5>{capitalize(t("new " + name))}</h5>
                        <Field
                            className={styles.reset_field}
                            data-testid="reset-input-1"
                            type={name}
                            name="value"
                        />
                        <h5>{capitalize(t("repeat new " + name))}</h5>
                        <Field
                            className={styles.reset_field}
                            data-testid="reset-input-2"
                            type={name}
                            name="valueRepeat"
                        />
                        <Button type="submit" data-testid="confirm-reset" className="mt-3">
                            {capitalize(t("confirm"))}
                        </Button>
                    </Form>
                </Formik>
            </div>
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
        </div>
    );
}
