const express = require('express')
const router = express.Router()
const pool = require('../database') 
router.get('/', async (req, res) => {
    const schedulevisits = await pool.query("SELECT * FROM sig_clients join sig_schedulevisits on idclient=client_clientid join sig_users on iduser=user_userid where user_userid=1 group by client_name");
    res.json(schedulevisits)
})
router.post('/orders', async (req, res) => {
    console.log(req.body);
    
    /* const schedulevisits = await pool.query("SELECT * FROM sig_clients join sig_schedulevisits on idclient=client_clientid join sig_users on iduser=user_userid where client_name='"+req.body.client_name+"' and user_userid=1");
 res.json(schedulevisits) */
})
module.exports = router;