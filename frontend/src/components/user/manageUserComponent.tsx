import useTranslation from "next-translate/useTranslation";
import { Col, Container, DropdownButton, Row, Toast, ToastContainer } from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useState } from "react";
import { useSWRConfig } from "swr";
import apiPaths from "../../properties/apiPaths";
import { StatusCodes } from "http-status-codes";
import { AxiosResponse } from "axios";
import { capitalize } from "../../utility/stringUtil";
import { UserRole } from "../../api/entities/UserEntity";
import timers from "../../properties/timers";
import { disabledUser, setRoleAdminOfUser, setRoleCoachOfUser, userDelete } from "../../api/calls/userCalls";
import { ConfirmDeleteButton } from "../util/confirmDeleteButton";

export function UserComponent(props: any) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();
    const [user, setUser] = useState<any>(props.user);
    const [show, setShow] = useState<boolean>(false);

    if (!user) {
        return null;
    }

    async function deleteUser() {
        const response = await userDelete(user._links.self.href);
        if (response.status == StatusCodes.NO_CONTENT) {
            await mutate(apiPaths.users);
        } else {
            setShow(true);
        }
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
        const response: AxiosResponse = await setRoleAdminOfUser(user._links.self.href);
        setUserPatch(response);
    }

    async function setUserRoleCoach() {
        const response: AxiosResponse = await setRoleCoachOfUser(user._links.self.href);
        setUserPatch(response);
    }

    async function disableUser() {
        const response: AxiosResponse = await disabledUser(user._links.self.href);
        setUserPatch(response);
    }

    return (
        <Container>
            <Row data-testid="user-row">
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
                    <ConfirmDeleteButton dataTestId="overview-delete-user" handler={deleteUser} />
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
                <hr style={{ marginTop: "1rem" }} />
            </Row>
        </Container>
    );
}

export default UserComponent;
