import ContenedorArchivo from "../contenedores/ContenedorArchivo.js";

class ProductosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('./db/productos.json');
    }

}

export default ProductosDaoArchivo;