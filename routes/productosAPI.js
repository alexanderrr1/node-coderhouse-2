import "dotenv/config.js"
import express from 'express';
import ProductosDaoArchivo from "../src/daos/ProductosDaoArchivo.js";

export const router = express.Router();

const contenedor = new ProductosDaoArchivo();
const isAdmin = process.env.ADMIN === "true";

router.get('/', async(req, res) => {
    const productos = await contenedor.findAll();
    res.json({
        productos
    })
})

router.get('/:id', async(req, res) => {
    if(typeof await contenedor.findById(req.params.id) == 'string'){
        return res.json({
            error: 'producto no encontrado'
        })
    }
    const productos = await contenedor.findAll();
    const productoSeleccionado = productos.filter(producto => producto.id == req.params.id);
    return res.json( {
        producto: productoSeleccionado
    });
})

router.post('/', async(req, res) => {
    if(!isAdmin) {
        return res.json({
            error: -1,
            descripcion: 'Perfil no autorizado'
        })
    }
    const productoIngresado = req.body;
    const productoGuardado = await contenedor.save(productoIngresado);
    return res.json({
        producto: productoGuardado
    })
})

router.put('/:id', async(req, res) => {
    if(!isAdmin) {
        return res.json({
            error: -1,
            descripcion: 'Perfil no autorizado'
        })
    }
    if(typeof await contenedor.findById(req.params.id) == 'string'){
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
    if(!isAdmin) {
        return res.json({
            error: -1,
            descripcion: 'Perfil no autorizado'
        })
    }
    if(typeof await contenedor.findById(req.params.id) == 'string'){
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