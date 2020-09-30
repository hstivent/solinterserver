const express = require('express')
const router = express.Router()
const pool = require('../database');

router.post('/create', async (req, res) => {  
    const { name  } = req.body  
    const newTipoObra = {
        idtipo:null,
        nombre:name,
        estado:1
    };
    await pool.query('INSERT INTO sig_tipo_obra set ?', [newTipoObra]);
    res.json({
       status: 'Tipo de obra registrada'
    })
})


router.put('/:id', async (req, res) => {
  console.log( req.body )
 const { name,id  } = req.body  
    const newTipoObra = {
        nombre:name
   };
  await pool.query('UPDATE sig_tipo_obra set ? WHERE idtipo = ?', [newTipoObra, id ]);
  res.json({
      status: 'Obra actualizada'
  })
})

router.get('/', async (req, res) => {
    const obras = await pool.query("SELECT * FROM sig_tipo_obra WHERE estado = 1");
    res.json(obras)
})

router.post('/search', async (req, res) => {
    const obras = await pool.query("SELECT * FROM sig_tipo_obra WHERE estado = 1 AND nombre LIKE ?", '%' + req.body.name + '%' );
    res.json(obras)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const updateObra = {
      estado:0
  };
  await pool.query('UPDATE sig_tipo_obra set ? WHERE idtipo = ?', [updateObra, id]);
  res.json({
      status: 'Tipo Obra eliminada'
  })
})

module.exports = router;



























