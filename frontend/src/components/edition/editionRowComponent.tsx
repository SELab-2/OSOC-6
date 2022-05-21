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
import { useEditionApplicationPathTransformer, useGlobalEditionSetter } from "../../hooks/utilHooks";
import { IEdition } from "../../api/entities/EditionEntity";
import { useCurrentAdminUser } from "../../hooks/useCurrentUser";
import { useRouter } from "next/router";

type EditionProps = {
    edition: IEdition;
};

export function EditionRowComponent(props: EditionProps) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();
    const [show, setShow] = useState<boolean>(false);
    const edition = props.edition;
    const transformer = useEditionApplicationPathTransformer();
    const globalEditionSetter = useGlobalEditionSetter();
    const currentUserIsAdmin = useCurrentAdminUser();
    const router = useRouter();

    if (!edition) {
        return null;
    }

    async function useRightUrlAndGlobalContext() {
        await globalEditionSetter(edition);
        await router.push("/" + applicationPaths.assignStudents);
    }

    async function deleteEdition() {
        const response = await editionDelete(edition._links.self.href);
        if (response.status == StatusCodes.NO_CONTENT) {
            try {
                const editionsMutate = mutate(apiPaths.editions);
                const editionMutate = mutate(edition._links.self.href);
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
                    <a
                        style={{ cursor: "pointer" }}
                        onClick={useRightUrlAndGlobalContext}
                        data-testid="list-view-edition"
                    >
                        <Image alt="" src={"/resources/view.svg"} width="15" height="15" />
                    </a>
                    {currentUserIsAdmin && (
                        <a
                            style={{ padding: "1rem", cursor: "pointer" }}
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
                    )}
                    {currentUserIsAdmin && (
                        <a
                            style={{ cursor: "pointer" }}
                            onClick={deleteEdition}
                            data-testid="list-delete-edition"
                        >
                            <Image alt="" src={"/resources/delete.svg"} width="15" height="15" />
                        </a>
                    )}
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
                <hr style={{marginTop: "1rem"}} />
            </Row>
        </Container>
    );
}

export default EditionRowComponent;
