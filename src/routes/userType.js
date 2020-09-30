const express = require('express')
const router = express.Router()
//const md5 = require('md5');

const pool = require('../database');
router.post('/create', async (req, res) => {
    const { userTypeName } = req.body;
    const newUserType = {
        usertypename:userTypeName,
        usertype_state:'activo'
    };
    await pool.query('INSERT INTO sig_usertype set ?', [newUserType]);
    res.json({
         status: 'Tipo de Usuario registrada'
    })
})

router.get('/', async (req, res) => {
    const usertype = await pool.query("SELECT * FROM sig_usertype");
    res.json(usertype)
})

router.put('/:idtypeuser', async (req, res) => {
    const {userTypeName } = req.body;
    const updateUserType = {
        usertypename:userTypeName
    };
    await pool.query('UPDATE sig_usertype set ? WHERE idusertype = ?', [updateUserType, req.params.idtypeuser]);
    res.json({
        status: 'Tipo de Usuario actualizada'
    })
})

module.exports = router;