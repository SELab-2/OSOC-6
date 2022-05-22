import { Container, Nav, Navbar } from "react-bootstrap";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import applicationPaths from "../../properties/applicationPaths";
import { useEditionApplicationPathTransformer } from "../../hooks/utilHooks";
import OptionsMenu from "./optionsMenu";
import { useCurrentAdminUser, useCurrentUser } from "../../hooks/useCurrentUser";

export const NavBar = () => {
    const { t } = useTranslation("common");
    const transformer = useEditionApplicationPathTransformer();
    const currentUserIsAdmin = useCurrentAdminUser();
    const { user } = useCurrentUser();

    return (
        <div className="capitalize" data-testid="nav-bar">
            <Navbar collapseOnSelect sticky="top" expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand
                        href={
                            user
                                ? transformer("/" + applicationPaths.assignStudents)
                                : transformer("/" + applicationPaths.login)
                        }
                        data-testid="navbar-brand"
                    >
                        <Image alt="" src={"/resources/osoc-logo.svg"} width="30" height="30" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {user && (
                            <Nav className={"ms-auto"}>
                                <Nav.Item>
                                    <Nav.Link
                                        data-testid="navbar-students"
                                        href={transformer("/" + applicationPaths.students)}
                                    >
                                        {t("students")}
                                    </Nav.Link>
                                </Nav.Item>
                                {currentUserIsAdmin && (
                                    <Nav.Item>
                                        <Nav.Link
                                            data-testid="navbar-users"
                                            href={transformer("/" + applicationPaths.users)}
                                        >
                                            {t("users")}
                                        </Nav.Link>
                                    </Nav.Item>
                                )}
                                <Nav.Item>
                                    <Nav.Link
                                        data-testid="navbar-projects"
                                        href={transformer("/" + applicationPaths.projects)}
                                    >
                                        {t("projects")}
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        data-testid="navbar-assignstudents"
                                        href={transformer("/" + applicationPaths.assignStudents)}
                                    >
                                        {t("assign students")}
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item data-testid="navbar-profile">
                                    <OptionsMenu />
                                </Nav.Item>
                            </Nav>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};

export default NavBar;
