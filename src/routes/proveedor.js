const express = require('express')
const sha1 = require('js-sha1')
const router = express.Router()
const pool = require('../database');

router.post('/create', async (req, res) => {  
   const { nombre,direccion,correo,telefono } = req.body;  
    const newProveedor = {
        id:null,
        nombre:nombre,
        direccion:direccion,
        correo:correo,
        telefono:telefono
    };
    await pool.query('INSERT INTO sig_proveedor set ?', [newProveedor]);
    res.json({
         status: 'Proveedor registrado'
    })
})


router.get('/', async (req, res) => {
    const users = await pool.query("SELECT * FROM sig_proveedor")
    res.json(users)
})


router.put('/:idproveedor', async (req, res) => {
   const 
   {  nombre,direccion,correo,telefono } = req.body;
    const updateProveedor = {
        id:null,
        nombre:nombre,
        direccion:direccion,
        correo:correo,
        telefono:telefono
    };
    await pool.query('UPDATE sig_proveedor set ? WHERE id = ?', [updateProveedor, idProveedor ]);
    res.json({
        status: 'Proveddor actualizado'
    })
})
router.post('/search', async (req, res) => {
    const users = await pool.query("SELECT * FROM sig_proveedor WHERE nombre LIKE ?", '%' + req.body.name + '%' );
    if( users )
    {
      res.status(200).send({ users , status : true })
    }
    else
    {
      res.json({
        status: 'Proveedor no encontrado'
      })
    }
})
module.exports = router;



























