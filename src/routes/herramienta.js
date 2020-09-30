const express = require('express')
const router = express.Router()
const pool = require('../database');

router.post('/create', async(req, res) => {
    const { code, name, unit, price, category  } = req.body;
    const newHerramienta = {
        idtool: null,
        code: code,
        name: name,
        unit: unit,
        price: price,
        category_idcategory: category,
        state: 'activo',
    };
    if(newHerramienta){
        await pool.query('INSERT INTO sig_tools set ?', [newHerramienta]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    } 

    // const { name } = req.body;
    // const newHerramienta = {
    //     id: null,
    //     nombre: name
    // };
    // await pool.query('INSERT INTO sig_tools set ?', [newHerramienta]);
    // res.json({
    //     status: 'Herramienta registrada'
    // })
})

router.get('/selected/:idvisit', async(req, res) => {
    // console.log("reqbodyid"+req.idvisit);
    // console.log("reqparamid"+req.params.idvisit);
    const visits = await pool.query("SELECT * FROM sig_materials join sig_materialselected on id_material=idmaterial join sig_category on id_category=idcategory where cod_visit=? and category_type=2", [req.params.idvisit]);
    console.log("Visits"+visits);
    
    res.json({
        status: true,
        visits})
})

router.post('/find', async (req, res) => {
    let find = req.body.letra;
    const tools = await pool.query('SELECT * from sig_tools where state ="activo" AND  name LIKE ?', '%'+find+'%');
    if(tools){
        res.json({
            tools,
            status: true
        })
    }else{
        res.json({
             status: false
        })
    }
})

router.get('/', async(req, res) => {
    const herramientas = await pool.query("SELECT idmaterial, `code`, name, unit, price, idcategory, category_name FROM `sig_materials` join `sig_category` on `id_category`=`idcategory` AND category_type =2");
    res.json(herramientas)
})

router.get('/:idCategory', async(req, res) => {
    const herramientas = await pool.query("SELECT * FROM sig_materials where idcategory=?", req.params.idCategory)
    res.json(herramientas)
})

router.put('/:id', async(req, res) => {
    // Gerardo Vallejos
    // const updateHerramienta = { name, price }
    const { id, code, unit, name, price, category  } = req.body;
    const updateHerramienta = {
        code: code,
        name: name,        
        unit: unit,
        price: price,
        category_idcategory: category,
        state: 'activo',
    };    
    if(updateHerramienta){
        await pool.query('UPDATE sig_tools set ? WHERE idtool = ?', [updateHerramienta, id]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
})

router.post('/search', async(req, res) => {
    const herramientas = await pool.query("SELECT * FROM sig_tools WHERE nombre LIKE ?", '%' + req.body.name + '%');
    res.json(herramientas)
})

router.delete('/:id', async(req, res) => {
    const { id } = req.params
    const updateHerramienta = { state: 'inactivo' }
    await pool.query('UPDATE sig_tools set ? WHERE idtool = ?', [updateHerramienta, id]);
    res.json({
        status: true
    })
})

module.exports = router;