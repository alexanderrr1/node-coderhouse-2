class ContenedorMemoria {

    constructor() {
        this.initialize();
    }

    initialize() {
        this.persistence = [];
    }

    findAll() {
        return this.persistence;
    }

    findById(id) {
        return this.findAll().find(x => x.id === id);
    }

    save(element) {
        element.id = this.persistence.length === 0 ? 1 : this.persistence[this.persistence.length-1].id + 1
        element.timestamp = Date.now();
        this.persistence.push(element);
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

    deleteById(id) {
        const elementToDeleteIndex = this.findAll().findIndex(x => x.id === id);
        this.persistence.splice(elementToDeleteIndex, 1);
    }

    deleteAll() {
        this.persistence = [];
    }

}

export default ContenedorMemoria;