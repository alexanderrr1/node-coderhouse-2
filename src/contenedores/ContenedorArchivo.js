import * as fsp from 'fs/promises';

class ContenedorArchivo {

    constructor(filePath){
        this.filePath = filePath;
        this.encode = "utf-8";
        (async () => {await this.initialize()})();
    };

    async initialize() {
        const readedData = await fsp.readFile(this.filePath, this.encode);
        if(readedData == "") {
            await fsp.writeFile(this.filePath, '[]', this.encode);
        }
    }

    async save(element) {
        const listOfProducts = await this.findAll();
        element.id = listOfProducts[listOfProducts.length-1].id + 1;
        element.timestamp = Date.now();
        listOfProducts.push(element);
        await fsp.writeFile(this.filePath, JSON.stringify(listOfProducts), this.encode);
        return element;
    };

    async findById(id) {
        const listOfProducts = await this.findAll();
        const foundProduct = listOfProducts.find(element => element.id == id);
        if(!foundProduct) return 'producto no encontrado';
        return foundProduct;
    };

    async findAll() {
        const readedData = await fsp.readFile(this.filePath, this.encode);
        const firstChar = readedData.charAt(0);
        const lastChar = readedData.charAt(readedData.length - 1);
        if( firstChar != "[" || lastChar != "]")  await fsp.writeFile(this.filePath, "[]", this.encode);
        return JSON.parse(await fsp.readFile(this.filePath, this.encode));
    };

    async deleteById(id){
        const file = await this.findAll();
        const foundProduct = file.findIndex(element => element.id == id);
        if(foundProduct != -1){
            file.splice(foundProduct, 1);
            await this.deleteAll();
            await fsp.writeFile(this.filePath, JSON.stringify(file), this.encode);
        }
        return `Deleted element with id ${id}`;
    };

    async deleteAll() {
        const emptyFile = JSON.stringify([]);
        await fsp.writeFile(this.filePath, emptyFile, this.encode);
        return `All element were deleted`;
    };

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

};

export default ContenedorArchivo;