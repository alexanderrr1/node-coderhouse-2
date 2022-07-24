import "dotenv/config.js"
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

/* Routers */
import { router as productosApiRouter} from './routes/productosAPI.js';
import { router as carritosApiRouter} from './routes/carritosAPI.js';
import { router as errorRouter} from './routes/error.js';

/* Base */
const app = express();
const server = http.createServer(app);
const port = process.env.PORT;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Express Config */
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

/* Routing */
app.use('/api/productos', productosApiRouter);
app.use('/api/carrito', carritosApiRouter);
app.use('/*', errorRouter);

/* Server Init */
server.listen(port, () => {
    console.log("Server escuchando en puerto", port)
});