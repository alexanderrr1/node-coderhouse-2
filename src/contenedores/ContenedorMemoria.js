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