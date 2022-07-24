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

    async findAll() {
        const readedData = await fsp.readFile(this.filePath, this.encode);
        const firstChar = readedData.charAt(0);
        const lastChar = readedData.charAt(readedData.length - 1);
        if( firstChar != "[" || lastChar != "]")  await fsp.writeFile(this.filePath, "[]", this.encode);
        return JSON.parse(await fsp.readFile(this.filePath, this.encode));
    };

    async findById(id) {
        const listOfElements = await this.findAll();
        const foundElement = listOfElements.find(element => element.id == id);
        if(!foundElement) return 'Elemento no encontrado';
        return foundElement;
    };

    async save(element) {
        const listOfElements = await this.findAll();
        element.id = listOfElements[listOfElements.length-1].id + 1;
        element.timestamp = Date.now();
        listOfElements.push(element);
        await fsp.writeFile(this.filePath, JSON.stringify(listOfElements), this.encode);
        return element;
    };

    async updateById(newElement, id) {
    }

    async deleteById(id){
        const file = await this.findAll();
        const foundElement = file.findIndex(element => element.id == id);
        if(foundElement != -1){
            file.splice(foundElement, 1);
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

};

export default ContenedorArchivo;