const express = require('express')
const router = express.Router()
const pool = require('../database')
const nodemailer = require('nodemailer')
const moment = require('moment')


router.post('/create', async(req, res) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "0ea825099bf2b7",
            pass: "f613a19c45696b" // generated ethereal password
        }
    });
    if (req.body.type == 1 || req.body.type == 2) {      
        const { ClientName2, DescSchedule2, UserName2 } = req.body;
        const newSchedule = {
            client_clientid: ClientName2,
            descrioption: DescSchedule2,
            user_userid: UserName2,
            schedule_status:'pendiente'
        };

        if (await pool.query('INSERT INTO sig_schedulevisits set ?', [newSchedule])) {
            async function main() {
                const client = await pool.query('SELECT * FROM sig_clients where idclient = ?', ClientName2)
                const user = await pool.query('SELECT * FROM sig_users where iduser = ?', UserName2)
                let ce;
                let un;
                let ue;
                let info;
                for (let i = 0; i < user.length; i++) {
                    const e = user[i];
                    un = e.user_name
                    ue = e.user_email
                }
                for (let i = 0; i < client.length; i++) {
                    const e = client[i];
                    ce = e.client_email
                }
                if(info = await transporter.sendMail({
                    from: 'andy@gmail.com',
                    to: ce,
                    subject: un + " de Solinter",
                    html: "<!DOCTYPE html><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>[SUBJECT]</title><style type='text/css'>body {padding-top: 0 !important;padding-bottom: 0 !important;padding-top: 0 !important;padding-bottom: 0 !important;margin: 0 !important;width: 100% !important;-webkit-text-size-adjust: 100% !important;-ms-text-size-adjust: 100% !important;-webkit-font-smoothing: antialiased !important;}.tableContent img {border: 0 !important;display: block !important;outline: none !important;}a {color: #382F2E;}p,h1 {color: #382F2E;margin: 0;}p {text-align: left;color: #999999;font-size: 14px;font-weight: normal;line-height: 19px;}a.link1 {color: #382F2E;}a.link2 {font-size: 16px;text-decoration: none;color: #ffffff;}h2 {text-align: left;color: #222222;font-size: 19px;font-weight: normal;}div,p,ul,h1 {margin: 0;}.bgBody {background: #ffffff;}.bgItem {background: #ffffff;}@media only screen and (max-width:480px) {table[class='MainContainer'],td[class='cell'] {width: 100% !important;height: auto !important;}td[class='specbundle'] {width: 100% !important;float: left !important;font-size: 13px !important;line-height: 17px !important;display: block !important;padding-bottom: 15px !important;}td[class='spechide'] {display: none !important;}img[class='banner'] {width: 100% !important;height: auto !important;}td[class='left_pad'] {padding-left: 15px !important;padding-right: 15px !important;}}@media only screen and (max-width:540px) {table[class='MainContainer'],td[class='cell'] {width: 100% !important;height: auto !important;}td[class='specbundle'] {width: 100% !important;float: left !important;font-size: 13px !important;line-height: 17px !important;display: block !important;padding-bottom: 15px !important;}td[class='spechide'] {display: none !important;}img[class='banner'] {width: 100% !important;height: auto !important;}.font {font-size: 18px !important;line-height: 22px !important;}.font1 {font-size: 18px !important;line-height: 22px !important;}}</style>" +
                        "<script type='colorScheme' class='swatch active'>{ 'name':'Default', 'bgBody':'ffffff', 'link':'382F2E', 'color':'999999', 'bgItem':'ffffff', 'title':'222222' }</script></head><body paddingwidth='0' paddingheight='0' style='padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;'offset='0' toppadding='0' leftpadding='0'><table bgcolor='#ffffff' width='100%' border='0' cellspacing='0' cellpadding='0' class='tableContent' align='center' style='font-family:Helvetica, Arial,serif;'><tbody><tr><td><table width='600' border='0' cellspacing='0' cellpadding='0' align='center' bgcolor='#ffffff' class='MainContainer'><tbody><tr><td><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td valign='top' width='40'>&nbsp;</td><td><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody>" +
                        "<tr><td height='75' class='spechide'></td></tr><tr><td class='movableContentContainer ' valign='top'><div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td height='35'></td></tr><tr><td><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td valign='top' align='center' class='specbundle'><img src='http://sigma7.com.co/assets/img/clients/logo-solinter_gris.png'></td></tr></tbody></table></td></tr></tbody></table></div><div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'><table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td valign='top' align='center'><div class='contentEditableContainer contentImageEditable'><div class='contentEditable'><img src='images/line.png' width='251' height='43' alt='' data-default='placeholder' data-max-width='560'></div></div></td> </tr> </table> </div> <div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'> <table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td height='55'></td></tr>"+
                        "<tr><td align='left'><div class='contentEditableContainer contentTextEditable'><div class='contentEditable' align='center'><h2>Agendamiento de visita</h2> </div></div></td></tr><tr><td height='15'></td></tr><tr><td align='left'><div class='contentEditableContainer contentTextEditable'><div class='contentEditable' align='center'><p>En el presente correo se le informa que la visita para: "+DescSchedule2+" Se ha agendado para el dia a las horas<br><br>Para cualquier información adicional responder este correo.<br><br>Exitos.<br><span style='color:#222222;'>"+un+"</span></p></div></div></td></tr><tr><td height='55'></td></tr><tr><td height='20'></td></tr></table> </div><div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td height='65'></tr><tr><td style='border-bottom:1px solid #DDDDDD;'></td></tr><tr><td height='25'></td></tr><tr><td> <table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr> <td valign='top' class='specbundle'><div class='contentEditableContainer contentTextEditable'> <div class='contentEditable' align='center'> <p style='text-align:left;color:#CCCCCC;font-size:12px;font-weight:normal;line-height:20px;'><span style='font-weight:bold;'>Solinter S.A.S</span>" +
                        "<br> [CLIENTS.ADDRESS]<br></div> </div> </td> <td valign='top' width='30' class='specbundle'>&nbsp;</td></tr></tbody></table></td></tr><tr><td height='88'></td></tr></tbody> </table> </div>" +
                        "</td> </tr></tbody></table></td><td valign='top' width='40'>&nbsp;</td></tr></tbody></table> </td> </tr> </tbody> </table> </td></tr></tbody></table></body></html>" // html body
                })){
                    res.send({
                        status:true
                    })
                }
            }
            main().catch(console.error);
        }
    } else {
        const { ClientName, DescSchedule, UserName, ScheduleDate, ScheduleTime } = req.body;
        const newSchedule = {
        client_clientid: ClientName,
        descrioption: DescSchedule,
        user_userid: UserName,
        datevisit: ScheduleDate,
        timevisit: ScheduleTime
        };
        if (await pool.query('INSERT INTO sig_schedulevisits set ?', [newSchedule])) {
            async function main() {
                const client = await pool.query('SELECT * FROM sig_clients where idclient = ?', ClientName)
                const user = await pool.query('SELECT * FROM sig_users where iduser = ?', UserName)
                let ce;
                let un;
                let ue;
                let info;
                for (let i = 0; i < user.length; i++) {
                    const e = user[i];
                    un = e.user_name
                    ue = e.user_email
                }
                for (let i = 0; i < client.length; i++) {
                    const e = client[i];
                    ce = e.client_email
                }
                if(info = await transporter.sendMail({
                    from: 'andy@gmail.com',
                    to: ce,
                    subject: un + " de Solinter",
                    html: "<!DOCTYPE html><html xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>[SUBJECT]</title><style type='text/css'>body {padding-top: 0 !important;padding-bottom: 0 !important;padding-top: 0 !important;padding-bottom: 0 !important;margin: 0 !important;width: 100% !important;-webkit-text-size-adjust: 100% !important;-ms-text-size-adjust: 100% !important;-webkit-font-smoothing: antialiased !important;}.tableContent img {border: 0 !important;display: block !important;outline: none !important;}a {color: #382F2E;}p,h1 {color: #382F2E;margin: 0;}p {text-align: left;color: #999999;font-size: 14px;font-weight: normal;line-height: 19px;}a.link1 {color: #382F2E;}a.link2 {font-size: 16px;text-decoration: none;color: #ffffff;}h2 {text-align: left;color: #222222;font-size: 19px;font-weight: normal;}div,p,ul,h1 {margin: 0;}.bgBody {background: #ffffff;}.bgItem {background: #ffffff;}@media only screen and (max-width:480px) {table[class='MainContainer'],td[class='cell'] {width: 100% !important;height: auto !important;}td[class='specbundle'] {width: 100% !important;float: left !important;font-size: 13px !important;line-height: 17px !important;display: block !important;padding-bottom: 15px !important;}td[class='spechide'] {display: none !important;}img[class='banner'] {width: 100% !important;height: auto !important;}td[class='left_pad'] {padding-left: 15px !important;padding-right: 15px !important;}}@media only screen and (max-width:540px) {table[class='MainContainer'],td[class='cell'] {width: 100% !important;height: auto !important;}td[class='specbundle'] {width: 100% !important;float: left !important;font-size: 13px !important;line-height: 17px !important;display: block !important;padding-bottom: 15px !important;}td[class='spechide'] {display: none !important;}img[class='banner'] {width: 100% !important;height: auto !important;}.font {font-size: 18px !important;line-height: 22px !important;}.font1 {font-size: 18px !important;line-height: 22px !important;}}</style>" +
                        "<script type='colorScheme' class='swatch active'>{ 'name':'Default', 'bgBody':'ffffff', 'link':'382F2E', 'color':'999999', 'bgItem':'ffffff', 'title':'222222' }</script></head><body paddingwidth='0' paddingheight='0' style='padding-top: 0; padding-bottom: 0; padding-top: 0; padding-bottom: 0; background-repeat: repeat; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased;'offset='0' toppadding='0' leftpadding='0'><table bgcolor='#ffffff' width='100%' border='0' cellspacing='0' cellpadding='0' class='tableContent' align='center' style='font-family:Helvetica, Arial,serif;'><tbody><tr><td><table width='600' border='0' cellspacing='0' cellpadding='0' align='center' bgcolor='#ffffff' class='MainContainer'><tbody><tr><td><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td valign='top' width='40'>&nbsp;</td><td><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody>" +
                        "<tr><td height='75' class='spechide'></td></tr><tr><td class='movableContentContainer ' valign='top'><div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td height='35'></td></tr><tr><td><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td valign='top' align='center' class='specbundle'><img src='http://sigma7.com.co/assets/img/clients/logo-solinter_gris.png'></td></tr></tbody></table></td></tr></tbody></table></div><div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'><table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td valign='top' align='center'><div class='contentEditableContainer contentImageEditable'><div class='contentEditable'><img src='images/line.png' width='251' height='43' alt='' data-default='placeholder' data-max-width='560'></div></div></td> </tr> </table> </div> <div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'> <table width='100%' border='0' cellspacing='0' cellpadding='0' align='center'><tr><td height='55'></td></tr>"+
                        "<tr><td align='left'><div class='contentEditableContainer contentTextEditable'><div class='contentEditable' align='center'><h2>Agendamiento de visita</h2> </div></div></td></tr><tr><td height='15'></td></tr><tr><td align='left'><div class='contentEditableContainer contentTextEditable'><div class='contentEditable' align='center'><p>En el presente correo se le informa que la visita para: "+DescSchedule+" Se ha agendado para el dia "+ScheduleDate+" a las "+ScheduleTime+" horas<br><br>Para cualquier información adicional responder este correo.<br><br>Exitos.<br><span style='color:#222222;'>"+un+"</span></p></div></div></td></tr><tr><td height='55'></td></tr><tr><td height='20'></td></tr></table> </div><div class='movableContent' style='border: 0px; padding-top: 0px; position: relative;'><table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr><td height='65'></tr><tr><td style='border-bottom:1px solid #DDDDDD;'></td></tr><tr><td height='25'></td></tr><tr><td> <table width='100%' border='0' cellspacing='0' cellpadding='0'><tbody><tr> <td valign='top' class='specbundle'><div class='contentEditableContainer contentTextEditable'> <div class='contentEditable' align='center'> <p style='text-align:left;color:#CCCCCC;font-size:12px;font-weight:normal;line-height:20px;'><span style='font-weight:bold;'>Solinter S.A.S</span>" +
                        "<br> [CLIENTS.ADDRESS]<br></div> </div> </td> <td valign='top' width='30' class='specbundle'>&nbsp;</td></tr></tbody></table></td></tr><tr><td height='88'></td></tr></tbody> </table> </div>" +
                        "</td> </tr></tbody></table></td><td valign='top' width='40'>&nbsp;</td></tr></tbody></table> </td> </tr> </tbody> </table> </td></tr></tbody></table></body></html>" // html body
                })){
                    res.send({
                        status:true
                    })
                }
            }
            main().catch(console.error);
        }
    }
})
router.post('/find', async (req, res) => {
    let find = req.body.letra;
    const visits = await pool.query('SELECT schedule_id, descrioption, iduser, user_name, date_format( `datevisit`,"%Y-%m-%d") datevisit, timevisit, user_userid,idclient, client_nit, client_name, client_address, client_phone, client_email, client_contact, clientype_clientypeid, client_status from sig_schedulevisits join sig_clients on idclient=client_clientid join sig_users on iduser=user_userid where sig_schedulevisits.schedule_status = 1 AND  descrioption LIKE ?', '%'+find+'%');
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
router.get('/', async(req, res) => {
    let id = req.query.iduser;
    let type = req.query.typeUser;
    if (type == 1 || type == 2) {
        let schedulevisits = await pool.query('SELECT idclient, client_name, count(idclient) AS "visits" from sig_schedulevisits join sig_clients on idclient=client_clientid join sig_users on iduser=user_userid GROUP BY idclient');
        res.json(schedulevisits)
    } else {
        let schedulevisits = await pool.query('SELECT idclient, client_name, count(idclient) AS "visits" from sig_schedulevisits join sig_clients on idclient=client_clientid join sig_users on iduser=user_userid WHERE sig_schedulevisits.schedule_status ="activo" AND sig_schedulevisits.user_userid = ? GROUP BY idclient', [id]);
        res.json(schedulevisits)
    }
})
router.get('/client', async(req, res) => {
    let id = req.query.iduser;
    let type = req.query.typeUser;
    let idclient = req.query.clientid;
    if (type == 1 || type == 2) {
        let schedulevisits = await pool.query('SELECT schedule_id, schedule_status, descrioption, iduser, user_name, date_format( datevisit,"%Y-%m-%d") datevisit, timevisit, user_userid, idclient, client_nit, client_name, client_address, client_phone, client_email, client_contact, clientype_clientypeid, client_status from sig_schedulevisits join sig_clients on idclient=client_clientid join sig_users on iduser=user_userid where sig_clients.idclient = ?', [idclient]);
        res.json(schedulevisits)
    } else {
        let schedulevisits = await pool.query(`SELECT schedule_id, schedule_status, descrioption, iduser, user_name, date_format(datevisit,"%Y-%m-%d") datevisit, timevisit, user_userid,idclient, client_nit, client_name, client_address, client_phone, client_email, client_contact, clientype_clientypeid, client_status from sig_schedulevisits join sig_clients on idclient=client_clientid join sig_users on iduser=user_userid where idclient= ? AND sig_schedulevisits.schedule_status ="activo" AND sig_schedulevisits.user_userid = ?`, [idclient, id]);
        res.json(schedulevisits)
    }
})
router.post('/webvisits', async(req, res) => {
    let id = req.body.iduser;
    let type = req.body.typeUser;
    let schedulevisits = await pool.query('SELECT schedule_id, descrioption, iduser, user_name, date_format( `datevisit`,"%Y-%m-%d") datevisit, timevisit, user_userid,idclient, client_nit, client_name, client_address, client_phone, client_email, client_contact, clientype_clientypeid, client_status from sig_schedulevisits join sig_clients on idclient=client_clientid join sig_users on iduser=user_userid where sig_schedulevisits.schedule_status="activo" order by sig_schedulevisits.schedule_id');
    res.json(schedulevisits)
})
router.get('/webvisitsday', async(req, res) => {
    let dt = new Date();
    var odt = moment(dt).format('YYYY-MM-DD');
    let ok = odt.replace(/\//g, "-");
    let ok2 = ok.replace("9", "5");
    let schedulevisits = await pool.query(`SELECT * from sig_schedulevisits join sig_clients on idclient=client_clientid join sig_users on iduser=user_userid WHERE sig_schedulevisits.datevisit='${ok2}'`);
    res.json(schedulevisits)
})
router.post('/visitPen', async(req, res) => {
    let id = req.body.iduser;
    let schedulevisits = await pool.query('SELECT * from sig_schedulevisits where schedule_status ="pendiente" and user_userid="'+id+'" ');
    res.json(schedulevisits)
})
router.post('/visitsPen', async(req, res) => {
    let id = req.body.iduser;
    let schedulevisits = await pool.query('SELECT schedule_id, descrioption, iduser, user_name, date_format( `datevisit`,"%Y-%m-%d") datevisit, timevisit, user_userid,idclient, client_nit, client_name, client_address, client_phone, client_email, client_contact, clientype_clientypeid, client_status from sig_schedulevisits join sig_clients on idclient=client_clientid join sig_users on iduser=user_userid where sig_schedulevisits.schedule_status ="pendiente" and user_userid="'+id+'"');
    res.json(schedulevisits)
})
router.get('/visitsPen', async(req, res) => {
    let schedulevisits = await pool.query('SELECT * from sig_schedulevisits join sig_clients on idclient=client_clientid join sig_users on iduser=user_userid where sig_schedulevisits.schedule_status ="pendiente"');
    res.json(schedulevisits)
})
router.put('/visitsPen', async(req, res) => {
    const { idSchedule, ScheduleDate, ScheduleTime } = req.body;
    const updateSchedule = {
        datevisit: ScheduleDate,
        timevisit: ScheduleTime,
        schedule_status: 'activo'
    };
    await pool.query('UPDATE sig_schedulevisits set ? WHERE schedule_id = ?', [updateSchedule, idSchedule]);
    res.json({
        status: true
    })
})
router.post('/orders', async(req, res) => {
    const { iduser, idclient } = req.body
    const user  = await pool.query("SELECT * FROM sig_users where iduser='"+iduser+"'")
    for (let i = 0; i < user.length; i++) {
        const e = user[i];
        if (e.user_usertype == 1 || e.user_usertype == 2) {
            const schedulevisits = await pool.query("SELECT * FROM sig_clients join sig_schedulevisits on idclient=client_clientid join sig_users on iduser=user_userid where idclient='" + idclient + "' ");
            res.json({
                status: true,
                schedulevisits
            })
        } else {
            const schedulevisits = await pool.query("SELECT * FROM sig_clients join sig_schedulevisits on idclient=client_clientid join sig_users on iduser=user_userid where idclient='" + idclient + "'  and user_userid='"+iduser+"'");
            res.json({
                status: true,
                schedulevisits
            })
        }
        
  }
})
router.put('/:idschedule', async(req, res) => {
    const { idSchedule, ClientName, DescSchedule, UserId, ScheduleDate, ScheduleTime } = req.body;
    const updateSchedule = {
        client_clientid: ClientName,
        descrioption: DescSchedule,
        user_userid: UserId,
        datevisit: ScheduleDate,
        timevisit: ScheduleTime,
        schedule_status: 1
    };
    if(updateSchedule){
        await pool.query('UPDATE sig_schedulevisits set ? WHERE schedule_id = ?', [updateSchedule, idSchedule]);
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
})
router.get('/:idschedule', async(req, res) => {
    const { idschedule } = req.params;
    const visit = await pool.query("Select * FROM sig_clients join sig_schedulevisits on client_clientid=idclient and sig_schedulevisits.schedule_id='"+idschedule+"' ");
    const sections = await pool.query("Select idsection, section_name, section_descrip, mockup_picture_uri FROM sig_section join sig_schedulevisits on id_schedule=schedule_id and sig_schedulevisits.schedule_id='"+idschedule+"' ");
    for (let i = 0; i < sections.length; i++) {
        const e = sections[i];
        const photos = await pool.query(`Select * From sig_photos WHERE id_section=${e.idsection}`);
        const materials = await pool.query("Select cod_visit, id_material, count, precio, porcentage, name, unit, `code`, idcategory, category_type  From sig_materialselected JOIN sig_materials on sig_materials.idmaterial=sig_materialselected.id_material join sig_category on sig_category.id_category=sig_materials.idcategory WHERE cod_visit="+idschedule+" AND cod_section="+e.idsection+" AND category_type=1");
        const tools = await pool.query("Select cod_visit, id_material, count, precio, porcentage, name, unit, `code`, idcategory, category_type  From sig_materialselected JOIN sig_materials on sig_materials.idmaterial=sig_materialselected.id_material join sig_category on sig_category.id_category=sig_materials.idcategory WHERE cod_visit="+idschedule+" AND cod_section="+e.idsection+" AND category_type=2");
        const machinaries = await pool.query("Select cod_visit, id_material, count, precio, porcentage, name, unit, `code`, idcategory, category_type  From sig_materialselected JOIN sig_materials on sig_materials.idmaterial=sig_materialselected.id_material join sig_category on sig_category.id_category=sig_materials.idcategory WHERE cod_visit="+idschedule+" AND cod_section="+e.idsection+" AND category_type=3");
        const workforce = await pool.query("Select cod_visit, id_material, count, precio, porcentage, name, unit, `code`, idcategory, category_type  From sig_materialselected JOIN sig_materials on sig_materials.idmaterial=sig_materialselected.id_material join sig_category on sig_category.id_category=sig_materials.idcategory WHERE cod_visit="+idschedule+" AND cod_section="+e.idsection+" AND category_type=4");
        e.tools = tools
        e.workforce = workforce 
        e.machinaries = machinaries
        e.materials = materials
        e.photos = photos
    }
    res.json({ data: {visit, sections}, status: true})
})
router.delete('/:id', async(req, res) => {
    const { id } = req.params;
    const UpdatepVisit = {
        schedule_status: 0
    };
    if(id){
        await pool.query('UPDATE sig_schedulevisits set ? WHERE schedule_id = ?', [UpdatepVisit, id])
        res.json({
            status: true
        })
    }else{
        res.json({
            status: false
        })
    }
})

module.exports = router;