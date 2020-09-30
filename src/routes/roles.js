const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/',async (req, res) => {
    const roles = await pool.query("SELECT * FROM roles WHERE estado ='activo' ORDER BY nombre ASC ");
    res.json(roles)
});

module.exports = router;