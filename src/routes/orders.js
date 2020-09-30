const express = require('express')
const router = express.Router()
    //const md5 = require('md5');

const pool = require('../database');

router.get('/', async(req, res) => {
    const orders = await pool.query("SELECT * FROM sig_registervisit ");
    res.json(orders)

})
router.post('/search', async(req, res) => {
    const clients = await pool.query("SELECT * FROM sig_registervisit WHERE client_name client_status = 1 AND LIKE ?", '%' + req.body.name + '%');
    if (clients) {
        res.status(200).send({ clients, status: true })
    } else {
        res.json({
            status: 'cliente no encontrado'
        })
    }
})
router.post('/create', async(req, res) => {
    const { loadImage, loadBosq, visitDescription } = req.body
    const newVisitRegister = {
        visit_desc: visitDescription,
        visit_picture_mokup: loadBosq
    };
    const otra = await pool.query('INSERT INTO sig_registervisit set ?', [newVisitRegister])
    for (let i = 0; i < loadImage.length; i++) {
        const newphoto = {
            photo: loadImage[i],
            id_registervisit: otra.insertId
        };
        await pool.query('INSERT INTO sig_photos set ?', [newphoto])
    }
    res.json({
        status: true
    })
})
router.post('/materialS', async(req, res) => {
    const { id, loadMaterials, id_section } = req.body
    for (let i = 0; i < loadMaterials.length; i++) {
        const newMaterialSelected = {
            cod_visit: id,
            cod_section: id_section,
            count: 1,
            precio: 0,
            porcentage: 0,
            id_material: loadMaterials[i],  
        }
        await pool.query('INSERT INTO sig_materialselected set ?', [newMaterialSelected])   
    }
    res.json({
        status: true
    })
})
router.post('/workforceS', async(req, res) => {
    const { id, loadWorkforces, id_section } = req.body
    for (let i = 0; i < loadWorkforces.length; i++) {
        const newWorkforceSelected = {
            cod_visit: id,
            cod_section: id_section,
            count: 1,
            precio: 0,
            porcentage: 0,
            id_material: loadWorkforces[i],  
        }
        await pool.query('INSERT INTO sig_materialselected set ?', [newWorkforceSelected])   
    }
    res.json({
        status: true
    })
})
router.post('/toolS', async(req, res) => {
    const { id, loadTools, id_section } = req.body
    for (let i = 0; i < loadTools.length; i++) {
        const newToolSelected = {
            cod_visit: id,
            cod_section: id_section,
            count: 1,
            precio: 0,
            porcentage: 0,
            id_material: loadTools[i],  
        }
        await pool.query('INSERT INTO sig_materialselected set ?', [newToolSelected])   
    }
    res.json({
        status: true
    })
})
router.post('/machinaryS', async(req, res) => {
    const { id, loadMachinarys, id_section } = req.body
    for (let i = 0; i < loadMachinarys.length; i++) {
        const newMachinarySelected = {
            cod_visit: id,
            cod_section: id_section,
            count: 1,
            precio: 0,
            porcentage: 0,
            id_material: loadMachinarys[i],  
        }
        await pool.query('INSERT INTO sig_materialselected set ?', [newMachinarySelected])   
    }
    res.json({
        status: true
    })
})
router.put('/:idclient', async(req, res) => {
    const { id, nit, name, address, phone, email, contact, typeclient, clientimage, imagetype } = req.body
    const updateClient = {
        client_nit: nit,
        client_name: name,
        client_address: address,
        client_phone: phone,
        client_email: email,
        client_contact: contact,
        client_image: clientimage,
        clientype_clientypeid: typeclient,
        client_status: 1,
        imagetype: imagetype
    }

    await pool.query('UPDATE sig_clients set ? WHERE idclient = ?', [updateClient, id])
    res.json({
        status: 'Cliente actualizado'
    })
})
router.put('/materialP/:cod_visit', async(req, res) => {
    const { porcentage, tools, cod_visit } = req.body
    for (let i = 0; i < tools.length; i++) {
        const e = tools[i];
        const precio = (e.price + ((e.price * porcentage)/100))* e.count
        const updatetoolselected = {precio, porcentage}
        await pool.query('UPDATE sig_toolselected set ? WHERE cod_visit = ? and id_tool = ?', [updatetoolselected, e.cod_visit, e.id_tool])
    }
    res.json({status: true})   
})
router.put('/machinaryP/:cod_visit', async(req, res) => {
    const { porcentage, tools, cod_visit } = req.body
    for (let i = 0; i < tools.length; i++) {
        const e = tools[i];
        const precio = (e.price + ((e.price * porcentage)/100))* e.count
        const updatetoolselected = {precio, porcentage}
        await pool.query('UPDATE sig_toolselected set ? WHERE cod_visit = ? and id_tool = ?', [updatetoolselected, e.cod_visit, e.id_tool])
    }
    res.json({status: true})   
})
router.put('/workforceP/:cod_visit', async(req, res) => {
    const { porcentage, tools, cod_visit } = req.body
    for (let i = 0; i < tools.length; i++) {
        const e = tools[i];
        const precio = (e.price + ((e.price * porcentage)/100))* e.count
        const updatetoolselected = {precio, porcentage}
        await pool.query('UPDATE sig_toolselected set ? WHERE cod_visit = ? and id_tool = ?', [updatetoolselected, e.cod_visit, e.id_tool])
    }
    res.json({status: true})   
})
router.put('/selectedput/:cod_visit', async(req, res) => {
    const { porcentage, materials, code_visit, id_section } = req.body
    for (let i = 0; i < materials.length; i++) {
        const e = materials[i];
        await pool.query('UPDATE sig_materialselected set porcentage=? WHERE cod_visit = ? and id_material = ? and cod_section = ?', [porcentage, code_visit, e.id_material, id_section])
    }
    res.json({status: true})
})
router.put('/materialS/:cod_visit', async(req, res) => {
    let cnt = 1;
    const { count, id_material, cod_visit, id_section } = req.body
    const precio = await pool.query('select price from sig_materials where idmaterial = ?', [id_material])
    const pc = precio[0].price;
    if (count > 0) cnt = count;
        await pool.query('UPDATE sig_materialselected set count=?, precio=? WHERE cod_visit =? and cod_section=? and id_material =?', [cnt, pc, cod_visit, id_section, id_material])
    res.status(200).json({status: true})
})
router.put('/workForceS/:cod_visit', async(req, res) => {
    const { count, id_Workf, cod_visit, id_section } = req.body
    const precio = await pool.query('select price from sig_materials where idmaterial = ?', [id_Workf])
    const pc = precio[0].price;
    if (count > 0) cnt = count;
    await pool.query('UPDATE sig_materialselected set count=?, precio=? WHERE cod_visit =? and cod_section=? and id_material =?', [cnt, pc, cod_visit, id_section, id_Workf])
    res.status(200).json({status: true})
})
router.put('/toolS/:cod_visit', async(req, res) => {
    const { count, id_tool, cod_visit, id_section } = req.body
    const precio = await pool.query('select price from sig_materials where idmaterial = ?', [id_tool])
    const pc = precio[0].price;
    if (count > 0) cnt = count;
    await pool.query('UPDATE sig_materialselected set count=?, precio=? WHERE cod_visit =? and cod_section=? and id_material =?', [cnt, pc, cod_visit, id_section, id_tool])
    res.status(200).json({status: true})
})
router.put('/machinaryS/:cod_visit', async(req, res) => {
    const { count, id_machinary, cod_visit, id_section } = req.body
    const precio = await pool.query('select price from sig_materials where idmaterial = ?', [id_machinary])
    const pc = precio[0].price;
    if (count > 0) cnt = count;
    await pool.query('UPDATE sig_materialselected set count=?, precio=? WHERE cod_visit =? and cod_section=? and id_material =?', [cnt, pc, cod_visit, id_section, id_machinary])
    res.status(200).json({status: true})
})
router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    const UdatepClient = {
        client_status: 0
    };
    await pool.query('UPDATE sig_clients set ? WHERE idclient = ?', [UdatepClient, id])
    res.json({
        status: 'Product delete'
    })
});

module.exports = router