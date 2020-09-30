const express = require('express')
const sha1 = require('js-sha1')
const router = express.Router()
const pool = require('../database');

router.post('/create', async (req, res) => {  
    const { lugar,precio } = req.body;  
    const newTransporte = {
        id:null,
        lugar:lugar,
        precio:precio
    };
    await pool.query('INSERT INTO sig_transporte set ?', [newTransporte]);
    res.json({
         status: 'Herramienta registrada'
    })
})


router.get('/', async (req, res) => {
    const transportes = await pool.query("SELECT * FROM sig_transporte")
    res.json(transportes)
})

router.put('/:idtransporte', async (req, res) => {
    const { lugar,precio } = req.body 
    const newTransporte = {
        lugar:lugar,
        precio:precio
    };
    await pool.query('UPDATE sig_transporte set ? WHERE id = ?', [newTransporte, id ]);
    res.json({
        status: 'Transporte actualizado'
    })
})

module.exports = router;



























