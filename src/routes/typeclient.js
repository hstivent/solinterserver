const express = require('express')
const router = express.Router()
//const md5 = require('md5');

const pool = require('../database');
router.post('/create', async (req, res) => {
    const { userTypeClient } = req.body;
    const newClientType = {
        clientypename:userTypeClient,
        clientype_state:'activo'
    };
    await pool.query('INSERT INTO sig_clienttype set ?', [newClientType]);
    res.json({
         status: 'Tipo de Usuario registrado'
    })
})
router.get('/', async (req, res) => {
    const typeclients = await pool.query("SELECT * FROM sig_clienttype");
    res.json(typeclients)
})

router.put('/:idtypeclient', async (req, res) => {
    const { typeclientName } = req.body;
    const updateTypeClient = {
        clientypename:typeclientName
    };
    await pool.query('UPDATE sig_clienttype set ? WHERE idtypeclient = ?', [updateTypeClient, req.params.idtypeclient]);
    res.json({
        status: 'Typo de Usuario actualizado'
    })
})
module.exports = router;