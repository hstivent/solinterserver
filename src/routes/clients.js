const express = require('express')
const router = express.Router()
const pool = require('../database');

router.get('/', async (req, res) => {
    const clients = await pool.query("SELECT * FROM sig_clients join sig_clienttype on clientype_clientypeid=idtypeclient WHERE client_status ='activo' ");
    res.json(clients)
})

router.get('/:id', async (req, res) => {
    const clients = await pool.query("SELECT * FROM sig_clients WHERE client_status = 'activo' and idclient='"+req.params.id+"'");
    res.json(clients)

})
    
router.post('/search', async (req, res) => {
    const clients = await pool.query("SELECT * FROM sig_clients WHERE client_name client_status = 1 AND LIKE ?", '%' + req.body.name + '%' );
    if( clients )
    {
      res.status(200).send({ clients , status : true })
    }
    else
    {
      res.json({
        status: 'cliente no encontrado'
      })
    }
})

router.post('/find', async (req, res) => {
    let find = req.body.letra;
    const clients = await pool.query("SELECT * FROM sig_clients WHERE client_status=1 AND  client_name LIKE ?", '%'+find+'%' );
    if(clients){
        res.json({
            clients,
            status: true
        })
    }else{
        res.json({
             status: false
        })
    }
})

router.post('/create', async (req, res) => { 
    //  Developer: Gerardo vallejos
    const { nit,name,address,phone,email,contact,typeclient } = req.body
    const newClient = {
        client_nit: nit,
        client_name:name,
        client_address:address,
        client_phone:phone,
        client_email:email,
        client_contact:contact,
        clientype_clientypeid:typeclient,
        client_status : 1,
    };
    if(newClient){
        await pool.query('INSERT INTO sig_clients set ?', [newClient])
        res.json({
             status: true
        })
        }else{
            res.json({
                 status: false
            })
    }
})

router.put('/:idclient', async (req, res) => {
    //  Developer: Gerardo vallejos
    const { id,nit,name,address,phone,email,contact,typeclient, imageclient, imagetype} = req.body
    const updateClient = {
        client_nit: nit,
        client_name:name,
        client_address:address,
        client_phone:phone,
        client_email:email,
        client_contact:contact,
        client_image:imageclient,
        client_status:1,
        imagetype:imagetype
    }
    if(updateClient){
        await pool.query('UPDATE sig_clients set ? WHERE idclient = ?', [updateClient, id ])
        res.json({
            status: true
        })
    }else{
        res.json({
             status: false
        })
    }
})

router.delete('/:id', async (req, res) => {
    //  Developer: Gerardo vallejos
    const { id } = req.params;
    const UdatepClient = {
        client_status:0
    };
    if(id){
        await pool.query('UPDATE sig_clients set ? WHERE idclient = ?', [UdatepClient, id])
        res.json({
            status: true
        })
    }else{
        res.json({
             status: false
        })
    }
});
module.exports = router