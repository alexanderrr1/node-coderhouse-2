import "dotenv/config.js"
import express from 'express';
import { Server } from 'socket.io';
import { engine } from "express-handlebars";
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Contenedor from './Contenedor.js';

/* Routers */
import { router as productosApiRouter} from './routes/productosAPI.js';
import { router as carritosApiRouter} from './routes/carritosAPI.js';
import { router as productosRouter} from './routes/productos.js';
import { router as indexRouter} from './routes/index.js';
import { router as errorRouter} from './routes/error.js';

/* Base */
const app = express();
const server = http.createServer(app);
const io = new Server(server)
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
let mensajes = [];
const messages_db = './messages.txt';
const utf = 'utf-8';

(async() => {
    const contenedor = new Contenedor("messages");
    await contenedor.initialize();
})();

/* Socket IO */
io.on("connection", socket => {
    console.log("SocketIO Connected!");
    const messages = JSON.parse(fs.readFileSync(messages_db, utf));

    mensajes = messages;

    socket.emit("initial", messages);

    socket.on("sendMessage", (data) => {
        data.timestamp = (new Date).toLocaleString();
        mensajes.push(data);
        io.sockets.emit("shareMessages", mensajes);
        fs.writeFileSync(messages_db, JSON.stringify(mensajes), utf);
    });

    socket.on("product", () => {
        io.sockets.emit("refreshProducts");
    })

});

/* Server Init */
server.listen(port, () => {
    console.log("Server escuchando en puerto", port)
});