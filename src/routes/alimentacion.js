const express = require('express')
const router = express.Router()
const pool = require('../database');

router.post('/create', async (req, res) => {  
    const { nombre,precio } = req.body  
    const neAlimentacion = {
        id:null,
        nombre:nombre,
        precio:precio,
        dateregister:dateregister
    };
    await pool.query('INSERT INTO sig_aliementacion set ?', [neAlimentacion]);
    res.json({
         status: 'Alimentacion registrada'
    })
})

router.get('/', async (req, res) => {
    const alimentacion = await pool.query("SELECT * FROM sig_aliementacion");
    res.json(alimentacion)
})

module.exports = router;
