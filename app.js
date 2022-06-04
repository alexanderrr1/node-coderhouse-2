const express = require('express')
const app = express()
const port = 3000;
const Contenedor = require('./Contenedor');

const contenedor = new Contenedor('productos');

const getRandomArrayPos = (max) => {
    return Math.floor((Math.random() * max));
}

app.get('/productos', async(req, res) => {
    const productos = await contenedor.getAll();
    res.json({
        productos
    })
})

app.get('/productoRandom', async(req, res) => {
    const productos = await contenedor.getAll();
    const randomPos = getRandomArrayPos(productos.length);
    res.json( {
        producto: productos[randomPos]
    });
})

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log("Server escuchando en puerto", port)
});