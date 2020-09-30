const express = require('express')
const router = express.Router()
    //const md5 = require('md5');
const pool = require('../database');

router.post('/create', async(req, res) => {
    const { code, name, unit, price, category  } = req.body;
    const newMaterial = {
        idmaterial: null,
        code: code,
        name: name,
        unit: unit,
        price: price,
        idcategory: category,
        state: 'activo',
    };
    if(newMaterial){
        await pool.query('INSERT INTO sig_materials set ?', [newMaterial]);
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
    const materials = await pool.query("SELECT idmaterial, `code`, name, unit, price, idcategory, category_name FROM `sig_materials` join `sig_category` on `id_category`=`idcategory` AND category_type =1");
    res.json(materials)
})

router.post('/find', async (req, res) => {
    let find = req.body.letra;
    const visits = await pool.query('SELECT * from sig_materials where state ="activo" AND  name LIKE ?', '%'+find+'%');
    if(visits){
        res.json({
            visits,
            status: true
        })
    }else{
        res.json({
             status: false
        })
    }
})

router.get('/:idCategory', async(req, res) => {
    const materials = await pool.query("SELECT * FROM sig_materials where idcategory=?", [req.params.idCategory]);
    res.json(materials)
})
router.get('/selected/:idvisit', async(req, res) => {
    const { idvisit } = req.params;
    const { id_section } = req.query;
    const visits = await pool.query("SELECT * FROM sig_materials join sig_materialselected on id_material=idmaterial join sig_category on id_category=idcategory where cod_visit=? and cod_section=? and category_type=1", [idvisit, id_section]);
    res.json({
        status: true,
        visits})
})

router.get('/porcentage', async(req, res) => {

        const porcentages = await pool.query("SELECT * FROM sig_porcentage");

        console.log(res.json(porcentages))
    })
    /*
        router.get('/:id', async (req, res) => {
        const { id } = req.params
        console.log(id);
        console.log( req.params )
        //const materials = await pool.query("SELECT * FROM sig_materials where id_category=?", [ id ])
        //res.json(materials)
    })
    /*
    router.delete('/:id', async (req, res) => {
        const { id } = req.params
        await pool.query('DELETE FROM sig_tipo_contrato WHERE id = ?', [id]);
        res.json({
            status: 'Tipo Contrato eliminado'
        })
      })*/

router.put('/:idmaterial', async(req, res) => {
    const { idmaterial, code, name, unit, price, category  } = req.body;
    const updateMaterial = {
        code: code,
        name: name,
        unit: unit,
        price: price,
        idcategory: category,
        state: 'activo',
    };    
    if(updateMaterial){
        await pool.query('UPDATE sig_materials set ? WHERE idmaterial = ?', [updateMaterial, idmaterial]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
})

router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    
    const updateMaterial = {
        state:'inactivo'
    };
    if(id){
        await pool.query('UPDATE sig_materials set ? WHERE idmaterial = ?', [updateMaterial, id]);
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
    const materials = await pool.query("SELECT * FROM sig_materials WHERE name LIKE ?", '%' + req.body.name + '%');
    if (materials) {
        res.status(200).send({ materials, status: true })
    } else {
        res.json({
            status: true
        })
    }
})

module.exports = router;