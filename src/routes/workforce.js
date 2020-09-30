const express = require('express')
const sha1 = require('js-sha1')
const router = express.Router()
const pool = require('../database');

router.post('/create', async(req, res) => {
    // Gerardo Vallejos
    const { code, name, price, unit,category  } = req.body;
    const newWorkforce = {
        idworkf: null,
        code: code,
        name: name,
        price: price,
        unit: unit,
        idcategory: category,
        state: 'activo',
    };
    if(newWorkforce){
        await pool.query('INSERT INTO sig_workforce set ?', [newWorkforce]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
})

router.post('/find', async (req, res) => {
    let find = req.body.letra;
    const workforces = await pool.query('SELECT * from sig_workforce where state ="activo" AND  name LIKE ?', '%'+find+'%');
    if(workforces){
        res.json({
            workforces,
            status: true
        })
    }else{
        res.json({
             status: false
        })
    }
})

router.get('/', async(req, res) => {
    const workf = await pool.query("SELECT idmaterial, code, name, unit, price, idcategory, category_name FROM `sig_materials` join `sig_category` on `id_category`=`idcategory` AND category_type =4");
    res.json(workf)
})

router.get('/:idCategory', async(req, res) => {
    const workforce = await pool.query("SELECT * FROM sig_materials where idcategory=?", [req.params.idCategory]);
    res.json(workforce)
})

router.put('/:id', async(req, res) => {
    //  Gerardo Vallejos
    const { idworkf, code, name, price, unit, category  } = req.body;
    const updateWorkforce = {
        code: code,
        name: name,
        price: price,
        unit: unit,
        idcategory: category,
        state: 'activo',
    };    
    if(updateWorkforce){
        await pool.query('UPDATE sig_workforce set ? WHERE idworkf = ?', [updateWorkforce, idworkf]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }    
    // const { name, price } = req.body
    // const update = { name, price }
    // await pool.query('UPDATE sig_workforce set ? WHERE idworkf = ?', [update, req.params.id]);
    // res.json({
    //     status: true
    // })
})

router.get('/selected/:idvisit', async(req, res) => {

    const visits = await pool.query("SELECT * FROM sig_materials join sig_materialselected on id_material=idmaterial join sig_category on id_category=idcategory where cod_visit=? and category_type=4", [req.params.idvisit]);
    res.json({
        status: true,
        visits})
})

router.post('/search', async(req, res) => {
    const workforce = await pool.query("SELECT * FROM sig_workforce WHERE name LIKE ?", '%' + req.body.name + '%');
    res.json(workforce)
})

router.delete('/:id', async(req, res) => {
    // Gerardo Vallejos
    const { id } = req.params;    
    const updateWorkforce = {
        state:'inactivo'
    };
    if(id){
        await pool.query('UPDATE sig_workforce set ? WHERE idworkf = ?', [updateWorkforce, id]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
    // const { id } = req.params
    // const update = { state: 'inactivo' }
    // await pool.query('UPDATE sig_workforce set ? WHERE idworkf = ?', [update, id]);
    // res.json({
    //     status: true
    // })
})

module.exports = router;