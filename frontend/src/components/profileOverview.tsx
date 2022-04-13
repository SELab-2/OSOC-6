import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { Container, Row, Col } from "react-bootstrap";

export function ProfileOverview() {
    const { t } = useTranslation("common");
    return (
        <Container>
            <h2>{t("UserOverview My Profile")}</h2>
            <Row>
                <Col>{t("UserOverview Name")}</Col>
                <Col>Username</Col>
                <Col>
                    <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                </Col>
            </Row>
            <Row>
                <Col>{t("UserOverview E-mail")}</Col>
                <Col>dummy@email.com</Col>
                <Col>
                    <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                </Col>
            </Row>
            <Row>
                <Col>{t("UserOverview Password")}</Col>
                <Col>******</Col>
                <Col>
                    <Image alt="" src={"/resources/edit.svg"} width="15" height="15" />
                </Col>
            </Row>
        </Container>
    );
}

export default ProfileOverview;
