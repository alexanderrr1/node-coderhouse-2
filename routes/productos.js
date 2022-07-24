import express from 'express';
import ProductosDaoArchivo from "../src/daos/ProductosDaoArchivo.js";

export const router = express.Router();

const contenedor = new ProductosDaoArchivo();

router.get('/', async(req, res) => {
    const productosList = await contenedor.findAll();
    res.render('productoList',{
        productosList
    })
})

router.get('/form', async(req, res) => {
    res.render('productoForm');
})

router.post('/', async(req, res) => {
    await contenedor.save(req.body);
    res.render('productoForm');
})