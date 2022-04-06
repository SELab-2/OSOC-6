import {Navbar, Nav, Container} from 'react-bootstrap'

export const NavBar = () => {
    return (
        <>
            <Navbar collapseOnSelect fixed='top' expand="sm" bg="dark" variant="dark">
                <Container>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link href="#students">Students</Nav.Link>
                            <Nav.Link href="#users">Users</Nav.Link>
                            <Nav.Link href="#projects">Projects</Nav.Link>
                            <Nav.Link href="#assignStudents">Assign Students</Nav.Link>
                            <Nav.Link href="#profile">Profile</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
};

export default NavBar;