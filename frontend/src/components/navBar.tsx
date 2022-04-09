import { Navbar, Nav, Container } from 'react-bootstrap';
import useTranslation from 'next-translate/useTranslation';

export const NavBar = () => {
    const { t } = useTranslation('navBar');
    return (
        <>
            <Navbar
                collapseOnSelect
                fixed="top"
                expand="sm"
                bg="dark"
                variant="dark"
            >
                <Container>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="students">
                                {t('Navbar students')}
                            </Nav.Link>
                            <Nav.Link href="users">
                                {t('Navbar users')}
                            </Nav.Link>
                            <Nav.Link href="projects">
                                {t('Navbar projects')}
                            </Nav.Link>
                            <Nav.Link href="assignStudents">
                                {t('Navbar assign students')}
                            </Nav.Link>
                            <Nav.Link href="profile">
                                {t('Navbar profile')}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default NavBar;
