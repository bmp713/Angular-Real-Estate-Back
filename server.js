require("dotenv").config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
const fs = require('fs');

const port = process.env.PORT || 4000; 
const app = express(); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => { 
    console.log('Server listening on port', port) 
});


// MongoDB Atlas
const mongoose = require('mongoose'); 
const Properties = require("./properties");

const connection = mongoose.connect(
    'mongodb+srv://bmp713:%40MongoDB310@cluster0.68vf5.mongodb.net/?retryWrites=true&w=majority', 
    { useUnifiedTopology: true, dbName: 'real-estate7' }
)
    .then( () => {
        console.log('Connected to the database ');
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })


// Create new properties
const createProperty = async (data) => {
    try{
        const property = await Properties.create(data);
        console.log('property =>', property);
        return property;
    }catch(err){
        console.log(err);
    }
}

// Read property
const readProperty = async (id) => {
    console.log("readProperty id =>",id);
    try{
        const property = await Properties.findOne({id:id});
        console.log('readProperty =>', property);
        return property;
    }catch(err){
        console.log(err);
    }
}


// Read properties
const readProperties = async () => {
    try{
        const properties = await Properties.find({});
        console.log('readProperties =>', properties);
        return properties;
    }catch(err){
        console.log(err);
    }
}
//readProperties();


//Initialize properties
// fs.readFile('./products.json', 'utf8', (err, data) => {
//     if(err) console.error(err);
//     data = JSON.parse(data);
//     data.forEach( (property) => {
//         // console.log( "property =>", property );
//         createProperty( property );
//     });
// });


// Read products 
app.get("/read", async (req, res) => {
    console.log("req.body =>", req.body);

    try{
        readProperties()
            .then( (result) => {
                console.log("API properties => ", result);
                res.send(result);     
            });
    }catch(err){};

    // Read from JSON
    fs.readFile('./products.json', 'utf8', (err, data) => {
        if(err) console.error(err);
        res.send(data);
    });
});  

// Read product by id 
app.get("/read/:id", async (req, res) => {
    console.log("req.body =>", req.body);

    try{
        readProperty( req.params.id )
            .then( (result) => {
                console.log("readProperty API properties => ", result);
                res.send(result);    
            });
    }catch(err){};

    fs.readFile('./products.json', 'utf8', (err, data) => {
        if(err) console.error(err);
        data = JSON.parse(data);
        let product = data.find( item => {
            return item.id === req.params.id;
        });
        //res.send( product );
    });
}); 



// Update product
app.post("/update/:id", async (req, res) => {
    console.log("POST req.body =>", req.body);

    try{
        const property = await Properties.findOne({id:req.params.id});
        console.log('property =>', property);

        property.city = req.body.city;
        property.name = req.body.name;
        property.type = req.body.type;
        property.rooms = req.body.rooms;
        property.price = req.body.price;
        property.description = req.body.description;

        await property.save();
        res.send( property );

    }catch(err){
        console.log(err);
    }


    fs.readFile('./products.json', 'utf8', (err, data) => {
        if(err) console.error(err);

        data = JSON.parse(data);

        let product = data.find( item => {
            return item.id === req.params.id;
        });

        product.city = req.body.city;
        product.name = req.body.name;
        product.type = req.body.type;
        product.rooms = req.body.rooms;
        product.price = req.body.price;
        product.description = req.body.description;

        fs.writeFileSync('./products.json', JSON.stringify(data, null, "\t"), err => {
           if(err) console.error(err);
        });
        
        //res.send( data );
    });
}); 


// Delete product by id
app.delete("/delete/:id", async (req, res) => {
    
    try{
        const property = await Properties.deleteOne({id:req.params.id});
        console.log('property =>', property);

        //await property.save();
        res.send( property );
        //res.status(204).send();
    }catch(err){
        console.log(err);
    }

    fs.readFile('./products.json', 'utf8', (err, data) => {
        if(err) console.error(err);

        data = JSON.parse(data);

        data = data.filter( item => {
            return item.id !== req.params.id;
        });

        fs.writeFileSync('./products.json', JSON.stringify(data, null, "\t"), err => {
           if(err) console.error(err);
        });        
    });
    //res.send();
    res.status(204).send();

}); 



