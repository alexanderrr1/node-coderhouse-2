import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import CarritosDaoArchivo from "../src/daos/carritos/CarritosDaoArchivo.js";
import ProductosDaoArchivo from "../src/daos/productos/ProductosDaoArchivo.js";

export const router = express.Router();

const productosDao = new ProductosDaoArchivo();
const carritosDao = new CarritosDaoArchivo();

/* Crear Carrito */
router.post('/', async(req, res) => {
    const carrito = {
        id: uuidv4(),
        timestamp: Date.now(),
        productos: [],
    };
    await carritosDao.save(carrito);
    res.status(201).json({
        msg: `Se ha creado el carrito ${carrito.id} con éxito`
    });
});

/* Eliminar Carrito por ID */
router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    const carritoParaEliminar = await carritosDao.findById(id);
    if(carritoParaEliminar == undefined){
        return res.status(404).json({
            msg: `No existe carrito con id ${id}.`
        })
    }
    await carritosDao.deleteById(id);
    return res.json({
        msg: 'Carrito eliminado con éxito.'
    });
});

/* Obtener Productos de Carrito */
router.get('/:id/productos', async(req, res) => {
    const { id } = req.params;
    //Traer el carrito a mostrar los productos
    const carritoMostrarProductos = await carritosDao.findById(id);
    if(carritoMostrarProductos == undefined){
        return res.status(404).json({
            msg: `No existe carrito con id ${id}.`
        })
    }
    const productos = carritoMostrarProductos.productos;
    res.json({
        productos
    })
})

/* Agregar Producto al Carrito */
router.post('/:id_carrito/productos/:id_producto', async(req, res) => {
    const { id_carrito, id_producto } = req.params;
    //Traer el carrito a modificar
    const carritoParaModificar = await carritosDao.findById(id_carrito);
    if(carritoParaModificar == undefined){
        return res.status(404).json({
            msg: `No existe carrito con id ${id_carrito}.`
        })
    }
    // Traer el producto a guardar
    const productoParaAgregarAlCarrito = await productosDao.findById(id_producto);
    if(productoParaAgregarAlCarrito == undefined){
        return res.status(404).json({
            msg: `No existe producto con id ${id_producto}.`
        });
    }

    // Agrego el Producto
    carritoParaModificar.productos.push(productoParaAgregarAlCarrito);

    // Guardo el carrito en la DB
    const carritoModificado = await carritosDao.updateById(carritoParaModificar, id_carrito);
    res.status(200).json({
        carritoModificado
    })
});

/* Borrar Producto de Carrito */
router.delete('/:id_carrito/productos/:id_producto', async(req, res) => {
    const { id_carrito, id_producto } = req.params;
    // Traer el carrito elegido
    const carritoParaEliminarProducto = await carritosDao.findById(id_carrito);
    if(carritoParaEliminarProducto == undefined){
        return res.status(404).json({
            msg: `No existe carrito con id ${id_carrito}.`
        })
    }
    // Separo los productos.
    let productosDelCarrito = carritoParaEliminarProducto.productos;
    // Validacion para verificar el que producto exista dentro del carrito
    if(!existeProductoEnElCarrito(productosDelCarrito, id_producto)){
        return res.status(404).json({
            msg: `No existe el producto con id ${id_producto} en el carrito ${id_carrito}`
        })
    };
    // Asigno los nuevos productos (No eliminados) al carrito.
    productosDelCarrito = productosDelCarrito.filter(producto => producto.id != id_producto);
    carritoParaEliminarProducto.productos = productosDelCarrito;

    // Guardo el carrito en la DB
    await carritosDao.updateById(carritoParaEliminarProducto, id_carrito);
    return res.status(200).json({
        carritoParaEliminarProducto
    })
})

const existeProductoEnElCarrito = (productosDelCarrito, productoId) => {
    const finded = productosDelCarrito.find(producto => producto.id == productoId);
    return finded == undefined ? false : true;
}