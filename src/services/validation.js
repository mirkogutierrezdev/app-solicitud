export const addVerify = (rut) => {
    // Convertir el RUT a cadena y eliminar puntos y guión
    const rutClean = String(rut).replace(/\D/g, '');

    let acum = 0;
    let multiplier = 2;

    // Iterar desde el último dígito hacia el primero
    for (let i = rutClean.length - 1; i >= 0; i--) {
        acum += rutClean[i] * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const remainder = 11 - (acum % 11);

    // Determinar el dígito verificador
    if (remainder === 11) return '0';
    if (remainder === 10) return 'K';
    return remainder.toString();
};


export const formatRut = (rut) => {
    // Separar el RUT en número y dígito verificador
    const [rutBody, verifier] = rut.split('-');

    // Eliminar puntos del cuerpo del RUT (si existen) y formatearlo
    const formattedRutBody = rutBody.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retornar el RUT formateado
    return `${formattedRutBody}-${verifier}`;
};
