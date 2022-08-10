const mongoose = require('mongoose');

const propertiesSchema = new mongoose.Schema({
    id: String,
    city: String,
    name: String,
    type: String,
    description: String,
    rooms: String,
    price: String,
    img: String
});

module.exports = mongoose.model('Properties', propertiesSchema);



 