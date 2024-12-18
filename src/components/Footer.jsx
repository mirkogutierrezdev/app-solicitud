export const Footer = () => {
    return (
        <footer>
            <div className="footer-info">
                <div>
                    <strong>Contacto :</strong> Mirko Gutiérrez | <a href="mailto:mgutierrez@laflorida.cl">mgutierrez@laflorida.cl</a> | Anexo: 4898
                </div>
                <div>
                    <strong>Contacto :</strong> Francisco Escudero | <a href="mailto:fescudero@laflorida.cl">fescudero@laflorida.cl</a> | Anexo: 4230
                </div>
                <div>
                    <strong>Contacto :</strong> Gonzalo Gallegos | <a href="mailto:ggallegos@laflorida.cl">ggallegos@laflorida.cl</a> | Anexo: 4118
                </div>
            </div>
            <div className="footer-credits">
                © {new Date().getFullYear()} Municipalidad de La Florida. Todos los derechos reservados.
            </div>
        </footer>
    );
};
