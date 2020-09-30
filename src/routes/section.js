const express = require('express')
const router = express.Router()
const pool = require('../database');
const fs = require('fs');
const cloudinary = require('cloudinary');
var multer = require('multer');
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname+"/upload/")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+'.jpg')
    }
});
const upload = multer({ storage });
cloudinary.config({ 
  cloud_name: 'sigma-7', 
  api_key: '949981489195312', 
  api_secret: 'mg95Hm0oR4ar_GhXjaGICjtC9lA' 
});

router.get('/:idvisit', async(req, res) => {
    const { idvisit } = req.params;
    const sections = await pool.query("SELECT * FROM `sig_section` WHERE id_schedule = ?", [idvisit]);
    res.status(200).json(sections)
});

router.get('/show/:id', async(req, res) => {
    const { id } = req.params;
    const photos = await pool.query("SELECT * FROM `sig_photos` WHERE id_section = ?", [id]);
    const section = await pool.query("SELECT * FROM `sig_section` WHERE idsection = ?", [id]);
    res.status(200).json({
        section,
        photos
    })
});

router.post('/photos', upload.single('image'), async(req, res) => {
    const {id, type} = req.body;
    await cloudinary.uploader.upload(req.file.path).then( async (result) => {
        if (type == 2) {
            try {
                const PHOTO = {
                    photo_uri:result.url,
                    id_section:id
                }
                await pool.query("INSERT INTO `sig_photos` set ?", [PHOTO]);
                res.status(200).json(result.url);
            } catch (error) {
                res.status(500).json({message:"Error al subir imagen 2"});
            }
        } else {
            try {
                const PHOTO = {
                    mockup_picture_uri:result.url,
                }
                await pool.query("UPDATE sig_section set ? WHERE idsection = ?", [PHOTO, id]);
                res.status(200).json(result.url);
            } catch (error) {
                res.status(500).json({message:"Error al subir imagen 3"});
            }
        }
    }).catch((err) => {
       console.log(err); 
       res.status(500).json({message:"Error al subir imagen"});
    });
})

router.post('/', async(req, res) => {
    const { idSchedule, nameSection, descSection } = req.body
    const SECTION = {
        id_schedule: idSchedule,
        section_name: nameSection,
        section_descrip: descSection
    }
    await pool.query("INSERT INTO `sig_section` set ?", [SECTION]);
    res.status(200).json({
        status:true
    })
})

module.exports = router;