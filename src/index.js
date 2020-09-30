const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
var port = process.env.PORT || 8000
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)
let sequenceNumberByClient = new Map(); 

io.on("connection", function(socket) {
    console.info(`Client connected [id=${socket.id}]`);
    sequenceNumberByClient.set(socket, 1); 
    socket.on("disconnect", () => { 
        sequenceNumberByClient.delete(socket); 
        console.info(`Client gone [id=${socket.id}]`); 
    }); 
    socket.on("newschedule", msg => {
      io.emit("newschedule", msg)
    })
    socket.on("schedule", msg => {
        io.emit("schedule")
      })

    socket.on("pending", msg => {
        io.to(socket.id).emit("pending", msg)
      })
  });
  setInterval(() => { 
    for (const [client, sequenceNumber] of sequenceNumberByClient.entries()){
         client.emit("seq-num", sequenceNumber); 
         sequenceNumberByClient.set(client, sequenceNumber + 1);
        }
    },1000);


app.set('port', process.env.PORT);
app.use(cors())
app.use(morgan('dev'))
app.use(express.json({ limit: "100mb" }))
app.use(express.urlencoded({ limit: "100mb", extended: true }))
app.use('/typeclients', require('./routes/typeclient'))
app.use('/clients', require('./routes/clients'))
app.use('/users', require('./routes/users'))
app.use('/usertype', require('./routes/userType'))
app.use('/clientypes', require('./routes/typeclient'))
app.use('/schedulevisits', require('./routes/schedulevisits'))
app.use('/categories', require('./routes/category'))
app.use('/materials', require('./routes/materials'))
app.use('/login', require('./routes/login'))
app.use('/listschedule', require('./routes/listschedule'))
app.use('/serviceorder', require('./routes/orders'))
app.use('/notificacion', require('./routes/notification'))
app.use('/permiso', require('./routes/gestion.permiso'))
app.use('/tipoobra', require('./routes/tipo.obra'))
app.use('/tipocontrato', require('./routes/tipo.contrato'))
app.use('/maquinaria', require('./routes/machinary'))
app.use('/alimentacion', require('./routes/alimentacion'))
app.use('/proveedor', require('./routes/proveedor'))
app.use('/herramienta', require('./routes/herramienta'))
app.use('/transporte', require('./routes/transporte'))
app.use('/porcentages', require('./routes/porcentages'))
app.use('/workforce', require('./routes/workforce'))
app.use('/section', require('./routes/section'))
app.use('/upload', require('./routes/upload'))
app.use('/pdf', require('./routes/cotizaciones'))

http.listen(port, () => {
    console.log('Server is in port', port);
});