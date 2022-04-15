import useTranslation from "next-translate/useTranslation";
import { Row, Col, Image, DropdownButton } from "react-bootstrap";
import {
    disabledUserHandler,
    setRoleAdminHandler,
    setRoleCoachHandler,
    userDeleteHandler,
} from "../handlers/usersHandler";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useEffect, useState } from "react";

export function UserComponent(props: any) {
    const { t } = useTranslation("common");
    const [user, setUser] = useState<any>(props.user);

    if (!user) {
        return null;
    }

    function deleteUser() {
        userDeleteHandler(user._links.self.href).then((response) => {
            if (response.status == 204) {
                props.unmountMe();
            }
        });
    }

    function setUserRoleAdmin() {
        setRoleAdminHandler(user._links.self.href).then((response) => {
            if (response.status != 200) {
                // TODO Toast
            } else {
                let newUser = JSON.parse(JSON.stringify(response.data));
                setUser(newUser);
            }
        });
    }

    function setUserRoleCoach() {
        setRoleCoachHandler(user._links.self.href).then((response) => {
            if (response.status != 200) {
                // TODO Toast
            } else {
                let newUser = JSON.parse(JSON.stringify(response.data));
                setUser(newUser);
            }
        });
    }

    function disableUser() {
        disabledUserHandler(user._links.self.href).then((response) => {
            if (response.status != 200) {
                // TODO Show toast
            } else {
                let newUser = JSON.parse(JSON.stringify(response.data));
                setUser(newUser);
            }
        });
    }

    return (
        <Row>
            <Col>{user.callName}</Col>
            <Col>{user.email}</Col>
            <Col>
                <DropdownButton
                    id="dropdown-basic-button"
                    title={user.enabled ? user.userRole : "Disabled"}
                >
                    {(user.userRole != "ADMIN" || user.enabled == false) && (
                        <DropdownItem onClick={setUserRoleAdmin}>
                            {t("UserRole Admin")}
                        </DropdownItem>
                    )}
                    {(user.userRole != "COACH" || user.enabled == false) && (
                        <DropdownItem onClick={setUserRoleCoach}>
                            {t("UserRole Coach")}
                        </DropdownItem>
                    )}
                    {user.enabled && (
                        <DropdownItem onClick={disableUser}>{t("UserRole Disabled")}</DropdownItem>
                    )}
                </DropdownButton>
            </Col>
            <Col xs={1}>
                <a onClick={deleteUser}>
                    <Image alt="" src={"/resources/delete.svg"} width="15" height="15" />
                </a>
            </Col>
            <hr />
        </Row>
    );
}

export default UserComponent;
