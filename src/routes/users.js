const express = require('express')
const router = express.Router()
const pool = require('../database')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

function encrypt(password){
    const key = crypto.scryptSync('sigma7', 'salt', 24);
    const iv = Buffer.alloc(16, 0); 
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

router.post('/create', async(req, res) => {
    const { UserID, UserName, UserAddress, UserPhone, UserEmail, UserTypeName, userNam } = req.body;
    const newUser = {
        iduser: null,
        user_id: UserID,
        user_name: UserName,
        user_address: UserAddress,
        user_phone: UserPhone,
        user_email: UserEmail,
        username: userNam,
        password: encrypt(UserID),
        user_state: 'activo',
        user_usertype: UserTypeName,
    };
    if (await pool.query('INSERT INTO sig_users set ?', [newUser])) {
        async function main() {
            let transporter = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: "07c471989a4071",
                    pass: "a0aabc614d6e40" // generated ethereal password
                }
            });
            if(info = await transporter.sendMail({
                from: 'andy@gmail.com',
                to: UserEmail,
                subject: "Solinter",
                html: "<!DOCTYPE html><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>[SUBJECT]</title><style type='text/css'>body {padding-top: 0 !important;padding-bottom: 0 !important;padding-top: 0 !important;padding-bottom: 0 !important;margin: 0 !important;width: 100% !important;-webkit-text-size-adjust: 100% !important;-ms-text-size-adjust: 100% !important;-webkit-font-smoothing: antialiased !important;}.tableContent img {border: 0 !important;display: block !important;outline: none !important;}a {color: #382F2E;}p,h1 {color: #382F2E;margin: 0;}p {text-align: left;color: #999999;font-size: 14px;font-weight: normal;line-height: 19px;}a.link1 {color: #382F2E;}a.link2 {font-size: 16px;text-decoration: none;color: #ffffff;}h2 {text-align: left;color: #222222;font-size: 19px;font-weight: normal;}div,p,ul,h1 {margin: 0;}.bgBody {background: #ffffff;}.bgItem {background: #ffffff;}@media only screen and (max-width:480px) {table[class='MainContainer'],td[class='cell'] {width: 100% !important;height: auto !important;}td[class='specbundle'] {width: 100% !important;float: left !important;font-size: 13px !important;line-height: 17px !important;display: block !important;padding-bottom: 15px !important;}td[class='spechide'] {display: none !important;}img[class='banner'] {width: 100% !important;height: auto !important;}td[class='left_pad'] {padding-left: 15px !important;padding-right: 15px !important;}}@media only screen and (max-width:540px) {table[class='MainContainer'],td[class='cell'] {width: 100% !important;height: auto !important;}td[class='specbundle'] {width: 100% !important;float: left !important;font-size: 13px !important;line-height: 17px !important;display: block !important;padding-bottom: 15px !important;}td[class='spechide'] {display: none !important;}img[class='banner'] {width: 100% !important;height: auto !important;}.font {font-size: 18px !important;line-height: 22px !important;}.font1 {font-size: 18px !important;line-height: 22px !important;}}</style>" +
                    "<script type='colorScheme' class='swatch active'>{ 'name':'Default', 'bgBody':'ffffff', 'link':'382F2E', 'color':'999999', 'bgItem':'ffffff', 'title':'222222' }</script></head><body paddingwidth='0' paddingheight='0' style='padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;'offset='0' toppadding='0' leftpadding='0'><table bgcolor='#ffffff' width='100%' border='0' cellspacing='0' cellpadding='0' class='tableContent' align='center' style='font-family:Helvetica, Arial,serif;'><tbody><tr><td><table width='600' border='0' cellspacing='0' cellpadding='0' align='center' bgcolor='#ffffff' class='MainContainer'><tbody><tr><td><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td valign='top' width='40'>&nbsp;</td><td><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody>" +
                    "<tr><td height='75' class='spechide'></td></tr><tr><td class='movableContentContainer ' valign='top'><div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td height='35'></td></tr><tr><td><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td valign='top' align='center' class='specbundle'><img src='http://sigma7.com.co/assets/img/clients/logo-solinter_gris.png'></td></tr></tbody></table></td></tr></tbody></table></div><div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'><table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td valign='top' align='center'><div class='contentEditableContainer contentImageEditable'><div class='contentEditable'><img src='images/line.png' width='251' height='43' alt='' data-default='placeholder' data-max-width='560'></div></div></td> </tr> </table> </div> <div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'> <table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td height='55'></td></tr>"+
                    "<tr><td align='left'><div class='contentEditableContainer contentTextEditable'><div class='contentEditable' align='center'><h2>Bienvenido "+UserName+"</h2> </div></div></td></tr><tr><td height='15'></td></tr><tr><td align='left'><div class='contentEditableContainer contentTextEditable'><div class='contentEditable' align='center'><p>En el presente correo se le informa que la vinculación a la plataforma de la empresa ha sido satisfactoria<br><br>Su usuario:"+userNam+"<br>Contraseña provicional es su documento<br>Si desea cambiarla ingrese a su perfil<br><brPara cualquier información comunicarse con el administrador.<br><br>Exitos.<br></p></div></div></td></tr><tr><td height='55'></td></tr><tr><td height='20'></td></tr></table> </div><div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td height='65'></tr><tr><td style='border-bottom:1px solid #DDDDDD;'></td></tr><tr><td height='25'></td></tr><tr><td> <table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr> <td valign='top' class='specbundle'><div class='contentEditableContainer contentTextEditable'> <div class='contentEditable' align='center'> <p style='text-align:left;color:#CCCCCC;font-size:12px;font-weight:normal;line-height:20px;'><span style='font-weight:bold;'>Solinter S.A.S</span>" +
                    "<br><span style='font-weight:bold;'>Calle 8ª N° 2ª – 7 Buenaventura – Colombia.</span><br><span style='font-weight:bold;'>Teléfono: 317 812 5497</span><br><span style='font-weight:bold;'>Correo: carlosamu@solintersas.com</span><br><span style='font-weight:bold;'>www.solintersas.com</span><br></div> </div> </td> <td valign='top' width='30' class='specbundle'>&nbsp;</td></tr></tbody></table></td></tr><tr><td height='88'></td></tr></tbody> </table> </div>" +
                    "</td> </tr></tbody></table></td><td valign='top' width='40'>&nbsp;</td></tr></tbody></table> </td> </tr> </tbody> </table> </td></tr></tbody></table></body></html>" // html body
            })){
                res.json({
                    status: 200,
                    message:'Usuario creado'})
            }
        }
        main().catch(console.error);
    } else {
        res.status(500).send({error})
    }
})

function decipherPass(password) {
    const algorithm = 'aes-192-cbc';
    const key = crypto.scryptSync('sigma7', 'salt', 24);
    const iv = Buffer.alloc(16, 0); 
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(password, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}

router.get('/', async(req, res) => {
    let type = 3;
    const users = await pool.query("SELECT * FROM sig_users join sig_usertype on user_usertype=idusertype where user_state='activo' AND user_userType= ?", [type]);
    res.status(200).json(users)
})

router.get('/:id', async(req, res) => {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM sig_users join sig_usertype on user_usertype=idusertype where user_state='activo' AND iduser= ?", [id]);
    res.status(200).json(user)
})

router.post('/find', async (req, res) => {
    let find = req.body.letra;
    const users = await pool.query("SELECT * FROM sig_users WHERE user_state='activo' AND  user_name LIKE ? AND user_userType= 3", '%'+find+'%' );
    if(users){
        for (let i = 0; i < users.length; i++) {
            const e = users[i];
            e.password = decipherPass(e.password)
        }
        res.json({
            users,
            status: true
        })
    }else{
        res.json({
             status: false
        })
    }
})

router.put('/:iduser', async(req, res) => {
    const { idUser, UserID, UserName, UserAddress, UserPhone, UserEmail, userNam, UserTypeName, password } = req.body;
    const passDb = await pool.query('SELECT * FROM sig_users WHERE iduser= ?', req.body.idUser);
    if (passDb[0].password == password) {
        const updateUser = {
            user_id: UserID,
            user_name: UserName,
            user_address: UserAddress,
            user_phone: UserPhone,
            user_email: UserEmail,
            username: userNam,
            user_usertype: UserTypeName,
        };
        await pool.query('UPDATE sig_users set ? WHERE iduser = ?', [updateUser, idUser]);
        res.json({
            status: true
        })
    } else {
        const updateUser = {
            user_id: UserID,
            user_name: UserName,
            user_address: UserAddress,
            user_phone: UserPhone,
            user_email: UserEmail,
            username: userNam,
            password: encrypt(password),
            user_usertype: UserTypeName,
        };
        await pool.query('UPDATE sig_users set ? WHERE iduser = ?', [updateUser, idUser]);
        res.json({
            status: true
        })
    }
})

router.get('/valid/', async(req, res) =>{
    const cd = await pool.query('SELECT * FROM sig_users WHERE user_id="'+req.query.doc+'" OR username="'+req.query.user+'" OR user_email="'+req.query.email+'" ');
    if (cd.length >= 1) {
        res.json({
            status: 500,
            message: "Ya existe ese usuario",
            length: cd.length})   
    } else {
        res.send({
            status: 200,
            length: 0
        })
    }
})

router.post('/search', async(req, res) => {
    const users = await pool.query("SELECT * FROM sig_users WHERE user_name LIKE ? AND user_userType= 3", '%' + req.body.name + '%');
    if (users) {
        res.status(200).send({ users, status: true })
    } else {
        res.json({
            status: 'Usuario no encontrado'
        })
    }
})

router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    const UdatepUser = {
        user_state: 'inactivo'
    };
    if (await pool.query('UPDATE sig_users set ? WHERE iduser = ?', [UdatepUser, id])) {
        res.json({
            status: true
        })
    } else {
        res.json({
            status: false
        })
    }
});

module.exports = router;