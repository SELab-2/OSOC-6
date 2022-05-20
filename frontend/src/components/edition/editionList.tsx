import useTranslation from "next-translate/useTranslation";
import useSWR from "swr";
import apiPaths from "../../properties/apiPaths";
import { Button, Col, Container, Row } from "react-bootstrap";
import { capitalize } from "../../utility/stringUtil";
import { IEdition } from "../../api/entities/EditionEntity";
import { getAllEditionsFromPage } from "../../api/calls/editionCalls";
import { EditionRowComponent } from "./editionRowComponent";
import applicationPaths from "../../properties/applicationPaths";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import styles from "../../styles/editionList.module.css";

export function EditionList() {
    const { t } = useTranslation("common");
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
                <div className={styles.edition_header}>
                    <h2 style={{ marginBottom: "40px" }}>{capitalize(t("manage editions"))}</h2>
                    <Button className={styles.edition_new_button} href={transformer(applicationPaths.editionCreate)}>
                        {capitalize(t("create new edition"))}
                    </Button>
                </div>
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
