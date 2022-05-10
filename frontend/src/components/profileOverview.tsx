import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { Button, Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import { useState } from "react";
import apiPaths from "../properties/apiPaths";
import applicationPaths from "../properties/applicationPaths";
import styles from "../styles/profileOverview.module.css";
import { emptyUser, UserRole } from "../api/entities/UserEntity";
import { StatusCodes } from "http-status-codes";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { AxiosResponse } from "axios";
import { capitalize } from "../utility/stringUtil";
import timers from "../properties/timers";
import { useEditionApplicationPathTransformer } from "../hooks/utilHooks";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { saveCallNameOfUser, userDelete } from "../api/calls/userCalls";

export function ProfileOverview() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionApplicationPathTransformer();
    let { user: userResponse, error } = useCurrentUser();
    const { mutate } = useSWRConfig();
    const [editCallName, setEditCallName] = useState<boolean>(false);
    const [callName, setCallName] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    const user = userResponse || emptyUser;

    if (error) {
        console.log(error);
        return null;
    }

    function handleEditCallName() {
        if (user) {
            setEditCallName(true);
            setCallName(user.callName);
        }
    }

    async function handleSaveCallName() {
        setEditCallName(false);
        if (user) {
            const response: AxiosResponse = await saveCallNameOfUser(user._links.self.href, callName);
            if (response.status == StatusCodes.OK) {
                await mutate(apiPaths.ownUser, response.data);
            } else {
                setShow(true);
            }
        }
    }

    async function deleteCurrentUser() {
        if (user) {
            const response: AxiosResponse = await userDelete(user._links.self.href);
            if (response.status == StatusCodes.NO_CONTENT) {
                await router.push(transformer(applicationPaths.login));
            } else {
                setShow(true);
            }
        }
    }

    function onChange(event: any) {
        // Intended to run on the change of every form element
        event.preventDefault();
        setCallName(event.target.value);
    }

    return (
        <Container>
            <h2>{capitalize(t("user profile"))}</h2>
            <Row data-testid="profile-overview">
                <Col className={styles.first_element}>{capitalize(t("name") + ":")}</Col>
                {/*show callname if not editing*/}
                {!editCallName && <Col>{user.callName}</Col>}
                {!editCallName && (
                    <Col>
                        <a data-testid="edit-callname" onClick={handleEditCallName}>
                            <Image
                                alt={capitalize(t("edit"))}
                                src={"/resources/edit.svg"}
                                width="15"
                                height="15"
                            />
                        </a>
                    </Col>
                )}

                {/*input field and save mark if editing*/}
                {editCallName && (
                    <Col>
                        <input
                            data-testid="input-callname"
                            name="callname"
                            defaultValue={user.callName}
                            onChange={onChange}
                        />
                        <button data-testid="save-callname" onClick={handleSaveCallName}>
                            <Image
                                alt={capitalize(t("confirm"))}
                                src={"/resources/checkmark.svg"}
                                width="15"
                                height="15"
                            />
                        </button>
                    </Col>
                )}
            </Row>
            <Row>
                <Col className={styles.first_element}>{capitalize(t("email")) + ":"}</Col>
                <Col>{user.email}</Col>
                <Col>
                    <a href={applicationPaths.changeEmail}>
                        <Image
                            alt={capitalize(t("edit"))}
                            src={"/resources/edit.svg"}
                            width="15"
                            height="15"
                        />
                    </a>
                </Col>
            </Row>
            <Row>
                <Col className={styles.first_element}>{capitalize(t("user password") + ":")}</Col>
                <Col>******</Col>
                <Col>
                    <a href={applicationPaths.changePassword}>
                        <Image
                            alt={capitalize(t("edit"))}
                            src={"/resources/edit.svg"}
                            width="15"
                            height="15"
                        />
                    </a>
                </Col>
            </Row>
            <Row>
                <Col className={styles.first_element}>{capitalize(t("user status"))}</Col>
                <Col>
                    {user.userRole == UserRole.admin && <a>{capitalize(t("admin"))}</a>}
                    {user.userRole == UserRole.coach && <a>{capitalize(t("coach"))}</a>}
                </Col>
            </Row>
            <Row>
                <Button data-testid="delete-userprofile" onClick={deleteCurrentUser}>
                    {capitalize(t("user delete"))}
                </Button>
            </Row>
            <ToastContainer position="bottom-end">
                <Toast bg="warning" onClose={() => setShow(false)} show={show} delay={timers.toast} autohide>
                    <Toast.Body>{capitalize(t("something went wrong"))}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}

export default ProfileOverview;
