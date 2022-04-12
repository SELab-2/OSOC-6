import { Navbar, Nav, Container } from "react-bootstrap";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

export const NavBar = () => {
    const { t } = useTranslation("common");
    return (
        <>
            <Navbar collapseOnSelect sticky="top" expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="students">
                        <Image alt="" src={"/resources/osoc-logo.svg"} width="40" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className={"ms-auto"}>
                            <Nav.Item>
                                <Nav.Link href="students">{t("Navbar students")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="users">{t("Navbar users")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="projects">{t("Navbar projects")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="assignStudents">
                                    {t("Navbar assign students")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link href="profile">
                                    <Image
                                        alt=""
                                        src={"/resources/profile-icon.svg"}
                                        width="40"
                                        height="40"
                                    />
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default NavBar;
