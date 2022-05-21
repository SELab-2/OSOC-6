import { Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import styles from "../../styles/editionList.module.css";
import { capitalize } from "../../utility/stringUtil";
import Image from "next/image";
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import useSWR, { useSWRConfig } from "swr";
import apiPaths from "../../properties/apiPaths";
import {
    getEditionOnUrl,
    saveEditionActiveState,
    saveEditionName,
    saveEditionYear,
} from "../../api/calls/editionCalls";
import { AxiosResponse } from "axios";
import { StatusCodes } from "http-status-codes";
import timers from "../../properties/timers";
import { emptyEdition } from "../../api/entities/EditionEntity";
import applicationPaths from '../../properties/applicationPaths';
import { useGlobalEditionSetter } from '../../hooks/utilHooks';
import { useRouter } from 'next/router';
export interface EditionOverviewProps {
    editionId: string;
}

/**
 * Component showing the attributes of an edition and allowing the user to change them.
 * @param editionId the id of the edition that is to be displayed and maybe changed.
 */
export function EditionOverview({ editionId }: EditionOverviewProps) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();

    const { data: receivedEdition, error: editionError } = useSWR(
        apiPaths.editions + "/" + editionId,
        getEditionOnUrl
    );

    const [name, setName] = useState<string>("");
    const [editName, setEditName] = useState<boolean>(false);
    const [year, setYear] = useState<string>("");
    const [editYear, setEditYear] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>();
    const [showGeneralError, setShowGeneralError] = useState<boolean>(false);
    const [showYearError, setShowYearError] = useState<boolean>(false);

    const globalEditionSetter = useGlobalEditionSetter();
    const router = useRouter();

    if (editionError) {
        console.log(editionError);
        return null;
    }

    if (active === undefined && receivedEdition !== undefined) {
        setActive(receivedEdition.active);
    }

    const edition = receivedEdition || emptyEdition;

    async function useRightUrlAndGlobalContext() {
        await globalEditionSetter(edition);
        await router.push("/" + applicationPaths.assignStudents);
    }

    function handleEditName() {
        if (receivedEdition) {
            setEditName(true);
            setName(receivedEdition.name);
        }
    }

    async function handleSaveName() {
        setEditName(false);
        if (edition) {
            const response: AxiosResponse = await saveEditionName(edition._links.self.href, name);
            if (response.status === StatusCodes.OK) {
                if (response.data) {
                    await Promise.all([
                        mutate(apiPaths.editions),
                        mutate(edition._links.self.href, response.data),
                    ]);
                } else {
                    setShowGeneralError(true);
                }
            } else {
                setShowGeneralError(true);
            }
        }
    }

    function handleEditYear() {
        if (edition) {
            setEditYear(true);
            setYear(edition.year.toString());
        }
    }

    async function handleSaveYear() {
        setEditYear(false);
        if (!Number(year)) {
            setShowYearError(true);
            return;
        }
        if (edition) {
            const response: AxiosResponse = await saveEditionYear(edition._links.self.href, year);
            if (response.status === StatusCodes.OK) {
                if (edition) {
                    await Promise.all([
                        mutate(apiPaths.editions),
                        mutate(edition._links.self.href, response.data),
                    ]);
                    setShowYearError(false);
                } else {
                    setShowGeneralError(true);
                }
            } else {
                setShowGeneralError(true);
            }
        }
    }

    async function handleChangeActive() {
        // Ask the user if they REALLY want to change this attribute with a popup window, as it is very impactful
        if (edition) {
            if (window.confirm(capitalize(t("change edition state")))) {
                await handleSaveActive();
            }
        }
    }

    async function handleSaveActive() {
        if (edition) {
            const response: AxiosResponse = await saveEditionActiveState(
                edition._links.self.href,
                !edition.active
            );
            if (response.status === StatusCodes.OK) {
                setActive(!edition.active);
                edition.active = !edition.active;
                await Promise.all([mutate(edition._links.self.href), mutate(apiPaths.editions)]);
            } else {
                setShowGeneralError(true);
            }
        }
    }

    function onChange(event: any) {
        event.preventDefault();
        if (event.target.attributes.name.value === "name") {
            setName(event.target.value);
        } else if (event.target.attributes.name.value === "year") {
            setYear(event.target.value);
        }
    }

    return (
        <Container style={{ maxWidth: "50%" }}>
            <div className={styles.edition_header}>
                <h3 style={{ marginTop: "10rem" }}>{capitalize(t("edition overview"))}</h3>
                <a
                    className={styles.eye}
                    onClick={useRightUrlAndGlobalContext}
                    data-testid="list-view-edition"
                >
                    <Image alt="" src={"/resources/view.svg"} width="20" height="20" />
                </a>
            </div>
            <hr/>
            <div data-testid="edition-overview">
                <Row className={styles.edition_create_row}>
                    <Col xs={2}>{capitalize(t("name") + ":")}</Col>
                    {/*show edition name if not editing*/}
                    {!editName && <Col data-testid="edition-name">{name ? name : edition.name}</Col>}
                    {!editName && (
                        <Col xs={1}>
                            <a style={{cursor: "pointer"}} data-testid="edit-name" onClick={handleEditName}>
                                <Image
                                    alt={capitalize(t("edit"))}
                                    src={"/resources/edit.svg"}
                                    width="15"
                                    height="15"
                                />
                            </a>
                        </Col>
                    )}

                    {editName && (
                        <Col>
                            <input
                                className={styles.edition_create_field}
                                data-testid="input-name"
                                name="name"
                                defaultValue={edition.name}
                                onChange={onChange}
                            />
                            <button className={styles.callname_confirm} data-testid="save-name" onClick={handleSaveName}>
                                <Image
                                    alt={capitalize(t("confirm"))}
                                    src={"/resources/checkmark.svg"}
                                    width="15"
                                    height="15"
                                />
                            </button>
                        </Col>
                    )}
                </Row>
                <Row className={styles.edition_create_row}>
                    <Col xs={2}>{capitalize(t("year") + ":")}</Col>
                    {/*show edition year if not editing*/}
                    {!editYear && <Col data-testid="edition-year">{year ? year : edition.year}</Col>}
                    {!editYear && (
                        <Col xs={1}>
                            <a style={{cursor: "pointer"}} data-testid="edit-year" onClick={handleEditYear}>
                                <Image
                                    alt={capitalize(t("edit"))}
                                    src={"/resources/edit.svg"}
                                    width="15"
                                    height="15"
                                />
                            </a>
                        </Col>
                    )}

                    {editYear && (
                        <Col>
                            <input
                                className={styles.edition_create_field}
                                data-testid="input-year"
                                type="number"
                                name="year"
                                defaultValue={edition.year}
                                onChange={onChange}
                            />
                            <button className={styles.callname_confirm} data-testid="save-year" onClick={handleSaveYear}>
                                <Image
                                    alt={capitalize(t("confirm"))}
                                    src={"/resources/checkmark.svg"}
                                    width="15"
                                    height="15"
                                />
                            </button>
                        </Col>
                    )}
                </Row>
                <Row className={styles.edition_create_row}>
                    <Col xs={2}>{capitalize(t("active") + ":")}</Col>
                    <Col data-testid="edition-active">{active ? active : edition.active}</Col>

                    <Col xs={1}>
                        <input
                            data-testid="input-active"
                            type="checkbox"
                            name="active"
                            checked={active}
                            onChange={handleChangeActive}
                        />
                    </Col>
                </Row>
                <ToastContainer position="bottom-end">
                    <Toast
                        bg="warning"
                        onClose={() => setShowGeneralError(false)}
                        show={showGeneralError}
                        delay={timers.toast}
                        autohide
                    >
                        <Toast.Body>{capitalize(t("something went wrong"))}</Toast.Body>
                    </Toast>
                </ToastContainer>
                <ToastContainer position="bottom-end">
                    <Toast
                        data-testid="error-year"
                        bg="warning"
                        onClose={() => setShowYearError(false)}
                        show={showYearError}
                        delay={timers.toast}
                        autohide
                    >
                        <Toast.Body>{capitalize(t("invalid edition year"))}</Toast.Body>
                    </Toast>
                </ToastContainer>
            </div>
        </Container>
    );
}

export default EditionOverview;
