import { Navbar, Nav, Button, Col, Row, Dropdown } from 'react-bootstrap';
import '../css/HomeTab.css'; // Importa el archivo CSS creado
import { useContext, useEffect, useState } from 'react';
import { esJefe } from '../services/services';
import DataContext from '../context/DataContext';
import UnreadContext from '../context/UnreadContext';

function HomeTabs() {

    const { data } = useContext(DataContext);
    const { unreadCount, setDepto } = useContext(UnreadContext);
    const depto = data ? data.departamento.depto : 0;
    const rut = data ? data.rut : 0;
    const [isJefe, setIsJefe] = useState(false);

    const getIsJefe = async () => {
        try {
            const result = await esJefe(depto, rut);
            setIsJefe(result);
        } catch (error) {
            console.error('Error fetching esJefe:', error);
        }
    };

    useEffect(() => {
        if (depto && rut) {
            getIsJefe();
            setDepto(depto);
        }
    }, [depto, rut, setDepto]);

    console.log(isJefe);

    return (
        <Row className="justify-content-center">
            <Col md={10}>
                <Navbar bg="light" className="home-tab-container">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
                        <Nav className="align-items-center">

                            {/* Solicitudes dropdown menu */}
                            <Dropdown>
                                <Dropdown.Toggle variant="light" className="me-2 rounded-pill border-0 text-dark home-tab-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
                                        <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                                        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                                    </svg>
                                    Solicitudes
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="/solicitudes">Solicitar</Dropdown.Item>
                                    <Dropdown.Item href="/missolicitudes">Mis solicitudes</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* Botones restantes */}
                            <Button href='/' variant="light" className="me-2 rounded-pill border-0 text-dark home-tab-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-person" viewBox="0 0 16 16">
                                    <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2v9.255S12 12 8 12s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h5.5z" />
                                </svg>
                                Mis Datos
                            </Button>
                            {/* Otros botones */}
                            <Button href='/ausencias' variant="light" className="me-2 rounded-pill border-0 text-dark home-tab-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-x-fill" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708" />
                                </svg>
                                Ausencias
                            </Button>
                            <Button href='/feriados' variant="light" className="me-2 rounded-pill border-0 text-dark home-tab-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-week" viewBox="0 0 16 16">
                                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                </svg>
                                Administrativos y Feriados
                            </Button>
                            <Button href='/licencias' variant="light" className="me-2 rounded-pill border-0 text-dark home-tab-button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-prescription2" viewBox="0 0 16 16">
                                    <path d="M7 6h2v2h2v2H9v2H7v-2H5V8h2z" />
                                    <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v10.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 14.5V4a1 1 0 0 1-1-1zm2 3v10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V4zM3 3h10V1H3z" />
                                </svg>
                                Licencias Medicas
                            </Button>

                            {isJefe && (
                                <div className='text-center text-white mt-3'>
                                    <a href='/inboxSol' style={{ textDecoration: 'none', color: 'black' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-inbox" viewBox="0 0 16 16">
                                            <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span className="start-100 translate-middle badge rounded-pill bg-danger">
                                                {unreadCount}
                                                <span className="visually-hidden">unread messages</span>
                                            </span>
                                        )}
                                    </a>
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Col>
        </Row>
    );
}

export default HomeTabs;
