import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js";
import fsp from "fs/promises";

class ProductosDaoArchivo extends ContenedorArchivo {

    constructor() {
        super('./db/productos.json');
    }

    async updateById(newElement, id) {
        const file = await this.findAll();
        const foundProductIndex = file.findIndex(element => element.id == id );
        const oldProduct = await this.findById(id);
        oldProduct.timestamp = Date.now();
        oldProduct.nombre = newElement.nombre;
        oldProduct.descripcion = newElement.descripcion;
        oldProduct.codigo = newElement.codigo;
        oldProduct.foto = newElement.foto;
        oldProduct.precio = newElement.precio;
        oldProduct.stock = newElement.stock;
        file.splice(foundProductIndex, 1, oldProduct);
        await this.deleteAll();
        await fsp.writeFile(this.filePath, JSON.stringify(file), this.encode);
        return oldProduct;
    }

}

export default ProductosDaoArchivo;