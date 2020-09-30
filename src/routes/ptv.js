const express = require('express');
const router = express.Router();

const pool = require('../database');
router.post('/create', async (req, res) => {
    const { id, name, direccion, telefono, correo, nit, domicilios, propietario } = req.body;
    const newPtv = {
        id:id,
        nombre:name,
        direccion:direccion,
        telefono:telefono,
        ip:'',
        estado:'activo',
        correo:correo,
        nit:nit,
        domicilios:domicilios,
        propietario:propietario
    };
    await pool.query('INSERT INTO puntoventa set ?', [newPtv]);
    res.json({
         status: 'Punto de venta registrado'
    })
})

router.get('/',async (req, res) => {
    const puntoventa = await pool.query("SELECT * FROM puntoventa WHERE estado ='activo' ORDER BY nombre ASC ");
    res.json(puntoventa)
});

router.post('/search', async (req, res) => {
    const puntoventa = await pool.query('SELECT * FROM puntoventa WHERE nombre like ?', '%' + req.body.name + '%')
    if( puntoventa )
    {
      res.status(200).send({ puntoventa , status : true })
    }
    else
    {
      res.json({
        status: 'Punto de venta no encontrado'
      })
    }
})

router.get('/',async (req, res) => {
    const puntoventa = await pool.query('SELECT * FROM puntoventa WHERE idproducto = ?', [req.id]);
    res.json(puntoventa)
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const newProduct = {
        estado:'inactivo'
    };
    await pool.query('UPDATE puntoventa set ? WHERE id = ?', [newProduct, id]);
    res.json({
        status: 'Punto de venta eliminado'
    })
});

router.put('/:id', async (req, res) => {
    const { name, direccion, celular, correo, nit, domicilios, propietario } = req.body;
    const newPtv = {
        nombre:name,
        direccion:direccion,
        telefono:celular,
        ip:'',
        estado:'activo',
        correo:correo,
        nit:nit,
        domicilios:domicilios,
        propietario:propietario
    };
    await pool.query('UPDATE puntoventa set ? WHERE id = ?', [newPtv, req.body.id]);
    res.json({
        status: 'Product updated'
    })
});

module.exports = router;