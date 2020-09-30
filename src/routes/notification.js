const express = require('express')
const router = express.Router()
const pool = require('../database');

router.post('/create', async (req, res) => {  
    const { idclient,msg,dateregister } = req.body  
    const newNotification = {
        idnotification:null,
        idclient:idclient,
        msg:msg,
        dateregister:dateregister
    };
    await pool.query('INSERT INTO sig_notification set ?', [newNotification]);
    res.json({
         status: 'Notificación registrada'
    })
})

router.get('/', async (req, res) => {
    const msgs = await pool.query("SELECT * FROM sig_notification");
    res.json(msgs)
})

router.post('/search', async (req, res) => {
    const msg = await pool.query("SELECT * FROM sig_notification WHERE msg LIKE ?", '%' + req.body.name + '%' );
    if( msg )
    {
      res.status(200).send({ msg , status : true })
    }
    else
    {
      res.json({
        status: 'Notificación no encontrada'
      })
    }
})
module.exports = router;



























