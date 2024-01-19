const mongoose = require('mongoose');
const config = require('./');

mongoose.set('strictQuery', true);
mongoose.connect(config.CONNECTION_STRING).then(()=>{
    console.log("Conectado ao Mongodb Atlas ")
}).catch((err)=>{
    console.error(err)
})