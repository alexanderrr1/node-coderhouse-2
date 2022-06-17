const express = require('express');
const Contenedor = require('../Contenedor');
const router = express.Router();

const contenedor = new Contenedor('productos');

router.get('/', async(req, res) => {
    const productos = await contenedor.getAll();
    res.json({
        productos
    })
})

router.get('/:id', async(req, res) => {
    if(typeof await contenedor.getById(req.params.id) == 'string'){
        return res.json({
            error: 'producto no encontrado'
        })
    }
    const productos = await contenedor.getAll();
    const productoSeleccionado = productos.filter(producto => producto.id == req.params.id);
    return res.json( {
        producto: productoSeleccionado
    });
})

router.post('/', async(req, res) => {
    const productoIngresado = req.body;
    const productoGuardado = await contenedor.save(productoIngresado);
    res.json({
        producto: productoGuardado
    })
})

router.put('/:id', async(req, res) => {
    if(typeof await contenedor.getById(req.params.id) == 'string'){
        return res.json({
            error: 'producto no encontrado'
        })
    }
    const productoModificado = req.body;
    const productoAModificarId = req.params.id;
    const productoGuardado = await contenedor.updateById(productoModificado, productoAModificarId);
    res.json({
        producto: productoGuardado
    })
})

router.delete('/:id', async(req, res) => {
    if(typeof await contenedor.getById(req.params.id) == 'string'){
        return res.json({
            error: 'producto no encontrado'
        })
    }
    const productoAEliminarId = req.params.id;
    await contenedor.deleteById(productoAEliminarId);
    res.json({
        msg: "Producto Eliminado"
    })
})

module.exports = router;