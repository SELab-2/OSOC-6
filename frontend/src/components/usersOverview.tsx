import useTranslation from "next-translate/useTranslation";
import { Container, Row, Col } from "react-bootstrap";
import apiPaths from "../properties/apiPaths";
import { getAllUsers } from "../api/calls/usersCalls";
import UserComponent from "./manageUserComponent";
import { IUser } from "../api/entities/UserEntity";
import useSWR from "swr";

export function UsersOverview() {
    const { t } = useTranslation("common");
    let {data, error} = useSWR(apiPaths.users, getAllUsers);

    data = data || [];

    if (error) {
        console.log(error);
        return null;
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
                <UserComponent key={user.email} user={user} />
            ))}
        </Container>
    );
}

export default UsersOverview;
