import { useContext, useEffect, useState } from 'react';
import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button, Dropdown } from 'react-bootstrap';
import DataContext from '../context/DataContext';
import { esJefe } from '../services/services';
import UnreadContext from '../context/UnreadContext';

const Sidebar = () => {

    const { data } = useContext(DataContext);
    const { unreadCount, setDepto } = useContext(UnreadContext);
    const nombres = data ? data.nombres : "";
    const depto = data ? data.departamento.depto : 0;
    const rut = data ? data.rut : 0;
    const [isJefe, setIsJefe] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [depto, rut, setDepto]);

    return (
        <>
            <div style={{ width: '100px', height: '100vh', backgroundColor: '#003366', color: 'white', position: 'fixed', top: '0', left: '0', zIndex: 1030 }}>
                <span onClick={handleShow} className="material-icons" style={{ cursor: 'pointer', fontSize: '24px', marginTop: '10px', display: 'block', textAlign: 'center' }}>
                    menu
                </span>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto' }}>
                        <a href='/' style={{ textDecoration: 'none', color: 'white', position: 'relative' }}>
                            <img src="/src/img/yo.jpg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </a>
                    </div>
                    <p style={{ marginTop: '5px', marginBottom: '0', fontSize: '12px' }}>{nombres}</p>
                </div>
                {isJefe && (
                    <div className='text-center text-white mt-3'>
                        <a href='/inboxSol' style={{ textDecoration: 'none', color: 'white' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-inbox" viewBox="0 0 16 16">
                                <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4zm9.954 5H10.45a2.5.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374z" />
                            </svg>
                            {unreadCount > 0 &&
                                <span className="start-100 translate-middle badge rounded-pill bg-danger">
                                    {unreadCount}
                                    <span className="visually-hidden">unread messages</span>
                                </span>
                            }
                        </a>
                    </div>
                )}
            </div>

            <Offcanvas show={show} onHide={handleClose} placement="start" style={{ backgroundColor: '#003366', color: 'white', width: '250px' }}>
                <OffcanvasHeader closeButton closeVariant="white">
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto' }}>
                            <img src="/src/img/yo.jpg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <p style={{ marginTop: '10px', marginBottom: '0', fontSize: '20px' }}>{nombres}</p>
                    </div>
                    <div className="mt-3">
                        <Button href='/' variant="link" onClick={handleClose} style={{ color: 'white', width: '100%', textAlign: 'left' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
                            </svg>
                            <span className="ms-2">Home</span>
                        </Button>
                    </div>
                    <div className="mt-3">
                        <Dropdown>
                            <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ color: 'white', width: '100%', textAlign: 'left' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.35 2.056L9.373 8.775l-.707 2.121 2.122-.707 4.778-4.778-2-2z" />
                                    <path fillRule="evenodd" d="M1 13.5V15h1.5l4.978-4.978-.707-.707L1 13.5zm1-.707 4.264-4.264.707.707L2.707 13H2v-.707z" />
                                    <path fillRule="evenodd" d="M1 1v10h10V1H1zM0 0h12v12H0V0z" />
                                </svg>
                                <span className="ms-2">Solicitudes</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item href="/solicitudes" onClick={handleClose}>Solicitar</Dropdown.Item>
                                <Dropdown.Item href="/missolicitudes" onClick={handleClose}>Mis Solicitudes</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </>
    );
};

export default Sidebar;
