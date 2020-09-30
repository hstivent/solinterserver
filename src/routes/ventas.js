const express = require('express');
const router = express.Router();

const pool = require('../database');
router.get('/',async (req, res) => {
    const ventas = await pool.query("SELECT p.nombre, v.precio, v.cantidad, v.total, concat(u.nombrecompleto,' ',u.identificacion) usuario, t.nombre ptv, v.fregistro  FROM venta v JOIN producto p ON p.idproducto =  v.idproducto JOIN usuario u ON u.identificacion = v.usuario JOIN puntoventa t ON t.id = v.idpuntoventa WHERE v.fregistro = CURDATE() AND v.estado = 'facturado'");
    res.json(ventas)
});


router.get('/facturado/:id',async (req, res) => {
     const { id } = req.params;
     const ventas = await pool.query("SELECT p.nombre, v.precio, v.cantidad, v.total, concat(u.nombrecompleto,' ',u.identificacion) usuario, t.nombre ptv, v.fregistro  FROM venta v JOIN producto p ON p.idproducto =  v.idproducto JOIN usuario u ON u.identificacion = v.usuario JOIN puntoventa t ON t.id = v.idpuntoventa WHERE v.fregistro = CURDATE() AND v.estado = 'facturado' AND t.id = ?",[id]);
     res.json(ventas)
});

router.get('/total', async (req, res) => {
    const total = await pool.query("SELECT sum(v.total) total FROM venta v JOIN producto p ON p.idproducto = v.idproducto JOIN usuario u ON u.identificacion = v.usuario JOIN puntoventa t ON t.id = v.idpuntoventa WHERE v.fregistro = CURDATE()")
    console.log("total ",total)
    if( total )
    {
      res.status(200).send( total )
    }
    else
    {
      res.json({
        status: 'Error al sumar total'
      })
    }
})

router.get('/totalpunto/:id', async (req, res) => {
    const { id } = req.params;
    const total = await pool.query('SELECT sum(v.total) total FROM venta v JOIN producto p ON p.idproducto =  v.idproducto JOIN usuario u ON u.identificacion = v.usuario JOIN puntoventa t ON t.id = v.idpuntoventa WHERE v.fregistro = CURDATE() AND t.id = ?',[id])
    if( total )
    {
      res.status(200).send( total )
    }
    else
    {
      res.json({
        status: 'Error al sumar total'
      })
    }
})

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