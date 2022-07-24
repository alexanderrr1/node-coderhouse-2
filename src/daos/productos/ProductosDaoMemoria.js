import ContenedorMemoria from "../../contenedores/ContenedorMemoria.js";

class ProductosDaoMemoria extends ContenedorMemoria {

    constructor() {
        super();
    }

    updateById(id, newElement) {
        const oldElement = this.findAll().find(x => x.id === id);
        const oldElementIndex = this.findAll().findIndex(x => x.id === id);
        oldElement.timestamp = Date.now();
        oldElement.nombre = newElement.nombre;
        oldElement.descripcion = newElement.descripcion;
        oldElement.codigo = newElement.codigo;
        oldElement.foto = newElement.foto;
        oldElement.precio = newElement.precio;
        oldElement.stock = newElement.stock;
        this.persistence.splice(oldElementIndex, 1, oldElement);
        return oldElement;
    }

}

export default ProductosDaoMemoria;