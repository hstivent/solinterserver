const express = require('express')
const router = express.Router()
    //const md5 = require('md5');
const pool = require('../database');

router.post('/create', async(req, res) => {
    // Gerardo Vallejos
    const { code, name, price, unit, category  } = req.body;
    const newMachinary = {
        idmachinary: null,
        code: code,
        name: name,
        price: price,
        unit: unit,
        idcategory: category,
        state: 'activo',
    };
    if(newMachinary){
        await pool.query('INSERT INTO sig_machinaries set ?', [newMachinary]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
})

router.get('/', async(req, res) => {
    const machinaries = await pool.query("SELECT idmaterial, code, name, unit, price, idcategory, category_name FROM `sig_materials` join `sig_category` on `id_category`=`idcategory` AND category_type =3");
    res.json(machinaries)    
})

router.get('/selected/:idvisit', async(req, res) => {

    const visits = await pool.query("SELECT * FROM sig_materials join sig_materialselected on id_material=idmaterial join sig_category on id_category=idcategory where cod_visit=? and category_type=3", [req.params.idvisit]);
    res.json({
        status: true,
        visits})
})

router.get('/:idCategory', async(req, res) => {
    const machinaries = await pool.query("SELECT * FROM sig_materials where idcategory=?", [req.params.idCategory]);
    res.json(machinaries)
})

router.put('/:id', async(req, res) => {   
    // Gerardo Vallejos
    const { idmachinary, code, name, price, unit, category  } = req.body;
    const updateMachinary = {
        code: code,
        name: name,
        price: price,
        unit: unit,
        idcategory: category,
        state: 'activo',
    }; 
    if(updateMachinary){
        await pool.query('UPDATE sig_machinaries set ? WHERE idmachinary = ?', [updateMachinary, idmachinary]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
//     const { name, price, id } = req.body
//     const updateMachinary = { name, price }
//     await pool.query('UPDATE sig_machinaries set ? WHERE idmachinary = ?', [updateMachinary, id]);
//     res.json({
//         status: true
//     })    
})


router.post('/search', async(req, res) => {
    const machinary = await pool.query("SELECT * FROM sig_machinaries WHERE name LIKE ?", '%' + req.body.name + '%');
    res.json(machinary)
})

router.delete('/:id', async(req, res) => {
    const { id } = req.params
    const updateMachinary = { state: 'inactivo' }    
    if(id){
        await pool.query('UPDATE sig_machinaries set ? WHERE idmachinary = ?', [updateMachinary, id]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
    // const { id } = req.params
    // const updateMachinary = { state: 'inactivo' }
    // await pool.query('UPDATE sig_machinaries set ? WHERE idmachinary = ?', [updateMachinary, id]);
    // res.json({
    //     status: true
    // })
})

module.exports = router;