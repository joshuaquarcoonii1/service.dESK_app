const mongoose = require('mongoose')



const ServiceDeskAdmin=new mongoose.Schema({
username:{type:String},
password:{type:String},
location:{type:String}
})

const ServiceAdmin =mongoose.model('ServiceDeskAdmin',ServiceDeskAdmin,'ServiceDeskAdmin');
module.exports= ServiceAdmin;



