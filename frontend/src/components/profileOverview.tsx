import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { Button, Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import { useState } from "react";
import apiPaths from "../properties/apiPaths";
import applicationPaths from "../properties/applicationPaths";
import styles from "../styles/profileOverview.module.css";
import { profileSaveHandler, userDeleteHandler } from "../handlers/profileHandler";
import { getEmtpyUser, getUserInfo, UserRole } from "../api/entities/UserEntity";
import { StatusCodes } from "http-status-codes";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import { AxiosResponse } from "axios";
import { capitalize } from "../utility/stringUtil";
import timers from "../properties/timers";
import { useEditionPathTransformer } from "../hooks/utilHooks";

export function ProfileOverview() {
    const { t } = useTranslation("common");
    const router = useRouter();
    const transformer = useEditionPathTransformer();
    let { data, error } = useSWR(apiPaths.ownUser, getUserInfo);
    const { mutate } = useSWRConfig();
    const [editCallname, setEditCallname] = useState<boolean>(false);
    const [callname, setCallname] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);

    data = data || getEmtpyUser();

    if (error) {
        console.log(error);
        return null;
    }

    function handleEditCallName() {
        setEditCallname(true);
    }

    async function handleSaveCallName() {
        setEditCallname(false);
        if (data) {
            const response: AxiosResponse = await profileSaveHandler(data._links.self.href, callname);
            if (response.status == StatusCodes.OK) {
                data = response.data;
                const user = mutate(apiPaths.ownUser);
            } else {
                setShow(true);
            }
        }
    }

    async function deleteCurrentUser() {
        if (data) {
            const response: AxiosResponse = await userDeleteHandler(data._links.self.href);
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
        setCallname(event.target.value);
    }

    return (
        <div className={styles.profile_full_div}>
            <div className={styles.profile_center}>
                <h2 style={{ marginRight: "20px", marginBottom: "50px" }}>{t("user profile")}</h2>
                <Row data-testid="profile-overview" className={styles.profile_row}>
                    <Col className={styles.first_element}>{capitalize(t("name") + ":")}</Col>
                    {/*show callname if not editing*/}
                    {!editCallname && <Col>{data.callName}</Col>}
                    {!editCallname && (
                        <Col className={styles.profile_last_col}>
                            <a
                                data-testid="edit-callname"
                                onClick={handleEditCallName}
                                className={styles.clickable}
                            >
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
                    {editCallname && (
                        <Col>
                            <input
                                className={styles.callname_field}
                                data-testid="input-callname"
                                name="callname"
                                defaultValue={data.callName}
                                onChange={onChange}
                            />
                            <button
                                data-testid="save-callname"
                                onClick={handleSaveCallName}
                                className={styles.callname_confirm}
                            >
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
                <Row className={styles.profile_row}>
                    <Col className={styles.first_element}>{capitalize(t("email")) + ":"}</Col>
                    <Col>{data.email}</Col>
                    <Col className={styles.profile_last_col}>
                        <a href={applicationPaths.changeEmail} className={styles.clickable}>
                            <Image
                                alt={capitalize(t("edit"))}
                                src={"/resources/edit.svg"}
                                width="15"
                                height="15"
                            />
                        </a>
                    </Col>
                </Row>
                <Row className={styles.profile_row}>
                    <Col className={styles.first_element}>{capitalize(t("user password") + ":")}</Col>
                    <Col>******</Col>
                    <Col className={styles.profile_last_col}>
                        <a href={applicationPaths.changePassword} className={styles.clickable}>
                            <Image
                                alt={capitalize(t("edit"))}
                                src={"/resources/edit.svg"}
                                width="15"
                                height="15"
                            />
                        </a>
                    </Col>
                </Row>
                <Row className={styles.profile_row}>
                    <Col className={styles.first_element}>{capitalize(t("user status"))}</Col>
                    <Col>
                        {data.userRole == UserRole.admin && <a>{capitalize(t("admin"))}</a>}
                        {data.userRole == UserRole.coach && <a>{capitalize(t("coach"))}</a>}
                    </Col>
                </Row>
                <Row className={styles.profile_row}>
                    <Button data-testid="delete-userprofile" onClick={deleteCurrentUser}>
                        {capitalize(t("user delete"))}
                    </Button>
                </Row>
            </div>
            <ToastContainer position="bottom-end">
                <Toast bg="warning" onClose={() => setShow(false)} show={show} delay={timers.toast} autohide>
                    <Toast.Body>{capitalize(t("something went wrong"))}</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default ProfileOverview;
