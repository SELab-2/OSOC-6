import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { Button, Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import { useEffect, useState } from "react";
import apiPaths from "../properties/apiPaths";
import applicationPaths from "../properties/applicationPaths";
import { getUserInfo } from "../api/calls/userProfileCalls";
import styles from "../styles/profileOverview.module.css";
import { profileSaveHandler, userDeleteHandler } from "../handlers/profileHandler";
import { IAuthority, IUser, UserRole } from "../api/entities/UserEntity";
import { StatusCodes } from "http-status-codes";
import useSWR, { useSWRConfig } from "swr";
import Router from "next/router";
import { IReferencer } from "../api/entities/BaseEntities";

function getEmtpyUser(): IUser {
    return {
        accountNonExpired: true,
        accountNonLocked: true,
        authorities: { authority: UserRole.admin },
        callName: "",
        credentialsNonExpired: true,
        email: "",
        enabled: true,
        userRole: UserRole.admin,
        username: "",

        _links: {
            communications: { href: "" },
            projects: { href: "" },
            receivedInvitations: { href: "" },
            skills: { href: "" },
            userEntity: { href: "" },
            self: { href: "" },
        },
    };
}

export function ProfileOverview() {
    const { t } = useTranslation("common");
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

    function handleSaveCallName() {
        setEditCallname(false);
        if (data) {
            profileSaveHandler(data._links.self.href, callname).then((response) => {
                if (response.status == StatusCodes.OK) {
                    data = response.data;
                    const user = mutate(apiPaths.ownUser);
                } else {
                    setShow(true);
                }
            });
        }
    }

    function deleteCurrentUser() {
        if (data) {
            userDeleteHandler(data._links.self.href).then(async (response) => {
                if (response.status == StatusCodes.NO_CONTENT) {
                    await Router.push(applicationPaths.login);
                } else {
                    setShow(true);
                }
            });
        }
    }

    function onChange(event: any) {
        // Intended to run on the change of every form element
        event.preventDefault();
        setCallname(event.target.value);
    }

    return (
        <Container>
            <h2>{t("UserOverview My Profile")}</h2>
            <Row data-testid="profile-overview">
                <Col className={styles.first_element}>{t("UserOverview Name")}</Col>
                {/*show callname if not editing*/}
                {!editCallname && <Col>{data.callName}</Col>}
                {!editCallname && (
                    <Col>
                        <a data-testid="edit-callname" onClick={handleEditCallName}>
                            <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                        </a>
                    </Col>
                )}

                {/*input field and save mark if editing*/}
                {editCallname && (
                    <Col>
                        <input
                            data-testid="input-callname"
                            name="callname"
                            defaultValue={data.callName}
                            onChange={onChange}
                        />
                        <button data-testid="save-callname" onClick={handleSaveCallName}>
                            <Image alt="" src={"/resources/checkmark.svg"} width="15" height="15" />
                        </button>
                    </Col>
                )}
            </Row>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview E-mail")}</Col>
                <Col>{data.email}</Col>
                <Col>
                    <a href={applicationPaths.changeEmail}>
                        <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                    </a>
                </Col>
            </Row>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview Password")}</Col>
                <Col>******</Col>
                <Col>
                    <a href={applicationPaths.changePassword}>
                        <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                    </a>
                </Col>
            </Row>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview Status")}</Col>
                <Col>
                    {data.userRole == UserRole.admin && <a>Admin</a>}
                    {data.userRole == UserRole.coach && <a>Coach</a>}
                </Col>
            </Row>
            <Row>
                <Button data-testid="delete-userprofile" onClick={deleteCurrentUser}>
                    Delete my profile
                </Button>
            </Row>
            <ToastContainer position="bottom-end">
                <Toast bg="warning" onClose={() => setShow(false)} show={show} delay={3000} autohide>
                    <Toast.Body>Oops, something went wrong!</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}

export default ProfileOverview;
