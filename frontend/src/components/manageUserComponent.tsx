import useTranslation from "next-translate/useTranslation";
import { Row, Col, DropdownButton, Toast, Container, ToastContainer } from "react-bootstrap";
import Image from "next/image";
import {
    disabledUserHandler,
    setRoleAdminHandler,
    setRoleCoachHandler,
    userDeleteHandler,
} from "../handlers/usersHandler";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useState } from "react";
import { useSWRConfig } from "swr";
import apiPaths from "../properties/apiPaths";
import { StatusCodes } from "http-status-codes";
import { AxiosResponse } from "axios";
import { capitalize } from "../utility/stringUtil";
import { UserRole } from "../api/entities/UserEntity";
import timers from "../properties/timers";
import styles from "../styles/usersOverview.module.css";

export function UserComponent(props: any) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();
    const [user, setUser] = useState<any>(props.user);
    const [show, setShow] = useState<boolean>(false);

    if (!user) {
        return null;
    }

    function deleteUser() {
        userDeleteHandler(user._links.self.href).then((response) => {
            if (response.status == StatusCodes.NO_CONTENT) {
                try {
                    const user = mutate(apiPaths.users);
                } catch (error) {
                    setShow(true);
                }
            } else {
                setShow(true);
            }
        });
    }

    function setUserPatch(response: AxiosResponse) {
        if (response.status != StatusCodes.OK) {
            setShow(true);
        } else {
            let newUser = Object.assign({}, response.data);
            setUser(newUser);
        }
    }

    async function setUserRoleAdmin() {
        const response: AxiosResponse = await setRoleAdminHandler(user._links.self.href);
        setUserPatch(response);
    }

    async function setUserRoleCoach() {
        const response: AxiosResponse = await setRoleCoachHandler(user._links.self.href);
        setUserPatch(response);
    }

    async function disableUser() {
        const response: AxiosResponse = await disabledUserHandler(user._links.self.href);
        setUserPatch(response);
    }

    return (
        <Container>
            <Row data-testid="user-row" className={styles.users_row}>
                <Col>{user.callName}</Col>
                <Col>{user.email}</Col>
                <Col>
                    <DropdownButton
                        id="dropdown-basic-button"
                        title={user.enabled ? user.userRole : capitalize(t("disabled"))}
                    >
                        {(user.userRole != UserRole.admin || user.enabled == false) && (
                            <DropdownItem onClick={setUserRoleAdmin} data-testid="overview-admin-user">
                                {capitalize(t("admin"))}
                            </DropdownItem>
                        )}
                        {(user.userRole != UserRole.coach || user.enabled == false) && (
                            <DropdownItem onClick={setUserRoleCoach} data-testid="overview-coach-user">
                                {capitalize(t("coach"))}
                            </DropdownItem>
                        )}
                        {user.enabled && (
                            <DropdownItem onClick={disableUser} data-testid="overview-disable-user">
                                {capitalize(t("disabled"))}
                            </DropdownItem>
                        )}
                    </DropdownButton>
                </Col>
                <Col xs={1}>
                    <a onClick={deleteUser} data-testid="overview-delete-user" style={{ cursor: "pointer" }}>
                        <Image alt="" src={"/resources/delete.svg"} width="15" height="15" />
                    </a>
                </Col>
                <ToastContainer position="bottom-end">
                    <Toast
                        bg="warning"
                        onClose={() => setShow(false)}
                        show={show}
                        delay={timers.toast}
                        autohide
                    >
                        <Toast.Body>{capitalize(t("something went wrong"))}</Toast.Body>
                    </Toast>
                </ToastContainer>
                <hr />
            </Row>
        </Container>
    );
}

export default UserComponent;
