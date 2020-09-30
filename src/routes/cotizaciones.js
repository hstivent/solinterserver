

const express = require('express')
const pool = require('../database')
const router = express.Router()
var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
/*
let storage = multer.diskStorage({

  destination: (req, file, cb) => {
      cb(null, './../../var/lib/mysql/storage')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
  const path = req.file.path
  const workBook = PDF.readFile(path);
  const nameFile = `./../../var/lib/mysql/storage/${req.file.fieldname}-${Date.now()}.pdf`
  const nameF = nameFile.replace("./../../var/lib/mysql/", " ")
  PDF.writeFile(workBook, nameFile, { bookType: "pdf" })
  res.send(nameF)
})
*/

router.post('/pdf', async(req, res, next) => {
  let { tipo,generalidades,personal,formapago,observaciones,tiempodeentrega,descripcion  } = req.body;
  const visits4 = await pool.query('SELECT idsection, (@cnt := @cnt + 1) Item,  Actividades, Cant, Valor_Unit, Valor_Total, SUB_TOTAL, IVA, TOTAL_PAGAR, client_contact, client_name, fecha,  descrioption, client_address, cot, asesor, telefono from (select   section_descrip Actividades, sum(count) Cant,CONCAT("$",FORMAT(sum(precio),2)) Valor_Unit, CONCAT("$",FORMAT((sum(count*precio)),2)) Valor_Total, idsection,CONCAT("$", FORMAT(sum(count*precio),2)) SUB_TOTAL,CONCAT("$",FORMAT(((sum(count*precio))*19)/100,2)) IVA, CONCAT("$",FORMAT((sum(count*precio)+((sum(count*precio))*19)/100),2)) TOTAL_PAGAR, client_contact, client_name, descrioption, client_address, schedule_id cot, DATE_FORMAT(CURDATE(), "%d %M %Y") fecha, user_name asesor, user_phone telefono from sig_clients join sig_schedulevisits on idclient=client_clientid join sig_registervisit on schedule_id=visit_id join sig_section on id_schedule= schedule_id join sig_materialselected on visit_id=cod_visit join sig_materials on idmaterial=id_material join sig_users on user_userid=iduser where idsection= cod_section and cod_visit=? group by idsection) t CROSS JOIN (SELECT @cnt := 0) h', 1);
  const visits = await pool.query('select CONCAT("$",FORMAT(sum(count*precio),2)) SUB_TOTAL,CONCAT("$",FORMAT(((sum(count*precio))*9)/100,2)) IVA, CONCAT("$",FORMAT((sum(count*precio)+((sum(count*precio))*19)/100),2)) TOTAL_PAGAR, client_contact, client_name, descrioption, client_address, schedule_id cot, DATE_FORMAT(CURDATE(), "%d %M %Y") fecha, user_name asesor, user_phone telefono from sig_clients join sig_schedulevisits on idclient=client_clientid join sig_registervisit on schedule_id=visit_id join sig_section on id_schedule= schedule_id join sig_materialselected on visit_id=cod_visit join sig_materials on idmaterial=id_material join sig_users on user_userid=iduser where idsection=cod_section and cod_visit=? group by client_name', 1);
  let e1,e2,e3,e4,e5,e6,e7,e8,col
  for (let index = 0; index < visits4.length; index++) {
    e1 = visits4[index].client_contact;
    e2 = visits4[index].client_name;
    e3 = visits4[index].descrioption;
    e4 = visits4[index].client_address; 
    e5 = visits4[index].cot;
    e6 = visits4[index].fecha;
    e7 = visits4[index].asesor;
    e8 = visits4[index].telefono; 
  }  
if(tipo==1)
{
  var documentDefinition={
    header: 
    {
      columns: [
        {   
          alignment: 'right', text: 'SolInter\n NIT: 900031874\n DIRECCION: Cra. 64B #11-41',alignment: 'center',  style: 'hh' }
      ]
    },   
    footer: {
      margin: 5,
      columns: [
        {text: 'CL. 8 NO 2ª-7 Oficina 304 – Edificio Mónica\n Buenaventura - Valle del cauca\n TEL 032-2416807 Cel. +57-321 463 4447 solinter.sas@gmail.com ', alignment: 'center', style: 'hh' }
      ]
    },
  
    content: [

      {text: 'Buenaventura, '+e6, italics: true, fontSize: 12, margin: [30, 80, 0, 15]},
      {text:'Sr.', fontSize: 12, margin: [30, 0, 0, 0] },
      {text:e2, fontSize: 13, bold: true, margin: [30, 0, 0, 0]},

      {text: 'Asunto: ', bold: true, fontSize: 12, margin: [30, 20, 0, 0]},
      {text: e3, fontSize: 12, margin: [30, 0, 0, 20]},

      {text:'Cordial saludo', fontSize: 12, margin: [30, 0, 0, 20] },
      {text:'Por medio de la presente nos permitimos presentarles la propuesta del asunto, nuestra oferta consta de: \n\n  ', fontSize: 12, 	alignment: 'justify', margin: [30, 0, 40, 0] },
      {text:'1. Cuadro cantidades de obras.\n 2. Condiciones comerciales. \n\n   ', fontSize: 12, margin: [50, 0, 0, 0], 	alignment: 'justify' },
      {text:' \n\n Esperamos que esta oferta sea de su interés y aceptación. \n\n Cordialmente.\n\n\n\n  ', fontSize: 12, 	alignment: 'justify', margin: [30, 0, 0, 0] },

      {text: e7, fontSize: 15, bold: true,  margin: [30, 0, 0, 0]	},
      {text: 'Gerente', fontSize: 15, bold: true, margin: [30, 0, 0, 0]	},
      {text: 'Soluciones Integradas del Valle S.A.S\n Móvil: (57) 317 812 54 97\n Buenaventura - Colombia - South América. ', fontSize: 8, margin: [30, 0, 0, 0] },

     // encabezado(visits4),
     //****************************************************** 
    
     {text: '1. DESCRIPCIÓN DE LA OFERTA., ', fontSize: 15, bold: true, margin: [30, 80, 0, 15],  pageBreak: 'before',},
     {text:'\n\n1.1. ALCANCE.\n\n', fontSize: 15, bold: true,  margin: [30, 0, 0, 0] },
     {text: descripcion, fontSize: 13, alignment: 'justify',  margin: [30, 0, 0, 0]},

     {text: '\n\n1.2. PERSONAL REQUERIDO.\n\n  ', fontSize: 15, bold: true, margin: [30, 20, 0, 0]},
     
     {text: personal, fontSize: 13, 	alignment: 'justify', margin: [30, 0, 40, 0] },
    
     {text: '\n\n1.3. GENERALIDADES A CARGO DE SOLINTER. \n\n', fontSize: 15, bold: true, margin: [30, 0, 0, 0]	},
     {text:generalidades, fontSize: 13, margin: [50, 0, 0, 0], 	alignment: 'justify' },

     //********************************************************* 
      {text: '2. CUADRO DE CANTIDADES DE OBRA', style: 'header',  pageBreak: 'before',  },
    
      table(visits4, ['Item', 'Actividades', 'Cant', 'Valor_Unit', 'Valor_Total']),
      resultado(visits),
      {text: '\n\n 3. FORMA DE PAGO Y TIEMPO DE EJECUCIÒN \n\n',  fontSize: 15, bold: true  },
      {text: formapago,  fontSize: 13 },
      {text: observaciones,  fontSize: 13 },
      {text: tiempodeentrega,  fontSize: 13 },
  ],
  styles: {
    header: {
      fontSize: 22,
      bold: true,
      alignment: 'center',
      fillColor: '#cccccc',
      border: [true, true, true, true],
      margin: [0, 20, 0, 15]
    },
    hh:{
      fontSize: 8
    }
   
  },

  };}
  else if(tipo==2){
    var documentDefinition={
      header: 
      {
        columns: [
          {   
            alignment: 'right', text: 'SolInter\n NIT: 900031874\n DIRECCION: Cra. 64B #11-41',alignment: 'center',  style: 'hh' }
        ]
      },   
      footer: {
        margin: 5,
        columns: [
          {text: 'CL. 8 NO 2ª-7 Oficina 304 – Edificio Mónica\n Buenaventura - Valle del cauca\n TEL 032-2416807 Cel. +57-321 463 4447 solinter.sas@gmail.com ', alignment: 'center', style: 'hh' }
        ]
      },
    
      content: [
  
        {text: 'Buenaventura, '+e6, italics: true, fontSize: 12, margin: [30, 80, 0, 15]},
        {text:'Sr.', fontSize: 12, margin: [30, 0, 0, 0] },
        {text:e2, fontSize: 13, bold: true, margin: [30, 0, 0, 0]},
  
        {text: 'Asunto: ', bold: true, fontSize: 12, margin: [30, 20, 0, 0]},
        {text: e3, fontSize: 12, margin: [30, 0, 0, 20]},
  
        {text:'Cordial saludo', fontSize: 12, margin: [30, 0, 0, 20] },
        {text:'Por medio de la presente nos permitimos presentarles la propuesta del asunto, nuestra oferta consta de: \n\n  ', fontSize: 12, 	alignment: 'justify', margin: [30, 0, 40, 0] },
        {text:'1. Cuadro cantidades de obras.\n 2. Condiciones comerciales. \n\n   ', fontSize: 12, margin: [50, 0, 0, 0], 	alignment: 'justify' },
        {text:' \n\n Esperamos que esta oferta sea de su interés y aceptación. \n\n Cordialmente.\n\n\n\n  ', fontSize: 12, 	alignment: 'justify', margin: [30, 0, 0, 0] },
  
        {text: e7, fontSize: 15, bold: true,  margin: [30, 0, 0, 0]	},
        {text: 'Gerente', fontSize: 15, bold: true, margin: [30, 0, 0, 0]	},
        {text: 'Soluciones Integradas del Valle S.A.S\n Móvil: (57) 317 812 54 97\n Buenaventura - Colombia - South América. ', fontSize: 8, margin: [30, 0, 0, 0] },
  
       // encabezado(visits4),
       
        {text: ' CANTIDADES', style: 'header',  pageBreak: 'before',  },
      
        table(visits4, ['Item', 'Actividades', 'Cant', 'Valor_Unit', 'Valor_Total']),
        resultado(visits),
        {text: '\n\n 3. FORMA DE PAGO \n\n',  fontSize: 15, bold: true  },
        {text: formapago,  fontSize: 13 },
      {text: observaciones,  fontSize: 13 },
      {text: tiempodeentrega,  fontSize: 13 },
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        alignment: 'center',
        fillColor: '#cccccc',
        border: [true, true, true, true],
        margin: [0, 20, 0, 15]
      },
      hh:{
        fontSize: 8
      }
     
    },
  
    };

  }

  const pdfDoc=pdfMake.createPdf(documentDefinition);
  res.json(documentDefinition)


function buildTableBody(data, columns) {
    var body = [];

    body.push(columns);     
    data.forEach(function(row) { 
        var dataRow = [];

        columns.forEach(function(column) {
            dataRow.push(row[column]);
        })

        body.push(dataRow);
    });
    
    return body;
    
}

function table(data, columns) {
    return {
      style: 'tableExample',
     
        table: {  
          widths: ['5%','45%','10%','20%','20%'],
          headerRows: 1,   
          body: buildTableBody(data, columns), 
        },
        
        fontSize: 10,
            bold: true,
            italics: true,
            alignment: 'right',      
        layout: 'lightHorizontalLines'
    };
}
/*function table1(data, columns) {
  let element,col

  for (let index = 0; index < data.length; index++) {
    if(columns=='SUB_TOTAL')
       element += data[index].SUB_TOTAL;
    else if(columns=='IVA')
        element += data[index].IVA;
    else if(columns=='TOTAL_PAGAR')
      element += data[index].TOTAL_PAGAR;
  }
  for (let index = 0; index < columns.length; index++) {
     col = columns[index];
    
  }
  var bodys = [];
  var dataRow = [];
  return {
    style: 'tableExample',
      table: {   
        widths: ['*', 'auto'],
        body: [
                [  	
                  '',
                  ''
                ],
                [
                  [columns],
                  {
                  rowSpan: 1,
							    colSpan: 1,
							    border: [true, true, true, true],
							    fillColor: '#56E847',
                  text:  element,
                  bold: true,
                  }
                ]		
              ]
      },
   
          fontSize: 10,
          bold: true,
          italics: true,
          alignment: 'right',   
          fillColor: '#25B2DF',     
      layout: 'lightHorizontalLines'
  };

}*/

function encabezado(data) {
  let e1,e2,e3,e4,e5,e6,e7,e8,col
  for (let index = 0; index < data.length; index++) {
    e1 = data[index].client_contact;
    e2 = data[index].client_name;
    e3 = data[index].descrioption;
    e4 = data[index].client_address; 
    e5 = data[index].cot;
    e6 = data[index].fecha;
    e7 = data[index].asesor;
    e8 = data[index].telefono; 
 
  }  
  return {
    style: 'tableExample',
     pageBreak: 'before',
      table: { 
        widths: ['15%', '25%', '20%', '15%', '25%'],  
        body: [

                [  	
                  '',
                  '',
                  '',
                  '',
                  ''
                ],
                [
                  'Contacto:',
                  {
                  rowSpan: 1,
                  colSpan: 1,
                  alignment: 'right',
							    border: [true, true, true, true],
                  text:  e1
                  },
                  '',
                  'Cotización No.:',
                  {
                    alignment: 'right',
                    text:  e5
                    }
                ],
                [
                  'Empresa:',
                  {
                    alignment: 'right',
                    text:  e2},
                    '',
                    'Fecha:',
                    {
                      alignment: 'right',
                      text:  e6
                      }
                ],
                [
                  'Proyecto:',
                  {alignment: 'right',
                    text:  e3},
                  '',
                  'Asesor:',
                  {alignment: 'right',
                    text:  e7
                    }
                ],
                [
                  'Dirección:',                 
                  {alignment: 'right',text:  e4},
                  '',
                  'Teléfono:',
                  {
                    alignment: 'right', text:  e8
                    }
                ]		
              ]
      },
   
          fontSize: 10,
          bold: true,
          italics: true,
          alignment: 'left',
          margin: [0, 30, 0, 15],   
          fillColor: '#FFFFFF',     
      layout: 'lightHorizontalLines'
  };

}

function resultado(data) {
  let a1,a2,a3,col;
  for (let index = 0; index < data.length; index++) {
        a1 =data[index].SUB_TOTAL;
        a2 = data[index].IVA;
        a3 = data[index].TOTAL_PAGAR;

  } 

  return {
    style: 'tableExample',   
      table: {   
        widths: ['70%', '30%'],
        body: [

                [ 
                  '', 
                  '' 
                ],
                [ 
                  
                  {
                    
                  rowSpan: 1,
                  colSpan: 2,
                  border: [true, true, true, true],
                  fillColor: '#FFFFFF', 
                  //fillColor: '#56E847',
                  alignment: 'center',  
                  bold: true,
                  text:  'RESULTADOS'
                   } 
                ],
                [
                  'SUBTOTAL:',
                  {
                    rowSpan: 1,
                    colSpan: 1,
                    border: [true, true, true, true],
                    fillColor: '#FFFFFF', 
                    //fillColor: '#56E847',
                    alignment: 'right',  
                    bold: true,
                    text:  a1
                   }
                 
                ],
                [
                  'IVA:',
                  {
                    rowSpan: 1,
							    colSpan: 1,
                  border: [true, true, true, true],
                  fillColor: '#FFFFFF', 
                  //fillColor: '#56E847',
                  width: 15, 
                  height: 10,
                  alignment: 'right',  
                  bold: true,
                    text:  a2}
                    
                ],
                [
                  'Proyecto:',
                  {
                    rowSpan: 1,
							    colSpan: 1,
                  border: [true, true, true, true],
                  fillColor: '#FFFFFF', 
                  //fillColor: '#56E847',
                  alignment: 'right',  
                  bold: true,
                    text:  a3}
                ]
                	
              ]
      },
   
          fontSize: 10,
          bold: true,
          italics: true, 
          alignment: 'left',   
          fillColor: '#FFFFFF',  
       //   fillColor: '#25B2DF',  
      layout: 'lightHorizontalLines'
  };

}

})
module.exports = router;
