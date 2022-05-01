import { Navbar, Nav, Container } from "react-bootstrap";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import applicationPaths from "../properties/applicationPaths";
import { useEditionPathTransformer } from "../api/calls/baseCalls";

export const NavBar = () => {
    const { t } = useTranslation("common");
    const transformer = useEditionPathTransformer();

    return (
        <div className="capitalize" data-testid="nav-bar">
            <Navbar collapseOnSelect sticky="top" expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href={"/" + applicationPaths.students} data-testid="navbar-brand">
                        <Image alt="" src={"/resources/osoc-logo.svg"} width="30" height="30" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className={"ms-auto"}>
                            <Nav.Item data-testid="navbar-students">
                                <Nav.Link href={transformer("/" + applicationPaths.students)}>
                                    {t("students")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item data-testid="navbar-users">
                                <Nav.Link href={"/" + applicationPaths.users}>{t("users")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item data-testid="navbar-projects">
                                <Nav.Link href={transformer("/" + applicationPaths.projects)}>
                                    {t("projects")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item data-testid="navbar-assignstudents">
                                <Nav.Link href={transformer("/" + applicationPaths.assignStudents)}>
                                    {t("assign students")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item data-testid="navbar-profile">
                                <Nav.Link href={"/" + applicationPaths.profile}>
                                    <Image
                                        alt=""
                                        src={"/resources/profile-icon.svg"}
                                        width="25"
                                        height="25"
                                    />
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavBar;
