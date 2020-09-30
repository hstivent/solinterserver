const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.post('/create', async (req, res) => {
    const { idproducto, name, price, category } = req.body;
    const newLink = {
        idproducto:idproducto,
        codigo:'',
        nombre:name,
        color:'',
        talla:'',
        costo:0,
        precioventa:0,
        descuento:0,
        precio:price,
        cantidad:0,
        stock:0,
        estado:'activo',
        usuario:'admin',
        fregistro: new Date(),
        imagen:null,
        tipo:category
    };
    await pool.query('INSERT INTO producto set ?', [newLink]);
    res.json({
         status: 'Producto registered'
    })
})

router.get('/',async (req, res) => {
    const product = await pool.query("SELECT * FROM producto WHERE estado='activo' ORDER BY nombre ASC ");
    res.json(product)
});

router.post('/search', async (req, res) => {
    const product = await pool.query('SELECT * FROM producto WHERE nombre like ?', '%' + req.body.name + '%')
    if( product )
    {
      res.status(200).send({ product , status : true })
    }
    else
    {
      res.json({
        status: 'Producto no encontrado'
      })
    }
})

router.get('/',async (req, res) => {
    const product = await pool.query('SELECT * FROM producto WHERE idproducto = ?', [req.id]);
    res.json(product)
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    console.log("id ",id)
    const newProduct = {
        estado:'inactivo'
    };
    await pool.query('UPDATE producto set ? WHERE idproducto = ?', [newProduct, id]);
    res.json({
        status: 'Product delete'
    })
});

router.put('/:id', async (req, res) => {
    const { name, price, category } = req.body; 
    const newProduct = {
        nombre:name,
        precio:price,
        tipo:category
    };
    await pool.query('UPDATE producto set ? WHERE idproducto = ?', [newProduct, req.body.idproducto]);
    res.json({
        status: 'Product updated'
    })
});



module.exports = router;