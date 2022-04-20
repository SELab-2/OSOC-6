import useTranslation from "next-translate/useTranslation";
import { Row, Col, Image, DropdownButton } from "react-bootstrap";
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

export function UserComponent(props: any) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();
    const [user, setUser] = useState<any>(props.user);

    if (!user) {
        return null;
    }

    function deleteUser() {
        userDeleteHandler(user._links.self.href).then((response) => {
            if (response.status == StatusCodes.NO_CONTENT) {
                try {
                    const user = mutate(apiPaths.users);
                } catch (error) {
                    // TODO toast
                }
            } else {
                // TODO toast
            }
        });
    }

    function setUserRoleAdmin() {
        setRoleAdminHandler(user._links.self.href).then((response) => {
            if (response.status != StatusCodes.OK) {
                // TODO Toast
            } else {
                let newUser = Object.assign({}, response.data);
                setUser(newUser);
            }
        });
    }

    function setUserRoleCoach() {
        setRoleCoachHandler(user._links.self.href).then((response) => {
            if (response.status != StatusCodes.OK) {
                // TODO Toast
            } else {
                let newUser = Object.assign({}, response.data);
                setUser(newUser);
            }
        });
    }

    function disableUser() {
        disabledUserHandler(user._links.self.href).then((response) => {
            if (response.status != StatusCodes.OK) {
                // TODO Show toast
            } else {
                let newUser = Object.assign({}, response.data);
                setUser(newUser);
            }
        });
    }

    return (
        <Row data-testid="user-row">
            <Col>{user.callName}</Col>
            <Col>{user.email}</Col>
            <Col>
                <DropdownButton id="dropdown-basic-button" title={user.enabled ? user.userRole : "Disabled"}>
                    {(user.userRole != "ADMIN" || user.enabled == false) && (
                        <DropdownItem onClick={setUserRoleAdmin} data-testid="overview-admin-user">
                            {t("UserRole Admin")}
                        </DropdownItem>
                    )}
                    {(user.userRole != "COACH" || user.enabled == false) && (
                        <DropdownItem onClick={setUserRoleCoach} data-testid="overview-coach-user">
                            {t("UserRole Coach")}
                        </DropdownItem>
                    )}
                    {user.enabled && (
                        <DropdownItem onClick={disableUser} data-testid="overview-disable-user">
                            {t("UserRole Disabled")}
                        </DropdownItem>
                    )}
                </DropdownButton>
            </Col>
            <Col xs={1}>
                <a onClick={deleteUser} data-testid="overview-delete-user">
                    <Image alt="" src={"/resources/delete.svg"} width="15" height="15" />
                </a>
            </Col>
            <hr />
        </Row>
    );
}

export default UserComponent;
