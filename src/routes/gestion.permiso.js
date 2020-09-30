const express = require('express')
const router = express.Router()
const pool = require('../database');

router.post('/create', async (req, res) => {  
    const { idencargado,idcliente,archivo,dateregister } = req.body  
    const newPermision = {
        idpermiso:null,
        idencargado:idencargado,
        idcliente:idcliente,
        archivo:archivo,
        dateregister:dateregister
    };
    await pool.query('INSERT INTO sig_gestion_permisos set ?', [newPermision]);
    res.json({
        status: 'Permiso registrado registrada'
    })
})

router.get('/', async (req, res) => {
    const msgs = await pool.query("SELECT * FROM sig_gestion_permisos");
    res.json(msgs)
})

router.post('/search', async (req, res) => {
    const msg = await pool.query("SELECT * FROM sig_gestion_permisos WHERE idcliente LIKE ?", '%' + req.body.name + '%' );
    if( msg )
    {
      res.status(200).send({ msg , status : true })
    }
    else
    {
      res.json({
        status: 'Permiso no encontrada'
      })
    }
})
module.exports = router;



























