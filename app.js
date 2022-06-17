const express = require('express')
const productosRouter = require('./routes/productos');

const app = express()
const port = 8080;


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/api/productos', productosRouter);

app.listen(port, () => {
    console.log("Server escuchando en puerto", port)
});