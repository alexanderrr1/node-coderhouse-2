import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js";
import fsp from "fs/promises";

class CarritosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('./db/carritos.json');
    }

    async updateById(newElement, id) {
        const carritosList = await this.findAll();
        const carritoIndex = carritosList.findIndex(element => element.id == id);
        const oldCarrito = await this.findById(id);
        oldCarrito.timestamp = Date.now();
        oldCarrito.productos = newElement.productos;
        carritosList.splice(carritoIndex, 1, oldCarrito);
        await this.deleteAll();
        await fsp.writeFile(this.filePath, JSON.stringify(carritosList), this.encode);
        return oldCarrito;
    }

}

export default CarritosDaoArchivo;