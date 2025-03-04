/* eslint-disable react-hooks/exhaustive-deps */
import { Navbar, Nav, Button, Col, Row, Dropdown, Container } from 'react-bootstrap';
import '../css/HomeTab.css'; // Importa el archivo CSS creado
import { useContext, useEffect, useState } from 'react';
import { esJefe, getPermisosUsuario, getSubroganciasByFecha } from '../services/services';
import DataContext from '../context/DataContext';
import UnreadContext from '../context/UnreadContext';

export const HomeTabs = () => {
    const { data, setRut } = useContext(DataContext);
    const { unreadCount, setDepto } = useContext(UnreadContext);
    const depto = data ? data.departamento.depto : 0;
    const rut = data ? data.rut : 0;
    const [isJefe, setIsJefe] = useState(false);
    const [expanded, setExpanded] = useState(false); // Estado para manejar el colapso del menú
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Estado para detectar vista móvil
    const [permisoUsuario, setPermisoUsuario] = useState([]);
    const [subrogancias, setSubrogancias] = useState([]);
    const [fechaActual, setFechaActual] = useState(null);

    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses son 0-indexados
        const day = String(today.getDate()).padStart(2, '0');
        setFechaActual(`${year}-${month}-${day}`);
    }

    const getIsJefe = async () => {
        try {
            const result = await esJefe(depto, rut);
            setIsJefe(result);
        } catch (error) {
            console.error('Error fetching esJefe:', error);
        }
    };

    const fetchSubrogancias = async () => {

        try {

            const response = await getSubroganciasByFecha(rut, fechaActual);
            if (response) {
                setSubrogancias(response);
            }

        } catch (error) {
            console.log(error);

        }

    }

    const fetchPermisos = async () => {
        try {
            const permisosUsuario = await getPermisosUsuario(rut); // Implementa esta función en tu backend
            setPermisoUsuario(permisosUsuario);
        } catch (error) {
            console.error('Error fetching permisos:', error);
        }
    };

    useEffect(() => {
        if (depto && rut) {
            getIsJefe();
            setDepto(depto);
            fetchPermisos();
            fetchSubrogancias();
            getCurrentDate();
        }

    }, [depto, rut, setDepto]);

    useEffect(() => {


        getCurrentDate();


    }, []);


    useEffect(() => {
        if (subrogancias.length > 0) {
            setIsJefe(true);
        }


    }, [subrogancias]);





    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        setRut(null);
        window.location.href = 'https://appx.laflorida.cl/login/cerrar-sesion.php';
    };

    const handleBack = () => {
        window.location.href = 'https://appx.laflorida.cl/login/menu.php';


    };

    const hasPermission = (permission) => {
        const permisos = permisoUsuario?.perfil?.permisos?.map(p => p.nombre) || [];
        return permisos.includes(permission);
    };


    return (
        <Container fluid className="position-relative p-3">
            {/* Botón Volver flotante */}
            <Button
                onClick={handleBack}
                variant="outline-primary"
                className="position-fixed top-0 start-0 m-3"
                style={{
                    zIndex: 1050,
                    fontWeight: 'bold',
                    padding: '10px 20px',
                    borderRadius: '50px'
                }}
            >
                &larr; Volver
            </Button>

            {/* Navbar principal */}
            <Row className="justify-content-center mt-5">
                <Col md={10}>
                    <Navbar
                        bg="light"
                        expand="md"
                        expanded={expanded}
                        className="home-tab-container"
                    >
                        <Navbar.Toggle
                            aria-controls="basic-navbar-nav"
                            onClick={() => setExpanded(!expanded)}
                        />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="align-items-center justify-content-center">
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="light"
                                        className="me-2 rounded-pill border-0 text-dark home-tab-button"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            fill="currentColor"
                                            className="bi bi-journal-text"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                                            <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                                            <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
                                        </svg>
                                        Solicitudes
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>

                                        <Dropdown.Item href="/sol/solicitudes">
                                            Solicitar
                                        </Dropdown.Item>


                                        <Dropdown.Item href="/sol/missolicitudes">
                                            Mis solicitudes
                                        </Dropdown.Item>


                                        {hasPermission("GESTIONAR_USUARIOS") && (
                                            <Dropdown.Item href="/sol/usuarios">Usuarios</Dropdown.Item>
                                        )}
                                        {hasPermission("GESTIONAR_PERFILES") && (
                                            <Dropdown.Item href="/sol/perfiles">Perfiles</Dropdown.Item>
                                        )}
                                        {hasPermission("VER_DECRETO") && (
                                            <Dropdown.Item href="/sol/decretos">
                                                Generación de Decretos
                                            </Dropdown.Item>
                                        )}
                                        {hasPermission("LISTAR_DECRETOS") && (
                                            <Dropdown.Item href="/sol/decretosview">
                                                Listado de Decretos
                                            </Dropdown.Item>
                                        )}
                                        {hasPermission("CREAR_SUBROGANCIAS") && (
                                            <Dropdown.Item href="/sol/subrogancias">
                                                Subrogancias
                                            </Dropdown.Item>


                                        )

                                        }

                                    </Dropdown.Menu>
                                </Dropdown>

                                {!isMobile && (
                                    <>
                                        <Button
                                            href="/sol/home"
                                            variant="light"
                                            className="me-2 rounded-pill border-0 text-dark home-tab-button"
                                        >
                                            Mis Datos
                                        </Button>
                                        <Button
                                            href="/sol/ausencias"
                                            variant="light"
                                            className="me-2 rounded-pill border-0 text-dark home-tab-button"
                                        >
                                            Ausencias
                                        </Button>
                                        <Button
                                            href="/sol/feriados"
                                            variant="light"
                                            className="me-2 rounded-pill border-0 text-dark home-tab-button"
                                        >
                                            Administrativos y Feriados
                                        </Button>
                                        <Button
                                            href="/sol/licencias"
                                            variant="light"
                                            className="me-2 rounded-pill border-0 text-dark home-tab-button"
                                        >
                                            Licencias Médicas
                                        </Button>
                                    </>
                                )}

                                <Button
                                    variant="danger"
                                    onClick={handleLogout}
                                    className="me-2 rounded-pill"
                                >
                                    Cerrar Sesión
                                </Button>

                                {!isMobile && isJefe && (
                                    <div className="text-center text-dark mt-3">
                                        <a
                                            href="/sol/inboxsol"
                                            style={{ textDecoration: 'none', color: 'black' }}
                                            className="position-relative"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="40"
                                                height="40"
                                                fill="currentColor"
                                                className="bi bi-inbox"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
                                            </svg>
                                            {unreadCount > 0 && (
                                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                    {unreadCount}
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
        </Container>
    );
}

export default HomeTabs;
