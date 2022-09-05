
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
app.use(express.static('public')); 
app.use('/assets', express.static('assets'));

app.listen(port, () => { 
    console.log('Server listening on port', port) 
});

// Handle for file name 
// const imageUpload = null;


// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBHgOaPFiBZ5Uh3LZLTXqcWwtQl5w-JEtQ",
    authDomain: "node-real-estate-d86a8.firebaseapp.com",
    projectId: "node-real-estate-d86a8",
    storageBucket: "node-real-estate-d86a8.appspot.com",
    messagingSenderId: "937364880252",
    appId: "1:937364880252:web:881f08b151198ec25fc2f9",
    measurementId: "G-TQLPGEFEJX"
};

const { initializeApp } = require('firebase-admin/app');
const { ref, getStorage, getDownloadURL, uploadBytes } = require("firebase/storage");


// MongoDB Atlas for data
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
        console.log('server.js => createProperty() =>', property);
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
        //console.log('readProperty =>', property);
        return property;
    }catch(err){
        console.log(err);
    }
}


// Read properties
const readProperties = async () => {
    try{
        // const properties = await Properties.find({},{"_id":1,_id:0}).sort({"_id":-1});
        const properties = await Properties.find({});

        //console.log('readProperties =>', properties);
        return properties;
    }catch(err){
        console.log(err);
    }
}
//readProperties();


// Read products 
app.get("/read", async (req, res) => {
    console.log("req.body =>", req.body);

    try{
        readProperties()
            .then( (result) => {
                //console.log("API properties => ", result);
                res.send(result);     
            });
    }catch(err){};

}); 


// Read product by id 
app.get("/read/:id", async (req, res) => {
    console.log("req.body =>", req.body);

    try{
        readProperty( req.params.id )
            .then( (result) => {
                //console.log("readProperty() API properties => ", result);
                res.send(result);    
            });
    }catch(err){};
}); 


// Create new property
app.post("/create", async (req, res) => {

    console.log("/create POST req.body =>", req.body);

    try{
        let property = {
            id: req.body.id,
            city: req.body.city,
            name: req.body.name,
            type: req.body.type,
            description: req.body.description,
            rooms: req.body.rooms,
            price: req.body.price,
            img: req.body.img
        }
        //img: `http://angular-real-estate-back.herokuapp.com/assets/${imageName}`
        //img: `http://localhost:4000/assets/${imageName}`
        //img: `../assets/${imageName}`

        console.log("/create property =", property);
        createProperty(property);

        //await property.save();
        res.send( property );

    }catch(err){
        console.log(err);
    }

}); 


// Update product
app.post("/update/:id", async (req, res) => {
    console.log("/update POST req.body =>", req.body);

    try{
        const property = await Properties.findOne({id:req.params.id});
        console.log('property =>', property);

        property.city = req.body.city;
        property.name = req.body.name;
        property.type = req.body.type;
        property.rooms = req.body.rooms;
        property.price = req.body.price;
        property.description = req.body.description;
        property.img = req.body.img;

        await property.save();
        res.send( property );

    }catch(err){
        console.log(err);
    }

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

}); 


// Access file from multer
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/")
    },
    filename: function (req, file, cb) {
        console.log(file.mimetype);
        console.log("file = ", file);

        cb(null, Date.now() + '.jpg')  
        // cb(null, file.originalfilename);  
    }
});
const upload = multer({
    storage: storage
})


// Upload new image
app.post("/upload", upload.single("image"), async (req, res) => {

    console.log("/upload req.file =>", req.file);
    console.log("/upload POST req.body =>", req.body);
    console.log("/upload req.file.filename =>", req.file.filename);
    console.log("/upload req.file.originalname =>", req.file.originalname);
    
    // Pass new name of file to create() 
    imageName = req.file.filename;


    // Upload image file to Firestore, S3
    // Initialize Cloud Storage reference
    // const firebase = initializeApp(firebaseConfig);
    // const storage = getStorage(firebase);

    // const file = req.file.filename;
    // const storageRef = ref(storage, 'assets/'+ file.name );

    // uploadBytes(storageRef, file )
    //     .then( (snapshot) => {
    //         console.log('server.js => Uploaded file, ', file);
    //         console.log('server.js => snapshot =>', snapshot);

    //         getDownloadURL(snapshot.ref).then( (url) => {
    //             console.log('getDownloadURL() url =>', url);
    //             this.url =  url;
    //         });
    //     })
    //     .catch( (error) => {
    //         console.log("File error =>", error);
    //     })


    try{
        res.send(req.file);
    }catch(err){
        console.log(err);
    }

 
}); 



