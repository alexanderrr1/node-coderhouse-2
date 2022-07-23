require('dotenv').config();
const express = require('express');
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const http = require('http');
const path = require('path');
const Contenedor = require("./ContenedorDB");
const { options : optionsMessageDB } = require("./config/messageDB");

/* Routers */
const productosApiRouter = require('./routes/productosAPI');
const carritosApiRouter = require('./routes/carritosAPI');
const productosRouter = require('./routes/productos');
const indexRouter = require('./routes/index');
const errorRouter = require('./routes/error');


/* Base */
const app = express();
const server = http.createServer(app);
const io = new Server(server)
const port = process.env.PORT;

/* Express Config */
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

/* View Engine */
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

/* Routing */
app.use('/', indexRouter);
app.use('/productos', productosRouter);
app.use('/api/productos', productosApiRouter);
app.use('/api/carrito', carritosApiRouter);
app.use('/*', errorRouter);

/* Variables para socketIO*/
const messageDB = new Contenedor(optionsMessageDB);

/* Socket IO */
io.on("connection", async( socket) => {
    console.log("SocketIO Connected!");

    /* Inicializo mensajes */
    const messages = await messageDB.getAll('message');
    socket.emit("initial", messages);

    /* Actualizo mensajes con cada chat */
    socket.on("sendMessage", async(data) => {
        await messageDB.save('message', data);
        io.sockets.emit("shareMessages", await messageDB.getAll('message'));
    });

    socket.on("product", () => {
        io.sockets.emit("refreshProducts");
    })

});

/* Server Init */
server.listen(port, () => {
    console.log("Server escuchando en puerto", port)
});