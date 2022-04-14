import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { Container, Row, Col, Dropdown, DropdownButton, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import apiPaths from "../properties/apiPaths";
import { getUserInfo } from "../api/UserEntity";
import styles from "../styles/profileOverview.module.css";
import { profileDeleteHandler } from "../handlers/profileHandler";

export function ProfileOverview() {
    const { t } = useTranslation("common");
    const [data, setData] = useState<any>();

    useEffect(() => {
        getUserInfo(apiPaths.ownUser).then((response) => setData(response));
    }, []);

    if (!data) {
        return null;
    }

    function handleDelete() {
        profileDeleteHandler(data._links.self.href);
    }

    return (
        <Container>
            <h2>{t("UserOverview My Profile")}</h2>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview Name")}</Col>
                <Col>{data.callName}</Col>
                <Col>
                    <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                </Col>
            </Row>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview E-mail")}</Col>
                <Col>{data.email}</Col>
                <Col>
                    <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                </Col>
            </Row>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview Password")}</Col>
                <Col>******</Col>
                <Col>
                    <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                </Col>
            </Row>
            <Row>
                <Col className={styles.first_element}>{t("UserOverview Status")}</Col>
                <Col>
                    {data.userRole == "ADMIN" && <a>Admin</a>}
                    {data.userRole == "COACH" && <a>Coach</a>}
                </Col>
            </Row>
            <Row>
                <Button onClick={handleDelete}>Delete my profile</Button>
            </Row>
        </Container>
    );
}

export default ProfileOverview;
