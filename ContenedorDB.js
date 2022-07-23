const Knex = require('knex')

class Contenedor {

    constructor(config){
        this.knex = new Knex(config);
        this.initialize(config);
    };

    async initialize(config) {
        this.verifyConnection(config.client);
        if(config.client === 'mysql') {
            await this.createTablesProductIfNotExist();
        } else {
            await this.createTablesMessageIfNotExist();
        }
    }

    verifyConnection(client) {
        this.knex.raw('SELECT 1')
            .then(() => {
                console.log(`${client} connected`);
            })
            .catch((e) => {
                console.log(`${client} not connected`);
                console.log(e);
            })
    }

    async createTablesMessageIfNotExist() {
        const existMessageTable = await this.knex.schema.hasTable('message');
        if(!existMessageTable) {
            this.knex.schema.createTableIfNotExists('message', table  => {
                table.increments('id');
                table.string('sender');
                table.string('message');
                table.timestamp('timestamp');
            })
                .then(() => console.log("Table created"))
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    async createTablesProductIfNotExist() {
        const existProductTable = await this.knex.schema.hasTable('product')
        if(!existProductTable) {
            this.knex.schema.createTableIfNotExists('product', table  => {
                table.increments('id');
                table.string('nombre');
                table.string('descripcion');
                table.string('codigo');
                table.string('foto');
                table.float('precio');
                table.integer('stock');
                table.timestamp('timestamp');
            })
                .then(() => console.log("Table created"))
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    async save(table, data) {
        await this.knex(table).insert(data);
    };

    async getById(table, id) {
        return this.knex.from(table).select().where({id});
    };

    async getAll(table) {
        return this.knex.from(table).select();
    };

    async deleteById(table, id){
        return this.knex(table).where({id}).del();
    };

    async deleteAll(table) {
        return this.knex(table).del();
    };

    async updateById(table, newElement, id) {
        return this.knex(table).where({id}).update(newElement);
    }

}

module.exports = Contenedor;