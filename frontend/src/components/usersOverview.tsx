import useTranslation from "next-translate/useTranslation";
import { Col, Container, Row } from "react-bootstrap";
import apiPaths from "../properties/apiPaths";
import UserComponent from "./manageUserComponent";
import { IUser } from "../api/entities/UserEntity";
import useSWR from "swr";
import { capitalize } from "../utility/stringUtil";
import { getAllUsersFromPage } from "../api/calls/userCalls";

export function UsersOverview() {
    const { t } = useTranslation("common");
    let { data, error } = useSWR(apiPaths.users, getAllUsersFromPage);

    data = data || [];

    if (error) {
        console.log(error);
        return null;
    }

    return (
        <Container data-testid="user-overview">
            <h2>{capitalize(t("users manage"))}</h2>
            <Row>
                <Col>
                    <h6>{capitalize(t("search name"))}</h6>
                </Col>
                <Col>
                    <h6>{capitalize(t("email"))}</h6>
                </Col>
                <Col>
                    <h6>{capitalize(t("users status"))}</h6>
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
