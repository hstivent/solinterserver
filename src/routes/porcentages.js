const express = require('express');
const router = express.Router();


const pool = require('../database');
router.post('/create', async (req, res) => {
   
})

router.get('/',async (req, res) => {
    const porcentage = await pool.query("SELECT * FROM sig_porcentage ");
    res.json(porcentage)
});

router.put('/:idcategory', async (req, res) => {
   
})



module.exports = router;