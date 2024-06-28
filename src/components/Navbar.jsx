
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

function CustomNavbar() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#">
                    <img
                        src="/src/img/logo.png"
                        width="80"
                        height="40"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <NavDropdown title="RRRHH" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/ausencias">Ausencias</NavDropdown.Item>
                            <NavDropdown.Item href="/feriados">Feriados y Administrativos</NavDropdown.Item>
                            <NavDropdown.Item href="/licencias">Licencias Medicas</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#">Asistencia</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Solicitudes y permisos" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/solicitudes">Solicitar</NavDropdown.Item>

                        </NavDropdown>
                        <Nav.Link disabled>Disabled</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default CustomNavbar;
