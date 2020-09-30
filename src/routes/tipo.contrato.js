const express = require('express')
const router = express.Router()
const pool = require('../database');

router.post('/create', async (req, res) => {  
    const { name  } = req.body  
    const newTipoObra = {
        idtipo:null,
        nombre:name
    };
    await pool.query('INSERT INTO sig_tipo_contrato set ?', [newTipoObra]);
    res.json({
       status: 'Tipo de obra registrada'
    })
})


router.put('/:id', async (req, res) => {
 const { name,id  } = req.body  
    const newTipoObra = {
        nombre:name
   };
  await pool.query('UPDATE sig_tipo_contrato set ? WHERE id = ?', [newTipoObra, id ]);
  res.json({
      status: 'Tipo contrato actualizada'
  })
})

router.get('/', async (req, res) => {
    const obras = await pool.query("SELECT * FROM sig_tipo_contrato");
    res.json(obras)
})

router.post('/search', async (req, res) => {
    const obras = await pool.query("SELECT * FROM sig_tipo_contrato WHERE nombre LIKE ?", '%' + req.body.name + '%' );
    res.json(obras)
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM sig_tipo_contrato WHERE id = ?', [id]);
  res.json({
      status: 'Tipo Contrato eliminado'
  })
})

module.exports = router;



























