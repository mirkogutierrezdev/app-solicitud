import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import '../css/LoginPage.css';
import { useState } from 'react';

const initialLoginState = {
    user: "",
    pwd: ""
}

export const LoginPage = () => {
    const [login, setLogin] = useState(initialLoginState);

    const onChangeInput = ({ target }) => {
        const { name, value } = target;

        if (name === 'user') {
            // Eliminar todos los caracteres que no sean números y limitar a 10 caracteres
            const cleanedValue = value.replace(/\D/g, '').slice(0, 9);
        
            
            setLogin(prev => ({
                ...prev,
                [name]: cleanedValue
            }));
        } else {
            // Actualizar el estado para el campo `pwd`
            setLogin(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }


    const handleClickSign = (event) => {
        event.preventDefault(); // Evita que el formulario se envíe y recargue la página
        console.log(login);    // Imprime el estado login en la consola
    }

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Row className="justify-content-center w-100">
                <Col xs={12} md={6} lg={4} className="text-center">
                    {/* Espacio para el logotipo */}
                    <div className="logo-container mb-4">
                        <img src='/src/img/logo.png' alt="Logo Intranet Municipal" className="logo-img" />
                    </div>
                    <h1 className="welcome-title mb-4">Intranet Municipal</h1>
                    <Form onSubmit={handleClickSign}>
                        <Form.Group className="mb-4" controlId="formBasicEmail">
                            <Form.Label>Rut Funcionario</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Ingrese su Rut" 
                                onChange={onChangeInput} 
                                name="user" 
                                value={login.user} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Password" 
                                onChange={onChangeInput} 
                                name="pwd" 
                                value={login.pwd} 
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Remember me" defaultChecked />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mb-4 w-100">
                            Sign in
                        </Button>

                        <div className="text-center">
                            <p>¿No está registrado? <a href="#!">Regístrese</a></p>
                            <p>o ingrese con:</p>

                            <Button variant="link" className="custom-button">
                                <img src='/src/img/logo-claveunica.svg' alt="Logo Clave Única" />
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};
