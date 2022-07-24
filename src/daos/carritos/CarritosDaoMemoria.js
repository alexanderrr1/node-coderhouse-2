import ContenedorMemoria from "../../contenedores/ContenedorMemoria.js";

class CarritosDaoMemoria extends ContenedorMemoria {

    constructor() {
        super();
    }

    updateById(id, newElement) {
        const oldElement = this.findAll().find(x => x.id === id);
        const oldElementIndex = this.findAll().findIndex(x => x.id === id);
        oldElement.timestamp = Date.now();
        oldElement.productos = newElement.productos;
        this.persistence.splice(oldElementIndex, 1, oldElement);
        return oldElement;
    }

}

export default CarritosDaoMemoria;