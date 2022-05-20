import useTranslation from "next-translate/useTranslation";
import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { getAllUsersFromPage } from "../../api/calls/userCalls";
import styles from "../../styles/usersOverview.module.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import { capitalize } from "../../utility/stringUtil";
import { IUser, UserRole } from "../../api/entities/UserEntity";
import UserComponent from "../user/manageUserComponent";
import { IEdition } from "../../api/entities/EditionEntity";
import { getAllEditionsFromPage } from "../../api/calls/editionCalls";
import { EditionRowComponent } from "./editionRowComponent";
import applicationPaths from "../../properties/applicationPaths";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import { useCurrentAdminUser, useCurrentUser } from '../../hooks/useCurrentUser';

export function EditionList() {
    const { t } = useTranslation("common");
    const currentUserIsAdmin = useCurrentAdminUser();
    let { data, error } = useSWR(apiPaths.editions, getAllEditionsFromPage);
    const transformer = useEditionApplicationPathTransformer();


    data = data || [];

    if (error) {
        console.log(error);
        return null;
    }

    return (
        <div data-testid="edition-list">
            <Container style={{ marginTop: "50px" }}>
                <h2 style={{ marginBottom: "40px" }}>{capitalize(t("manage editions"))}</h2>
                {currentUserIsAdmin && (
                    <Button data-testid="new-edition" href={transformer(applicationPaths.editionCreate)}>
                        {capitalize(t("create new edition"))}
                    </Button>
                )}
                <Row>
                    <Col>
                        <h6>{capitalize(t("name"))}</h6>
                    </Col>
                    <Col>
                        <h6>{capitalize(t("year"))}</h6>
                    </Col>
                    <Col>
                        <h6>{capitalize(t("active"))}</h6>
                    </Col>
                    <Col xs={1} />
                </Row>
                {data.map((edition: IEdition) => (
                    <EditionRowComponent key={edition.name} edition={edition} />
                ))}
            </Container>
        </div>
    );
}

export default EditionList;
