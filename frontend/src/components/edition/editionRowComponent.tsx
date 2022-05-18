import useTranslation from "next-translate/useTranslation";
import { Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import Image from "next/image";
import { useState } from "react";
import { useSWRConfig } from "swr";
import apiPaths from "../../properties/apiPaths";
import { StatusCodes } from "http-status-codes";
import { capitalize } from "../../utility/stringUtil";
import timers from "../../properties/timers";
import { editionDelete, extractIdFromEditionUrl } from "../../api/calls/editionCalls";
import applicationPaths from "../../properties/applicationPaths";
import useEdition from "../../hooks/useGlobalEdition";
import { useEditionApplicationPathTransformer, useGlobalContextAndUrl } from '../../hooks/utilHooks';
import { useRouter } from "next/router";

export function EditionRowComponent(props: any) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();
    const [show, setShow] = useState<boolean>(false);
    const edition = props.edition;
    const transformer = useEditionApplicationPathTransformer();

    if (!edition) {
        return null;
    }

    async function useRightUrlAndGlobalContext() {
        useGlobalContextAndUrl(edition);
    }

    async function deleteEdition() {
        const response = await editionDelete(edition._links.self.href);
        if (response.status == StatusCodes.NO_CONTENT) {
            try {
                const editionsMutate = mutate(apiPaths.editions);
                const editionMutate = mutate(edition._links_self.href);
            } catch (error) {
                setShow(true);
            }
        } else {
            setShow(true);
        }
    }

    return (
        <Container>
            <Row data-testid="edition-row">
                <Col>{edition.name}</Col>
                <Col>{edition.year}</Col>
                <Col>{edition.active ? capitalize(t("active")) : capitalize(t("not active"))}</Col>
                <Col xs={1}>
                    <a onClick={useRightUrlAndGlobalContext} data-testid="list-view-edition">
                        <Image alt="" src={"/resources/view.svg"} width="15" height="15" />
                    </a>
                    <a
                        href={transformer(
                            applicationPaths.editionBase +
                                "/" +
                                extractIdFromEditionUrl(edition._links.self.href)
                        )}
                        data-testid="list-edit-edition"
                    >
                        <Image
                            alt={capitalize(t("edit"))}
                            src={"/resources/edit.svg"}
                            width="15"
                            height="15"
                        />
                    </a>
                    <a onClick={deleteEdition} data-testid="list-delete-edition">
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

export default EditionRowComponent;
