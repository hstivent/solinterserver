const express = require('express');
const crypto = require('crypto')
const router = express.Router();
const pool = require('../database');
const token = require('./token');


function encrypt(password){
    const key = crypto.scryptSync('sigma7', 'salt', 24);
    const iv = Buffer.alloc(16, 0); 
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

router.post('/validar', async(req, res) => {
    const user = await pool.query(" SELECT iduser, user_id, user_name, user_address, user_phone, user_email, user_state, user_usertype FROM sig_users WHERE username = '" + req.body.username + "' AND password = '" + encrypt(req.body.password) + "' and user_state='activo' ");
    if (user[0]) {
        // Capturar campos a guardar
        var code = Math.floor((Math.random(user[0].user_id) * 200) + 13)
        var name = user[0].user_name
        var iduser = user[0].iduser
        var date = new Date()
        var status = 1
        var obj = { serie: code, user: name };
        var _Token = token.createToken(obj) // create token
        var userType = user[0].user_usertype
            // Guardar Inicio de sesion en DB
        const session = { id: null, session_name: name, session_iduser: iduser, session_code: code, session_typeUser: userType, session_token: _Token, dateTime: date, session_status: status };
        const rsQuery = await pool.query('INSERT INTO sig_session set ?', [session]);
            if(rsQuery){
                res.json({
                    sessionCode: code,
                    token: _Token,
                    status: true, // remplazo estado 200
                    userInfo: user[0],
                    userId: iduser,
                    typeUser: userType,
                    userName: name
                })
            }else{res.json({ status: false }) }
        // Cierre validacion rsQuery, (Solicitud Javier)    
    } else {
        res.json({
            status: false
        })
    }
});

router.post('/close', async(req, res) => {
    // Developer: Gerardo Vallejos
    let id = req.body.sessionId;
    if(id){
        await pool.query('DELETE FROM sig_session WHERE session_iduser = ?', id);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
});

router.post('/reload', async(req, res) => {
    // Developer: Gerardo Vallejos
    let code = req.body.sessionCode;
    let session = await pool.query('SELECT * FROM sig_session WHERE session_code = ?', code);
    if (session[0]) {
        res.json({
            status: true
        })
    } else {
        res.json({
            status: false
        })
    }
});

module.exports = router;