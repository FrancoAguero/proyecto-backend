import express from "express";
import mongoose from "mongoose";
import config from "./config.js";
import productosApiRouter from "./routers/products.js";
import cartsApiRouter from "./routers/carts.js";
import usersApiRouter from "./routers/users.js";
// import * as os from 'os'

//Para chequear la ip asi trabajamos desde multiples dispositivos
// let interfaces = os.networkInterfaces();
// let addresses = [];
// for (let k in interfaces) {
//     for (let k2 in interfaces[k]) {
//         let address = interfaces[k][k2];
//         if (address.family === 'IPv4' && !address.internal) {
//             addresses.push(address.address);
//         }
//     }
// }

// console.log(addresses);

const app = express();

const uri = config.mongoRemote.cnxStr;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productosApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/api/users', usersApiRouter);

const connectedServer = app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en el puerto ${connectedServer.address().port}`)
})

mongoose.connect(uri, config.mongoRemote.client)

connectedServer.on('error', error => console.log(`Error en el servidor ${error}`))