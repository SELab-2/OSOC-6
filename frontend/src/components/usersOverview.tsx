import useTranslation from "next-translate/useTranslation";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import apiPaths from "../properties/apiPaths";
import { getAllUsers } from "../api/calls/usersCalls";
import UserComponent from "./manageUserComponent";
import { IUser } from "../api/entities/UserEntity";

export function UsersOverview() {
    const { t } = useTranslation("common");
    const [data, setData] = useState<any>();

    useEffect(() => {
        getAllUsers(apiPaths.users).then((response) => setData(response));
    }, []);

    if (!data) {
        return null;
    }

    function handleUnmount() {
        getAllUsers(apiPaths.users).then((response) => setData(response));
    }

    return (
        <Container>
            <h2>{t("Users manage")}</h2>
            <Row>
                <Col>
                    <h6>{t("Users search name")}</h6>
                </Col>
                <Col>
                    <h6>{t("Users email")}</h6>
                </Col>
                <Col>
                    <h6>{t("Users status")}</h6>
                </Col>
                <Col xs={1} />
            </Row>
            {data.map((user: IUser) => (
                <UserComponent key={user.email} user={user} unmountMe={handleUnmount} />
            ))}
        </Container>
    );
}

export default UsersOverview;
