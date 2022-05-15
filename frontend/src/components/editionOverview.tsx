import { Col, Container, Row, Toast, ToastContainer } from "react-bootstrap";
import styles from "../styles/editionOverview.module.css";
import { capitalize } from "../utility/stringUtil";
import Image from "next/image";
import { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import useSWR, { useSWRConfig } from "swr";
import apiPaths from "../properties/apiPaths";
import { getEditionOnUrl } from "../api/calls/editionCalls";
import { AxiosResponse } from "axios";
import { StatusCodes } from "http-status-codes";
import {
    editionSaveActiveHandler,
    editionSaveNameHandler,
    editionSaveYearHandler,
} from "../handlers/editionHandler";
import timers from "../properties/timers";
export interface EditionOverviewProps {
    editionId: string;
}

export function EditionOverview({ editionId }: EditionOverviewProps) {
    const { t } = useTranslation("common");
    const { mutate } = useSWRConfig();

    const [name, setName] = useState<string>("");
    const [editName, setEditName] = useState<boolean>(false);
    const [year, setYear] = useState<string>("");
    const [editYear, setEditYear] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);
    const [showGeneralError, setShowGeneralError] = useState<boolean>(false);
    const [showYearError, setShowYearError] = useState<boolean>(false);

    let { data, error } = useSWR(apiPaths.editions + "/" + editionId, getEditionOnUrl);

    if (error || !data) {
        console.log(editionId);
        return null;
    }

    function handleEditName() {
        if (data) {
            setEditName(true);
            setName(data.name);
        }
    }

    async function handleSaveName() {
        setEditName(false);
        if (data) {
            const response: AxiosResponse = await editionSaveNameHandler(data._links.self.href, name);
            if (response.status == StatusCodes.OK) {
                data = response.data;
                mutate(apiPaths.editions);
            } else {
                setShowGeneralError(true);
            }
        }
    }

    function handleEditYear() {
        if (data) {
            setEditYear(true);
            setYear(data.year.toString());
        }
    }

    async function handleSaveYear() {
        setEditYear(false);
        if (!Number(year)) {
            setShowYearError(true);
            return;
        }
        if (data) {
            const response: AxiosResponse = await editionSaveYearHandler(data._links.self.href, year);
            if (response.status == StatusCodes.OK) {
                data = response.data;
                mutate(apiPaths.editions);
            } else {
                setShowGeneralError(true);
            }
        }
    }

    function handleChangeActive() {
        if (window.confirm(capitalize(t("change edition state")))) {
            handleSaveActive();
        }
    }

    async function handleSaveActive() {
        setActive(!active);
        if (data) {
            const response: AxiosResponse = await editionSaveActiveHandler(data._links.self.href, active);
            if (response.status == StatusCodes.OK) {
                data = response.data;
                mutate(apiPaths.editions);
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
        <Container>
            <h2>{capitalize(t("edition overview"))}</h2>
            <div data-testid="edition-overview">
                <Row>
                    <Col className={styles.first_element}>{capitalize(t("name") + ":")}</Col>
                    {/*show edition name if not editing*/}
                    {!editName && <Col data-testid="edition-name">{name ? name : data.name}</Col>}
                    {!editName && (
                        <Col>
                            <a data-testid="edit-name" onClick={handleEditName}>
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
                                data-testid="input-name"
                                name="name"
                                defaultValue={data.name}
                                onChange={onChange}
                            />
                            <button data-testid="save-name" onClick={handleSaveName}>
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
                <Row>
                    <Col className={styles.first_element}>{capitalize(t("year") + ":")}</Col>
                    {/*show edition year if not editing*/}
                    {!editYear && <Col data-testid="edition-year">{year ? year : data.year}</Col>}
                    {!editYear && (
                        <Col>
                            <a data-testid="edit-year" onClick={handleEditYear}>
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
                                data-testid="input-year"
                                type="number"
                                name="year"
                                defaultValue={data.year}
                                onChange={onChange}
                            />
                            <button data-testid="save-year" onClick={handleSaveYear}>
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
                <Row>
                    <Col className={styles.first_element}>{capitalize(t("active") + ":")}</Col>
                    <Col data-testid="edition-active">{active ? active : data.active}</Col>

                    <Col>
                        <input
                            data-testid="input-active"
                            type="checkbox"
                            name="active"
                            checked={data.active}
                            onChange={() => handleChangeActive()}
                            onClick={() => handleChangeActive()}
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
