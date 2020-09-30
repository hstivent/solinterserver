const express = require('express');
const router = express.Router();
const pool = require('../database');

router.get('/',async (req, res) => {
    const categories = await pool.query("SELECT * FROM sig_category WHERE category_state='activo' ORDER BY category_name ASC");
    res.json(categories)
});

router.get('/type/:type',async (req, res) => {
    const categories = await pool.query("SELECT * FROM sig_category WHERE category_state='activo' and category_type='"+req.params.type+"' ORDER BY category_name ASC");
    res.json(categories)
});


module.exports = router;