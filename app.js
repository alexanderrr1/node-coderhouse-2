const express = require('express')
const { engine } = require("express-handlebars");
const productosApiRouter = require('./routes/productosAPI');
const productosRouter = require('./routes/productos');
const indexRouter = require('./routes/index');

const path = require('path');
const app = express()
const port = 8080;

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

/* Server Init */
app.listen(port, () => {
    console.log("Server escuchando en puerto", port)
});